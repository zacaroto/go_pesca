-- ============================================
-- Fishing Groups: groups, group_members, share_to_groups
-- ============================================

-- Groups table
create table public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  avatar_url text,
  is_public boolean not null default false,
  invite_code text unique not null,
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now()
);

-- Group members (join table)
create table public.group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('creator', 'member')),
  joined_at timestamptz default now(),
  unique (group_id, user_id)
);

-- Add share_to_groups column to catches (default true = auto-share)
alter table public.catches add column share_to_groups boolean not null default true;

-- ============================================
-- Indexes
-- ============================================

create index groups_invite_code_idx on public.groups(invite_code);
create index groups_created_by_idx on public.groups(created_by);
create index group_members_group_id_idx on public.group_members(group_id);
create index group_members_user_id_idx on public.group_members(user_id);
create index catches_share_to_groups_idx on public.catches(share_to_groups);

-- ============================================
-- Row Level Security: Groups
-- ============================================

alter table public.groups enable row level security;

-- Authenticated users can view groups they belong to
create policy "Members can view their groups"
  on public.groups for select
  using (
    exists (
      select 1 from public.group_members
      where group_members.group_id = groups.id
      and group_members.user_id = auth.uid()
    )
  );

-- Authenticated users can view any group (needed for invite/join flow lookup)
-- Group membership data is protected by group_members RLS, not groups RLS
create policy "Authenticated users can view groups"
  on public.groups for select
  using (auth.uid() is not null);

-- Authenticated users can create groups
create policy "Authenticated users can create groups"
  on public.groups for insert
  with check (auth.uid() = created_by);

-- Creator can update their group
create policy "Creator can update group"
  on public.groups for update
  using (auth.uid() = created_by);

-- Creator can delete their group
create policy "Creator can delete group"
  on public.groups for delete
  using (auth.uid() = created_by);

-- ============================================
-- Row Level Security: Group Members
-- ============================================

alter table public.group_members enable row level security;

-- Members can view other members in their groups
create policy "Members can view group members"
  on public.group_members for select
  using (
    exists (
      select 1 from public.group_members gm
      where gm.group_id = group_members.group_id
      and gm.user_id = auth.uid()
    )
  );

-- Authenticated users can join groups (insert own membership)
create policy "Users can join groups"
  on public.group_members for insert
  with check (auth.uid() = user_id);

-- Users can leave groups (delete own membership)
create policy "Users can leave groups"
  on public.group_members for delete
  using (auth.uid() = user_id);

-- Creator can remove members
create policy "Creator can remove members"
  on public.group_members for delete
  using (
    exists (
      select 1 from public.groups
      where groups.id = group_members.group_id
      and groups.created_by = auth.uid()
    )
  );

-- ============================================
-- RLS: Allow group members to view member catches
-- ============================================

-- Group members can view catches of other members (regardless of is_public)
-- This enables the group feed where private catches are visible to group members
create policy "Group members can view member catches"
  on public.catches for select
  using (
    share_to_groups = true
    and exists (
      select 1 from public.group_members gm1
      join public.group_members gm2 on gm1.group_id = gm2.group_id
      where gm1.user_id = auth.uid()
      and gm2.user_id = catches.user_id
      and gm1.user_id != gm2.user_id
    )
  );
