import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { supabase } from '@/lib/supabase';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { guildId: string; moduleName: string } }
) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { enabled, threshold } = await req.json();
  const { guildId, moduleName } = params;

  const { data: guild } = await supabase
    .from('guilds')
    .select('modules')
    .eq('guild_id', guildId)
    .single();

  const modules = (guild?.modules as Record<string, any>) || {};
  modules[moduleName] = {
    ...modules[moduleName],
    enabled,
    threshold,
    updatedAt: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('guilds')
    .update({ modules })
    .eq('guild_id', guildId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
