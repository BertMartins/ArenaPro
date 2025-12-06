"use client";

import { useEffect, useState } from "react";
import BottomNav from "@/components/ui/BottomNav";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardCards from "@/components/dashboard/DashboardCards";
import DashboardChart from "@/components/dashboard/DashboardChart";
import AdminStatCard from "@/components/dashboard/AdminStatCard";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    async function loadDashboard() {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();
      setStats(data);
    }
    loadDashboard();
  }, []);

  if (!stats) return <p className="text-center mt-20">Carregando...</p>;

  return (
    <div className="pb-24">
      {/* Header */}
      <DashboardHeader
        name="Administrador"
        level={10}
        wins={stats.totalJogos}
        taxa={stats.totalJogadores}
      />

      {/* Cards principais */}
      <DashboardCards
        totalUsuarios={stats.totalUsuarios}
        totalJogadores={stats.totalJogadores}
        totalJogos={stats.totalJogos}
      />

      {/* Botões principais */}
      <div className="mt-6 flex flex-col gap-4 px-4">
        <button className="w-full bg-orange-500 py-4 rounded-xl text-white font-bold shadow-lg">
          ➕ CRIAR NOVO JOGO
        </button>

        <div className="flex gap-4">
          <button className="w-1/2 bg-blue-500 py-3 rounded-xl text-white font-bold shadow-lg">
            👥 USUÁRIOS
          </button>
          <button className="w-1/2 bg-green-500 py-3 rounded-xl text-white font-bold shadow-lg">
            💳 MENSALIDADES
          </button>
        </div>
      </div>

      {/* Jogos Disponíveis */}
      <div className="mt-10 px-4">
        <h2 className="text-xl font-bold mb-3">🏐 Jogos Disponíveis</h2>

        {stats.jogosDisponiveis.length === 0 && (
          <p className="text-gray-400">Nenhum jogo disponível</p>
        )}

        {stats.jogosDisponiveis.map((game: any) => (
          <div key={game.id} className="bg-[#1B2537] p-4 rounded-xl shadow-md mb-4">
            <p className="font-bold text-white">
              📅 {new Date(game.date).toLocaleDateString()}
            </p>
            <p className="text-gray-400 text-sm">
              👥 {game.players.length}/{game.maxPlayers} jogadores
            </p>

            <div className="mt-3 flex gap-3">
              <button className="flex-1 bg-orange-500 py-2 rounded-lg text-white font-bold">
                PARTICIPAR
              </button>
              <button className="px-4 bg-blue-600 rounded-lg text-white">👁</button>
            </div>
          </div>
        ))}
      </div>

      {/* Últimos Campeões */}
      <div className="mt-10 px-4">
        <h2 className="text-xl font-bold mb-3">🥇 Últimos Campeões</h2>

        {stats.ultimosGames.length === 0 && (
          <p className="text-gray-400">Nenhum jogo finalizado</p>
        )}

        {stats.ultimosGames.map((game: any) => (
          <div key={game.id} className="bg-[#1B2537] p-4 rounded-xl shadow-lg mb-3">
            <p className="font-bold text-white">
              🏆 {game.champion?.name ?? "Indefinido"}
            </p>
            <p className="text-gray-400">
              📅 {new Date(game.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* Gráfico */}
      <DashboardChart />

      {/* Navbar */}
      <BottomNav />
    </div>
  );
}
