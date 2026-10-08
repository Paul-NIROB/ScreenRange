-- Apply once in the Supabase SQL Editor on an existing ScreenRange project.

create table movie_ratings (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title_id bigint not null references titles(id) on delete cascade,
  score integer not null check (score between 1 and 100),
  created_at timestamptz default now(),
  unique (user_id, title_id)
);

alter table movie_ratings enable row level security;

create policy "Users can read their own movie ratings"
on movie_ratings for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can add their own movie ratings"
on movie_ratings for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can change their own movie ratings"
on movie_ratings for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create or replace function get_movie_stats(p_title_id bigint)
returns table (avg_score numeric, rating_count bigint)
language sql
security definer
set search_path = public
as $$
  select round(coalesce(avg(score), 0)::numeric, 1) as avg_score,
         count(*) as rating_count
  from movie_ratings
  where title_id = p_title_id;
$$;

grant execute on function get_movie_stats(bigint) to anon, authenticated;
