"use client";

import { useState } from "react";

export default function GameJoinButton({
  gameId,
  userIsInside,
  refresh,
}: {
  gameId: string;
  userIsInside: boolean;
  refresh: () => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);

    const endpoint = userIsInside ? "leave" : "join";
    const res = await fetch(`/api/games/${gameId}/${endpoint}`, {
      method: "POST",
    });

    const data = await res.json();

    if (!res.ok) alert(data.error || "Erro inesperado");
    else refresh();

    setLoading(false);
  }

  return (
    <button
      disabled={loading}
      onClick={handleClick}
      className={`flex-1 py-3 rounded-lg font-bold text-white text-lg transition flex items-center justify-center gap-2
      ${userIsInside ? "bg-red-600 hover:bg-red-700" : "bg-orange-500 hover:bg-orange-600"}`}
    >
      {loading ? "Aguarde..." : userIsInside ? "👤 Sair" : "👥 Participar"}
    </button>
  );
}
