export default function SeverityPill({ severity }: { severity: string }) {
  const colors: Record<string, string> = { low: 'bg-success/20 text-success', medium: 'bg-warning/20 text-warning', high: 'bg-danger/20 text-danger', critical: 'bg-danger text-white' };
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors[severity] || 'bg-gray-600 text-gray-300'}`}>{severity}</span>;
}
