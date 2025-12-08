"use client";

export default function BottomNav({ active }: { active?: "home" | "games" | "play" | "stats" }) {
  return (
    <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[calc(100%-48px)] max-w-4xl bg-neutral-900/80 backdrop-blur rounded-xl p-3 flex justify-around items-center shadow-lg">
      <a className={`flex-1 py-3 rounded-lg text-center ${active === "home" ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold" : "text-gray-300"}`} href="#">
        🏠<div className="text-xs">Início</div>
      </a>

      <a className={`flex-1 py-3 rounded-lg text-center ${active === "games" ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold" : "text-gray-300"}`} href="/player/games">
        📅<div className="text-xs">Jogos</div>
      </a>

      <a className={`flex-1 py-3 rounded-lg text-center ${active === "play" ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold" : "text-gray-300"}`} href="/player/play">
        ▶️<div className="text-xs">Play</div>
      </a>

      <a className={`flex-1 py-3 rounded-lg text-center ${active === "stats" ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold" : "text-gray-300"}`} href="/player/stats">
        📊<div className="text-xs">Stats</div>
      </a>
    </nav>
  );
}
