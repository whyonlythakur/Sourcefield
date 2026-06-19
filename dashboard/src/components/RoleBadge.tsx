export default function RoleBadge({ role }: { role: string }) {
  const colors: Record<string, string> = { admin: 'bg-accent/20 text-accent', moderator: 'bg-success/20 text-success', reporter: 'bg-warning/20 text-warning' };
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors[role] || 'bg-gray-600 text-gray-300'}`}>{role}</span>;
}
