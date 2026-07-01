"use client";

import { useState } from "react";
import GameJoinButton from "@/components/game/GameJoinButton";
import Image from "next/image";

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
  const progress = Math.min((playersCount / game.maxPlayers) * 100, 100);
  const isInProgress = game.status === "in_progress";

  const userIsInside = game.players.some((p: any) =>
    p.userId === currentUserId || p.user?.id === currentUserId
  );

  return (
    <div
      className="rounded-2xl p-4 sm:p-5 transition-all"
      style={{
        background: isInProgress
          ? "rgba(0,26,70,0.7)"
          : "rgba(0,26,70,0.6)",
        border: isInProgress
          ? "1.5px solid rgba(34,197,94,0.5)"
          : "1.5px solid rgba(2,115,208,0.2)",
        boxShadow: isInProgress
          ? "0 0 20px rgba(34,197,94,0.12), inset 0 1px 0 rgba(255,255,255,0.04)"
          : "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)"
      }}
    >
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">

          {/* Data */}
          <div className="flex items-center gap-1.5 font-bold text-base sm:text-lg" style={{ color: "#FB9A14" }}>
            <i className="fas fa-calendar-days text-sm" style={{ color: "#FB6600" }} />
            {new Date(game.date.slice(0, 10) + "T12:00:00Z").toLocaleDateString("pt-BR")}
          </div>

          {/* Jogadores */}
          <div className="text-xs sm:text-sm flex items-center gap-1.5" style={{ color: "#5A6F8D" }}>
            <i className="fas fa-users text-xs" />
            <span className="font-semibold text-white">{playersCount}</span>/{game.maxPlayers} jogadores
          </div>

          {/* Horário */}
          {(game.startTime || game.endTime) && (
            <div className="text-xs flex items-center gap-1.5" style={{ color: "#5A6F8D" }}>
              <i className="fas fa-clock text-xs" />
              {game.startTime ?? "?"}{game.endTime ? ` – ${game.endTime}` : ""}
            </div>
          )}

          {/* Arena */}
          {game.arenaName && (
            <div className="text-xs flex items-center gap-1.5" style={{ color: "#5A6F8D" }}>
              <i className="fas fa-building text-xs" />
              {game.arenaName}
            </div>
          )}

          {/* Localização */}
          {game.arenaLocation && (
            <a
              href={`https://maps.google.com/maps?q=${encodeURIComponent(game.arenaLocation)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs flex items-center gap-1.5 underline underline-offset-2 w-fit transition-colors"
              style={{ color: "#0273D0" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#FB6600")}
              onMouseLeave={e => (e.currentTarget.style.color = "#0273D0")}
            >
              <i className="fas fa-location-dot text-xs" />
              {game.arenaLocation}
            </a>
          )}

          {/* Em andamento */}
          {isInProgress && (
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" style={{ boxShadow: "0 0 6px rgba(34,197,94,0.8)" }} />
              <span className="text-xs font-bold text-green-400">Jogo em Andamento</span>
            </div>
          )}
        </div>

        {/* Logo animada */}
        <div className="animate-bounceSoft ml-3 flex-shrink-0">
          <Image src="/logo.png" alt="Bolinha Club" width={40} height={40} />
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="mt-3 w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${progress}%`,
            background: isInProgress
              ? "linear-gradient(90deg,#22C55E,#4ADE80)"
              : "linear-gradient(90deg,#FB6600,#FB9A14)",
            boxShadow: isInProgress
              ? "0 0 8px rgba(34,197,94,0.5)"
              : "0 0 8px rgba(251,102,0,0.5)"
          }}
        />
      </div>

      {/* AÇÕES */}
      <div className="mt-3 flex items-center gap-2">
        {game.status === "open" && (
          <GameJoinButton
            gameId={game.id}
            userIsInside={userIsInside}
            refresh={refresh}
          />
        )}

        {isInProgress && (
          <div
            className="flex-1 py-2.5 text-center text-xs font-bold rounded-xl"
            style={{
              color: "#4ADE80",
              border: "1px solid rgba(34,197,94,0.4)",
              background: "rgba(34,197,94,0.08)"
            }}
          >
            <i className="fas fa-lock mr-1" /> Lista Fechada
          </div>
        )}

        <button
          onClick={onView}
          className="py-2.5 rounded-xl font-bold text-white flex items-center justify-center gap-1.5 text-sm transition-all"
          style={{
            background: mode === "admin"
              ? "linear-gradient(135deg,#001A46,#004B9A)"
              : undefined,
            border: "1px solid rgba(2,115,208,0.4)",
            ...(mode === "admin" ? { flex: 1 } : { width: 40, height: 40, background: "rgba(0,75,154,0.5)" })
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(251,102,0,0.6)")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(2,115,208,0.4)")}
        >
          <i className="fas fa-eye text-sm" style={{ color: "#0273D0" }} />
          {mode === "admin" && <span style={{ color: "#FDFDFD" }}>Ver Detalhes</span>}
        </button>
      </div>
    </div>
  );
}
