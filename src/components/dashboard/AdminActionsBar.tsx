"use client";
import { useRouter } from "next/navigation";
import { useNav } from "@/context/NavContext";

export default function AdminActionsBar({ onCreate }: { onCreate: () => void }) {
  const nav = useNav();
  const router = useRouter();

  function goTo(view: "users" | "mensalistas" | "financeiro" | "voting") {
    if (nav) {
      nav.pushView({ type: view });
    } else {
      router.push(`/dashboard/${view}`);
    }
  }

  return (
    <div className="space-y-3">
      {/* CRIAR JOGO */}
      <button
        onClick={onCreate}
        className="w-full py-3.5 rounded-2xl text-white font-black text-base tracking-wide flex items-center justify-center gap-2 transition-all"
        style={{
          background: "linear-gradient(135deg, #FB6600 0%, #FB9A14 100%)",
          boxShadow: "0 6px 24px rgba(251,102,0,0.45), inset 0 1px 0 rgba(255,255,255,0.15)"
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-1px)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
      >
        <i className="fas fa-plus-circle text-lg" />
        CRIAR NOVO JOGO
      </button>

      {/* AÇÕES SECUNDÁRIAS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* Usuários */}
        <button
          onClick={() => goTo("users")}
          className="py-3 rounded-xl text-white font-bold text-xs sm:text-sm flex flex-col items-center gap-1 transition-all"
          style={{
            background: "linear-gradient(135deg, #001A46 0%, #004B9A 100%)",
            border: "1px solid rgba(2,115,208,0.35)",
            boxShadow: "0 4px 12px rgba(0,26,70,0.5)"
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(251,102,0,0.5)")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(2,115,208,0.35)")}
        >
          <i className="fas fa-users text-base" style={{ color: "#0273D0" }} />
          <span>USUÁRIOS</span>
        </button>

        {/* Mensalistas */}
        <button
          onClick={() => goTo("mensalistas")}
          className="py-3 rounded-xl text-white font-bold text-xs sm:text-sm flex flex-col items-center gap-1 transition-all"
          style={{
            background: "linear-gradient(135deg, #064E3B 0%, #065F46 100%)",
            border: "1px solid rgba(16,185,129,0.35)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(251,102,0,0.5)")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(16,185,129,0.35)")}
        >
          <i className="fas fa-credit-card text-base text-green-400" />
          <span>MENSALISTA</span>
        </button>

        {/* Financeiro */}
        <button
          onClick={() => goTo("financeiro")}
          className="py-3 rounded-xl text-white font-bold text-xs sm:text-sm flex flex-col items-center gap-1 transition-all"
          style={{
            background: "linear-gradient(135deg, #3B0764 0%, #6D28D9 100%)",
            border: "1px solid rgba(139,92,246,0.35)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(251,102,0,0.5)")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.35)")}
        >
          <i className="fas fa-chart-line text-base text-purple-400" />
          <span>FINANCEIRO</span>
        </button>

        {/* Votação */}
        <button
          onClick={() => goTo("voting")}
          className="py-3 rounded-xl text-white font-bold text-xs sm:text-sm flex flex-col items-center gap-1 transition-all"
          style={{
            background: "linear-gradient(135deg, #7C2D12 0%, #FF6B35 100%)",
            border: "1px solid rgba(255,107,53,0.35)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(251,102,0,0.5)")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,107,53,0.35)")}
        >
          <i className="fas fa-poll text-base" style={{ color: "#FFB347" }} />
          <span>VOTAÇÃO</span>
        </button>
      </div>
    </div>
  );
}
