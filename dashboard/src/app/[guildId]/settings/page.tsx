export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="space-y-6">
        <div className="bg-surface rounded-xl border border-border p-6">
          <h2 className="font-semibold mb-4">General</h2>
          <p className="text-gray-500">Prefix, language settings</p>
        </div>
        <div className="bg-surface rounded-xl border border-danger/50 p-6">
          <h2 className="font-semibold text-danger mb-4">Danger Zone</h2>
          <p className="text-gray-500">Reset config, transfer ownership, remove bot</p>
        </div>
      </div>
    </div>
  );
}
