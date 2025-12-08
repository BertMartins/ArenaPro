"use client";

import { useEffect, useState } from "react";
import StatsHeader from "@/components/dashboard/StatsHeader";
import AdminActionsBar from "@/components/dashboard/AdminActionsBar";
import CreateGameModal from "@/components/dashboard/CreateGameModal";
import GameCardAdmin from "@/components/dashboard/GameCardAdmin";
import BottomNav from "@/components/dashboard/BottomNav";

type Game = any;

export default function DashboardAdminPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  async function loadGames() {
    setLoading(true);
    try {
      const res = await fetch("/api/games");
      const data = await res.json();
      if (res.ok) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const filtered = data.filter((g: Game) => {
          const d = new Date(g.date);
          d.setHours(0, 0, 0, 0);
          return d >= today;
        });
        filtered.sort((a: Game, b: Game) => +new Date(a.date) - +new Date(b.date));
        setGames(filtered);
      } else {
        setGames([]);
      }
    } catch (err) {
      console.error(err);
      setGames([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGames();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <StatsHeader />
      <AdminActionsBar onCreate={() => setModalOpen(true)} />

      <section>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-orange-400">📅</span> Jogos Disponíveis
        </h2>

        {loading && <div className="text-gray-400">Carregando jogos...</div>}

        {!loading && games.length === 0 && (
          <div className="glass-card p-6 rounded">Nenhum jogo encontrado.</div>
        )}

        <div className="space-y-4">
          {games.map((g) => (
            <GameCardAdmin key={g.id} game={g} onUpdate={loadGames} />
          ))}
        </div>
      </section>

      <CreateGameModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={() => { setModalOpen(false); loadGames(); }}
      />

      <BottomNav active="home" />
    </div>
  );
}
