"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

const LEVEL_COLORS: Record<number, string> = {
  1: "bg-gray-500", 2: "bg-green-500", 3: "bg-blue-500",
  4: "bg-purple-500", 5: "bg-yellow-500", 6: "bg-red-500",
};

export default function StatsPage() {
  const router = useRouter();
  const [me, setMe] = useState<any>(null);
  const [myStats, setMyStats] = useState<any>(null);
  const [ranking, setRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [meRes, rankRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/stats/ranking"),
      ]);

      if (meRes.ok) {
        const d = await meRes.json();
        setMe(d.user);

        // Stats
        const statsEndpoint =
          d.user.role === "admin" ? "/api/admin/stats" : "/api/player/stats";
        const sRes = await fetch(statsEndpoint);
        if (sRes.ok) setMyStats(await sRes.json());
      }

      if (rankRes.ok) setRanking(await rankRes.json());

      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const wins = myStats?.wins ?? 0;
  const losses = myStats?.losses ?? 0;
  const titles = myStats?.titles ?? 0;
  const level = myStats?.level ?? 1;
  const winRate = myStats?.rate ?? 0;

  return (
    <div className="pb-24 animate-fadeIn">
      {/* Header */}
      <div className="p-6" style={{ background: "linear-gradient(135deg, #F59E0B 0%, #FCD34D 100%)" }}>
        <h1 className="text-3xl font-black text-white tracking-wider">ESTATÍSTICAS</h1>
        <p className="text-yellow-100">Seu desempenho em detalhes</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Card pessoal */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-4">
              <div className="text-5xl">🏐</div>
              <div>
                <h2 className="text-white font-bold text-2xl">{me?.name}</h2>
                <p className="text-gray-400 text-sm capitalize">{me?.role}</p>
              </div>
            </div>
            <span className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl font-bold ${LEVEL_COLORS[level] ?? "bg-gray-500"}`}>
              {level}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-400">{wins}</div>
              <div className="text-gray-300 text-sm">Vitórias</div>
            </div>
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-red-400">{losses}</div>
              <div className="text-gray-300 text-sm">Derrotas</div>
            </div>
            <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-yellow-400">{winRate}%</div>
              <div className="text-gray-300 text-sm">Taxa de Vitória</div>
            </div>
            <div className="bg-orange-500/20 border border-orange-500 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-orange-400">{titles}</div>
              <div className="text-gray-300 text-sm">Títulos</div>
            </div>
          </div>
        </div>

        {/* Evolução de nível */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-white font-bold text-lg mb-4">📈 Evolução de Nível</h3>
          <div className="space-y-3">
            {[6, 5, 4, 3, 2, 1].map((lvl) => (
              <div key={lvl} className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${LEVEL_COLORS[lvl]}`}>
                  {lvl}
                </span>
                <div className="flex-1 bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ${LEVEL_COLORS[lvl]}`}
                    style={{ width: level >= lvl ? "100%" : "0%" }}
                  />
                </div>
                <span className="text-sm font-medium w-20 text-right">
                  {level === lvl ? (
                    <span className="text-orange-400">Atual</span>
                  ) : level > lvl ? (
                    <span className="text-green-400">✓</span>
                  ) : (
                    <span className="text-gray-500">Bloqueado</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Ranking */}
        {ranking.length > 0 && (
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-white font-bold text-lg mb-4">🏆 Ranking Global</h3>
            <div className="space-y-3">
              {ranking.slice(0, 10).map((u, i) => (
                <div
                  key={u.id}
                  className={`flex items-center gap-3 rounded-lg p-3 ${
                    u.id === me?.id ? "bg-orange-500/20 border border-orange-500" : "bg-gray-700/30"
                  }`}
                >
                  <div className={`text-xl font-bold w-8 text-center ${
                    i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-300" : i === 2 ? "text-orange-600" : "text-gray-500"
                  }`}>
                    #{i + 1}
                  </div>
                  <span className="text-xl">{u.photo ?? "🏐"}</span>
                  <div className="flex-1">
                    <div className="text-white font-medium">{u.name}</div>
                    <div className="text-gray-400 text-xs">{u.wins} vitória{u.wins !== 1 ? "s" : ""} · {u.titles} título{u.titles !== 1 ? "s" : ""}</div>
                  </div>
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${LEVEL_COLORS[u.level] ?? "bg-gray-500"}`}>
                    {u.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav active="stats" />
    </div>
  );
}
