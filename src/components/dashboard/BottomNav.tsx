"use client";

export default function BottomNav({ active }: any) {
  const items = [
    { id: "home", label: "Início", icon: "🏠", href: "/" },
    { id: "games", label: "Jogos", icon: "📅", href: "/games" },
    { id: "play", label: "Play", icon: "▶️", href: "/play" },
    { id: "stats", label: "Stats", icon: "📊", href: "/stats" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0f131a] border-t border-white/10 h-20 flex justify-around items-center">
      {items.map((i) => (
        <a
          key={i.id}
          href={i.href}
          className={`flex flex-col items-center text-sm ${
            active === i.id ? "text-orange-400" : "text-gray-400"
          }`}
        >
          <span className="text-2xl">{i.icon}</span>
          {i.label}
        </a>
      ))}
    </nav>
  );
}
