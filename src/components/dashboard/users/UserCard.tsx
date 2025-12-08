"use client";

import { useState } from "react";
import EditLevelModal from "./EditLevelModal";
import EditProfileModal from "./EditProfileModal";

export default function UserCard({ user, refresh }: any) {
  const [openLevel, setOpenLevel] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const isAdmin = user.role === "admin";

  async function togglePayment() {
    const newType = user.paymentType === "monthly" ? "daily" : "monthly";

    await fetch("/api/admin/users/payment/" + user.id, {
      method: "PUT",
      body: JSON.stringify({ type: newType }),
    });

    refresh();
  }

  return (
    <>
      {openLevel && (
        <EditLevelModal
          open={openLevel}
          onClose={() => setOpenLevel(false)}
          user={user}
          refresh={refresh}
        />
      )}

      {openProfile && (
        <EditProfileModal
          open={openProfile}
          onClose={() => setOpenProfile(false)}
          user={user}
          refresh={refresh}
        />
      )}

      <div className="bg-[#101827] rounded-xl p-4 border border-white/10 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-bold text-xl">{user.name}</h2>
            <p className="text-white/60">{user.email}</p>

            <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 rounded bg-orange-600/40 text-sm">
                {user.role === "admin" ? "👑 Admin" : "👤 Jogador"}
              </span>

              <span className="px-2 py-1 rounded bg-green-600/40 text-sm">
                {user.paymentType === "monthly" ? "💳 Mensalista" : "💵 Diarista"}
              </span>
            </div>
          </div>

          <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center font-bold">
            {user.level}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4 text-center">
          <div className="bg-white/5 rounded-xl p-3">
            <div className="font-bold">{user.wins}</div>
            <div className="text-white/60 text-sm">Vitórias</div>
          </div>

          <div className="bg-white/5 rounded-xl p-3">
            <div className="font-bold">{user.losses}</div>
            <div className="text-white/60 text-sm">Derrotas</div>
          </div>

          <div className="bg-white/5 rounded-xl p-3">
            <div className="font-bold">{user.titles}</div>
            <div className="text-white/60 text-sm">Títulos</div>
          </div>
        </div>

        <div className="mt-4 space-y-3">

          {!isAdmin && (
            <div className="flex gap-3">
              <button
                onClick={() => setOpenLevel(true)}
                className="flex-1 bg-blue-600 py-2 rounded-lg font-bold"
              >
                ✏️ Nível
              </button>

              <button
                onClick={() => setOpenProfile(true)}
                className="flex-1 bg-orange-500 py-2 rounded-lg font-bold"
              >
                🔁 Perfil
              </button>
            </div>
          )}

          <button
            onClick={togglePayment}
            className="w-full py-2 bg-green-600 rounded-lg font-bold"
          >
            {user.paymentType === "monthly"
              ? "Trocar para Diarista"
              : "Trocar para Mensalista"}
          </button>
        </div>
      </div>
    </>
  );
}
