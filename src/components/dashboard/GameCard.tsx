"use client";

import { useState } from "react";
import GameJoinButton from "@/components/game/GameJoinButton";

export default function GameCard({
  game,
  currentUserId,
  mode = "player",
  onView,
  refresh,
}: {
  game: any;
  currentUserId: string;
  mode?: "player" | "admin";
  onView: () => void;
  refresh: () => void;
}) {
  const playersCount = game.players.length;
  const progress = (playersCount / game.maxPlayers) * 100;

  // === CORREÇÃO AQUI ===
  const userIsInside = game.players.some((p: any) => {
    return (
      p.userId === currentUserId || // quando vem de /api/games
      p.user?.id === currentUserId  // quando vem de /api/games/[gameId]
    );
  });

  return (
    <div className="bg-[#0f172a] rounded-xl p-4 pb-6 border border-white/10 shadow-lg mb-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <div className="flex items-center text-orange-400 font-bold text-lg gap-2">
            📅 {new Date(game.date).toLocaleDateString("pt-BR")}
          </div>

          <div className="text-gray-300 text-sm flex items-center gap-2 mt-1">
            🧍 {playersCount}/{game.maxPlayers} jogadores
          </div>
        </div>

        <div className="inline-block mb-4 animate-bounceSoft text-2xl">🏐</div>
      </div>

      {/* Progress bar */}
      <div className="mt-3 w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-400 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* AÇÕES */}
      <div className="mt-4 flex items-center gap-2">

        {/* PARTICIPAR/SAIR */}
        <GameJoinButton
          gameId={game.id}
          userIsInside={userIsInside}
          refresh={refresh}
        />

        {/* ADMIN BUTTON */}
        {mode === "admin" && (
          <button
            onClick={onView}
            className="flex-1 py-3 rounded-lg font-bold bg-purple-600 hover:bg-purple-700 text-white text-lg"
          >
            Gerenciar
          </button>
        )}

        {/* VISUALIZAR */}
        <button
          onClick={onView}
          className="w-12 h-12 rounded-lg bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center text-xl"
        >
          👁️
        </button>

      </div>
    </div>
  );
}
