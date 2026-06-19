export default function CasesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Case History</h1>
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-background/50">
            <tr>
              <th className="px-4 py-3 text-left">Case ID</th>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Module</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No cases yet</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
