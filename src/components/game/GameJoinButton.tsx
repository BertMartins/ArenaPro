"use client";

import { useState } from "react";

export default function GameJoinButton({
  gameId,
  isInside,
  refresh,
  compact = false,
}: {
  gameId: string;
  isInside: boolean;
  refresh: () => void;
  compact?: boolean;
}) {
  const [loading, setLoading] = useState(false);

  async function join() {
    setLoading(true);
    const res = await fetch(`/api/games/${gameId}/join`, { method: "POST" });
    if (!res.ok) alert((await res.json()).error);
    refresh();
    setLoading(false);
  }

  async function leave() {
    setLoading(true);
    const res = await fetch(`/api/games/${gameId}/leave`, { method: "POST" });
    if (!res.ok) alert((await res.json()).error);
    refresh();
    setLoading(false);
  }

  const label = loading
    ? "Aguarde..."
    : isInside
    ? compact ? "Sair" : "👤 Sair do Jogo"
    : compact ? "Participar" : "👥 Participar";

  return (
    <button
      disabled={loading}
      onClick={isInside ? leave : join}
      className={`flex-1 py-3 rounded-lg font-bold text-white text-lg transition flex items-center justify-center
        ${isInside ? "bg-red-600 hover:bg-red-700" : "bg-orange-500 hover:bg-orange-600"}
      `}
    >
      {label}
    </button>
  );
}
