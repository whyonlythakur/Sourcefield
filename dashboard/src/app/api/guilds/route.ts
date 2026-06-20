import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch user's guilds from Discord
    const discordRes = await fetch('https://discord.com/api/v10/users/@me/guilds', {
      headers: { Authorization: `Bearer ${token.accessToken}` },
    });
    if (!discordRes.ok) throw new Error('Failed to fetch Discord guilds');
    const userGuilds = await discordRes.json();

    // Filter for guilds where user has MANAGE_GUILD (0x00000020) or ADMINISTRATOR (0x00000008)
    const manageableGuilds = userGuilds.filter((g: any) => {
      const permissions = BigInt(g.permissions);
      const ADMINISTRATOR = BigInt(0x00000008);
      const MANAGE_GUILD = BigInt(0x00000020);
      return (permissions & (ADMINISTRATOR | MANAGE_GUILD)) !== BigInt(0);
    });

    // Get guild IDs the bot is in
    const { data: botGuilds } = await supabase.from('guilds').select('guild_id, guild_name, icon');
    const botGuildIds = new Set((botGuilds || []).map((g: any) => g.guild_id));

    // Mark which guilds have the bot
    const enriched = manageableGuilds.map((g: any) => ({
      id: g.id,
      name: g.name,
      icon: g.icon,
      hasBot: botGuildIds.has(g.id),
    }));

    return NextResponse.json(enriched);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
