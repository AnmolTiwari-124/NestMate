function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-primary/15 bg-white p-6 shadow-[0_10px_30px_rgba(249,115,22,0.06)]">
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className="mt-3 text-4xl font-black tracking-tight text-ink">{value ?? 0}</p>
    </div>
  );
}

export default StatCard;
