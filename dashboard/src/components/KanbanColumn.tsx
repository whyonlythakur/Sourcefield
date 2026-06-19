export default function KanbanColumn({ title, items }: { title: string; items: any[] }) {
  return (
    <div className="bg-surface rounded-xl border border-border p-4 min-h-[200px]">
      <h2 className="font-semibold mb-4">{title}</h2>
      {items.length === 0 && <p className="text-gray-500 text-sm">No items</p>}
    </div>
  );
}
