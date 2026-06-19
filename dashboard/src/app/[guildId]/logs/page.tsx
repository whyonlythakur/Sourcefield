const categories = ['Mod Actions', 'AutoMod Triggers', 'Message Logs', 'Member Logs', 'Raid Logs', 'Case Logs', 'Server Logs', 'Error Logs'];

export default function LogsPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="space-y-2">
        <h2 className="font-semibold mb-2">Log Channels</h2>
        {categories.map(cat => (
          <div key={cat} className="bg-surface rounded-lg border border-border p-3">
            <span className="text-sm">{cat}</span>
          </div>
        ))}
      </div>
      <div className="lg:col-span-2 bg-surface rounded-xl border border-border p-6">
        <h2 className="font-semibold mb-4">Live Feed</h2>
        <p className="text-gray-500">No log entries</p>
      </div>
    </div>
  );
}
