-- ============================================
-- Fix infinite recursion in group_members RLS
-- ============================================

-- Helper function to check group membership without triggering RLS
create or replace function public.is_group_member(p_group_id uuid, p_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.group_members
    where group_id = p_group_id
    and user_id = p_user_id
  );
$$;

-- Drop the recursive policy
drop policy if exists "Members can view group members" on public.group_members;

-- Replace with non-recursive version using the SECURITY DEFINER function
create policy "Members can view group members"
  on public.group_members for select
  using (
    public.is_group_member(group_id, auth.uid())
  );

-- Also drop the redundant first groups SELECT policy (the second one already allows all authenticated users)
drop policy if exists "Members can view their groups" on public.groups;

-- Fix the catches policy too (it joins group_members which triggers the recursive policy)
drop policy if exists "Group members can view member catches" on public.catches;

create policy "Group members can view member catches"
  on public.catches for select
  using (
    share_to_groups = true
    and exists (
      select 1 from public.group_members gm1
      where gm1.user_id = auth.uid()
      and public.is_group_member(gm1.group_id, catches.user_id)
      and gm1.user_id != catches.user_id
    )
  );
