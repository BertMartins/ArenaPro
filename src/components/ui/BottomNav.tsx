"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function BottomNav({ active }: { active: string }) {
  const [homeHref, setHomeHref] = useState("/player");
  const [hasActiveGame, setHasActiveGame] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.ok && r.json())
      .then((d) => {
        if (d?.user?.role === "admin") setHomeHref("/dashboard");
      });

    fetch("/api/games")
      .then((r) => r.ok && r.json())
      .then((games) => {
        if (Array.isArray(games)) {
          setHasActiveGame(games.some((g: any) => g.status === "in_progress"));
        }
      });
  }, []);

  const items = [
    { id: "home", label: "Início", icon: "fa-house", href: homeHref },
    { id: "games", label: "Jogos", icon: "fa-calendar", href: homeHref },
    { id: "play", label: "Play", icon: "fa-play-circle", href: "/play", badge: hasActiveGame },
    { id: "stats", label: "Stats", icon: "fa-chart-bar", href: "/stats" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-gray-700 shadow-2xl z-50">
      <div className="grid grid-cols-4 gap-1 p-2">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`relative flex flex-col items-center justify-center py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/40"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {item.badge && (
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              )}
              <i className={`fas ${item.icon} text-xl mb-1`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
