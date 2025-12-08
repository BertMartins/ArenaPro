"use client";

import { useEffect, useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";

export default function PlayerHeader() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/player/stats");
      if (res.ok) setStats(await res.json());
    })();
  }, []);

  if (!stats) return null;

  return (
    <header className="rounded-b-3xl overflow-hidden shadow-md">
      <div
        className="p-6 text-white"
        style={{ background: "linear-gradient(90deg, #ff7a18, #ff9e32)" }}
      >
        {/* TOP */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
              🏐
            </div>

            <div>
              <div className="font-bold text-lg">{stats.name}</div>
              <div className="text-sm text-white/80">
                🏆 {stats.titles} Títulos
              </div>
            </div>
          </div>

          <button
            className="text-white text-xl bg-white/20 hover:bg-white/30 p-2 rounded-lg"
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/login";
            }}
          >
            <FaSignOutAlt size={20} />
          </button>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-white/10 backdrop-blur py-6 flex flex-col items-center">
            <div className="w-12 h-12 bg-purple-600/40 rounded-full flex items-center justify-center text-xl font-bold">
              {stats.level}
            </div>
            <span className="text-sm mt-2 text-white/90">Nível</span>
          </div>

          <div className="rounded-xl bg-white/10 backdrop-blur py-6 flex flex-col items-center">
            <span className="text-3xl font-bold">{stats.wins}</span>
            <span className="text-sm mt-2 text-white/90">Vitórias</span>
          </div>

          <div className="rounded-xl bg-white/10 backdrop-blur py-6 flex flex-col items-center">
            <span className="text-3xl font-bold">{stats.rate}%</span>
            <span className="text-sm mt-2 text-white/90">Taxa</span>
          </div>
        </div>
      </div>
    </header>
  );
}
