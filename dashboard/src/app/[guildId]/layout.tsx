export default function GuildLayout({ children, params }: { children: React.ReactNode; params: { guildId: string } }) {
  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 bg-surface border-r border-border p-4 hidden md:block">
        <nav className="space-y-1">
          {[
            { href: 'overview', label: 'Overview' },
            { href: 'automod', label: 'AutoMod' },
            { href: 'reports', label: 'Reports' },
            { href: 'cases', label: 'Cases' },
            { href: 'logs', label: 'Logs' },
            { href: 'staff', label: 'Staff' },
            { href: 'media-security', label: 'Media Security' },
            { href: 'settings', label: 'Settings' },
            { href: 'audit', label: 'Audit' },
          ].map(item => (
            <a
              key={item.href}
              href={`/${params.guildId}/${item.href}`}
              className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-accent/10 hover:text-white transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        <header className="h-16 bg-surface border-b border-border flex items-center px-6">
          <span className="font-semibold">AutoMod Pro</span>
        </header>
        <div className="p-6 max-w-[1280px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
