"use client";
import { useEffect, useState, type FormEvent } from "react";
import { useToast } from "@/components/ui/ToastProvider";

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

type IncomeEntry = {
  id: string;
  date: string;
  category: "monthly_fee" | "daily_fee";
  amount: number;
  note: string | null;
  userName: string | null;
};

type ExpenseEntry = {
  id: string;
  date: string;
  amount: number;
  note: string | null;
};

type Summary = {
  cashBalance: number;
  month: number;
  year: number;
  monthlyFeeIncome: number;
  dailyFeeIncome: number;
  totalIncome: number;
  totalExpense: number;
  netMonth: number;
  incomeEntries: IncomeEntry[];
  expenseEntries: ExpenseEntry[];
};

function todayInputValue() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function FinanceiroPanel({ onClose }: { onClose: () => void }) {
  const toast = useToast();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load(m: number, y: number) {
    setLoading(true);
    try {
      const res = await fetch(`/api/financial?month=${m}&year=${y}`);
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(month, year);
  }, [month, year]);

  function goToMonth(delta: number) {
    let m = month + delta;
    let y = year;
    if (m > 12) { m = 1; y += 1; }
    if (m < 1) { m = 12; y -= 1; }
    setMonth(m);
    setYear(y);
  }

  async function handleAddExpense(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      const form = e.target as HTMLFormElement & {
        date: HTMLInputElement;
        description: HTMLInputElement;
        amount: HTMLInputElement;
      };

      const res = await fetch("/api/financial/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: form.date.value,
          description: form.description.value,
          amount: Number(form.amount.value),
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        toast(json.error || "Erro ao lançar gasto", "error");
        return;
      }

      toast("Gasto lançado!", "success");
      setShowExpenseForm(false);
      load(month, year);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteExpense(id: string) {
    const res = await fetch(`/api/financial/expenses/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok) {
      toast(json.error || "Erro ao excluir gasto", "error");
      return;
    }
    toast("Gasto excluído", "success");
    load(month, year);
  }

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div
          className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "#FB6600", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  const monthLabel = `${MONTH_NAMES[month - 1]} ${year}`;

  const movements = [
    ...(data?.incomeEntries.map((e) => ({ ...e, kind: "income" as const })) ?? []),
    ...(data?.expenseEntries.map((e) => ({ ...e, kind: "expense" as const })) ?? []),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="pb-24 animate-fadeIn max-w-2xl mx-auto">
      {/* HEADER */}
      <div
        className="p-4 sm:p-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #001A46 0%, #004B9A 65%, #0273D0 100%)",
          borderBottom: "2px solid rgba(251,102,0,0.4)",
        }}
      >
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
              <p className="text-xs" style={{ color: "#5A6F8D" }}>Caixa, mensalidades, diárias e gastos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl transition"
            style={{ background: "rgba(255,255,255,0.1)", color: "white" }}
          >
            <i className="fas fa-times" />
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-5 space-y-4">
        {/* SALDO EM CAIXA */}
        <div
          className="rounded-2xl p-4 sm:p-5 text-white"
          style={{ background: "linear-gradient(135deg, #FB6600, #FB9A14)", boxShadow: "0 4px 16px rgba(251,102,0,0.35)" }}
        >
          <div className="text-xs opacity-80 mb-1 flex items-center gap-1">
            <i className="fas fa-wallet text-[10px]" /> Saldo em Caixa do Bolinha Club
          </div>
          <div className="text-3xl sm:text-4xl font-black">
            R$ {(data?.cashBalance ?? 0).toFixed(2)}
          </div>
        </div>

        {/* NAVEGADOR DE MÊS */}
        <div className="flex items-center justify-between glass-card rounded-xl p-3">
          <button onClick={() => goToMonth(-1)} className="p-2 text-white hover:bg-white/10 rounded-lg">
            <i className="fas fa-chevron-left" />
          </button>
          <div className="text-white font-bold">{monthLabel}</div>
          <button onClick={() => goToMonth(1)} className="p-2 text-white hover:bg-white/10 rounded-lg">
            <i className="fas fa-chevron-right" />
          </button>
        </div>

        {/* CARDS DO MÊS */}
        <div className="grid grid-cols-2 gap-2">
          <div
            className="rounded-xl p-3 sm:p-4 text-white"
            style={{ background: "linear-gradient(135deg, #001A46, #004B9A)", border: "1px solid rgba(2,115,208,0.3)" }}
          >
            <div className="text-xs opacity-70 mb-1">Mensalidades</div>
            <div className="text-lg sm:text-xl font-black">R$ {(data?.monthlyFeeIncome ?? 0).toFixed(2)}</div>
          </div>
          <div
            className="rounded-xl p-3 sm:p-4 text-white"
            style={{ background: "linear-gradient(135deg, #064E3B, #065F46)", border: "1px solid rgba(16,185,129,0.3)" }}
          >
            <div className="text-xs opacity-70 mb-1">Diárias</div>
            <div className="text-lg sm:text-xl font-black">R$ {(data?.dailyFeeIncome ?? 0).toFixed(2)}</div>
          </div>
          <div
            className="rounded-xl p-3 sm:p-4 text-white"
            style={{ background: "linear-gradient(135deg, #7F1D1D, #991B1B)", border: "1px solid rgba(239,68,68,0.3)" }}
          >
            <div className="text-xs opacity-70 mb-1">Gastos</div>
            <div className="text-lg sm:text-xl font-black">R$ {(data?.totalExpense ?? 0).toFixed(2)}</div>
          </div>
          <div
            className="rounded-xl p-3 sm:p-4 text-white"
            style={{ background: "linear-gradient(135deg, #3B0764, #6D28D9)", border: "1px solid rgba(139,92,246,0.3)" }}
          >
            <div className="text-xs opacity-70 mb-1">Saldo do Mês</div>
            <div className="text-lg sm:text-xl font-black">R$ {(data?.netMonth ?? 0).toFixed(2)}</div>
          </div>
        </div>

        {/* LANÇAR GASTO */}
        {!showExpenseForm ? (
          <button
            onClick={() => setShowExpenseForm(true)}
            className="btn-primary w-full py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2"
          >
            <i className="fas fa-minus-circle" />
            Lançar Gasto
          </button>
        ) : (
          <form onSubmit={handleAddExpense} className="glass-card rounded-xl p-4 space-y-3">
            <h3 className="text-white font-bold text-base">Novo Gasto</h3>
            <div>
              <label className="text-sm text-gray-300 block mb-1">Data</label>
              <input
                name="date"
                type="date"
                required
                defaultValue={todayInputValue()}
                className="custom-input w-full px-3 py-2.5 rounded-lg text-white text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-gray-300 block mb-1">Descrição</label>
              <input
                name="description"
                type="text"
                required
                placeholder="Ex: Aluguel da quadra"
                className="custom-input w-full px-3 py-2.5 rounded-lg text-white text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-gray-300 block mb-1">Valor</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400 text-sm">R$</span>
                <input
                  name="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  placeholder="0,00"
                  className="custom-input w-full pl-10 pr-3 py-2.5 rounded-lg text-white text-sm"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowExpenseForm(false)}
                className="flex-1 py-2.5 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition disabled:opacity-50 text-sm"
              >
                {saving ? "Salvando..." : "Lançar"}
              </button>
            </div>
          </form>
        )}

        {/* EXTRATO */}
        <div className="glass-card rounded-2xl p-4 sm:p-5">
          <h3 className="text-white font-bold text-base sm:text-lg mb-3 flex items-center gap-2">
            <i className="fas fa-receipt text-orange-400" /> Extrato de {monthLabel}
          </h3>

          {movements.length === 0 ? (
            <div className="text-center py-8" style={{ color: "#5A6F8D" }}>
              <i className="fas fa-receipt text-4xl mb-3 block opacity-40" />
              <div>Nenhum lançamento neste mês</div>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {movements.map((m) => (
                <div
                  key={`${m.kind}-${m.id}`}
                  className="rounded-xl p-3 flex justify-between items-center"
                  style={{ background: "rgba(0,26,70,0.5)", border: "1px solid rgba(2,115,208,0.15)" }}
                >
                  <div className="min-w-0">
                    <div className="text-white font-semibold text-sm truncate">
                      {m.note ?? (m.kind === "income" ? "Receita" : "Gasto")}
                    </div>
                    <div className="text-xs" style={{ color: "#5A6F8D" }}>
                      {new Date(m.date).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className={`font-black ${m.kind === "income" ? "text-green-400" : "text-red-400"}`}>
                      {m.kind === "income" ? "+" : "-"} R$ {m.amount.toFixed(2)}
                    </div>
                    {m.kind === "expense" && (
                      <button
                        onClick={() => handleDeleteExpense(m.id)}
                        className="text-gray-400 hover:text-red-400 p-1"
                      >
                        <i className="fas fa-trash text-xs" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
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
                <p>• Mensalista paga → entra no Saldo em Caixa</p>
                <p>• Diarista/Visitante confirma pagamento → entra no Saldo em Caixa</p>
                <p>• Gastos lançados aqui abatem do Saldo em Caixa</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
