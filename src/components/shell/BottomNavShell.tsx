"use client";
import { useEffect, useState } from "react";
import { useNav, type Tab } from "@/context/NavContext";
import Image from "next/image";

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
    { id: "home",  label: "Início", icon: "fa-house" },
    { id: "games", label: "Jogos",  icon: "fa-calendar-days" },
    { id: "play",  label: "Play",   icon: "fa-volleyball", badge: hasActiveGame },
    { id: "stats", label: "Stats",  icon: "fa-chart-bar" },
  ];

  return (
    <nav
      className="bottom-nav fixed bottom-0 left-0 right-0 z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="grid grid-cols-4 gap-0.5 px-2 pt-1 pb-2 max-w-2xl mx-auto">
        {items.map((item) => {
          const isActive = nav.tab === item.id && !nav.subView;
          return (
            <button
              key={item.id}
              onClick={() => nav.setTab(item.id)}
              className="relative flex flex-col items-center justify-center py-2 sm:py-2.5 rounded-xl transition-all"
              style={isActive
                ? {
                    background: "linear-gradient(135deg, #FB6600, #FB9A14)",
                    boxShadow: "0 4px 16px rgba(251,102,0,0.45)"
                  }
                : { background: "transparent" }
              }
            >
              {item.badge && (
                <div
                  className="absolute top-1 right-1 w-2 h-2 rounded-full animate-pulse"
                  style={{ background: "#22C55E", boxShadow: "0 0 6px rgba(34,197,94,0.8)" }}
                />
              )}

              {/* Ícone de Play usa logo do clube */}
              {item.id === "play" ? (
                <div className="mb-0.5">
                  <Image
                    src="/logo.png"
                    alt="Play"
                    width={22}
                    height={22}
                    style={isActive ? {} : { opacity: 0.55, filter: "grayscale(0.4)" }}
                  />
                </div>
              ) : (
                <i
                  className={`fas ${item.icon} text-lg sm:text-xl mb-0.5 sm:mb-1`}
                  style={{ color: isActive ? "#FDFDFD" : "#5A6F8D" }}
                />
              )}
              <span
                className="text-[10px] sm:text-xs font-semibold"
                style={{ color: isActive ? "#FDFDFD" : "#5A6F8D" }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
