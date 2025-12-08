"use client";

import { useState } from "react";

export default function EditLevelModal({ open, onClose, user, refresh }: any) {
  const [level, setLevel] = useState(user.level ?? 1);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function save() {
    setLoading(true);
    await fetch(`/api/admin/users/level/${user.id}`, {
      method: "PUT",
      body: JSON.stringify({ level }),
    });
    refresh();
    setLoading(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-neutral-900 rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-white mb-4">Editar Nível</h2>

        <input
          type="number"
          min={1}
          max={10}
          value={level}
          onChange={(e) => setLevel(Number(e.target.value))}
          className="w-full p-3 rounded bg-gray-800 text-white mb-4"
        />

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 bg-gray-700 rounded-lg">
            Cancelar
          </button>

          <button
            onClick={save}
            className="flex-1 py-2 bg-blue-600 rounded-lg font-bold"
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
