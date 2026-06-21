'use client';

import { useEffect, useState } from 'react';

const LOG_CATEGORIES = [
  { id: 'modActions', name: 'Mod Actions', color: 'bg-blue-500' },
  { id: 'automodTriggers', name: 'AutoMod Triggers', color: 'bg-red-500' },
  { id: 'messageLogs', name: 'Message Logs', color: 'bg-green-500' },
  { id: 'memberLogs', name: 'Member Logs', color: 'bg-yellow-500' },
  { id: 'raidLogs', name: 'Raid Logs', color: 'bg-orange-500' },
  { id: 'caseLogs', name: 'Case Logs', color: 'bg-purple-500' },
  { id: 'serverLogs', name: 'Server Logs', color: 'bg-gray-500' },
  { id: 'errorLogs', name: 'Error Logs', color: 'bg-red-700' },
];

interface LogEntry {
  id: string;
  category: string;
  action: string;
  target: string;
  moderator: string;
  timestamp: string;
}

export default function LogsPage({ params }: { params: { guildId: string } }) {
  const guildId = params.guildId;
  const [selectedCategory, setSelectedCategory] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const url = selectedCategory
      ? `/api/guilds/${guildId}/logs?category=${selectedCategory}`
      : `/api/guilds/${guildId}/logs`;

    fetch(url)
      .then((res) => res.json())
      .then((d) => {
        setLogs(d.logs || []);
        setLoading(false);
      })
      .catch(() => {
        setLogs([]);
        setLoading(false);
      });
  }, [guildId, selectedCategory]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="space-y-2">
        <h2 className="font-semibold mb-2">Log Channels</h2>
        <button
          onClick={() => setSelectedCategory('')}
          className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
            !selectedCategory
              ? 'bg-accent/10 border-accent text-white'
              : 'bg-surface border-border text-gray-300 hover:bg-accent/5'
          }`}
        >
          All Logs
        </button>
        {LOG_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`w-full text-left px-4 py-3 rounded-lg border transition-colors flex items-center gap-3 ${
              selectedCategory === cat.id
                ? 'bg-accent/10 border-accent text-white'
                : 'bg-surface border-border text-gray-300 hover:bg-accent/5'
            }`}
          >
            <div className={`w-3 h-3 rounded-full ${cat.color}`} />
            <span className="text-sm">{cat.name}</span>
          </button>
        ))}
      </div>
      <div className="lg:col-span-2 bg-surface rounded-xl border border-border p-6">
        <h2 className="font-semibold mb-4">
          {selectedCategory ? LOG_CATEGORIES.find(c => c.id === selectedCategory)?.name : 'All Logs'} - Live Feed
        </h2>
        {loading && <p className="text-gray-400">Loading...</p>}
        {!loading && logs.length === 0 && (
          <p className="text-gray-500">No log entries found</p>
        )}
        {!loading && logs.length > 0 && (
          <div className="space-y-3 max-h-[600px] overflow-auto">
            {logs.map((log) => (
              <div key={log.id} className="p-3 bg-background rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{log.action}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>Target: {log.target}</span>
                  {log.moderator && <span>Mod: {log.moderator}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}