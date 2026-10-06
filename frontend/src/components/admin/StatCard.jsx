function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <p className="text-sm font-medium text-zinc-400">{label}</p>
      <p className="mt-3 text-4xl font-bold text-white">{value ?? 0}</p>
    </div>
  );
}

export default StatCard;
