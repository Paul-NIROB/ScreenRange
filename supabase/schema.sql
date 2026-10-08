-- ScreenRange database schema
-- Run this once in the Supabase SQL Editor on a new project.

-- ---------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------

create table titles (
  id bigint generated always as identity primary key,
  tmdb_id integer unique,
  name text not null,
  year integer,
  poster_path text,
  created_at timestamptz default now()
);

create table people (
  id bigint generated always as identity primary key,
  tmdb_id integer unique not null,
  name text not null,
  profile_path text,
  created_at timestamptz default now()
);

create table cast_roles (
  id bigint generated always as identity primary key,
  title_id bigint not null references titles(id) on delete cascade,
  person_id bigint not null references people(id) on delete cascade,
  character_name text,
  billing_order integer,
  tmdb_credit_id text unique not null,
  created_at timestamptz default now()
);

create table performance_ratings (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  cast_role_id bigint not null references cast_roles(id) on delete cascade,
  score integer not null check (score between 1 and 10),
  created_at timestamptz default now(),
  unique (user_id, cast_role_id)
);

create table movie_ratings (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title_id bigint not null references titles(id) on delete cascade,
  score integer not null check (score between 1 and 100),
  created_at timestamptz default now(),
  unique (user_id, title_id)
);

create table screen_time_entries (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  cast_role_id bigint not null references cast_roles(id) on delete cascade,
  minutes integer not null check (minutes between 1 and 300),
  created_at timestamptz default now(),
  unique (user_id, cast_role_id)
);

create table reviews (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title_id bigint not null references titles(id) on delete cascade,
  author_name text not null default 'Anonymous',
  body text not null check (char_length(body) between 10 and 1000),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, title_id)
);

create table ai_summaries (
  title_id bigint primary key references titles(id) on delete cascade,
  summary text not null,
  data_hash text not null,
  generated_at timestamptz default now()
);

-- ---------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------

alter table titles enable row level security;
alter table people enable row level security;
alter table cast_roles enable row level security;
alter table performance_ratings enable row level security;
alter table movie_ratings enable row level security;
alter table screen_time_entries enable row level security;
alter table reviews enable row level security;
alter table ai_summaries enable row level security;

-- Public read-only catalogue data
create policy "Anyone can read titles"
on titles for select using (true);

create policy "Anyone can read people"
on people for select using (true);

create policy "Anyone can read cast roles"
on cast_roles for select using (true);

-- Ratings: private to each user (public sees aggregates via functions)
create policy "Users can read their own ratings"
on performance_ratings for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can add their own ratings"
on performance_ratings for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can change their own ratings"
on performance_ratings for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Movie ratings are private to each user (public sees aggregates via functions)
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

-- Screen time: private to each user (public sees medians via functions)
create policy "Users can read their own screen time entries"
on screen_time_entries for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can add their own screen time entries"
on screen_time_entries for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can change their own screen time entries"
on screen_time_entries for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Reviews: public to read, owner-only to write
create policy "Anyone can read reviews"
on reviews for select using (true);

create policy "Users can add their own reviews"
on reviews for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can change their own reviews"
on reviews for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own reviews"
on reviews for delete
to authenticated
using (auth.uid() = user_id);

-- AI summaries: public to read; written only by the server (service role)
create policy "Anyone can read AI summaries"
on ai_summaries for select using (true);

-- ---------------------------------------------------------------
-- Functions (aggregates over private tables)
-- ---------------------------------------------------------------

create or replace function get_title_stats(p_title_id bigint)
returns table (cast_role_id bigint, avg_score numeric, rating_count bigint)
language sql
security definer
set search_path = public
as $$
  select r.cast_role_id,
         round(avg(r.score)::numeric, 1) as avg_score,
         count(*) as rating_count
  from performance_ratings r
  join cast_roles c on c.id = r.cast_role_id
  where c.title_id = p_title_id
  group by r.cast_role_id;
$$;

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

create or replace function get_title_screen_time(p_title_id bigint)
returns table (cast_role_id bigint, median_minutes numeric, entry_count bigint)
language sql
security definer
set search_path = public
as $$
  select s.cast_role_id,
         round((percentile_cont(0.5) within group (order by s.minutes))::numeric, 0) as median_minutes,
         count(*) as entry_count
  from screen_time_entries s
  join cast_roles c on c.id = s.cast_role_id
  where c.title_id = p_title_id
  group by s.cast_role_id;
$$;

create or replace function get_top_performances(p_limit integer default 20)
returns table (
  cast_role_id bigint,
  person_id bigint,
  person_name text,
  profile_path text,
  character_name text,
  title_id bigint,
  title_name text,
  title_year integer,
  avg_score numeric,
  rating_count bigint,
  weighted_score numeric
)
language sql
security definer
set search_path = public
as $$
  with per_role as (
    select r.cast_role_id as role_id,
           avg(r.score)::numeric as avg_score,
           count(*) as rating_count
    from performance_ratings r
    group by r.cast_role_id
  ),
  overall as (
    select coalesce(avg(r.score), 0)::numeric as c
    from performance_ratings r
  )
  select cr.id as cast_role_id,
         p.id as person_id,
         p.name as person_name,
         p.profile_path as profile_path,
         cr.character_name as character_name,
         t.id as title_id,
         t.name as title_name,
         t.year as title_year,
         round(pr.avg_score, 1) as avg_score,
         pr.rating_count as rating_count,
         round(
           (pr.rating_count::numeric / (pr.rating_count + 3)) * pr.avg_score
           + (3.0 / (pr.rating_count + 3)) * o.c,
           2
         ) as weighted_score
  from per_role pr
  join cast_roles cr on cr.id = pr.role_id
  join people p on p.id = cr.person_id
  join titles t on t.id = cr.title_id
  cross join overall o
  order by weighted_score desc, rating_count desc
  limit p_limit;
$$;

grant execute on function get_title_stats(bigint) to anon, authenticated;
grant execute on function get_movie_stats(bigint) to anon, authenticated;
grant execute on function get_title_screen_time(bigint) to anon, authenticated;
grant execute on function get_top_performances(integer) to anon, authenticated;
