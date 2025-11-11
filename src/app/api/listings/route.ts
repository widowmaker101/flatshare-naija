import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
export async function GET() {
  const supabase = await createClient();
  const { data: listings, error } = await supabase.from('listings').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  return NextResponse.json(listings || []);
}
