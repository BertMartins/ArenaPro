"use client";

import Link from "next/link";

export default function BottomNav({
  active,
  role,
}: {
  active: string;
  role: "admin" | "player";
}) {
  const homeHref = role === "admin" ? "/dashboard" : "/player";

  const items = [
    { id: "home", label: "Início", icon: "fa-solid fa-house", href: homeHref },
    { id: "play", label: "Play", icon: "fa-solid fa-play-circle", href: "/play" },
    { id: "stats", label: "Stats", icon: "fa-solid fa-chart-bar", href: "/stats" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-gray-700 shadow-2xl z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      <div className="grid grid-cols-3 gap-0.5 p-1 sm:p-2 max-w-2xl mx-auto">
        {items.map((item) => {
          const isActive = active === item.id;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`
                relative flex flex-col items-center justify-center
                py-2 sm:py-3 rounded-lg transition-all
                ${isActive
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/40"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"}
              `}
            >
              <i className={`${item.icon} text-lg sm:text-xl mb-0.5 sm:mb-1 ${isActive ? "animate-pulse" : ""}`} />
              <span className="text-[10px] sm:text-xs font-medium">{item.label}</span>

              {item.id === "play" && (
                <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
