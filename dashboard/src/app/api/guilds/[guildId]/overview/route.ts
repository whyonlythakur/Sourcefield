import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest, { params }: { params: { guildId: string } }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const guildId = params.guildId;
  const last24h = new Date(Date.now() - 86400 * 1000).toISOString();
  const last7d = new Date(Date.now() - 7 * 86400 * 1000).toISOString();

  try {
    // Total members count (approximate from guilds table if stored)
    const { data: guild } = await supabase
      .from('guilds')
      .select('member_count, settings')
      .eq('guild_id', guildId)
      .single();

    // Active cases count
    const { count: activeCases } = await supabase
      .from('cases')
      .select('*', { count: 'exact', head: true })
      .eq('guild_id', guildId)
      .eq('status', 'active');

    // Auto-actions in last 24h
    const { count: autoActions24h } = await supabase
      .from('cases')
      .select('*', { count: 'exact', head: true })
      .eq('guild_id', guildId)
      .eq('source', 'automod')
      .gte('created_at', last24h);

    // Actions in last 7 days (grouped by day)
    const { data: weeklyActions } = await supabase
      .from('cases')
      .select('created_at')
      .eq('guild_id', guildId)
      .gte('created_at', last7d)
      .order('created_at', { ascending: true });

    // Case breakdown by type
    const { data: caseBreakdown } = await supabase
      .from('cases')
      .select('type')
      .eq('guild_id', guildId);

    // Pending reports count
    const { count: pendingReports } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true })
      .eq('guild_id', guildId)
      .eq('status', 'pending');

    return NextResponse.json({
      totalMembers: guild?.member_count || 0,
      activeCases: activeCases || 0,
      autoActions24h: autoActions24h || 0,
      raidStatus: guild?.settings?.raidMode ? 'Lockdown' : 'Calm',
      weeklyActions: weeklyActions || [],
      caseBreakdown: caseBreakdown || [],
      pendingReports: pendingReports || 0,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
