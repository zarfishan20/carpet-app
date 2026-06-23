interface Props {
  title: string;
  value: number | string;
}

export default function StatCard({ title, value }: Props) {
  return (
    <div className="stat-card fs-app">
      <p className="stat-card-title">{title}</p>
      <h2 className="stat-card-value">{value}</h2>
    </div>
  );
}