'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/StatCard';
import LiveLogFeed from '@/components/LiveLogFeed';

interface OverviewData {
  totalMembers: number;
  activeCases: number;
  autoActions24h: number;
  raidStatus: string;
  weeklyActions: any[];
  caseBreakdown: any[];
  pendingReports: number;
}

function getDailyCounts(actions: any[]) {
  const days: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days[d.toISOString().split('T')[0]] = 0;
  }
  actions.forEach((a: any) => {
    const date = new Date(a.created_at).toISOString().split('T')[0];
    if (days[date] !== undefined) days[date]++;
  });
  return { labels: Object.keys(days), values: Object.values(days) };
}

function getTypeCounts(cases: any[]) {
  const counts: Record<string, number> = {};
  cases.forEach((c: any) => {
    counts[c.type] = (counts[c.type] || 0) + 1;
  });
  return counts;
}

export default function OverviewPage({ params }: { params: { guildId: string } }) {
  const guildId = params.guildId;
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/guilds/${guildId}/overview`)
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [guildId]);

  if (loading || !data) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Overview</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Members" value="-" />
          <StatCard title="Active Cases" value="-" />
          <StatCard title="Auto-Actions (24h)" value="-" />
          <StatCard title="Raid Status" value="..." />
        </div>
      </div>
    );
  }

  const daily = getDailyCounts(data.weeklyActions);
  const maxDaily = Math.max(...daily.values, 1);
  const typeCounts = getTypeCounts(data.caseBreakdown);
  const typeEntries = Object.entries(typeCounts);
  const maxType = Math.max(...Object.values(typeCounts), 1);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Members" value={data.totalMembers.toLocaleString()} />
        <StatCard title="Active Cases" value={data.activeCases.toLocaleString()} />
        <StatCard title="Auto-Actions (24h)" value={data.autoActions24h.toLocaleString()} />
        <StatCard title="Raid Status" value={data.raidStatus} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface rounded-xl border border-border p-6">
          <h2 className="font-semibold mb-4">Actions (7d)</h2>
          <div className="flex items-end gap-2 h-48">
            {daily.values.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-accent rounded-t-md min-w-4"
                  style={{ height: `${(v / maxDaily) * 100}%` }}
                />
                <span className="text-xs text-gray-400">{daily.labels[i]?.slice(8) || ''}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-surface rounded-xl border border-border p-6">
          <h2 className="font-semibold mb-4">Case Breakdown</h2>
          <div className="h-48 flex items-end gap-2">
            {typeEntries.map(([type, count]) => (
              <div key={type} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-accent rounded-t-md min-w-4"
                  style={{ height: `${(count / maxType) * 100}%` }}
                  title={`${type}: ${count}`}
                />
                <span className="text-xs text-gray-400 truncate w-full text-center">{type}</span>
              </div>
            ))}
            {typeEntries.length === 0 && <p className="text-gray-500 text-sm">No cases</p>}
          </div>
        </div>
      </div>
      <div className="mt-6">
        <LiveLogFeed guildId={guildId} />
      </div>    </div>
  );
}
