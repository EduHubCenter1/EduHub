import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getAdminScopes } from '@/lib/data/admin-scopes';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const user = session.user;
  const userRole = user?.user_metadata?.role;

  if (userRole !== 'classAdmin' || !user?.id) {
    return new NextResponse(JSON.stringify({ error: 'Forbidden: User is not a classAdmin or has no ID.' }), { status: 403 });
  }

  const adminScopes = await getAdminScopes(user.id);
  
  return NextResponse.json(adminScopes);
}