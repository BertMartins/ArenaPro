"use client";

import { useState } from "react";

export default function UserCard({
  user,
  onRefresh,
  onEditLevel,
}: {
  user: any;
  onRefresh: () => void;
  onEditLevel: () => void;
}) {
  const [loading, setLoading] = useState(false);

  async function toggleRole() {
    setLoading(true);
    await fetch(`/api/admin/users/${user.id}/toggle-role`, { method: "POST" });
    setLoading(false);
    onRefresh();
  }

  async function togglePayment() {
    setLoading(true);
    await fetch(`/api/admin/users/${user.id}/toggle-payment`, { method: "POST" });
    setLoading(false);
    onRefresh();
  }

  return (
    <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 shadow-xl">
      {/* CABEÇALHO */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-bold text-white">{user.name}</h2>
          <p className="text-sm text-gray-400">{user.email}</p>

          {/* Badges */}
          <div className="flex gap-2 mt-2">
            <span
              className={`px-2 py-1 text-xs rounded bg-${
                user.role === "admin" ? "yellow-600" : "blue-600"
              } text-white`}
            >
              {user.role === "admin" ? "Admin" : "Jogador"}
            </span>

            <span
              className={`px-2 py-1 text-xs rounded ${
                user.paymentType === "monthly"
                  ? "bg-green-600 text-white"
                  : "bg-blue-600 text-white"
              }`}
            >
              {user.paymentType === "monthly" ? "Mensalista" : "Diarista"}
            </span>
          </div>
        </div>

        <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center">
          {user.level || 0}
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-[#111827] p-3 rounded-lg text-center">
          <div className="text-2xl text-white">{user.wins}</div>
          <div className="text-gray-400 text-xs">Vitórias</div>
        </div>

        <div className="bg-[#111827] p-3 rounded-lg text-center">
          <div className="text-2xl text-red-400">{user.losses}</div>
          <div className="text-gray-400 text-xs">Derrotas</div>
        </div>

        <div className="bg-[#111827] p-3 rounded-lg text-center">
          <div className="text-2xl text-yellow-400">{user.titles}</div>
          <div className="text-gray-400 text-xs">Títulos</div>
        </div>
      </div>

      {/* BOTÕES */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={onEditLevel}
          className="py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-sm"
        >
          ✏️ Nível
        </button>

        <button
          disabled={loading}
          onClick={toggleRole}
          className="py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-bold text-sm disabled:opacity-50"
        >
          {user.role === "admin" ? "👤 Tornar Jogador" : "⭐ Tornar Admin"}
        </button>

        <button
          disabled={loading}
          onClick={togglePayment}
          className="py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold text-sm disabled:opacity-50"
        >
          {user.paymentType === "monthly"
            ? "💰 Trocar p/ Diarista"
            : "💳 Trocar p/ Mensalista"}
        </button>
      </div>
    </div>
  );
}
