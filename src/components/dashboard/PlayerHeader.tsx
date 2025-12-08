"use client";

import { useEffect, useState } from "react";

export default function PlayerHeader() {
  const [stats, setStats] = useState<any>(null);

  async function loadStats() {
    try {
      const res = await fetch("/api/player/stats");
      const data = await res.json();
      if (res.ok) setStats(data);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  if (!stats) {
    return (
      <header className="rounded-xl overflow-hidden">
        <div className="p-6" style={{ background: "linear-gradient(90deg, #ff7a18, #ff9e32)" }}>
          <div className="h-32" />
        </div>
      </header>
    );
  }

  return (
    <header className="rounded-xl overflow-hidden">
      <div
        className="p-6 text-white"
        style={{ background: "linear-gradient(90deg, #ff7a18, #ff9e32)" }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-3xl">🏐</div>
            <div>
              <div className="font-bold text-lg">{stats.name}</div>
              <div className="text-sm text-white/80">🏆 {stats.titles} Títulos</div>
            </div>
          </div>

          <button
            className="text-white text-xl bg-white/20 hover:bg-white/30 p-2 rounded-lg transition"
            title="logout"
            onClick={async () => {
             await fetch("/api/auth/logout", { method: "POST" });
             window.location.href = "/login";
           }}>
            <i className="fas fa-sign-out-alt text-xl"></i>
          </button>
          
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl flex flex-col justify-center items-center py-6" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div className="text-3xl font-bold text-purple-300 bg-purple-800/30 w-12 h-12 rounded-full flex items-center justify-center">{stats.level}</div>
            <span className="mt-2 text-sm text-white/90">Nível</span>
          </div>

          <div className="rounded-xl flex flex-col justify-center items-center py-6" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div className="text-3xl font-bold">{stats.wins}</div>
            <span className="mt-2 text-sm text-white/90">Vitórias</span>
          </div>

          <div className="rounded-xl flex flex-col justify-center items-center py-6" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div className="text-3xl font-bold">{stats.rate}%</div>
            <span className="mt-2 text-sm text-white/90">Taxa</span>
          </div>
        </div>
      </div>
    </header>
  );
}
