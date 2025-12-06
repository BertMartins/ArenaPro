"use client";

import { useState } from "react";

interface Props {
  gameId: string;
  isInGame: boolean;
  onChange?: () => void;
}

export default function JoinLeaveButton({ gameId, isInGame, onChange }: Props) {
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(isInGame);

  async function join() {
    setLoading(true);
    const res = await fetch(`/api/game/join/${gameId}`, { method: "POST" });
    const data = await res.json();

    if (res.ok) {
      setJoined(true);
      onChange?.();
    } else {
      alert(data.error);
    }
    setLoading(false);
  }

  async function leave() {
    setLoading(true);
    const res = await fetch(`/api/game/leave/${gameId}`, { method: "POST" });
    const data = await res.json();

    if (res.ok) {
      setJoined(false);
      onChange?.();
    } else {
      alert(data.error);
    }
    setLoading(false);
  }

  return joined ? (
    <button
      onClick={leave}
      disabled={loading}
      className={`btn-secondary w-full py-3 rounded-lg font-bold ${
        loading ? "opacity-50" : ""
      }`}
    >
      {loading ? "Saindo..." : "Sair do jogo"}
    </button>
  ) : (
    <button
      onClick={join}
      disabled={loading}
      className={`btn-primary w-full py-3 rounded-lg font-bold ${
        loading ? "opacity-50" : ""
      }`}
    >
      {loading ? "Entrando..." : "Participar"}
    </button>
  );
}
