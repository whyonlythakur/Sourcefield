export default function AutomodPage() {
  const modules = [
    'Spam Detection', 'Duplicate/Copy-paste', 'Mass Mention', 'Mass Emoji/Sticker',
    'Caps Lock Filter', 'Profanity Filter', 'Custom Blacklist', 'Invite Filter',
    'External Links', 'Phishing Links', 'NSFW Image', 'Zalgo Filter',
    'Anti-Raid', 'New Account Filter', 'Alt Detection', 'Webhook Spam',
    'Nickname Filter', 'Channel/Role Spam', 'Auto-Slowmode', 'Token/IP Grabber',
    'Selfbot Detection', 'Warn System', 'Mute Manager', 'Lockdown',
    'Verification Gate', 'Media Security',
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">AutoMod Modules</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map(name => (
          <div key={name} className="bg-surface rounded-xl border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{name}</span>
              <div className="w-10 h-5 bg-gray-600 rounded-full" />
            </div>
            <p className="text-sm text-gray-500">Not yet configured</p>
          </div>
        ))}
      </div>
    </div>
  );
}
