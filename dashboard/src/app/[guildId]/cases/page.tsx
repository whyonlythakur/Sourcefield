'use client';

import { useEffect, useState } from 'react';

interface Case {
  id: string;
  user_id: string;
  type: string;
  status: string;
  created_at: string;
}

export default function CasesPage({ params }: { params: { guildId: string } }) {
  const guildId = params.guildId;
  const [cases, setCases] = useState<Case[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/guilds/${guildId}/cases?page=${page}`)
      .then((res) => res.json())
      .then((d) => {
        setCases(d.cases || []);
        setTotal(d.total || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [guildId, page]);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Case History</h1>
        <p className="text-gray-400">Loading cases...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Case History</h1>
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-background/50">
            <tr>
              <th className="px-4 py-3 text-left">Case ID</th>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {cases.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No cases yet
                </td>
              </tr>
            )}
            {cases.map((c) => (
              <tr key={c.id} className="border-t border-border hover:bg-background/30">
                <td className="px-4 py-3">{c.id}</td>
                <td className="px-4 py-3">{c.user_id}</td>
                <td className="px-4 py-3 capitalize">{c.type}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      c.status === 'active'
                        ? 'bg-yellow-900/50 text-yellow-400'
                        : 'bg-green-900/50 text-green-400'
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {new Date(c.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {total > 50 && (
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-4 py-2 bg-surface border border-border rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-400">
            Page {page} of {Math.ceil(total / 50)}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page * 50 >= total}
            className="px-4 py-2 bg-surface border border-border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
