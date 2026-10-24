-- Stage 8: moderator sign-in.
-- A signed-in moderator (Supabase Auth, role "authenticated") can see every post and approve or reject it.
-- This is safe only because new sign-ups are turned off: the only signed-in users are moderators
-- created by hand in Authentication -> Users -> Add user.

-- Moderators may read every row, including waiting and rejected posts.
drop policy if exists "Moderators can read every event" on public.events;
create policy "Moderators can read every event"
  on public.events for select
  to authenticated
  using (true);

-- Moderators may change a post, but only to published, waiting, or rejected.
drop policy if exists "Moderators can review events" on public.events;
create policy "Moderators can review events"
  on public.events for update
  to authenticated
  using (true)
  with check (status in ('published', 'waiting', 'rejected'));

-- Grants: moderators read the whole table, and may change only the review columns.
grant select on public.events to authenticated;
grant update (status, status_reason, reviewed_at, reviewed_by) on public.events to authenticated;
