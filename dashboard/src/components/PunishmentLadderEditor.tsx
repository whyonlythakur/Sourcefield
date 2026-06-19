export default function PunishmentLadderEditor({ ladder }: { ladder: string[] }) {
  return (
    <div className="flex gap-2">
      {ladder.map((step, i) => (
        <span key={i} className="bg-accent/20 text-accent text-xs px-2 py-1 rounded">{step}</span>
      ))}
    </div>
  );
}
