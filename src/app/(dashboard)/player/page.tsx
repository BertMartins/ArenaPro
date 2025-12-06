"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import JoinLeaveButton from "@/components/game/JoinLeaveButton";

export default function PlayerDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/dashboard/player");
    const json = await res.json();
    setData(json.dashboard);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl">
        Carregando dados...
      </div>
    );
  }

  const { stats, gamesToday, myGames, currentUserId } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-950 text-white p-6 animate-fadeIn">

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold animate-slideIn">Área do Jogador</h1>
        <p className="text-zinc-400">Gerencie sua participação nos jogos</p>
      </div>

      {/* STATS */}
      <StatsSection stats={stats} />

      {/* JOGOS DE HOJE */}
      <SectionTitle title="Jogos de Hoje" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {gamesToday.length === 0 && (
          <p className="text-zinc-400">Nenhum jogo para hoje.</p>
        )}

        {gamesToday.map((game: any) => (
          <GameCard
            key={game.id}
            game={game}
            currentUserId={currentUserId}
            refresh={load}
          />
        ))}
      </div>

      {/* MEUS JOGOS */}
      <SectionTitle title="Meus Jogos" />

      <div className="space-y-4">
        {myGames.length === 0 && (
          <p className="text-zinc-400">Você ainda não participou de jogos.</p>
        )}

        {myGames.map((g: any) => (
          <MyGameCard key={g.id} gp={g} />
        ))}
      </div>
    </div>
  );
}

/* --------------------------
  COMPONENTES DO PLAYER
--------------------------- */

function StatsSection({ stats }: any) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
      <StatCard label="Vitórias" value={stats.wins} color="from-green-500 to-green-700" />
      <StatCard label="Derrotas" value={stats.losses} color="from-red-500 to-red-700" />
      <StatCard label="Títulos" value={stats.titles} color="from-yellow-500 to-yellow-600" />
      <StatCard label="Nível" value={stats.level} color="from-blue-500 to-blue-700" />
    </div>
  );
}

function StatCard({ label, value, color }: any) {
  return (
    <div className={`glass-card p-6 text-center rounded-xl bg-gradient-to-br ${color} border border-white/10`}>
      <p className="text-xl font-semibold">{label}</p>
      <p className="text-4xl font-bold mt-1">{value}</p>
    </div>
  );
}

function SectionTitle({ title }: any) {
  return (
    <h2 className="text-3xl font-semibold mt-10 mb-6 border-l-4 border-orange-500 pl-3">
      {title}
    </h2>
  );
}

function GameCard({ game, currentUserId, refresh }: any) {
  const isInGame = game.players.some((p: any) => p.userId === currentUserId);

  return (
    <div className="glass-card p-6 rounded-xl border border-white/10 shadow-xl hover:shadow-orange-500/20 transition-all">

      <div className="flex justify-between mb-3">
        <h3 className="text-xl font-semibold">
          {new Date(game.date).toLocaleDateString()}
        </h3>
        <span className="text-zinc-400">
          {game.players.length}/{game.maxPlayers}
        </span>
      </div>

      <p className="text-zinc-400 mb-3">
        Criado por: <span className="text-white">{game.createdBy?.name}</span>
      </p>

      <JoinLeaveButton
        gameId={game.id}
        isInGame={isInGame}
        onChange={refresh}
      />

      <Link
        href={`/player/game/${game.id}`}
        className="btn-secondary inline-block mt-3 px-4 py-2 rounded-lg"
      >
        Ver detalhes
      </Link>
    </div>
  );
}

function MyGameCard({ gp }: any) {
  const game = gp.game;

  return (
    <div className="glass-card p-4 rounded-xl border border-white/10">
      <div className="flex justify-between items-center">
        <p className="font-semibold">
          {new Date(game.date).toLocaleDateString()}
        </p>
        <span className="text-sm text-orange-400">Participou</span>
      </div>

      <p className="text-zinc-400 text-sm mt-1">
        Criado por: <span className="text-white">{game.createdBy?.name}</span>
      </p>
    </div>
  );
}
