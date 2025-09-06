import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic'; // Ensure this route is always run dynamically

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ role: profile.role });

  } catch (error) {
    console.error('Error fetching user role:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
