import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET(req: NextRequest, { params }: { params: { guildId: string } }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');

  let query = supabaseServer
    .from('audit_log')
    .select('*')
    .eq('guild_id', params.guildId)
    .order('timestamp', { ascending: false })
    .limit(50);

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const logs = (data || []).map((entry: any) => ({
    id: entry.id,
    category: entry.category,
    action: entry.action,
    target: entry.target_user_id || entry.target_role_id || 'N/A',
    moderator: entry.moderator_id,
    timestamp: entry.timestamp,
  }));

  return NextResponse.json({ logs });
}