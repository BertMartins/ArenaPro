"use client";

import { useEffect, useState } from "react";
import PlayerHeader from "@/components/dashboard/PlayerHeader";
import GameCardPlayer from "@/components/dashboard/GameCardPlayer";
import BottomNav from "@/components/dashboard/BottomNav";

type Game = any;

export default function PlayerDashboard() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  async function loadUser() {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (res.ok) setUser(data.user);
    } catch (err) {
      console.error(err);
    }
  }

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
    loadUser();
    loadGames();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <PlayerHeader />

      <section>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-orange-400">📅</span> Jogos Disponíveis
        </h2>

        {loading && <div className="text-gray-400">Carregando jogos...</div>}

        {!loading && games.length === 0 && (
          <div className="glass-card p-6 rounded text-gray-400">Nenhum jogo encontrado.</div>
        )}

        <div className="space-y-4">
          {games.map((g) => (
            <GameCardPlayer key={g.id} game={g} userId={user?.id} onUpdate={loadGames} />
          ))}
        </div>
      </section>

      <BottomNav active="home" />
    </div>
  );
}
