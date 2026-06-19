export default function ConfidenceBadge({ score }: { score: number }) {
  const color = score >= 90 ? 'text-success' : score >= 60 ? 'text-warning' : 'text-danger';
  return <span className={`text-xs font-semibold ${color}`}>{score}%</span>;
}
