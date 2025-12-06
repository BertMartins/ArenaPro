"use client";
import { useEffect, useState } from "react";

export default function PlayerDashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/player/dashboard", { credentials: "include" })
      .then((r) => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return <div>Carregando...</div>;

  const totals = data.totals?._sum || {};
  return (
    <div className="space-y-6 animate-fade">
      <h1 className="text-3xl font-bold text-white">Área do Jogador</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
          <h3 className="text-sm text-gray-300">Jogos</h3>
          <p className="text-2xl font-bold text-orange-400">{data.gamesCount}</p>
        </div>
        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
          <h3 className="text-sm text-gray-300">Pontos totais</h3>
          <p className="text-2xl font-bold text-orange-400">{totals.points || 0}</p>
        </div>
        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
          <h3 className="text-sm text-gray-300">Aces</h3>
          <p className="text-2xl font-bold text-orange-400">{totals.aces || 0}</p>
        </div>
      </div>

      <div className="bg-white/5 p-6 rounded-xl border border-white/10">
        <h3 className="text-lg text-white mb-3">Últimos jogos</h3>
        <div className="space-y-3">
          {data.lastGames.map((s: any) => (
            <div key={s.id} className="p-3 bg-white/2 rounded-md">
              <div className="text-white font-semibold">{s.game.opponent} — {new Date(s.game.date).toLocaleDateString()}</div>
              <div className="text-sm text-gray-300">Pontos: {s.points} • Aces: {s.aces} • Blocks: {s.blocks}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
