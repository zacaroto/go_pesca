# QA Agent Skill Design

## Overview

A Claude Code slash command (`/qa_agent`) that verifies acceptance criteria for GitHub issues, runs code review, executes tests, auto-fixes failures, and posts a structured report as a comment on the issue.

## Invocation

```
/qa_agent <issue-url-or-number>
```

Accepted input formats:
- Full issue URL: `https://github.com/zacaroto/go_pesca/issues/20`
- Project board URL: `https://github.com/users/zacaroto/projects/1/views/1?...&issue=zacaroto%7Cgo_pesca%7C20`
- Short form: `#20` or `20`

## Architecture

The slash command acts as an orchestrator with 3 parallel subagents:

```
/qa_agent <issue-url>
     |
     +-- Parse issue URL -> gh issue view -> extract ACs + detect language
     |
     +-- Determine base branch (main or develop)
     |
     +--+-- [parallel] Code Review Agent
     |  +-- [parallel] AC Verification Agent
     |  +-- [parallel] Test Runner Agent
     |
     +-- Collect results -> identify failures
     |
     +-- Auto-fix loop (if failures found):
     |   +-- Fix issues
     |   +-- Re-run failed checks
     |   +-- Commit fixes
     |
     +-- Post comment to GitHub issue (in detected language)
```

## Subagents

### 1. Code Review Agent

- **Type:** `general-purpose`
- **Input:** Diff (current branch vs base branch), issue title/body as intent
- **Task:** Review for bugs, security issues, missing error handling, code quality
- **Output:** List of findings with severity (P0-P3), file:line, description

### 2. AC Verification Agent

- **Type:** `general-purpose`
- **Input:** Parsed list of acceptance criteria, repo root path
- **Task per AC:**
  - File/directory existence checks (Glob)
  - Import verification (Grep for import statements)
  - Config validation (reads package.json, tsconfig.json, app.json, etc.)
  - Dependency checks (Grep for package references)
- **Output:** Per-AC status (pass/fail/partial) with evidence

### 3. Test Runner Agent

- **Type:** `general-purpose`
- **Input:** Repo root path, workspace structure
- **Runs:**
  - `npm run build:web` (web build)
  - `npx tsc --noEmit` in each workspace (typecheck)
  - `npm test` if test scripts exist
  - Expo dev server boot check when mobile ACs exist
- **Output:** Command results with pass/fail per check

## Issue Comment Format

The comment is posted in the same language as the issue (auto-detected).

```markdown
## QA Agent Report

### Acceptance Criteria Status

| # | Criteria | Status | Notes |
|---|----------|--------|-------|
| 1 | Expo project created in `apps/mobile/` | Pass | Directory exists with valid app.json |
| 2 | `packages/shared/` with types | Pass | Types, constants exported correctly |
| 3 | Both apps import from `@go-pesca/shared` | Fixed | Web app wasn't importing -- fixed in commit abc123 |
| 4 | `npx expo start` launches | Pass | Dev server starts on port 8081 |

### Code Review Findings

- (any bugs or issues found, with severity)

### Test Results

- Build: Pass
- TypeScript: Pass
- Tests: Pass (or N/A)

### Auto-fixes Applied

- (list of fixes made, with commit refs)
```

## Input Parsing Logic

1. If input matches `https://github.com/.../issues/\d+` -> extract owner, repo, number directly
2. If input contains `issue=owner%7Crepo%7Cnumber` (project board URL) -> decode and extract
3. If input is `#N` or just `N` -> use current repo context from `gh repo view`

## Auto-fix Behavior

- When an AC fails or a P0/P1 code review finding is detected, the orchestrator attempts to fix it
- Fixes are committed with message: `fix(qa): <description of fix>`
- After fixing, the relevant check is re-run to verify
- Maximum 2 fix attempts per issue before marking as "needs manual intervention"
- Only P0 and P1 findings trigger auto-fix; P2/P3 are reported only

## Base Branch Detection

1. Check if current branch has an open PR -> use PR base branch
2. Else check if `develop` branch exists -> use `develop`
3. Else use `main`

## File Structure

```
.claude/commands/qa_agent.md    # The slash command prompt
```

Single file — all orchestration logic lives in the prompt. Subagents are dispatched via the Agent tool with inline prompts.

## Language Detection

Detect the issue language by checking:
1. Keywords in issue body (e.g., "Como", "Quiero" -> Spanish; "As a", "I want" -> English)
2. Default to English if ambiguous

## Error Handling

- If `gh` CLI is not authenticated: stop and tell the user to run `gh auth login`
- If issue not found: report error with the parsed URL/number
- If a subagent fails: report its failure in the final comment, continue with other results
- If auto-fix fails after 2 attempts: mark AC as "Needs manual fix" in the comment
