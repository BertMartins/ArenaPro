"use client";

import { useState } from "react";

export default function EditProfileModal({ open, onClose, user, refresh }: any) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function save() {
    setLoading(true);
    await fetch(`/api/admin/users/profile/${user.id}`, {
      method: "PUT",
      body: JSON.stringify({ name, email }),
    });
    refresh();
    setLoading(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-neutral-900 rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-white mb-4">Editar Perfil</h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nome"
            className="w-full p-3 rounded bg-gray-800 text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="E-mail"
            className="w-full p-3 rounded bg-gray-800 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex gap-3 mt-4">
          <button onClick={onClose} className="flex-1 py-2 bg-gray-700 rounded-lg">
            Cancelar
          </button>

          <button
            onClick={save}
            className="flex-1 py-2 bg-orange-500 rounded-lg font-bold"
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
