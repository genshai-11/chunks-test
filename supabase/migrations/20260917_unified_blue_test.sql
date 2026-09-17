-- Migration: 20260917_unified_blue_test.sql
-- Adds BLUE-TEST-49Q package and satellite metric tables to Chunks-LMS Supabase instance.

begin;

-- 1. Register BLUE-TEST-49Q package if not exists
insert into public.test_packages (id, title, slug, description, source_metadata)
values (
  'b10e3049-7777-4949-b10e-000000000049'::uuid,
  'BLUE-TEST-49Q',
  'blue-test-49q',
  'CHUNKS Test No. 3 (Observation & Conscious Flow Test with 49 challenges across 7 interactive tools).',
  jsonb_build_object(
    'sessions', 7,
    'questionsPerSession', 7,
    'totalQuestions', 49,
    'constantMCT', 1.86,
    'tools', jsonb_build_array('Marker', 'Chair', 'Magnet', 'Cup', 'Photo', 'Book', 'Person')
  )
)
on conflict (id) do nothing;

-- 2. Blue Test Attempt Metrics (1-to-1 with standalone_test_attempts)
create table if not exists public.blue_test_attempt_metrics (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.standalone_test_attempts(id) on delete cascade,
  max_time_seconds_raw numeric not null check (max_time_seconds_raw > 0),
  elapsed_seconds_raw numeric not null check (elapsed_seconds_raw >= 0),
  completion_ratio numeric not null check (completion_ratio >= 0 and completion_ratio <= 1),
  completion_mode text not null check (completion_mode in ('manual_end','auto_max','manual_red','correction')),
  derived_color text not null,
  effective_color text not null,
  created_at timestamptz not null default now(),
  unique (attempt_id)
);

-- 3. Blue Test Cumulative Component Events (49 items cumulative tracking)
create table if not exists public.blue_test_component_events (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.standalone_test_attempts(id) on delete cascade,
  assignment_id uuid not null references public.standalone_test_assignments(id) on delete cascade,
  question_global_order integer not null check (question_global_order between 1 and 49),
  choice_mode text not null check (choice_mode in ('completed_all','stopped_at')),
  stopped_component_index integer check (stopped_component_index between 1 and 49),
  mastered_count integer not null default 0,
  sequence integer not null default 1,
  created_at timestamptz not null default now()
);

-- 4. Enable RLS
alter table public.blue_test_attempt_metrics enable row level security;
alter table public.blue_test_component_events enable row level security;

-- Allow authenticated staff read/write
create policy "Allow staff read blue_test_attempt_metrics"
  on public.blue_test_attempt_metrics for select
  to authenticated
  using (true);

create policy "Allow staff insert blue_test_attempt_metrics"
  on public.blue_test_attempt_metrics for insert
  to authenticated
  with check (true);

create policy "Allow staff read blue_test_component_events"
  on public.blue_test_component_events for select
  to authenticated
  using (true);

create policy "Allow staff insert blue_test_component_events"
  on public.blue_test_component_events for insert
  to authenticated
  with check (true);

commit;
