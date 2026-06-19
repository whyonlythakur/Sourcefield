export default function SelectServerPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-4xl w-full px-6">
        <h1 className="text-2xl font-bold mb-6">Select a Server</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <p className="text-gray-400">Loading servers...</p>
        </div>
      </div>
    </div>
  );
}
