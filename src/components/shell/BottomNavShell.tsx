"use client";
import { useEffect, useState } from "react";
import { useNav, type Tab } from "@/context/NavContext";

export default function BottomNavShell() {
  const nav = useNav()!;
  const [hasActiveGame, setHasActiveGame] = useState(false);

  useEffect(() => {
    fetch("/api/games")
      .then((r) => r.ok && r.json())
      .then((games) => {
        if (Array.isArray(games)) {
          setHasActiveGame(games.some((g: any) => g.status === "in_progress"));
        }
      });
  }, [nav.tab]);

  const items: { id: Tab; label: string; icon: string; badge?: boolean }[] = [
    { id: "home", label: "Início", icon: "fa-house" },
    { id: "games", label: "Jogos", icon: "fa-calendar" },
    { id: "play", label: "Play", icon: "fa-play-circle", badge: hasActiveGame },
    { id: "stats", label: "Stats", icon: "fa-chart-bar" },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-gray-700 shadow-2xl z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="grid grid-cols-4 gap-0.5 p-1 sm:p-2 max-w-2xl mx-auto">
        {items.map((item) => {
          const isActive = nav.tab === item.id && !nav.subView;
          return (
            <button
              key={item.id}
              onClick={() => nav.setTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-2 sm:py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/40"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {item.badge && (
                <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              )}
              <i className={`fas ${item.icon} text-lg sm:text-xl mb-0.5 sm:mb-1`} />
              <span className="text-[10px] sm:text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
