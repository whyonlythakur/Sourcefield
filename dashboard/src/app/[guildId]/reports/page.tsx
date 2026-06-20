'use client';

import { useEffect, useState } from 'react';

interface Report {
  id: string;
  reporter_id: string;
  target_id: string;
  reason: string;
  severity: string;
  status: string;
  created_at: string;
}

const STATUSES = ['pending', 'in_review', 'resolved'];

export default function ReportsPage({ params }: { params: { guildId: string } }) {
  const guildId = params.guildId;
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/guilds/${guildId}/reports`)
      .then((res) => res.json())
      .then((d) => {
        setReports(d || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [guildId]);

  async function moveStatus(id: string, newStatus: string) {
    await fetch(`/api/guilds/${guildId}/reports`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    });
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  }

  const getReports = (status: string) =>
    reports.filter((r) => r.status === status);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Reports</h1>
        <p className="text-gray-400">Loading reports...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STATUSES.map((status) => {
          const items = getReports(status);
          return (
            <div key={status} className="bg-surface rounded-xl border border-border p-4 min-h-[300px]">
              <h2 className="font-semibold mb-4 capitalize">{status.replace('_', ' ')}</h2>
              <div className="space-y-3">
                {items.length === 0 && (
                  <p className="text-gray-500 text-sm">No reports</p>
                )}
                {items.map((report) => (
                  <div key={report.id} className="bg-background rounded-lg p-3 border border-border">
                    <p className="text-sm font-medium">Target: {report.target_id}</p>
                    <p className="text-xs text-gray-400">Reason: {report.reason}</p>
                    <p className="text-xs text-gray-500">Severity: {report.severity}</p>
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {status !== 'pending' && (
                        <button
                          onClick={() => moveStatus(report.id, 'pending')}
                          className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
                        >
                          Pending
                        </button>
                      )}
                      {status !== 'in_review' && (
                        <button
                          onClick={() => moveStatus(report.id, 'in_review')}
                          className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
                        >
                          Review
                        </button>
                      )}
                      {status !== 'resolved' && (
                        <button
                          onClick={() => moveStatus(report.id, 'resolved')}
                          className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
