const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export async function fetchGuild(guildId: string) {
  const res = await fetch(`${API_BASE}/api/guilds/${guildId}`);
  return res.json();
}

export async function updateModule(guildId: string, moduleName: string, data: any) {
  const res = await fetch(`${API_BASE}/api/guilds/${guildId}/modules/${moduleName}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}
