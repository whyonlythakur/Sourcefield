export default function DangerZoneCard({ title, description, actionLabel }: { title: string; description: string; actionLabel: string }) {
  return (
    <div className="border border-danger/50 rounded-xl p-4">
      <h3 className="font-semibold text-danger">{title}</h3>
      <p className="text-sm text-gray-400 mt-1">{description}</p>
      <button className="mt-3 bg-danger/20 text-danger px-4 py-2 rounded-lg text-sm hover:bg-danger/30 transition-colors">{actionLabel}</button>
    </div>
  );
}
