"use client";

export default function DashboardCards({
  totalUsuarios,
  totalJogadores,
  totalJogos,
}: {
  totalUsuarios: number;
  totalJogadores: number;
  totalJogos: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 px-4 mt-8">
      {/* Usuários */}
      <div className="bg-[#1B2537] rounded-xl p-4 shadow-lg border border-white/10">
        <p className="text-gray-400 text-sm">Usuários</p>
        <h2 className="text-3xl font-bold mt-1 text-orange-400">{totalUsuarios}</h2>
      </div>

      {/* Jogadores */}
      <div className="bg-[#1B2537] rounded-xl p-4 shadow-lg border border-white/10">
        <p className="text-gray-400 text-sm">Jogadores</p>
        <h2 className="text-3xl font-bold mt-1 text-blue-400">{totalJogadores}</h2>
      </div>

      {/* Jogos */}
      <div className="bg-[#1B2537] rounded-xl p-4 shadow-lg border border-white/10 col-span-2">
        <p className="text-gray-400 text-sm">Jogos</p>
        <h2 className="text-3xl font-bold mt-1 text-green-400">{totalJogos}</h2>
      </div>
    </div>
  );
}
