'use client';

import { useEffect, useState } from 'react';

interface AuditEntry {
  id: string;
  action: string;
  moderator: string;
  target: string;
  reason: string;
  timestamp: string;
  changes?: Record<string, any>;
}

export default function AuditPage({ params }: { params: { guildId: string } }) {
  const guildId = params.guildId;
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/guilds/${guildId}/audit?page=${page}`)
      .then((res) => res.json())
      .then((d) => {
        setEntries(d.entries || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [guildId, page]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Audit Trail</h1>
      {loading && <p className="text-gray-400">Loading...</p>}
      {!loading && entries.length === 0 && (
        <div className="bg-surface rounded-xl border border-border p-6">
          <p className="text-gray-500">No audit entries</p>
        </div>
      )}
      {!loading && entries.length > 0 && (
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-background/50">
              <tr>
                <th className="px-4 py-3 text-left">Action</th>
                <th className="px-4 py-3 text-left">Moderator</th>
                <th className="px-4 py-3 text-left">Target</th>
                <th className="px-4 py-3 text-left">Reason</th>
                <th className="px-4 py-3 text-left">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-t border-border hover:bg-background/30">
                  <td className="px-4 py-3 font-medium">{entry.action}</td>
                  <td className="px-4 py-3">{entry.moderator}</td>
                  <td className="px-4 py-3">{entry.target}</td>
                  <td className="px-4 py-3 text-gray-400">{entry.reason}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(entry.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
          className="px-4 py-2 bg-surface border border-border rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-400">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-surface border border-border rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
}