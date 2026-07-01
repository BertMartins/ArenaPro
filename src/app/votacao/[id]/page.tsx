"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useToast } from "@/components/ui/ToastProvider";
import { LEVEL_LABELS, LEVEL_COLORS } from "@/shared/levelLabels";

type Participant = { id: string; name: string; photo: string | null; level: number };
type Phase = "scheduled" | "open" | "closed";

type SessionData = {
  id: string;
  title: string;
  startAt: string;
  endAt: string;
  phase: Phase;
  participants: Participant[];
  myVotes?: { targetId: string; level: number }[];
  results?: {
    userId: string;
    name: string;
    photo: string | null;
    votesCount: number;
    average: number | null;
    level: number;
  }[];
};

export default function VotacaoPage() {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const [data, setData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function load() {
    setLoading(true);
    setAuthError(false);
    try {
      const res = await fetch(`/api/voting/${id}`);
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        setAuthError(true);
        return;
      }
      const json = await res.json();
      if (!res.ok) {
        toast(json.error || "Erro ao carregar votação", "error");
        return;
      }
      setData(json);
      if (json.myVotes) {
        const initial: Record<string, number> = {};
        json.myVotes.forEach((v: { targetId: string; level: number }) => {
          initial[v.targetId] = v.level;
        });
        setVotes(initial);
      }
    } catch {
      setAuthError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleSubmit() {
    const payload = Object.entries(votes).map(([targetId, level]) => ({ targetId, level }));
    if (payload.length === 0) {
      toast("Selecione o nível de pelo menos uma pessoa", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/voting/${id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ votes: payload }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast(json.error || "Erro ao enviar votos", "error");
        return;
      }
      toast("Votos registrados! Você pode alterar até a votação encerrar.", "success");
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (authError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center gap-4">
        <i className="fas fa-lock text-4xl text-orange-400" />
        <p className="text-white">Sua sessão expirou. Faça login novamente para continuar.</p>
        <a
          href={`/login?next=${encodeURIComponent(`/votacao/${id}`)}`}
          className="btn-primary px-6 py-3 rounded-lg text-white font-bold"
        >
          Ir para o login
        </a>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        Votação não encontrada.
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 max-w-2xl mx-auto animate-fadeIn">
      <div
        className="p-5 sm:p-6"
        style={{ background: "linear-gradient(135deg, #7C2D12 0%, #FF6B35 65%, #FF8C42 100%)" }}
      >
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-wider">{data.title}</h1>
        <p className="text-white/80 text-sm mt-1">
          {new Date(data.startAt).toLocaleString("pt-BR")} → {new Date(data.endAt).toLocaleString("pt-BR")}
        </p>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {data.phase === "scheduled" && (
          <div className="glass-card rounded-xl p-6 text-center">
            <i className="fas fa-clock text-3xl text-blue-400 mb-3 block" />
            <p className="text-white font-bold">Esta votação ainda não começou.</p>
            <p className="text-gray-400 text-sm mt-1">
              Volte a partir de {new Date(data.startAt).toLocaleString("pt-BR")}.
            </p>
          </div>
        )}

        {data.phase === "open" && (
          <>
            <div className="glass-card rounded-xl p-4 text-sm text-gray-300">
              <i className="fas fa-info-circle mr-2 text-orange-400" />
              Escolha o nível (1-6) de quem você conhece. Pode deixar em branco quem preferir não avaliar.
            </div>

            <div className="space-y-3">
              {data.participants.map((p) => (
                <div key={p.id} className="glass-card rounded-xl p-4">
                  <div className="text-white font-bold mb-2">
                    {p.photo && <span className="mr-2">{p.photo}</span>}
                    {p.name}
                  </div>
                  <div className="grid grid-cols-6 gap-1.5">
                    {([1, 2, 3, 4, 5, 6] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setVotes((v) => ({ ...v, [p.id]: lvl }))}
                        title={LEVEL_LABELS[lvl]}
                        className={`flex items-center justify-center h-10 rounded-lg border-2 transition-all font-bold text-white text-sm bg-gradient-to-br ${LEVEL_COLORS[lvl]} ${
                          votes[p.id] === lvl
                            ? "border-white ring-2 ring-orange-400 scale-110 shadow-lg"
                            : "border-transparent opacity-40 hover:opacity-70"
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary w-full py-3.5 rounded-xl text-white font-bold text-base disabled:opacity-60"
            >
              {submitting ? "Enviando..." : submitted ? "Atualizar meus votos" : "Enviar votos"}
            </button>
          </>
        )}

        {data.phase === "closed" && (
          <>
            <div className="glass-card rounded-xl p-4 text-sm text-gray-300">
              <i className="fas fa-flag-checkered mr-2 text-orange-400" />
              Votação encerrada. Veja o resultado abaixo.
            </div>
            <div className="space-y-2">
              {data.results?.map((r) => (
                <div key={r.userId} className="glass-card rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <div className="text-white font-bold">
                      {r.photo && <span className="mr-2">{r.photo}</span>}
                      {r.name}
                    </div>
                    <div className="text-gray-400 text-xs mt-0.5">
                      {r.votesCount === 0
                        ? "Sem votos recebidos"
                        : `${r.votesCount} voto${r.votesCount === 1 ? "" : "s"} · média ${r.average?.toFixed(1)}`}
                    </div>
                  </div>
                  <div className="bg-purple-600 text-white w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold">
                    {r.level}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
