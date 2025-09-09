import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseMiddlewareClient } from '../supabase/middleware';

export async function handleUpload(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createSupabaseMiddlewareClient(req, res);
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  return res;
}
