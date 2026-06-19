'use client';

import { useEffect, useState } from 'react';
import { fetchGuild } from '@/lib/api';

export function useGuild(guildId: string) {
  const [guild, setGuild] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuild(guildId)
      .then(setGuild)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [guildId]);

  return { guild, loading };
}
