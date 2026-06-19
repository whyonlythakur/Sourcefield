export default function ModuleToggleCard({ name, enabled, threshold }: { name: string; enabled: boolean; threshold: number }) {
  return (
    <div className="bg-surface rounded-xl border border-border p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">{name}</span>
        <span className={enabled ? 'text-success' : 'text-gray-500'}>{enabled ? 'ON' : 'OFF'}</span>
      </div>
      <p className="text-sm text-gray-500">Threshold: {threshold}</p>
    </div>
  );
}
