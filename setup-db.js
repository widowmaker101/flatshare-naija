require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or key in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  console.log('Creating listings table...');

  const sql = `
    DROP TABLE IF EXISTS public.listings;
    CREATE TABLE public.listings (
      id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      title TEXT NOT NULL,
      price TEXT NOT NULL,
      location TEXT NOT NULL,
      beds INTEGER NOT NULL,
      occupants INTEGER NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
    ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Public can read listings" ON public.listings FOR SELECT USING (true);
    INSERT INTO public.listings (title, price, location, beds, occupants) VALUES
      ('Cozy Room in Ikeja', '₦50,000', 'Lagos', 1, 2),
      ('Shared Flat in Wuse', '₦40,000', 'Abuja', 1, 3),
      ('Student Hostel in UNILAG', '₦30,000', 'Lagos', 1, 4),
      ('Executive Room in VI', '₦120,000', 'Lagos', 1, 1);
  `;

  const { error } = await supabase.rpc('exec_sql', { sql });

  if (error) {
    console.error('Failed to create table:', error.message);
    console.log('\nTip: exec_sql may not be enabled. Use Supabase dashboard SQL editor instead.');
    process.exit(1);
  }

  console.log('Table created + 4 listings inserted!');
})();
