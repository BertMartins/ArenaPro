"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/dashboard/BottomNav";

export default function FinanceiroPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/financial");
      if (res.ok) setData(await res.json());
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const monthLabel = data ? `${monthNames[(data.month ?? 1) - 1]} ${data.year}` : "";

  const arenaPaid = data?.arenaPaid ?? 0;
  const dailyBox = data?.dailyBox ?? 0;
  const total = arenaPaid + dailyBox;
  const dailyPlayers = data?.dailyPlayers ?? [];

  return (
    <div className="pb-24 animate-fadeIn">
      {/* Header */}
      <div className="p-6" style={{ background: "linear-gradient(135deg, #ff7a18, #ff9e32)" }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white tracking-wider">CONTROLE FINANCEIRO</h1>
            <p className="text-orange-100">Gestão de receitas e despesas</p>
          </div>
          <button onClick={() => router.push("/dashboard")} className="text-white hover:bg-white/20 p-2 rounded-lg">
            ✕
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Período */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-white font-bold text-lg mb-4">📅 {monthLabel}</h3>

          {/* Cards de resumo */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="rounded-xl p-4 text-white" style={{ background: "linear-gradient(135deg, #1D4ED8, #3B82F6)" }}>
              <div className="text-xs opacity-80 mb-1">Pago para Arena</div>
              <div className="text-2xl font-bold">R$ {arenaPaid.toFixed(2)}</div>
            </div>
            <div className="rounded-xl p-4 text-white" style={{ background: "linear-gradient(135deg, #059669, #10B981)" }}>
              <div className="text-xs opacity-80 mb-1">Caixinha Diaristas</div>
              <div className="text-2xl font-bold">R$ {dailyBox.toFixed(2)}</div>
            </div>
          </div>
          <div className="rounded-xl p-4 text-white" style={{ background: "linear-gradient(135deg, #7C3AED, #A78BFA)" }}>
            <div className="text-xs opacity-80 mb-1">Total Arrecadado</div>
            <div className="text-2xl font-bold">R$ {total.toFixed(2)}</div>
          </div>
        </div>

        {/* Pagamentos Arena */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-white font-bold text-lg mb-4">🏟️ Pagamentos para Arena (Mensalistas)</h3>
          <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4">
            <div className="flex justify-between items-center mb-1">
              <div className="text-blue-300 text-sm">Recebido este mês</div>
              <div className="text-white text-xl font-bold">R$ {arenaPaid.toFixed(2)}</div>
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-3">
            ℹ️ Valores são contabilizados automaticamente quando mensalistas marcam pagamento
          </p>
        </div>

        {/* Caixinha diaristas */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-white font-bold text-lg mb-4">🐷 Caixinha de Diaristas</h3>

          {dailyPlayers.length > 0 ? (
            <>
              <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center">
                  <div className="text-green-300 text-sm">Total em Caixa</div>
                  <div className="text-white text-2xl font-bold">R$ {dailyBox.toFixed(2)}</div>
                </div>
                <div className="text-green-300 text-xs mt-1">
                  {dailyPlayers.length} participação{dailyPlayers.length > 1 ? "ões" : ""} × R$ 15,00
                </div>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                <div className="text-gray-400 text-xs font-bold mb-2">Histórico:</div>
                {dailyPlayers.map((p: any) => (
                  <div key={p.id} className="bg-gray-700/50 rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <div className="text-white font-medium text-sm">{p.userName}</div>
                      <div className="text-gray-400 text-xs">
                        {new Date(p.gameDate).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                    <div className="text-green-400 font-bold">+ R$ {p.amount.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-3">💰</div>
              <div>Nenhuma participação de diarista este mês</div>
            </div>
          )}

          <p className="text-gray-400 text-sm mt-3">
            ℹ️ R$ 15 é adicionado automaticamente quando diarista/visitante participa de um jogo
          </p>
        </div>

        {/* Info */}
        <div className="bg-orange-500/20 border border-orange-500 rounded-xl p-4">
          <div className="flex gap-3">
            <span className="text-orange-400 text-xl">💡</span>
            <div className="flex-1">
              <div className="text-orange-300 font-bold mb-1">Como funciona?</div>
              <div className="text-orange-100 text-sm space-y-1">
                <p>• Quando mensalista paga → valor vai para "Pago para Arena"</p>
                <p>• Quando diarista/visitante participa → R$ 15 vai para "Caixinha"</p>
                <p>• Tudo é contabilizado automaticamente por mês</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav active="home" role="admin" />
    </div>
  );
}
