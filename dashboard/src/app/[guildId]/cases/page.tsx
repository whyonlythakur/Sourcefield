'use client';

import { useEffect, useState } from 'react';

interface Case {
  id: string;
  user_id: string;
  type: string;
  status: string;
  reason: string;
  moderator_id: string;
  created_at: string;
  updated_at: string;
}

export default function CasesPage({ params }: { params: { guildId: string } }) {
  const guildId = params.guildId;
  const [cases, setCases] = useState<Case[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

  useEffect(() => {
    const query = new URLSearchParams({
      page: page.toString(),
      search,
      type: filterType,
      status: filterStatus,
    }).toString();

    fetch(`/api/guilds/${guildId}/cases?${query}`)
      .then((res) => res.json())
      .then((d) => {
        setCases(d.cases || []);
        setTotal(d.total || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [guildId, page, search, filterType, filterStatus]);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Case History</h1>
        <p className="text-gray-400">Loading cases...</p>
      </div>
    );
  }

  if (selectedCase) {
    return (
      <div>
        <button
          onClick={() => setSelectedCase(null)}
          className="mb-4 px-4 py-2 bg-surface border border-border rounded-lg hover:bg-accent/10"
        >
          ← Back to Cases
        </button>
        <div className="bg-surface rounded-xl border border-border p-6 max-w-2xl">
          <h1 className="text-2xl font-bold mb-6">Case {selectedCase.id}</h1>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">User</p>
                <p className="font-medium">{selectedCase.user_id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Moderator</p>
                <p className="font-medium">{selectedCase.moderator_id || 'AutoMod'}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400">Type</p>
              <p className="font-medium capitalize">{selectedCase.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Status</p>
              <span className={`text-xs px-2 py-1 rounded ${
                selectedCase.status === 'active'
                  ? 'bg-yellow-900/50 text-yellow-400'
                  : 'bg-green-900/50 text-green-400'
              }`}>
                {selectedCase.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-400">Reason</p>
              <p className="font-medium">{selectedCase.reason}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div>
                <p className="text-sm text-gray-400">Created</p>
                <p className="font-medium">{new Date(selectedCase.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Updated</p>
                <p className="font-medium">{new Date(selectedCase.updated_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Case History</h1>
      <div className="bg-surface rounded-xl border border-border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by user ID or case ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-accent"
          />
          <select
            value={filterType}
            onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
            className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-accent"
          >
            <option value="">All Types</option>
            <option value="spam">Spam</option>
            <option value="profanity">Profanity</option>
            <option value="mention">Mass Mention</option>
            <option value="invite">Invite</option>
            <option value="links">External Links</option>
            <option value="raid">Raid</option>
            <option value="manual">Manual</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-accent"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
            <option value="escalated">Escalated</option>
          </select>
        </div>
      </div>
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
                  No cases found
                </td>
              </tr>
            )}
            {cases.map((c) => (
              <tr
                key={c.id}
                onClick={() => setSelectedCase(c)}
                className="border-t border-border hover:bg-background/30 cursor-pointer"
              >
                <td className="px-4 py-3 font-medium">{c.id}</td>
                <td className="px-4 py-3">{c.user_id}</td>
                <td className="px-4 py-3 capitalize">{c.type}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded ${
                    c.status === 'active'
                      ? 'bg-yellow-900/50 text-yellow-400'
                      : 'bg-green-900/50 text-green-400'
                  }`}>
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