import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  if (req.nextUrl.pathname.startsWith('/post-ad') && !session) {
    return NextResponse.redirect(new URL('/login?redirect=/post-ad', req.url));
  }
  return res;
}

export const config = { matcher: ['/post-ad/:path*', '/login'] };
