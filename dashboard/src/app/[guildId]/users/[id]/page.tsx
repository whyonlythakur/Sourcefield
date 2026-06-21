'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface UserData {
  user_id: string;
  username: string;
  warnPoints: number;
  totalCases: number;
  firstSeen: string;
  lastActive: string;
}

interface CaseHistory {
  id: string;
  type: string;
  status: string;
  created_at: string;
}

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<UserData | null>(null);
  const [history, setHistory] = useState<CaseHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((d) => {
        setUser(d.user || null);
        setHistory(d.history || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">User Profile</h1>
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">User Profile</h1>
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  const warnPercentage = Math.min((user.warnPoints / 10) * 100, 100);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface rounded-xl border border-border p-6">
            <h2 className="font-semibold mb-4">Overview</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Username</p>
                <p className="font-medium">{user.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">User ID</p>
                <p className="font-medium">{user.user_id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">First Seen</p>
                <p className="font-medium">{new Date(user.firstSeen).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Last Active</p>
                <p className="font-medium">{new Date(user.lastActive).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-xl border border-border p-6">
            <h2 className="font-semibold mb-4">Case History</h2>
            {history.length === 0 && (
              <p className="text-gray-500">No cases</p>
            )}
            {history.length > 0 && (
              <div className="space-y-2">
                {history.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                    <div>
                      <p className="font-medium text-sm">{c.type}</p>
                      <p className="text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      c.status === 'active'
                        ? 'bg-yellow-900/50 text-yellow-400'
                        : 'bg-green-900/50 text-green-400'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface rounded-xl border border-border p-6">
            <h2 className="font-semibold mb-4">Warn Points</h2>
            <div className="text-center mb-4">
              <p className="text-4xl font-bold">{user.warnPoints}</p>
              <p className="text-sm text-gray-400">/ 10 points</p>
            </div>
            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  warnPercentage >= 80 ? 'bg-red-500' : warnPercentage >= 50 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${warnPercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {user.warnPoints >= 10 && 'Auto-mute triggered'}
              {user.warnPoints >= 7 && user.warnPoints < 10 && '1 warning from auto-ban'}
              {user.warnPoints >= 5 && user.warnPoints < 7 && '1 warning from auto-kick'}
              {user.warnPoints >= 3 && user.warnPoints < 5 && '1 warning from auto-mute'}
              {user.warnPoints < 3 && 'Good standing'}
            </p>
          </div>

          <div className="bg-surface rounded-xl border border-border p-6">
            <h2 className="font-semibold mb-4">Statistics</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Cases</span>
                <span className="font-medium">{user.totalCases}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Active Cases</span>
                <span className="font-medium">{history.filter(c => c.status === 'active').length}</span>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-xl border border-danger/50 p-6">
            <h2 className="font-semibold text-danger mb-4">Actions</h2>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-surface border border-border rounded-lg hover:bg-accent/10 text-sm">
                View Full History
              </button>
              <button className="w-full px-4 py-2 bg-surface border border-border rounded-lg hover:bg-accent/10 text-sm">
                Clear Warn Points
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}