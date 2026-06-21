'use client';

import { useEffect, useState } from 'react';

interface MediaSecurityConfig {
  securityLevel: 'low' | 'moderate' | 'high';
  mediaChannelId: string;
  reviewChannelId: string;
  trustedRoleId: string;
  autoEscalate: boolean;
}

interface PendingReview {
  id: string;
  user_id: string;
  message_id: string;
  channel_id: string;
  attachments: string[];
  created_at: string;
}

export default function MediaSecurityPage({ params }: { params: { guildId: string } }) {
  const guildId = params.guildId;
  const [config, setConfig] = useState<MediaSecurityConfig | null>(null);
  const [reviews, setReviews] = useState<PendingReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/guilds/${guildId}/media-security`)
      .then((res) => res.json())
      .then((d) => {
        setConfig(d.config || null);
        setReviews(d.pendingReviews || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [guildId]);

  async function updateSecurityLevel(level: 'low' | 'moderate' | 'high') {
    await fetch(`/api/guilds/${guildId}/media-security`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ securityLevel: level }),
    });
    setConfig((prev) => prev ? { ...prev, securityLevel: level } : null);
  }

  async function handleReview(id: string, approve: boolean) {
    await fetch(`/api/guilds/${guildId}/media-security/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, approve }),
    });
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Media Security</h1>
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Media Security</h1>
      <div className="space-y-6">
        <div className="bg-surface rounded-xl border border-border p-6">
          <h2 className="font-semibold mb-4">Security Level</h2>
          <div className="flex gap-2 flex-wrap">
            {(['low', 'moderate', 'high'] as const).map((level) => (
              <button
                key={level}
                onClick={() => updateSecurityLevel(level)}
                className={`px-6 py-3 rounded-lg border font-medium capitalize transition-colors ${
                  config?.securityLevel === level
                    ? 'bg-accent border-accent text-white'
                    : 'bg-surface border-border text-gray-400 hover:text-white'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-400">
            {config?.securityLevel === 'low' && 'Low: Allow up to 2 attachments per message'}
            {config?.securityLevel === 'moderate' && 'Moderate: Allow 1 attachment per message'}
            {config?.securityLevel === 'high' && 'High: No attachments allowed without trusted role'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface rounded-xl border border-border p-6">
            <h2 className="font-semibold mb-4">Channel Bindings</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Media Channel</span>
                <span className="font-medium">{config?.mediaChannelId || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Review Channel</span>
                <span className="font-medium">{config?.reviewChannelId || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Trusted Role</span>
                <span className="font-medium">{config?.trustedRoleId || 'Not set'}</span>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-xl border border-border p-6">
            <h2 className="font-semibold mb-4">Settings</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={config?.autoEscalate}
                  onChange={() => {}}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm">Auto-escalate high-confidence violations</span>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-border p-6">
          <h2 className="font-semibold mb-4">Pending Media Reviews</h2>
          {reviews.length === 0 && (
            <p className="text-gray-500">No pending reviews</p>
          )}
          {reviews.length > 0 && (
            <div className="space-y-3">
              {reviews.map((review) => (
                <div key={review.id} className="bg-background rounded-lg p-4 border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium">User: {review.user_id}</p>
                      <p className="text-xs text-gray-400">
                        Channel: {review.channel_id} • {new Date(review.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReview(review.id, true)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReview(review.id, false)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {review.attachments.map((url, i) => (
                      <img key={i} src={url} alt="" className="w-24 h-24 object-cover rounded" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}