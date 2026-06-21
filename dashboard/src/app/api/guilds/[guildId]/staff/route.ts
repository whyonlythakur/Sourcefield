import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET(req: NextRequest, { params }: { params: { guildId: string } }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabaseServer
    .from('guild_staff')
    .select('*')
    .eq('guild_id', params.guildId)
    .order('role', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const staff = (data || []).map((s: any) => ({
    user_id: s.user_id,
    role: s.role,
    added_at: s.created_at,
    added_by: s.added_by,
  }));

  return NextResponse.json({ staff });
}