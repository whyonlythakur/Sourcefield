import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET(req: NextRequest, { params }: { params: { guildId: string } }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: guild } = await supabaseServer
    .from('guilds')
    .select('settings')
    .eq('guild_id', params.guildId)
    .single();

  const { data: reviews } = await supabaseServer
    .from('media_reviews')
    .select('*')
    .eq('guild_id', params.guildId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  return NextResponse.json({
    config: guild?.settings?.mediaSecurity || {},
    pendingReviews: reviews || [],
  });
}

export async function PATCH(req: NextRequest, { params }: { params: { guildId: string } }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { securityLevel } = await req.json();

  const { data: guild } = await supabaseServer
    .from('guilds')
    .select('settings')
    .eq('guild_id', params.guildId)
    .single();

  const settings = guild?.settings || {};
  settings.mediaSecurity = { ...settings.mediaSecurity, securityLevel };

  const { error } = await supabaseServer
    .from('guilds')
    .update({ settings, updated_at: new Date().toISOString() })
    .eq('guild_id', params.guildId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}