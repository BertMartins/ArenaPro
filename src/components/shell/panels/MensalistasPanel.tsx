"use client";
import { useEffect, useState } from "react";
import { useNav } from "@/context/NavContext";

export default function MensalistasPanel() {
  const nav = useNav()!;
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
    if (res.ok) { showToast("Mensalidade salva!"); load(); }
    else showToast("Erro ao salvar", "error");
  }

  async function togglePayment(userId: string) {
    const res = await fetch(`/api/payments/${userId}/toggle`, { method: "POST" });
    if (res.ok) { showToast("Status atualizado"); load(); }
    else showToast("Erro ao atualizar", "error");
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: "#FB6600", borderTopColor: "transparent" }} />
    </div>
  );

  const monthNames = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho",
    "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
  const monthLabel   = data ? `${monthNames[(data.month ?? 1) - 1]} ${data.year}` : "";
  const paidCount    = data?.monthlyUsers?.filter((u: any) => u.hasPaid).length ?? 0;
  const totalCount   = data?.monthlyUsers?.length ?? 0;
  const pendingCount = totalCount - paidCount;

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
              <i className="fas fa-credit-card" style={{ color: "#FB9A14" }} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-wider">MENSALIDADES</h1>
              <p className="text-xs" style={{ color: "#5A6F8D" }}>Controle de pagamentos mensais</p>
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

        {/* CONFIG */}
        <div className="glass-card rounded-2xl p-4">
          <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
            <i className="fas fa-cog" style={{ color: "#FB6600" }} /> Configuração — {monthLabel}
          </h3>
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <span className="absolute left-3 top-3.5 text-sm font-bold" style={{ color: "#5A6F8D" }}>R$</span>
              <input
                type="number"
                value={feeInput}
                onChange={(e) => setFeeInput(e.target.value)}
                min="0"
                step="0.01"
                placeholder="0,00"
                className="custom-input w-full pl-10 pr-3 py-3 rounded-xl text-white text-sm"
              />
            </div>
            <button
              onClick={saveFee}
              disabled={saving}
              className="btn-primary px-5 py-3 rounded-xl text-white font-bold flex items-center gap-1"
            >
              <i className="fas fa-save" />
              {saving ? "..." : "Salvar"}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div
              className="rounded-xl p-3 text-center"
              style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)" }}
            >
              <div className="text-2xl font-black text-green-400">{totalCount}</div>
              <div className="text-xs mt-0.5" style={{ color: "#5A6F8D" }}>Mensalistas</div>
            </div>
            <div
              className="rounded-xl p-3 text-center"
              style={{ background: "rgba(251,102,0,0.12)", border: "1px solid rgba(251,102,0,0.3)" }}
            >
              <div className="text-lg font-black" style={{ color: "#FB9A14" }}>R$ {(data?.feePerPerson ?? 0).toFixed(2)}</div>
              <div className="text-xs mt-0.5" style={{ color: "#5A6F8D" }}>Por Pessoa</div>
            </div>
            <div
              className="rounded-xl p-3 text-center"
              style={{ background: "rgba(0,75,154,0.2)", border: "1px solid rgba(2,115,208,0.3)" }}
            >
              <div className="text-2xl font-black text-white">{paidCount}/{totalCount}</div>
              <div className="text-xs mt-0.5" style={{ color: "#5A6F8D" }}>Pagaram</div>
            </div>
          </div>
        </div>

        {/* LISTA */}
        {data?.monthlyUsers?.length > 0 ? (
          <div className="glass-card rounded-2xl p-4 sm:p-5">
            <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              <i className="fas fa-users" style={{ color: "#0273D0" }} /> Mensalistas ({totalCount})
            </h3>
            <div className="space-y-3">
              {data.monthlyUsers.map((u: any) => (
                <div
                  key={u.id}
                  className="rounded-xl p-4 transition"
                  style={u.hasPaid
                    ? { background: "rgba(34,197,94,0.08)", border: "1.5px solid rgba(34,197,94,0.4)" }
                    : { background: "rgba(0,26,70,0.5)", border: "1.5px solid rgba(2,115,208,0.2)" }
                  }
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{u.photo ?? "🏐"}</span>
                      <div>
                        <div className="text-white font-bold">{u.name}</div>
                        <div className="text-xs" style={{ color: "#5A6F8D" }}>{u.email}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-black ${u.hasPaid ? "text-green-400" : ""}`}
                        style={u.hasPaid ? {} : { color: "#FB6600" }}>
                        R$ {(data.feePerPerson ?? 0).toFixed(2)}
                      </div>
                      <div className={`text-xs font-bold ${u.hasPaid ? "text-green-400" : ""}`}
                        style={u.hasPaid ? {} : { color: "#5A6F8D" }}>
                        {u.hasPaid ? "PAGO ✓" : "PENDENTE"}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => togglePayment(u.id)}
                    className="w-full py-2 rounded-xl text-white font-bold text-sm transition"
                    style={u.hasPaid
                      ? { background: "rgba(239,68,68,0.8)" }
                      : { background: "linear-gradient(135deg,#059669,#10B981)", boxShadow: "0 4px 12px rgba(16,185,129,0.3)" }
                    }
                  >
                    <i className={`fas ${u.hasPaid ? "fa-times" : "fa-check"} mr-2`} />
                    {u.hasPaid ? "Marcar como Pendente" : "Marcar como Pago"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-8 text-center">
            <i className="fas fa-users-slash text-5xl mb-4 block opacity-30" style={{ color: "#5A6F8D" }} />
            <h3 className="text-white text-lg font-bold mb-2">Nenhum Mensalista</h3>
            <p className="text-sm mb-5" style={{ color: "#5A6F8D" }}>Cadastre usuários como mensalistas na tela de Usuários</p>
            <button
              onClick={() => nav.pushView({ type: "users" })}
              className="btn-primary px-6 py-3 rounded-xl text-white font-bold"
            >
              <i className="fas fa-users mr-2" /> Gerenciar Usuários
            </button>
          </div>
        )}

        {/* ALERTS */}
        {pendingCount > 0 && totalCount > 0 && (
          <div className="rounded-2xl p-4" style={{ background: "rgba(234,179,8,0.12)", border: "1px solid rgba(234,179,8,0.4)" }}>
            <div className="flex gap-3">
              <i className="fas fa-triangle-exclamation text-yellow-400 text-xl mt-0.5" />
              <div>
                <div className="text-yellow-300 font-bold mb-0.5">Atenção!</div>
                <div className="text-yellow-100 text-sm">
                  {pendingCount} mensalista{pendingCount > 1 ? "s ainda não pagaram" : " ainda não pagou"} este mês.
                </div>
              </div>
            </div>
          </div>
        )}

        {pendingCount === 0 && totalCount > 0 && (
          <div className="rounded-2xl p-4" style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.4)" }}>
            <div className="flex gap-3">
              <i className="fas fa-circle-check text-green-400 text-xl mt-0.5" />
              <div>
                <div className="text-green-300 font-bold mb-0.5">Tudo Certo!</div>
                <div className="text-green-100 text-sm">Todos os mensalistas já pagaram este mês!</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* TOAST */}
      {toast && (
        <div
          className="fixed top-4 right-4 px-5 py-3 rounded-xl text-white z-[60] shadow-xl animate-slideIn font-semibold"
          style={{ background: toast.type === "error" ? "#EF4444" : "linear-gradient(135deg,#FB6600,#FB9A14)" }}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
