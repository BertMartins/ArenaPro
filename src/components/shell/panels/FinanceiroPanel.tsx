"use client";
import { useEffect, useState } from "react";
import { useNav } from "@/context/NavContext";

export default function FinanceiroPanel() {
  const nav = useNav()!;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/financial");
      if (res.ok) setData(await res.json());
      setLoading(false);
    })();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: "#FB6600", borderTopColor: "transparent" }} />
    </div>
  );

  const monthNames = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho",
    "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
  const monthLabel  = data ? `${monthNames[(data.month ?? 1) - 1]} ${data.year}` : "";
  const arenaPaid   = data?.arenaPaid   ?? 0;
  const dailyBox    = data?.dailyBox    ?? 0;
  const total       = arenaPaid + dailyBox;
  const dailyPlayers = data?.dailyPlayers ?? [];

  return (
    <div className="pb-24 animate-fadeIn max-w-2xl mx-auto">

      {/* HEADER */}
      <div
        className="p-4 sm:p-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #001A46 0%, #004B9A 65%, #0273D0 100%)",
          borderBottom: "2px solid rgba(251,102,0,0.4)"
        }}
      >
        <div style={{
          position: "absolute", top: "-30px", right: "-20px",
          width: 140, height: 140, borderRadius: "50%",
          background: "rgba(251,102,0,0.08)", pointerEvents: "none"
        }} />
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "rgba(251,102,0,0.2)", border: "2px solid rgba(251,102,0,0.4)" }}
            >
              <i className="fas fa-chart-line" style={{ color: "#FB9A14" }} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-wider">CONTROLE FINANCEIRO</h1>
              <p className="text-xs" style={{ color: "#5A6F8D" }}>Gestão de receitas e despesas</p>
            </div>
          </div>
          <button
            onClick={() => nav.popView()}
            className="p-2 rounded-xl transition"
            style={{ background: "rgba(255,255,255,0.1)", color: "white" }}
          >
            <i className="fas fa-times" />
          </button>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{ background: "linear-gradient(90deg, transparent, #FB6600, #FB9A14, transparent)" }}
        />
      </div>

      <div className="p-3 sm:p-5 space-y-4">

        {/* RESUMO DO MÊS */}
        <div className="glass-card rounded-2xl p-4">
          <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
            <i className="fas fa-calendar" style={{ color: "#FB6600" }} /> {monthLabel}
          </h3>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div
              className="rounded-xl p-3 sm:p-4 text-white"
              style={{ background: "linear-gradient(135deg, #001A46, #004B9A)", border: "1px solid rgba(2,115,208,0.3)" }}
            >
              <div className="text-xs opacity-70 mb-1 flex items-center gap-1">
                <i className="fas fa-building text-[10px]" /> Pago para Arena
              </div>
              <div className="text-xl sm:text-2xl font-black">R$ {arenaPaid.toFixed(2)}</div>
            </div>
            <div
              className="rounded-xl p-3 sm:p-4 text-white"
              style={{ background: "linear-gradient(135deg, #064E3B, #065F46)", border: "1px solid rgba(16,185,129,0.3)" }}
            >
              <div className="text-xs opacity-70 mb-1 flex items-center gap-1">
                <i className="fas fa-piggy-bank text-[10px]" /> Caixinha Diaristas
              </div>
              <div className="text-xl sm:text-2xl font-black">R$ {dailyBox.toFixed(2)}</div>
            </div>
          </div>
          <div
            className="rounded-xl p-3 sm:p-4 text-white"
            style={{ background: "linear-gradient(135deg, #FB6600, #FB9A14)", boxShadow: "0 4px 16px rgba(251,102,0,0.35)" }}
          >
            <div className="text-xs opacity-80 mb-1 flex items-center gap-1">
              <i className="fas fa-wallet text-[10px]" /> Total Arrecadado
            </div>
            <div className="text-2xl sm:text-3xl font-black">R$ {total.toFixed(2)}</div>
          </div>
        </div>

        {/* ARENA */}
        <div className="glass-card rounded-2xl p-4 sm:p-5">
          <h3 className="text-white font-bold text-base sm:text-lg mb-3 flex items-center gap-2">
            <i className="fas fa-building" style={{ color: "#0273D0" }} /> Arena (Mensalistas)
          </h3>
          <div
            className="rounded-xl p-4"
            style={{ background: "rgba(0,75,154,0.2)", border: "1px solid rgba(2,115,208,0.3)" }}
          >
            <div className="flex justify-between items-center">
              <div className="text-sm" style={{ color: "#5A6F8D" }}>Recebido este mês</div>
              <div className="text-white text-xl font-black">R$ {arenaPaid.toFixed(2)}</div>
            </div>
          </div>
          <p className="text-xs mt-3 flex items-center gap-1" style={{ color: "#5A6F8D" }}>
            <i className="fas fa-info-circle" /> Contabilizado automaticamente quando mensalistas marcam pagamento
          </p>
        </div>

        {/* CAIXINHA */}
        <div className="glass-card rounded-2xl p-4 sm:p-5">
          <h3 className="text-white font-bold text-base sm:text-lg mb-3 flex items-center gap-2">
            <i className="fas fa-piggy-bank text-green-400" /> Caixinha de Diaristas
          </h3>

          {dailyPlayers.length > 0 ? (
            <>
              <div
                className="rounded-xl p-4 mb-4"
                style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)" }}
              >
                <div className="flex justify-between items-center">
                  <div className="text-sm text-green-300">Total em Caixa</div>
                  <div className="text-white text-2xl font-black">R$ {dailyBox.toFixed(2)}</div>
                </div>
                <div className="text-xs text-green-300 mt-1">
                  {dailyPlayers.length} participação{dailyPlayers.length > 1 ? "ões" : ""} × R$ 15,00
                </div>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <div className="text-xs font-bold mb-2" style={{ color: "#5A6F8D" }}>Histórico:</div>
                {dailyPlayers.map((p: any) => (
                  <div
                    key={p.id}
                    className="rounded-xl p-3 flex justify-between items-center"
                    style={{ background: "rgba(0,26,70,0.5)", border: "1px solid rgba(2,115,208,0.15)" }}
                  >
                    <div>
                      <div className="text-white font-semibold text-sm">{p.userName}</div>
                      <div className="text-xs" style={{ color: "#5A6F8D" }}>
                        {new Date(p.gameDate).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                    <div className="font-black text-green-400">+ R$ {p.amount.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8" style={{ color: "#5A6F8D" }}>
              <i className="fas fa-piggy-bank text-4xl mb-3 block opacity-40" />
              <div>Nenhuma participação de diarista este mês</div>
            </div>
          )}
          <p className="text-xs mt-3 flex items-center gap-1" style={{ color: "#5A6F8D" }}>
            <i className="fas fa-info-circle" /> R$ 15 é adicionado automaticamente quando diarista/visitante participa
          </p>
        </div>

        {/* COMO FUNCIONA */}
        <div
          className="rounded-2xl p-4"
          style={{ background: "rgba(251,102,0,0.1)", border: "1px solid rgba(251,102,0,0.3)" }}
        >
          <div className="flex gap-3">
            <i className="fas fa-lightbulb text-xl mt-0.5 flex-shrink-0" style={{ color: "#FB9A14" }} />
            <div>
              <div className="font-bold mb-1" style={{ color: "#FB9A14" }}>Como funciona?</div>
              <div className="text-sm space-y-1" style={{ color: "#FB6600" }}>
                <p>• Mensalista paga → valor vai para "Pago para Arena"</p>
                <p>• Diarista/Visitante participa → R$ 15 vai para "Caixinha"</p>
                <p>• Tudo contabilizado automaticamente por mês</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
