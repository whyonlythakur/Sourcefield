'use client';

import { useEffect, useState } from 'react';

interface StaffMember {
  user_id: string;
  role: 'owner' | 'admin' | 'mod' | 'reporter';
  added_at: string;
  added_by: string;
}

const ROLE_COLORS = {
  owner: 'bg-red-500',
  admin: 'bg-orange-500',
  mod: 'bg-blue-500',
  reporter: 'bg-green-500',
};

export default function StaffPage({ params }: { params: { guildId: string } }) {
  const guildId = params.guildId;
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/guilds/${guildId}/staff`)
      .then((res) => res.json())
      .then((d) => {
        setStaff(d.staff || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [guildId]);

  const getByRole = (role: string) => staff.filter((s) => s.role === role);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Staff Management</h1>
      {loading && <p className="text-gray-400">Loading staff...</p>}
      {!loading && staff.length === 0 && (
        <div className="bg-surface rounded-xl border border-border p-6">
          <p className="text-gray-500">No staff members configured</p>
        </div>
      )}
      {!loading && staff.length > 0 && (
        <div className="space-y-6">
          {(['owner', 'admin', 'mod', 'reporter'] as const).map((role) => {
            const members = getByRole(role);
            if (members.length === 0) return null;
            return (
              <div key={role} className="bg-surface rounded-xl border border-border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-4 h-4 rounded-full ${ROLE_COLORS[role]}`} />
                  <h2 className="font-semibold capitalize">{role}s</h2>
                  <span className="text-sm text-gray-400">({members.length})</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {members.map((member) => (
                    <div key={member.user_id} className="bg-background rounded-lg p-4 border border-border">
                      <p className="font-medium">{member.user_id}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Added {new Date(member.added_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="mt-6 bg-surface rounded-xl border border-border p-6">
        <h2 className="font-semibold mb-4">Staff Hierarchy</h2>
        <div className="flex items-center justify-center gap-4">
          {(['owner', 'admin', 'mod', 'reporter'] as const).map((role, i) => (
            <div key={role} className="flex items-center">
              <div className={`px-4 py-2 rounded-lg ${ROLE_COLORS[role]} text-white font-medium capitalize`}>
                {role}
              </div>
              {i < 3 && (
                <div className="mx-2 text-gray-500">→</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}