# PO Agent Skill Design

**Date:** 2026-08-19
**Status:** Approved
**Skill Location:** `.claude/commands/po_agent.md`

## Goal

Create a `/po_agent` slash command that acts as a Product Owner: analyzes a GitHub issue, scores its development effort using T-shirt sizes, refines its acceptance criteria based on codebase analysis, updates the issue body, and marks it as ready for development.

## Input Specification

### Parameter

The skill receives a GitHub issue reference via `$ARGUMENTS`. Supported formats:

1. **Project board URL:**
   `https://github.com/users/<owner>/projects/<id>/views/<view>?...issue=<owner>%7C<repo>%7C<number>`
   Decode `%7C` to `|`, extract `owner`, `repo`, `number`.

2. **Direct issue URL:**
   `https://github.com/<owner>/<repo>/issues/<number>`
   Extract from URL path segments.

3. **Short format:**
   `#N` or just a number. Uses current repo context (`gh repo view --json nameWithOwner`).

### Issue Fetching

```bash
gh issue view <number> --repo <owner>/<repo> --json title,body,labels,state,assignees
```

Extract: title, body (with ACs), existing labels, state, assignees.

### Language Detection

Detect issue language to write refinements in the same language:

- **Spanish indicators:** "Como", "Quiero", "Para que", "Criterios de Aceptación", "Historia de Usuario"
- **English indicators:** "As a", "I want", "So that", "Acceptance Criteria", "User Story"
- **Default:** English (if ambiguous)

## Analysis Phase: 3 Parallel Subagents

Launch 3 `general-purpose` agents in parallel using the Agent tool.

### Agent 1: Codebase Analyzer

**Purpose:** Understand technical complexity of the issue.

**Process:**
- Parse the issue requirements to identify likely affected areas
- Use Glob to find relevant files by name patterns
- Use Grep to search for related functions, components, routes, types
- Use Read to inspect key files for complexity
- Assess: number of files to change, new dependencies needed, migration requirements, testing complexity

**Output:** Structured report with:
- Files likely affected (with paths)
- New files/components needed
- Dependencies to add/modify
- Database migration needs
- Technical complexity assessment (low/medium/high)

### Agent 2: Issue Context Agent

**Purpose:** Find related issues and dependencies in GitHub.

**Process:**
- List open issues: `gh issue list --repo <owner>/<repo> --state open --json number,title,labels,body --limit 50`
- Search for related issues by shared labels: `gh issue list --repo <owner>/<repo> --label "<label>" --json number,title,state`
- Search for cross-references (mentions of `#<number>` in other issues)
- Identify: blocking issues, dependent issues, related epics

**Output:** Structured report with:
- Related issues (number, title, relationship type)
- Blocking dependencies
- Issues that this one unblocks
- Epic/milestone context

### Agent 3: AC Reviewer

**Purpose:** Evaluate and improve acceptance criteria quality.

**Process:**
- Extract current ACs from issue body (lines starting with `- [ ]` or `- [x]`)
- Evaluate each AC against quality criteria:
  - **Testeable:** Can it be verified with a concrete test?
  - **Specific:** Is the expected behavior clearly defined?
  - **Measurable:** Is there a clear pass/fail criterion?
  - **Independent:** Can it be verified independently of other ACs?
- Identify missing ACs based on the issue description and common patterns (error handling, edge cases, accessibility, responsive design)
- Suggest improvements to existing ACs (more specific, testeable)

**Output:** Structured report with:
- Per-AC evaluation (pass/needs improvement + suggestion)
- New ACs to add
- ACs to split (if too broad)

## Scoring: T-shirt Sizing

After collecting all 3 agent results, the PO agent consolidates and assigns a size:

| Size | Criteria |
|------|----------|
| **XS** | Trivial change: config, typo, 1 file, no new logic |
| **S** | Small change: 1-2 files, simple logic, no new dependencies |
| **M** | Moderate change: 3-5 files, moderate logic, possible migrations |
| **L** | Large change: 5+ files, complex logic, new dependencies/services |
| **XL** | Very large change: multiple systems, high risk, requires prior design |

**Scoring factors (weighted):**
1. Number of files affected (from Codebase Analyzer)
2. New dependencies/services needed (from Codebase Analyzer)
3. Number and complexity of ACs (from AC Reviewer)
4. Dependencies on other issues (from Issue Context Agent)
5. Database migration needs (from Codebase Analyzer)
6. Risk level (cross-cutting concerns, shared code modifications)

## Refinement: Issue Body Update

The PO agent generates a refined issue body in the detected language and updates it via:

```bash
gh issue edit <number> --repo <owner>/<repo> --body "<refined_body>"
```

### Refined Body Template

```markdown
## User Story

(Original user story preserved or improved if poorly written)

## Effort Estimation

**Size:** [XS|S|M|L|XL]
**Rationale:** [1-2 sentence justification based on analysis]

## Acceptance Criteria

- [ ] AC 1 (refined/clarified)
- [ ] AC 2 (refined/clarified)
- [ ] AC N (new, if identified as missing)

## Technical Notes

- **Files affected:** [list of key file paths]
- **New files needed:** [list, if any]
- **Dependencies:** [new packages/services, if any]
- **Migrations:** [database changes needed, if any]
- **Risks:** [identified risks, if any]

## Related Issues

- Blocks: #X, #Y
- Blocked by: #Z
- Related: #W

---
*Refined by PO Agent on YYYY-MM-DD*
```

## Final Status Update

### Step 1: Try moving to "Ready" in Project Board

Attempt via GitHub GraphQL API:
```bash
gh api graphql -f query='mutation { ... }'
```

This requires the `read:project` scope on the GitHub token.

### Step 2: Fallback to labels

If the Project Board mutation fails (insufficient scopes), fall back to labels:

1. **Create `refined` label** if it doesn't exist:
   ```bash
   gh label create "refined" --color "0E8A16" --description "Ticket refined by PO Agent" -R <owner>/<repo> 2>/dev/null || true
   ```

2. **Add `refined` label** to the issue:
   ```bash
   gh issue edit <number> --repo <owner>/<repo> --add-label "refined"
   ```

3. **Add size label** (`size:XS`, `size:S`, `size:M`, `size:L`, `size:XL`):
   ```bash
   gh label create "size:<size>" --color "<color>" --description "Effort: <size>" -R <owner>/<repo> 2>/dev/null || true
   gh issue edit <number> --repo <owner>/<repo> --add-label "size:<size>"
   ```

   Size label colors:
   - XS: `#0E8A16` (green)
   - S: `#7CFC00` (light green)
   - M: `#FBCA04` (yellow)
   - L: `#E99695` (light red)
   - XL: `#D93F0B` (red)

## Error Handling

- **`gh` CLI not authenticated:** Stop and inform the user to run `gh auth login`.
- **Issue not found:** Stop and inform the user the issue number/URL is invalid.
- **Subagent failure:** Continue with available data; note the failure in the output.
- **Issue edit fails:** Fall back to posting a comment with the refined content.
- **Label creation fails:** Continue without labels; note in output.

## Output

After all operations complete, the PO agent prints a summary to the terminal:

```
PO Agent Summary for #<number>: <title>
─────────────────────────────────────
Size:     M (Medium)
ACs:      5 original → 7 refined (2 added, 3 improved)
Labels:   refined, size:M
Status:   Issue body updated ✓ | Labels added ✓ | Project board: fallback to label
Related:  #12 (blocks), #8 (related)
```

## Constraints

- Never remove existing ACs — only improve or add new ones
- Preserve the original user story intent
- If the issue has no ACs at all, generate them from the description
- Maximum 2 retries on GitHub API failures before falling back
- The skill is read-only for the codebase — it never modifies code files
