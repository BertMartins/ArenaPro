"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import JoinLeaveButton from "@/components/game/JoinLeaveButton";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/dashboard/admin");
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
        Carregando dashboard...
      </div>
    );
  }

  const { stats, gamesToday, lastGames, recentFinancial, currentUserId } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-950 text-white p-6 animate-fadeIn">

      {/* TÍTULO */}
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight mb-2 animate-slideIn">
          Painel Administrativo
        </h1>
        <p className="text-zinc-400 animate-fadeIn">
          Bem-vindo ao controle geral do ArenaPro
        </p>
      </div>

      {/* ====== CARDS DE ESTATÍSTICAS ====== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Total de Usuários" value={stats.totalUsers} color="from-blue-500 to-blue-700" icon="👥" />
        <StatCard title="Mensalistas" value={stats.totalMonthly} color="from-green-500 to-green-700" icon="💳" />
        <StatCard title="Diaristas" value={stats.totalDaily} color="from-yellow-500 to-orange-600" icon="🏐" />
      </div>

      {/* ====== JOGOS DE HOJE ====== */}
      <SectionTitle title="Jogos de Hoje" />

      {gamesToday.length === 0 && (
        <p className="text-zinc-400 mb-10">Nenhum jogo agendado para hoje.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {gamesToday.map((game: any) => (
          <GameCard key={game.id} game={game} currentUserId={currentUserId} refresh={load} />
        ))}
      </div>

      {/* ====== ÚLTIMOS JOGOS FINALIZADOS ====== */}
      <SectionTitle title="Últimos Jogos Finalizados" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {lastGames.map((game: any) => (
          <LastGameCard key={game.id} game={game} />
        ))}
      </div>

      {/* ====== FINANCEIRO ====== */}
      <SectionTitle title="Movimentações Financeiras Recentes" />

      <div className="space-y-4">
        {recentFinancial.map((m: any) => (
          <FinancialRow key={m.id} entry={m} />
        ))}
      </div>

      <div className="text-center mt-20 text-sm text-zinc-600">
        ArenaPro © {new Date().getFullYear()} — Gestão Profissional de Jogos
      </div>
    </div>
  );
}

/* ==========================================
 * COMPONENTES REUTILIZÁVEIS
 * ========================================== */

function StatCard({ title, value, color, icon }: any) {
  return (
    <div className={`glass-card p-6 rounded-2xl shadow-xl border border-white/10 bg-gradient-to-br ${color} animate-fadeIn`}>
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg text-zinc-200">{title}</h3>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}

function SectionTitle({ title }: any) {
  return (
    <h2 className="text-3xl font-semibold mb-6 mt-10 border-l-4 border-orange-500 pl-3">
      {title}
    </h2>
  );
}

function GameCard({ game, currentUserId, refresh }: any) {
  const isInGame = game.players.some((p: any) => p.userId === currentUserId);

  return (
    <div className="glass-card p-6 rounded-xl shadow-xl border border-white/10 hover:shadow-orange-500/20 transition-all">

      <div className="flex justify-between mb-4">
        <h3 className="text-xl font-semibold">Jogo • {new Date(game.date).toLocaleDateString()}</h3>
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
        href={`/dashboard/game/${game.id}`}
        className="btn-secondary inline-block mt-3 px-4 py-2 rounded-lg"
      >
        Ver detalhes
      </Link>
    </div>
  );
}

function LastGameCard({ game }: any) {
  return (
    <div className="glass-card p-6 rounded-xl border border-white/10 shadow-xl">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold">Finalizado</h3>
        <span className="text-zinc-400">
          {new Date(game.createdAt).toLocaleDateString()}
        </span>
      </div>
      <p className="text-zinc-300 mt-3">
        Campeão: <span className="text-yellow-400 font-bold">{game.champion?.name || "—"}</span>
      </p>
    </div>
  );
}

function FinancialRow({ entry }: any) {
  return (
    <div className="glass-card p-4 rounded-xl border border-white/10 flex justify-between items-center">
      <div>
        <p className="font-semibold">{entry.type}</p>
        <p className="text-zinc-400 text-sm">
          {entry.user?.name || "—"} • {entry.game?.id ? `Jogo ${entry.game.id.slice(0, 4)}` : "Sem jogo"}
        </p>
      </div>
      <div className="text-green-400 font-bold text-lg">
        R$ {entry.amount.toFixed(2)}
      </div>
    </div>
  );
}
