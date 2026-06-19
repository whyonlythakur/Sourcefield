export default function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-surface rounded-xl border border-border p-4">
      <p className="text-sm text-gray-400 mb-1">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
