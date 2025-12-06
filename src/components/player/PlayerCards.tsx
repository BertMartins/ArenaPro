"use client";

export default function PlayerCards({
  wins,
  losses,
  titles,
  level,
}: {
  wins: number;
  losses: number;
  titles: number;
  level: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 px-4 mt-8">

      <div className="bg-[#1B2537] p-4 rounded-xl shadow-lg border border-white/10">
        <p className="text-gray-400 text-sm">Vitórias</p>
        <h2 className="text-3xl font-bold mt-1 text-green-400">{wins}</h2>
      </div>

      <div className="bg-[#1B2537] p-4 rounded-xl shadow-lg border border-white/10">
        <p className="text-gray-400 text-sm">Derrotas</p>
        <h2 className="text-3xl font-bold mt-1 text-red-400">{losses}</h2>
      </div>

      <div className="bg-[#1B2537] p-4 rounded-xl shadow-lg border border-white/10">
        <p className="text-gray-400 text-sm">Títulos</p>
        <h2 className="text-3xl font-bold mt-1 text-yellow-400">{titles}</h2>
      </div>

      <div className="bg-[#1B2537] p-4 rounded-xl shadow-lg border border-white/10">
        <p className="text-gray-400 text-sm">Nível</p>
        <h2 className="text-3xl font-bold mt-1 text-blue-400">{level}</h2>
      </div>

    </div>
  );
}
