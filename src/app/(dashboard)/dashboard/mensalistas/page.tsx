"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/dashboard/BottomNav";

export default function MensalistasPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [feeInput, setFeeInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);

  function showToast(msg: string, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/payments");
      if (res.ok) {
        const d = await res.json();
        setData(d);
        setFeeInput(String(d.feeTotal ?? 0));
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function saveFee() {
    setSaving(true);
    const res = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feeTotal: Number(feeInput) }),
    });
    setSaving(false);
    if (res.ok) { showToast("Mensalidade salva! 💰"); load(); }
    else showToast("Erro ao salvar", "error");
  }

  async function togglePayment(userId: string) {
    const res = await fetch(`/api/payments/${userId}/toggle`, { method: "POST" });
    if (res.ok) { showToast("Status atualizado ✅"); load(); }
    else showToast("Erro ao atualizar", "error");
  }

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

  const paidCount = data?.monthlyUsers?.filter((u: any) => u.hasPaid).length ?? 0;
  const totalCount = data?.monthlyUsers?.length ?? 0;
  const pendingCount = totalCount - paidCount;

  return (
    <div className="pb-24 animate-fadeIn max-w-2xl mx-auto">
      {/* Header */}
      <div className="p-4 sm:p-6" style={{ background: "linear-gradient(135deg, #ff7a18, #ff9e32)" }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wider">MENSALIDADES</h1>
            <p className="text-orange-100 text-sm">Controle de pagamentos mensais</p>
          </div>
          <button onClick={() => router.push("/dashboard")} className="text-white hover:bg-white/20 p-2 rounded-lg">
            ✕
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-5 space-y-4">
        {/* Configuração */}
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-white font-bold text-base mb-3">⚙️ Configuração — {monthLabel}</h3>
          <div className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-3 text-gray-400 text-sm">R$</span>
              <input
                type="number"
                value={feeInput}
                onChange={(e) => setFeeInput(e.target.value)}
                min="0"
                step="0.01"
                placeholder="0,00"
                className="custom-input w-full pl-10 pr-3 py-2.5 rounded-lg text-white bg-gray-800/50 border border-gray-600 text-sm"
              />
            </div>
            <button
              onClick={saveFee}
              disabled={saving}
              className="btn-primary px-6 py-3 rounded-lg text-white font-bold"
            >
              {saving ? "..." : "💾 Salvar"}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-green-500/20 border border-green-500 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-400">{totalCount}</div>
              <div className="text-gray-300 text-xs">Mensalistas</div>
            </div>
            <div className="bg-orange-500/20 border border-orange-500 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-orange-400">
                R$ {(data?.feePerPerson ?? 0).toFixed(2)}
              </div>
              <div className="text-gray-300 text-xs">Por Pessoa</div>
            </div>
            <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-400">{paidCount}/{totalCount}</div>
              <div className="text-gray-300 text-xs">Pagaram</div>
            </div>
          </div>
        </div>

        {/* Lista */}
        {data?.monthlyUsers?.length > 0 ? (
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-white font-bold text-lg mb-4">👥 Mensalistas ({totalCount})</h3>
            <div className="space-y-3">
              {data.monthlyUsers.map((u: any) => (
                <div
                  key={u.id}
                  className={`rounded-lg p-4 border-2 ${u.hasPaid ? "border-green-500 bg-green-500/5" : "border-gray-600 bg-gray-700/30"}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{u.photo ?? "🏐"}</span>
                      <div>
                        <div className="text-white font-bold">{u.name}</div>
                        <div className="text-gray-400 text-sm">{u.email}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-bold ${u.hasPaid ? "text-green-400" : "text-orange-400"}`}>
                        R$ {(data.feePerPerson ?? 0).toFixed(2)}
                      </div>
                      <div className={`text-xs font-bold ${u.hasPaid ? "text-green-400" : "text-gray-400"}`}>
                        {u.hasPaid ? "PAGO ✓" : "PENDENTE"}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => togglePayment(u.id)}
                    className={`w-full py-2 rounded-lg text-white font-bold text-sm ${
                      u.hasPaid ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {u.hasPaid ? "✕ Marcar como Pendente" : "✓ Marcar como Pago"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-xl p-8 text-center">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-white text-xl font-bold mb-2">Nenhum Mensalista</h3>
            <p className="text-gray-400 mb-4">Cadastre usuários como mensalistas na tela de Usuários</p>
            <button onClick={() => router.push("/dashboard/users")}
              className="btn-primary px-6 py-3 rounded-lg text-white font-bold">
              Gerenciar Usuários
            </button>
          </div>
        )}

        {/* Alerta */}
        {pendingCount > 0 && totalCount > 0 && (
          <div className="bg-yellow-500/20 border border-yellow-500 rounded-xl p-4">
            <div className="flex gap-3">
              <span className="text-yellow-400 text-xl">⚠️</span>
              <div>
                <div className="text-yellow-300 font-bold">Atenção!</div>
                <div className="text-yellow-100 text-sm">
                  {pendingCount} mensalista{pendingCount > 1 ? "s ainda não pagaram" : " ainda não pagou"} este mês.
                </div>
              </div>
            </div>
          </div>
        )}
        {pendingCount === 0 && totalCount > 0 && (
          <div className="bg-green-500/20 border border-green-500 rounded-xl p-4">
            <div className="flex gap-3">
              <span className="text-green-400 text-xl">✅</span>
              <div>
                <div className="text-green-300 font-bold">Tudo Certo!</div>
                <div className="text-green-100 text-sm">Todos os mensalistas já pagaram este mês! 🎉</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {toast && (
        <div className={`fixed top-4 right-4 px-5 py-3 rounded-lg text-white z-50 shadow-lg animate-slideIn ${
          toast.type === "error" ? "bg-red-500" : "bg-green-500"
        }`}>
          {toast.msg}
        </div>
      )}

      <BottomNav active="home" role="admin" />
    </div>
  );
}
