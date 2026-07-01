"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useToast } from "@/components/ui/ToastProvider";

type Session = {
  id: string;
  title: string;
  startAt: string;
  endAt: string;
  status: string;
  phase: "scheduled" | "open" | "closed";
  votesCount: number;
};

const PHASE_LABEL: Record<Session["phase"], string> = {
  scheduled: "Agendada",
  open: "Aberta",
  closed: "Encerrada",
};

const PHASE_COLOR: Record<Session["phase"], string> = {
  scheduled: "text-blue-300 bg-blue-500/20 border-blue-500",
  open: "text-green-300 bg-green-500/20 border-green-500",
  closed: "text-gray-300 bg-gray-500/20 border-gray-500",
};

function toLocalInputValue(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function VotingPanel({ onClose }: { onClose: () => void }) {
  const toast = useToast();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);

  const now = new Date();
  const inOneDay = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  async function loadSessions() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/voting");
      const data = await res.json();
      setSessions(!res.ok || !Array.isArray(data) ? [] : data);
    } catch {
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSessions();
  }, []);

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreating(true);

    try {
      const form = e.target as HTMLFormElement & {
        title: HTMLInputElement;
        startAt: HTMLInputElement;
        endAt: HTMLInputElement;
      };
      const startAt = new Date(form.startAt.value).toISOString();
      const endAt = new Date(form.endAt.value).toISOString();
      const title = form.title.value.trim();

      const res = await fetch("/api/admin/voting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title || undefined, startAt, endAt }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast(data.error || "Erro ao criar votação", "error");
        return;
      }

      toast("Votação criada!", "success");
      setShowCreateForm(false);
      loadSessions();
    } finally {
      setCreating(false);
    }
  }

  function copyLink(id: string) {
    const url = `${window.location.origin}/votacao/${id}`;
    navigator.clipboard.writeText(url).then(
      () => toast("Link copiado!", "success"),
      () => toast("Não foi possível copiar o link", "error")
    );
  }

  async function handleFinalize(id: string) {
    const res = await fetch(`/api/admin/voting/${id}/finalize`, { method: "POST" });
    const data = await res.json();
    if (!res.ok) {
      toast(data.error || "Erro ao finalizar votação", "error");
      return;
    }
    toast("Votação finalizada! Níveis atualizados.", "success");
    loadSessions();
  }

  return (
    <div className="pb-24 animate-fadeIn max-w-2xl mx-auto">
      {/* HEADER */}
      <div
        className="p-4 sm:p-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #7C2D12 0%, #FF6B35 65%, #FF8C42 100%)",
          borderBottom: "2px solid rgba(255,107,53,0.4)",
        }}
      >
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.3)" }}
            >
              <i className="fas fa-poll text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-wider">VOTAÇÃO DE NÍVEL</h1>
              <p className="text-xs text-white/80">Gere um link para todos votarem no nível dos jogadores</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl transition"
            style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
          >
            <i className="fas fa-times" />
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-5 space-y-4">
        {/* BOTÃO CRIAR */}
        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary w-full py-3.5 rounded-xl text-white font-bold flex items-center justify-center gap-2"
          >
            <i className="fas fa-plus-circle" />
            Criar Nova Votação
          </button>
        )}

        {/* FORM CRIAR */}
        {showCreateForm && (
          <form onSubmit={handleCreate} className="glass-card rounded-xl p-4 space-y-3">
            <h3 className="text-white font-bold text-base">Nova Votação</h3>

            <div>
              <label className="text-sm text-gray-300 block mb-1">Título (opcional)</label>
              <input
                name="title"
                type="text"
                placeholder="Votação de Nível - Julho 2026"
                className="custom-input w-full px-3 py-2.5 rounded-lg text-white text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-300 block mb-1">Início</label>
                <input
                  name="startAt"
                  type="datetime-local"
                  required
                  defaultValue={toLocalInputValue(now)}
                  className="custom-input w-full px-3 py-2.5 rounded-lg text-white text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 block mb-1">Término</label>
                <input
                  name="endAt"
                  type="datetime-local"
                  required
                  defaultValue={toLocalInputValue(inOneDay)}
                  className="custom-input w-full px-3 py-2.5 rounded-lg text-white text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="flex-1 py-2.5 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={creating}
                className="flex-1 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-white font-bold transition disabled:opacity-50 text-sm"
              >
                {creating ? "Criando..." : "Criar"}
              </button>
            </div>
          </form>
        )}

        {/* LISTA DE SESSÕES */}
        {loading && <div className="text-gray-400 mt-4">Carregando votações...</div>}

        {!loading && sessions.length === 0 && (
          <div
            className="p-8 rounded-2xl text-center"
            style={{ background: "rgba(0,26,70,0.5)", border: "1px solid rgba(2,115,208,0.2)" }}
          >
            <i className="fas fa-poll text-4xl mb-3 block opacity-30 text-gray-400" />
            <div className="text-gray-400">Nenhuma votação criada ainda.</div>
          </div>
        )}

        <div className="space-y-3">
          {sessions.map((s) => (
            <div key={s.id} className="glass-card rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-white font-bold">{s.title}</div>
                  <div className="text-gray-400 text-xs mt-0.5">
                    {formatDateTime(s.startAt)} → {formatDateTime(s.endAt)}
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full border ${PHASE_COLOR[s.phase]}`}>
                  {PHASE_LABEL[s.phase]}
                </span>
              </div>

              <div className="text-gray-400 text-xs mb-3">
                <i className="fas fa-check-to-slot mr-1" />
                {s.votesCount} voto{s.votesCount === 1 ? "" : "s"} registrado{s.votesCount === 1 ? "" : "s"}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => copyLink(s.id)}
                  className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition"
                >
                  <i className="fas fa-link mr-1" />
                  Copiar Link
                </button>
                {s.phase === "open" && (
                  <button
                    onClick={() => handleFinalize(s.id)}
                    className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-bold transition"
                  >
                    <i className="fas fa-flag-checkered mr-1" />
                    Finalizar Agora
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
