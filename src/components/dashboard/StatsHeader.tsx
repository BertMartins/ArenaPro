"use client";

import React from "react";

export default function StatsHeader() {
  // Se quiser, aqui buscaria /api/admin/stats; por enquanto placeholders (ou você substitui por fetch)
  const level = 5;
  const wins = 45;
  const rate = 66;

  return (
    <header className="rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-md bg-white/10 flex items-center justify-center text-2xl">👤</div>
            <div>
              <div className="font-bold text-lg">Admin</div>
              <div className="text-sm text-orange-100">🏆 5 Títulos</div>
            </div>
          </div>

          <div className="text-white/90"> {/* action icon */}
            <button title="logout" className="p-2 rounded bg-white/10">⤴️</button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="glass-card p-4 rounded-md bg-white/10">
            <div className="text-xl font-bold text-center text-orange-50">{level}</div>
            <div className="text-xs text-center text-white/80 mt-2">Nível</div>
          </div>
          <div className="glass-card p-4 rounded-md bg-white/10">
            <div className="text-xl font-bold text-center text-orange-50">{wins}</div>
            <div className="text-xs text-center text-white/80 mt-2">Vitórias</div>
          </div>
          <div className="glass-card p-4 rounded-md bg-white/10">
            <div className="text-xl font-bold text-center text-orange-50">{rate}%</div>
            <div className="text-xs text-center text-white/80 mt-2">Taxa</div>
          </div>
        </div>
      </div>
    </header>
  );
}
