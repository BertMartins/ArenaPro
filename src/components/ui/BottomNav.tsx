"use client";

import Link from "next/link";

export default function BottomNav({ active }: { active: string }) {
  const items = [
    { id: "home", icon: "fa-home", label: "Início", href: "/" },
    { id: "games", icon: "fa-calendar", label: "Jogos", href: "/games" },
    { id: "play", icon: "fa-play-circle", label: "Play", href: "/play", highlight: false },
    { id: "stats", icon: "fa-chart-bar", label: "Stats", href: "/stats" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0d1117]/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.4)] z-50">
      <div className="grid grid-cols-4 gap-1 p-2">
        {items.map((item) => {
          const isActive = active === item.id;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`relative flex flex-col items-center justify-center py-3 rounded-lg transition-all duration-200 
                ${isActive
                  ? "bg-orange-500 text-white shadow-lg"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
            >
              {item.highlight && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              )}

              <i
                className={`fas ${item.icon} text-xl mb-1 
                  ${item.highlight ? "animate-pulse" : ""}`}
              ></i>

              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
