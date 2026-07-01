"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const LEVEL_COLORS: Record<number, { bg: string; glow: string }> = {
  1: { bg: "#6B7280", glow: "rgba(107,114,128,0.4)" },
  2: { bg: "#22C55E", glow: "rgba(34,197,94,0.4)" },
  3: { bg: "#004B9A", glow: "rgba(0,75,154,0.4)" },
  4: { bg: "#A855F7", glow: "rgba(168,85,247,0.4)" },
  5: { bg: "#FB9A14", glow: "rgba(251,154,20,0.4)" },
  6: { bg: "#EF4444", glow: "rgba(239,68,68,0.4)" },
};

function LevelBadge({ level, size = "md" }: { level: number; size?: "sm" | "md" | "lg" }) {
  const c = LEVEL_COLORS[level] ?? LEVEL_COLORS[1];
  const dim = size === "sm" ? 28 : size === "lg" ? 56 : 36;
  const fontSize = size === "sm" ? 11 : size === "lg" ? 22 : 14;
  return (
    <div
      className="rounded-full flex items-center justify-center font-black flex-shrink-0 text-white"
      style={{
        width: dim, height: dim, fontSize,
        background: c.bg,
        boxShadow: `0 0 12px ${c.glow}`
      }}
    >
      {level}
    </div>
  );
}

export default function StatsTab() {
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
        const ep = d.user.role === "admin" ? "/api/admin/stats" : "/api/player/stats";
        const sRes = await fetch(ep);
        if (sRes.ok) setMyStats(await sRes.json());
      }
      if (rankRes.ok) setRanking(await rankRes.json());
      setLoading(false);
    })();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: "#FB6600", borderTopColor: "transparent" }} />
    </div>
  );

  const wins   = myStats?.wins   ?? 0;
  const losses = myStats?.losses ?? 0;
  const titles = myStats?.titles ?? 0;
  const level  = myStats?.level  ?? 1;
  const winRate = myStats?.rate  ?? 0;

  return (
    <div className="pb-24 animate-fadeIn max-w-2xl mx-auto">

      {/* HEADER */}
      <div
        className="p-4 sm:p-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #001A46 0%, #004B9A 65%, #0273D0 100%)",
          borderBottom: "2px solid rgba(251,102,0,0.4)"
        }}
      >
        <div style={{
          position: "absolute", top: "-30px", right: "-20px",
          width: 140, height: 140, borderRadius: "50%",
          background: "rgba(251,102,0,0.08)", pointerEvents: "none"
        }} />
        <div className="flex items-center gap-3 relative z-10">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "rgba(251,102,0,0.2)", border: "2px solid rgba(251,102,0,0.4)" }}
          >
            <i className="fas fa-chart-bar" style={{ color: "#FB9A14" }} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wider">ESTATÍSTICAS</h1>
            <p className="text-xs sm:text-sm" style={{ color: "#5A6F8D" }}>Seu desempenho em detalhes</p>
          </div>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{ background: "linear-gradient(90deg, transparent, #FB6600, #FB9A14, transparent)" }}
        />
      </div>

      <div className="p-3 sm:p-5 space-y-4">

        {/* CARD PERFIL */}
        <div className="glass-card rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Logo clube */}
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: "rgba(251,102,0,0.12)",
                  border: "2px solid rgba(251,102,0,0.4)",
                  boxShadow: "0 0 20px rgba(251,102,0,0.2)"
                }}
              >
                <Image src="/logo.png" alt="Bolinha Club" width={42} height={42} className="rounded-full" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg sm:text-xl leading-tight">{me?.name}</h2>
                <p className="text-xs capitalize font-medium" style={{ color: "#5A6F8D" }}>
                  {me?.role === "admin" ? "Administrador" : "Jogador"}
                </p>
              </div>
            </div>
            <LevelBadge level={level} size="lg" />
          </div>

          {/* GRID STATS */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="rounded-xl p-3 text-center" style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)" }}>
              <div className="text-2xl sm:text-3xl font-black text-green-400">{wins}</div>
              <div className="text-xs mt-0.5" style={{ color: "#5A6F8D" }}>Vitórias</div>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)" }}>
              <div className="text-2xl sm:text-3xl font-black text-red-400">{losses}</div>
              <div className="text-xs mt-0.5" style={{ color: "#5A6F8D" }}>Derrotas</div>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: "rgba(251,154,20,0.12)", border: "1px solid rgba(251,102,0,0.3)" }}>
              <div className="text-2xl sm:text-3xl font-black" style={{ color: "#FB9A14" }}>{winRate}%</div>
              <div className="text-xs mt-0.5" style={{ color: "#5A6F8D" }}>Taxa de Vitória</div>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: "rgba(251,102,0,0.12)", border: "1px solid rgba(251,102,0,0.3)" }}>
              <div className="text-2xl sm:text-3xl font-black" style={{ color: "#FB6600" }}>{titles}</div>
              <div className="text-xs mt-0.5" style={{ color: "#5A6F8D" }}>Títulos</div>
            </div>
          </div>
        </div>

        {/* EVOLUÇÃO DE NÍVEL */}
        <div className="glass-card rounded-2xl p-4 sm:p-5">
          <h3 className="text-white font-bold text-base sm:text-lg mb-4 flex items-center gap-2">
            <i className="fas fa-layer-group" style={{ color: "#FB6600" }} /> Evolução de Nível
          </h3>
          <div className="space-y-2.5 sm:space-y-3">
            {[6, 5, 4, 3, 2, 1].map((lvl) => {
              const c = LEVEL_COLORS[lvl] ?? LEVEL_COLORS[1];
              return (
                <div key={lvl} className="flex items-center gap-2 sm:gap-3">
                  <LevelBadge level={lvl} size="sm" />
                  <div className="flex-1 rounded-full h-2 overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: level >= lvl ? "100%" : "0%",
                        background: c.bg,
                        boxShadow: level >= lvl ? `0 0 8px ${c.glow}` : "none"
                      }}
                    />
                  </div>
                  <span className="text-xs font-semibold w-16 text-right">
                    {level === lvl
                      ? <span style={{ color: "#FB6600" }}>Atual</span>
                      : level > lvl
                        ? <span className="text-green-400">✓</span>
                        : <span style={{ color: "#5A6F8D" }}>Bloqueado</span>
                    }
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* RANKING */}
        {ranking.length > 0 && (
          <div className="glass-card rounded-2xl p-4 sm:p-5">
            <h3 className="text-white font-bold text-base sm:text-lg mb-4 flex items-center gap-2">
              <i className="fas fa-trophy" style={{ color: "#FB9A14" }} /> Ranking Global
            </h3>
            <div className="space-y-2">
              {ranking.slice(0, 10).map((u, i) => {
                const isMe = u.id === me?.id;
                const medalColors = ["#FB9A14", "#9CA3AF", "#CD7C2F"];
                return (
                  <div
                    key={u.id}
                    className="flex items-center gap-2 sm:gap-3 rounded-xl p-2.5 sm:p-3 transition-all"
                    style={isMe
                      ? { background: "rgba(251,102,0,0.15)", border: "1px solid rgba(251,102,0,0.4)" }
                      : { background: "rgba(0,26,70,0.4)", border: "1px solid rgba(2,115,208,0.12)" }
                    }
                  >
                    {/* Posição */}
                    <div
                      className="text-base sm:text-lg font-black w-7 text-center flex-shrink-0"
                      style={{ color: i < 3 ? medalColors[i] : "#5A6F8D" }}
                    >
                      {i < 3
                        ? <i className={`fas fa-${i === 0 ? "trophy" : i === 1 ? "medal" : "award"}`} />
                        : `#${i + 1}`
                      }
                    </div>
                    {/* Foto */}
                    <span className="text-lg sm:text-xl flex-shrink-0">{u.photo ?? "🏐"}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-semibold text-sm truncate">{u.name}</div>
                      <div className="text-xs" style={{ color: "#5A6F8D" }}>{u.wins}V · {u.titles} títulos</div>
                    </div>
                    <LevelBadge level={u.level} size="sm" />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
