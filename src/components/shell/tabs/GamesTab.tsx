"use client";
import { useEffect, useState } from "react";
import GameCard from "@/components/dashboard/GameCard";
import { useNav } from "@/context/NavContext";

export default function GamesTab() {
  const nav = useNav()!;
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  async function loadUser() {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (res.ok) setUser(data.user);
    } catch {}
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
          .filter((g: any) => (g.date as string).substring(0, 10) >= todayStr)
          .sort((a: any, b: any) => a.date.localeCompare(b.date));
        setGames(filtered);
      } else {
        setGames([]);
      }
    } catch {
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
    <div className="p-3 sm:p-5 pb-24 space-y-4 max-w-2xl mx-auto">
      <h2 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
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
            mode={user?.role === "admin" ? "admin" : "player"}
            onView={() => nav.pushView({ type: "game-detail", gameId: g.id })}
            refresh={loadGames}
          />
        ))}
      </div>
    </div>
  );
}
