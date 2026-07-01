"use client";
import { NavProvider, useNav } from "@/context/NavContext";
import BottomNavShell from "./BottomNavShell";
import HomeAdminTab from "./tabs/HomeAdminTab";
import HomePlayerTab from "./tabs/HomePlayerTab";
import GamesTab from "./tabs/GamesTab";
import PlayTab from "./tabs/PlayTab";
import StatsTab from "./tabs/StatsTab";
import GameDetailPanel from "./panels/GameDetailPanel";
import UsersPanel from "./panels/UsersPanel";
import MensalistasPanel from "./panels/MensalistasPanel";
import FinanceiroPanel from "./panels/FinanceiroPanel";
import VotingPanel from "./panels/VotingPanel";

function ShellInner({ role }: { role: "admin" | "player" }) {
  const nav = useNav()!;
  const { tab, subView } = nav;

  return (
    <div className="min-h-screen">
      {/* Tab content — hidden while a sub-view panel is active so it stays mounted */}
      <div className={subView ? "hidden" : ""}>
        {tab === "home" && (role === "admin" ? <HomeAdminTab /> : <HomePlayerTab />)}
        {tab === "games" && <GamesTab />}
        {tab === "play" && <PlayTab />}
        {tab === "stats" && <StatsTab />}
      </div>

      {/* Sub-view panels (full-screen overlays) */}
      {subView?.type === "game-detail" && <GameDetailPanel gameId={subView.gameId} />}
      {subView?.type === "users" && <UsersPanel />}
      {subView?.type === "mensalistas" && <MensalistasPanel />}
      {subView?.type === "financeiro" && <FinanceiroPanel onClose={() => nav.popView()} />}
      {subView?.type === "voting" && <VotingPanel onClose={() => nav.popView()} />}

      <BottomNavShell />
    </div>
  );
}

export default function AppShell({ role }: { role: "admin" | "player" }) {
  return (
    <NavProvider>
      <ShellInner role={role} />
    </NavProvider>
  );
}
