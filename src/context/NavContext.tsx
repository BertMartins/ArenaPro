"use client";
import { createContext, useContext, useState, type ReactNode } from "react";

export type Tab = "home" | "games" | "play" | "stats";

export type SubView =
  | { type: "game-detail"; gameId: string }
  | { type: "users" }
  | { type: "mensalistas" }
  | { type: "financeiro" }
  | { type: "voting" };

interface NavCtx {
  tab: Tab;
  subView: SubView | null;
  setTab: (t: Tab) => void;
  pushView: (v: SubView) => void;
  popView: () => void;
}

const Ctx = createContext<NavCtx | null>(null);

export function NavProvider({ children }: { children: ReactNode }) {
  const [tab, setTabState] = useState<Tab>("home");
  const [subView, setSubView] = useState<SubView | null>(null);

  return (
    <Ctx.Provider
      value={{
        tab,
        subView,
        setTab: (t) => { setSubView(null); setTabState(t); },
        pushView: setSubView,
        popView: () => setSubView(null),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useNav() {
  return useContext(Ctx);
}
