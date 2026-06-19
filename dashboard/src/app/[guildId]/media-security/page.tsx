export default function MediaSecurityPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Media Security</h1>
      <div className="space-y-6">
        <div className="bg-surface rounded-xl border border-border p-6">
          <h2 className="font-semibold mb-4">Security Level</h2>
          <div className="flex gap-2">
            {['Low', 'Moderate', 'High'].map(level => (
              <button key={level} className="px-4 py-2 rounded-lg border border-border text-gray-400 hover:text-white transition-colors">{level}</button>
            ))}
          </div>
        </div>
        <div className="bg-surface rounded-xl border border-border p-6">
          <h2 className="font-semibold mb-4">Review Queue</h2>
          <p className="text-gray-500">No pending media reviews</p>
        </div>
      </div>
    </div>
  );
}
