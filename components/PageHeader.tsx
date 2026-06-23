export default function PageHeader({ title, action }: { title: string, action?: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl md:text-3xl font-black text-white">{title}</h1>
      {action}
    </div>
  );
}