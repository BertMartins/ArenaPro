"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PlayerHeader from "@/components/dashboard/PlayerHeader";
import GameCard from "@/components/dashboard/GameCard";
import BottomNav from "@/components/dashboard/BottomNav";

type Game = any;

export default function PlayerDashboard() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const router = useRouter(); // <-- Faltava isso!

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
        const now = new Date();
        const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

        const filtered = data
          .filter((g: Game) => (g.date as string).substring(0, 10) >= todayStr)
          .sort((a: Game, b: Game) => a.date.localeCompare(b.date));
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
    <div className="p-3 sm:p-5 space-y-4 pb-24 max-w-2xl mx-auto">
      <PlayerHeader />

      <section>
        <h2 className="text-base sm:text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span className="text-orange-400">📅</span> Jogos Disponíveis
        </h2>

        {loading && <div className="text-gray-400">Carregando jogos...</div>}

        {!loading && games.length === 0 && (
          <div className="glass-card p-6 rounded text-gray-400">Nenhum jogo encontrado.</div>
        )}

        <div className="space-y-4">
          {games.map((g) => (
            <GameCard
              key={g.id}
              game={g}
              currentUserId={user?.id || ""}
              mode="player"
              onView={() => router.push(`/games/${g.id}`)}
              refresh={loadGames}
            />

          ))}
        </div>
      </section>

      <BottomNav active="home" role="player" />
    </div>
  );
}
