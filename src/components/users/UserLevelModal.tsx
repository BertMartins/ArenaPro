"use client";

import { useState } from "react";

export default function UserLevelModal({
  user,
  onClose,
  onSaved,
}: {
  user: any;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [level, setLevel] = useState(user.level || 0);
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true);

    const res = await fetch(`/api/admin/users/${user.id}/level`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level }),
    });

    setLoading(false);
    if (res.ok) onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* fundo */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative bg-[#1f2937] p-6 rounded-xl w-full max-w-md border border-white/10 shadow-xl animate-scaleIn">
        <h2 className="text-xl font-bold text-white mb-4">
          Editar nível — {user.name}
        </h2>

        <input
          type="number"
          value={level}
          min={0}
          onChange={(e) => setLevel(Number(e.target.value))}
          className="w-full p-3 rounded-lg bg-[#111827] border border-white/10 text-white focus:border-orange-400 mb-4"
        />

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
          >
            Cancelar
          </button>

          <button
            onClick={save}
            disabled={loading}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-lg disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
