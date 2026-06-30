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

      {/* Status em andamento */}
      {game.status === "in_progress" && (
        <div className="text-green-400 text-xs font-bold mt-2 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
          Jogo em Andamento
        </div>
      )}

      {/* AÇÕES */}
      <div className="mt-4 flex items-center gap-2">
        {game.status === "open" && (
          <GameJoinButton
            gameId={game.id}
            userIsInside={userIsInside}
            refresh={refresh}
          />
        )}

        {game.status === "in_progress" && (
          <div className="flex-1 py-3 text-center text-green-300 text-sm border border-green-500 rounded-lg bg-green-500/10 font-bold">
            Lista Fechada
          </div>
        )}

        {/* VISUALIZAR / GERENCIAR */}
        <button
          onClick={onView}
          className={`py-3 rounded-lg font-bold text-white flex items-center justify-center gap-1 ${
            mode === "admin" ? "flex-1 bg-blue-600 hover:bg-blue-700" : "w-12 h-12 bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {mode === "admin" ? "👁️ Ver" : "👁️"}
        </button>
      </div>
    </div>
  );
}
