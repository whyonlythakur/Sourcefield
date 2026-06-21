import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET(req: NextRequest, { params }: { params: { guildId: string } }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50);

  const { data, error } = await supabaseServer
    .from('audit_log')
    .select('*')
    .eq('guild_id', params.guildId)
    .order('timestamp', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const entries = (data || []).map((entry: any) => ({
    id: entry.id,
    action: entry.action,
    moderator: entry.moderator_id,
    target: entry.target_user_id || entry.target_role_id || 'N/A',
    reason: entry.reason,
    timestamp: entry.timestamp,
  }));

  return NextResponse.json({ entries });
}