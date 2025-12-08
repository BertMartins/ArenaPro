"use client";

import { useEffect, useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";

export default function StatsHeader() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/stats");
      if (res.ok) setStats(await res.json());
    })();
  }, []);

  if (!stats) return null;

  return (
    <header className="rounded-b-3xl overflow-hidden shadow-md">
      <div
        className="p-6 text-white"
        style={{
          background: "linear-gradient(90deg, #ff7a18, #ff9e32)",
        }}
      >
        {/* TOP */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/25 flex items-center justify-center text-2xl">
              🏐
            </div>
            <div>
              <h2 className="font-bold text-lg">{stats.name}</h2>
              <p className="text-sm text-white/85">🏆 {stats.titles} Títulos</p>
            </div>
          </div>

          {/* LOGOUT */}
          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/login";
            }}
            className="bg-white/20 hover:bg-white/30 transition p-3 rounded-lg text-white"
          >
            <FaSignOutAlt size={20} />
          </button>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-3 gap-4">
          {/* Nível */}
          <div className="bg-white/10 backdrop-blur rounded-xl py-4 flex flex-col items-center">
            <div className="bg-purple-700/30 text-purple-200 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
              {stats.level}
            </div>
            <span className="text-sm mt-2 text-white/90">Nível</span>
          </div>

          {/* Vitórias */}
          <div className="bg-white/10 backdrop-blur rounded-xl py-4 flex flex-col items-center">
            <span className="text-3xl font-bold">{stats.wins}</span>
            <span className="text-sm mt-2 text-white/90">Vitórias</span>
          </div>

          {/* Taxa */}
          <div className="bg-white/10 backdrop-blur rounded-xl py-4 flex flex-col items-center">
            <span className="text-3xl font-bold">{stats.rate}%</span>
            <span className="text-sm mt-2 text-white/90">Taxa</span>
          </div>
        </div>
      </div>
    </header>
  );
}
