'use client';

import { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabase-client';

interface LogEntry {
  id: string;
  user_id: string;
  type: string;
  reason: string;
  created_at: string;
}

export default function LiveLogFeed({ guildId }: { guildId: string }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    // Fetch initial logs
    supabaseClient
      .from('cases')
      .select('*')
      .eq('guild_id', guildId)
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data) setLogs(data as LogEntry[]);
      });

    // Subscribe to real-time inserts
    const channel = supabaseClient
      .channel(`cases:${guildId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'cases',
          filter: `guild_id=eq.${guildId}`,
        },
        (payload) => {
          setLogs((prev) => [payload.new as LogEntry, ...prev].slice(0, 20));
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [guildId]);

  return (
    <div className="bg-surface rounded-xl border border-border p-4">
      <h2 className="font-semibold mb-4">Live Activity Feed</h2>
      <div className="space-y-2 max-h-64 overflow-auto">
        {logs.length === 0 && <p className="text-gray-500 text-sm">No recent activity</p>}
        {logs.map((log) => (
          <div key={log.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
            <div>
              <p className="text-sm font-medium">
                {log.type} — {log.user_id}
              </p>
              <p className="text-xs text-gray-400">{log.reason}</p>
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
