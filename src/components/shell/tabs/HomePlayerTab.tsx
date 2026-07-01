"use client";
import { useEffect, useState } from "react";
import PlayerHeader from "@/components/dashboard/PlayerHeader";
import GameCard from "@/components/dashboard/GameCard";
import { useNav } from "@/context/NavContext";
import Image from "next/image";

export default function HomePlayerTab() {
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
    <div className="p-3 sm:p-5 space-y-4 pb-24 max-w-2xl mx-auto">
      <PlayerHeader />

      {/* SEÇÃO JOGOS */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(251,102,0,0.2)", border: "1px solid rgba(251,102,0,0.4)" }}
          >
            <i className="fas fa-calendar-days text-xs" style={{ color: "#FB6600" }} />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white">Jogos Disponíveis</h2>
        </div>

        {loading && (
          <div className="space-y-3">
            {[1,2].map(i => <div key={i} className="skeleton h-28 rounded-2xl" />)}
          </div>
        )}

        {!loading && games.length === 0 && (
          <div
            className="p-8 rounded-2xl text-center"
            style={{ background: "rgba(0,26,70,0.5)", border: "1px solid rgba(2,115,208,0.15)" }}
          >
            <Image src="/logo.png" alt="Bolinha Club" width={48} height={48} className="mx-auto mb-3 opacity-40" />
            <p style={{ color: "#5A6F8D" }}>Nenhum jogo disponível no momento.</p>
          </div>
        )}

        <div className="space-y-3">
          {games.map((g) => (
            <GameCard
              key={g.id}
              game={g}
              currentUserId={user?.id || ""}
              mode="player"
              onView={() => nav.pushView({ type: "game-detail", gameId: g.id })}
              refresh={loadGames}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
