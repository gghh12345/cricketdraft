CREATE TABLE IF NOT EXISTS public.matches (
  id uuid default gen_random_uuid() primary key,
  room_code text,
  player1_name text,
  player2_name text,
  player1_squad jsonb,
  player2_squad jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
