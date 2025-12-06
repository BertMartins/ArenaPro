"use client";

export default function AdminStatCard({
  value,
  label,
  color,
}: {
  value: string | number;
  label: string;
  color: string;
}) {
  return (
    <div className="bg-[#1B2537] p-4 rounded-xl shadow-md border border-white/10 text-center">
      <h3 className={`text-3xl font-bold ${color}`}>{value}</h3>
      <p className="text-gray-400 text-sm mt-1">{label}</p>
    </div>
  );
}
