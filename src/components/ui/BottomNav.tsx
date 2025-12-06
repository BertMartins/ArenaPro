"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdHome, MdSportsVolleyball, MdPlayArrow, MdAssessment } from "react-icons/md";

export default function BottomNav() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `flex flex-col items-center justify-center flex-1 py-2 ${
      pathname === path ? "text-orange-400" : "text-gray-400"
    }`;

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-[#0B1120] border-t border-white/10 flex z-50">
      <Link href="/dashboard" className={linkClass("/dashboard")}>
        <MdHome size={24} />
        <span className="text-xs">Início</span>
      </Link>

      <Link href="/dashboard/jogos" className={linkClass("/dashboard/jogos")}>
        <MdSportsVolleyball size={24} />
        <span className="text-xs">Jogos</span>
      </Link>

      <Link href="/dashboard/play" className={linkClass("/dashboard/play")}>
        <MdPlayArrow size={24} />
        <span className="text-xs">Play</span>
      </Link>

      <Link href="/dashboard/stats" className={linkClass("/dashboard/stats")}>
        <MdAssessment size={24} />
        <span className="text-xs">Stats</span>
      </Link>
    </nav>
  );
}
