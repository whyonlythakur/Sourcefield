'use client';

import { useEffect, useState } from 'react';

interface GuildSettings {
  prefix: string;
  language: string;
  logChannels: Record<string, string>;
  verificationLevel: 'none' | 'low' | 'medium' | 'high';
}

export default function SettingsPage({ params }: { params: { guildId: string } }) {
  const guildId = params.guildId;
  const [settings, setSettings] = useState<GuildSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/guilds/${guildId}/settings`)
      .then((res) => res.json())
      .then((d) => {
        setSettings(d.settings || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [guildId]);

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    await fetch(`/api/guilds/${guildId}/settings`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    setSaving(false);
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="space-y-6">
        <div className="bg-surface rounded-xl border border-border p-6">
          <h2 className="font-semibold mb-4">General</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Command Prefix</label>
              <input
                type="text"
                value={settings?.prefix || '!'}
                onChange={(e) => setSettings((prev) => prev ? { ...prev, prefix: e.target.value } : null)}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Language</label>
              <select
                value={settings?.language || 'en'}
                onChange={(e) => setSettings((prev) => prev ? { ...prev, language: e.target.value } : null)}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-accent"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="ja">Japanese</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Verification Level</label>
              <select
                value={settings?.verificationLevel || 'none'}
                onChange={(e) => setSettings((prev) => prev ? { ...prev, verificationLevel: e.target.value as any } : null)}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-accent"
              >
                <option value="none">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-4 px-6 py-2 bg-accent hover:bg-accent/80 rounded-lg font-medium disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="bg-surface rounded-xl border border-border p-6">
          <h2 className="font-semibold mb-4">Log Channels</h2>
          <div className="space-y-3">
            {Object.entries(settings?.logChannels || {}).map(([category, channelId]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span className="text-sm font-medium text-gray-400">{channelId || 'Not set'}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-danger/50 p-6">
          <h2 className="font-semibold text-danger mb-4">Danger Zone</h2>
          <div className="space-y-4">
            <div className="p-4 bg-background rounded-lg border border-border">
              <p className="font-medium mb-2">Reset Configuration</p>
              <p className="text-sm text-gray-400 mb-3">Reset all bot settings to default values</p>
              <button className="px-4 py-2 bg-surface border border-border rounded-lg hover:bg-danger/10 hover:border-danger text-sm">
                Reset Config
              </button>
            </div>
            <div className="p-4 bg-background rounded-lg border border-border">
              <p className="font-medium mb-2">Transfer Ownership</p>
              <p className="text-sm text-gray-400 mb-3">Transfer server ownership to another user</p>
              <button className="px-4 py-2 bg-surface border border-border rounded-lg hover:bg-danger/10 hover:border-danger text-sm">
                Transfer
              </button>
            </div>
            <div className="p-4 bg-background rounded-lg border border-border">
              <p className="font-medium mb-2">Remove Bot</p>
              <p className="text-sm text-gray-400 mb-3">Remove AutoMod Pro from this server</p>
              <button className="px-4 py-2 bg-danger hover:bg-danger/80 rounded-lg text-sm">
                Remove Bot
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}