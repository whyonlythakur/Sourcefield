import StatCard from '@/components/StatCard';

export default function OverviewPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Members" value="－" />
        <StatCard title="Active Cases" value="－" />
        <StatCard title="Auto-Actions (24h)" value="－" />
        <StatCard title="Raid Status" value="Calm" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface rounded-xl border border-border p-6">
          <h2 className="font-semibold mb-4">Actions (7d)</h2>
          <p className="text-gray-500">Chart placeholder</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-6">
          <h2 className="font-semibold mb-4">Case Breakdown</h2>
          <p className="text-gray-500">Donut chart placeholder</p>
        </div>
      </div>
    </div>
  );
}
