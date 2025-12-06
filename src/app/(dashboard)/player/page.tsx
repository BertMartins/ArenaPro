"use client";

import { useEffect, useState } from "react";
import BottomNav from "@/components/ui/BottomNav";
import PlayerHeader from "@/components/player/PlayerHeader";
import PlayerCards from "@/components/player/PlayerCards";
import PlayerChart from "@/components/player/PlayerChart";

export default function PlayerDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/player/dashboard");
      const json = await res.json();
      setData(json);
    }
    load();
  }, []);

  if (!data) return <p className="text-center mt-20">Carregando...</p>;

  const stats = data.stats || {
    wins: 0,
    losses: 0,
    titles: 0,
    level: 1,
  };

  return (
    <div className="pb-24">

      {/* Header */}
      <PlayerHeader
        name="Jogador"
        wins={stats.wins}
        losses={stats.losses}
        titles={stats.titles}
        level={stats.level}
      />

      {/* Cards do jogador */}
      <PlayerCards
        wins={stats.wins}
        losses={stats.losses}
        titles={stats.titles}
        level={stats.level}
      />

      {/* Lista de jogos disponíveis */}
      <div className="mt-10 px-4">
        <h2 className="text-xl font-bold mb-3">🏐 Jogos Disponíveis</h2>

        {data.jogosDisponiveis.length === 0 && (
          <p className="text-gray-400">Nenhum jogo disponível</p>
        )}

        {data.jogosDisponiveis.map((game: any) => (
          <div key={game.id} className="bg-[#1B2537] p-4 rounded-xl shadow-md mb-4">
            <p className="font-bold text-white">
              📅 {new Date(game.date).toLocaleDateString()}
            </p>
            <p className="text-gray-400 text-sm">
              👥 {game.players.length}/{game.maxPlayers} jogadores
            </p>

            <button className="w-full mt-3 bg-orange-500 py-3 rounded-lg text-white font-bold">
              Participar
            </button>
          </div>
        ))}
      </div>

      {/* Gráfico */}
      <PlayerChart wins={stats.wins} />

      {/* Navbar */}
      <BottomNav />
    </div>
  );
}
