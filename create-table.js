const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

(async () => {
  const sql = `
    drop table if exists public.listings;
    create table public.listings (
      id bigint primary key generated always as identity,
      title text not null,
      price text not null,
      location text not null,
      beds integer not null,
      occupants integer not null,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null
    );
    alter table public.listings enable row level security;
    create policy "Public can read listings" on public.listings for select using (true);
    insert into public.listings (title, price, location, beds, occupants) values
      ('Cozy Room in Ikeja', '₦50,000', 'Lagos', 1, 2),
      ('Shared Flat in Wuse', '₦40,000', 'Abuja', 1, 3),
      ('Student Hostel in UNILAG', '₦30,000', 'Lagos', 1, 4),
      ('Executive Room in VI', '₦120,000', 'Lagos', 1, 1);
  `;

  const { data, error } = await supabase.rpc('exec_sql', { sql });
  if (error) {
    console.error('Failed to create table:', error);
    process.exit(1);
  }
  console.log('Table created and data inserted!');
})();
