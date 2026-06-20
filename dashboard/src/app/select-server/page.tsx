'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Guild {
  id: string;
  name: string;
  icon: string | null;
  hasBot: boolean;
}

export default function SelectServerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    if (status === 'authenticated' && session?.user?.accessToken) {
      fetch('/api/guilds')
        .then(res => res.json())
        .then(data => {
          if (data.error) setError(data.error);
          else setGuilds(data);
          setLoading(false);
        });
    }
  }, [status, session, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-gray-400">Loading servers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-2xl font-bold mb-6">Select a Server</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {guilds.map(guild => {
            const iconUrl = guild.icon
              ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
              : null;
            return (
              <a
                key={guild.id}
                href={guild.hasBot ? `/${guild.id}/overview` : undefined}
                onClick={!guild.hasBot ? (e) => { e.preventDefault(); alert('Bot is not in this server'); } : undefined}
                className={`block rounded-xl border p-4 transition-colors ${
                  guild.hasBot
                    ? 'bg-surface border-border hover:bg-accent/10 cursor-pointer'
                    : 'bg-gray-800 border-gray-700 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3">
                  {iconUrl ? (
                    <img src={iconUrl} alt="" className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-sm font-bold">
                      {guild.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{guild.name}</p>
                    <p className="text-sm text-gray-400">
                      {guild.hasBot ? 'Click to manage' : 'Bot not installed'}
                    </p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
