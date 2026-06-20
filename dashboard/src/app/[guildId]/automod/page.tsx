'use client';

import { useEffect, useState } from 'react';

const ALL_MODULES = [
  'Spam Detection',
  'Duplicate Messages',
  'Mass Mention',
  'Mass Emoji',
  'Caps Lock Filter',
  'Profanity Filter',
  'Custom Blacklist',
  'Invite Filter',
  'External Links',
  'Phishing Links',
  'NSFW Image',
  'Zalgo Filter',
  'Anti-Raid',
  'New Account Filter',
  'Alt Detection',
  'Webhook Spam',
  'Nickname Filter',
  'Channel Role Spam',
  'Auto-Slowmode',
  'Token IP Grabber',
  'Selfbot Detection',
  'Warn System',
  'Mute Manager',
  'Lockdown',
  'Verification Gate',
  'Media Security',
];

export default function AutomodPage({ params }: { params: { guildId: string } }) {
  const guildId = params.guildId;
  const [modules, setModules] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/guilds/${guildId}/modules`)
      .then((res) => res.json())
      .then((d) => {
        setModules(d || {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [guildId]);

  async function handleToggle(name: string, current: any) {
    const enabled = !current?.enabled;
    const threshold = current?.threshold || 3;
    await fetch(`/api/guilds/${guildId}/modules/${encodeURIComponent(name)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled, threshold }),
    });
    setModules((prev) => ({
      ...prev,
      [name]: { ...prev[name], enabled, threshold },
    }));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">AutoMod Modules</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ALL_MODULES.map((name) => {
          const mod = modules?.[name] || { enabled: false, threshold: 3 };
          return (
            <div
              key={name}
              className="bg-surface rounded-xl border border-border p-4 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{name}</span>
                <button
                  onClick={() => handleToggle(name, mod)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    mod.enabled ? 'bg-accent' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                      mod.enabled ? 'left-[26px]' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
              <p className="text-sm text-gray-500">
                Status: {mod.enabled ? 'Enabled' : 'Disabled'}
                {mod.threshold ? ` | Threshold: ${mod.threshold}` : ''}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
