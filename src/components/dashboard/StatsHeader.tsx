"use client";

import { useEffect, useState } from "react";
import { FaSignOutAlt, FaTrophy } from "react-icons/fa";
import Image from "next/image";

export default function StatsHeader() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/stats");
      if (res.ok) setStats(await res.json());
    })();
  }, []);

  if (!stats) return (
    <div className="rounded-2xl overflow-hidden mb-1">
      <div className="skeleton h-36" />
    </div>
  );

  return (
    <header className="rounded-2xl overflow-hidden shadow-2xl">
      <div
        className="p-4 sm:p-6 text-white relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #001A46 0%, #004B9A 65%, #0273D0 100%)",
          borderBottom: "2px solid rgba(251,102,0,0.4)"
        }}
      >
        {/* Círculo decorativo */}
        <div style={{
          position: "absolute", top: "-40px", right: "-40px",
          width: 180, height: 180, borderRadius: "50%",
          background: "rgba(251,102,0,0.08)", pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", bottom: "-30px", left: "40%",
          width: 120, height: 120, borderRadius: "50%",
          background: "rgba(255,255,255,0.04)", pointerEvents: "none"
        }} />

        {/* TOP ROW */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-3">
            {/* Avatar com logo */}
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(251,102,0,0.15)",
                border: "2px solid rgba(251,102,0,0.5)",
                boxShadow: "0 0 16px rgba(251,102,0,0.3)"
              }}
            >
              <Image src="/logo.png" alt="Bolinha Club" width={36} height={36} className="rounded-full" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg leading-tight">{stats.name}</h2>
              <p className="text-xs sm:text-sm flex items-center gap-1" style={{ color: "#FB9A14" }}>
                <FaTrophy size={11} /> {stats.titles} Títulos · Admin
              </p>
            </div>
          </div>

          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/login";
            }}
            className="transition p-2 sm:p-2.5 rounded-xl text-white"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
            title="Sair"
          >
            <FaSignOutAlt size={16} />
          </button>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 relative z-10">
          {/* Nível */}
          <div
            className="rounded-xl py-3 sm:py-4 flex flex-col items-center gap-1"
            style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(251,102,0,0.25)" }}
          >
            <div
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-black text-lg sm:text-xl"
              style={{ background: "linear-gradient(135deg,#FB6600,#FB9A14)", boxShadow: "0 0 12px rgba(251,102,0,0.4)" }}
            >
              {stats.level}
            </div>
            <span className="text-xs text-white/80 font-medium">Nível</span>
          </div>

          {/* Vitórias */}
          <div
            className="rounded-xl py-3 sm:py-4 flex flex-col items-center gap-1"
            style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <span className="text-2xl sm:text-3xl font-black" style={{ color: "#FB9A14" }}>{stats.wins}</span>
            <span className="text-xs text-white/80 font-medium">Vitórias</span>
          </div>

          {/* Taxa */}
          <div
            className="rounded-xl py-3 sm:py-4 flex flex-col items-center gap-1"
            style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <span className="text-2xl sm:text-3xl font-black text-white">{stats.rate}%</span>
            <span className="text-xs text-white/80 font-medium">Taxa</span>
          </div>
        </div>

        {/* Linha laranja inferior */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{ background: "linear-gradient(90deg, transparent, #FB6600, #FB9A14, transparent)" }}
        />
      </div>
    </header>
  );
}
