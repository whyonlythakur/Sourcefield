export default function ReportsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      <div className="grid grid-cols-3 gap-6">
        {['Pending', 'In Review', 'Resolved'].map(status => (
          <div key={status} className="bg-surface rounded-xl border border-border p-4">
            <h2 className="font-semibold mb-4">{status}</h2>
            <p className="text-gray-500 text-sm">No reports</p>
          </div>
        ))}
      </div>
    </div>
  );
}
