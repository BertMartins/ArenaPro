"use client";
import { useEffect, useState } from "react";
import { useNav } from "@/context/NavContext";

const LEVEL_COLORS: Record<number, string> = {
  1: "bg-gray-500", 2: "bg-green-500", 3: "bg-blue-500",
  4: "bg-purple-500", 5: "bg-yellow-500", 6: "bg-red-500",
};

function buildWindowStart(game: any): Date {
  const [year, month, day] = (game.date as string).slice(0, 10).split("-").map(Number);
  const [hh, mm] = (game.paymentWindowStart || "12:00").split(":").map(Number);
  return new Date(year, month - 1, day, hh || 0, mm || 0, 0, 0);
}

function paymentDeadline(player: any, game: any): Date | null {
  if (!player.mainEnteredAt) return null;
  const windowStart = buildWindowStart(game);
  const mainEnteredAt = new Date(player.mainEnteredAt);
  const base = mainEnteredAt > windowStart ? mainEnteredAt : windowStart;
  return new Date(base.getTime() + (game.paymentDeadlineMinutes ?? 60) * 60000);
}

function formatRemaining(deadline: Date): string {
  const diffMs = deadline.getTime() - Date.now();
  if (diffMs <= 0) return "Prazo esgotado";
  const mins = Math.ceil(diffMs / 60000);
  if (mins < 60) return `${mins} min restantes`;
  const hours = Math.floor(mins / 60);
  const rem = mins % 60;
  return `${hours}h${rem > 0 ? ` ${rem}min` : ""} restantes`;
}

export default function GameDetailPanel({
  gameId,
  onBack,
  onGoToPlay,
}: {
  gameId: string;
  onBack?: () => void;
  onGoToPlay?: () => void;
}) {
  const nav = useNav();
  const goBack = onBack ?? (() => nav?.popView());
  const goToPlay = onGoToPlay ?? (() => nav?.setTab("play"));
  const [game, setGame] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [visitorModal, setVisitorModal] = useState(false);
  const [visitorName, setVisitorName] = useState("");
  const [visitorLevel, setVisitorLevel] = useState(3);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);

  function showToast(msg: string, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function load() {
    const [gameRes, meRes] = await Promise.all([
      fetch(`/api/games/${gameId}`),
      fetch("/api/auth/me"),
    ]);
    if (gameRes.ok) {
      const d = await gameRes.json();
      setGame(d.game ?? d);
    }
    if (meRes.ok) {
      const d = await meRes.json();
      setUser(d.user);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, [gameId]);

  async function handleJoin() {
    setSaving(true);
    const res = await fetch(`/api/games/${gameId}/join`, { method: "POST" });
    setSaving(false);
    if (res.ok) { showToast("Você entrou no jogo! 🏐"); load(); }
    else { const d = await res.json(); showToast(d.error || "Erro", "error"); }
  }

  async function handleLeave() {
    setSaving(true);
    const res = await fetch(`/api/games/${gameId}/leave`, { method: "POST" });
    setSaving(false);
    if (res.ok) { showToast("Você saiu do jogo", "info"); load(); }
    else showToast("Erro ao sair", "error");
  }

  async function handleConfirmPayment(playerId: string) {
    setSaving(true);
    const res = await fetch(`/api/games/${gameId}/confirm-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId }),
    });
    setSaving(false);
    if (res.ok) { showToast("Pagamento confirmado! 💰"); load(); }
    else { const d = await res.json(); showToast(d.error || "Erro ao confirmar", "error"); }
  }

  async function handleRemove(playerId: string) {
    if (!confirm("Remover este jogador?")) return;
    const res = await fetch(`/api/games/${gameId}/remove-player`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId }),
    });
    if (res.ok) { showToast("Jogador removido", "info"); load(); }
    else showToast("Erro ao remover", "error");
  }

  async function handleAddVisitor(e: any) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/games/${gameId}/add-visitor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: visitorName, level: visitorLevel }),
    });
    setSaving(false);
    if (res.ok) {
      showToast(`Visitante ${visitorName} adicionado! 👤`);
      setVisitorModal(false);
      setVisitorName("");
      setVisitorLevel(3);
      load();
    } else {
      showToast("Erro ao adicionar visitante", "error");
    }
  }

  async function handleStart() {
    if (!confirm("Criar times e iniciar o jogo?")) return;
    setSaving(true);
    const res = await fetch(`/api/games/${gameId}/start`, { method: "POST" });
    setSaving(false);
    if (res.ok) {
      showToast("Jogo iniciado! Times criados 🎯");
      goBack();
      goToPlay();
    } else {
      const d = await res.json();
      showToast(d.error || "Erro ao iniciar", "error");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="p-6 text-center text-gray-400">
        <p>Jogo não encontrado.</p>
        <button onClick={() => goBack()} className="mt-4 text-orange-400">Voltar</button>
      </div>
    );
  }

  const isAdmin = user?.role === "admin";
  const allPlayers = game.players ?? [];
  const mainPlayers = allPlayers
    .filter((p: any) => p.mainEnteredAt && !p.expired)
    .sort((a: any, b: any) => new Date(a.mainEnteredAt).getTime() - new Date(b.mainEnteredAt).getTime());
  const reservePlayers = allPlayers
    .filter((p: any) => !p.mainEnteredAt && !p.expired)
    .sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  const expiredPlayers = allPlayers.filter((p: any) => p.expired);
  const userInMain = mainPlayers.some((p: any) => p.userId === user?.id || p.user?.id === user?.id);
  const userInReserve = reservePlayers.some((p: any) => p.userId === user?.id || p.user?.id === user?.id);
  const userIsIn = userInMain || userInReserve;
  const getUser = (p: any) => p.user ?? p;
  const getUserId = (p: any) => p.userId ?? p.user?.id ?? p.id;

  return (
    <div className="pb-24 animate-fadeIn max-w-2xl mx-auto">
      <div className="p-4 sm:p-6" style={{ background: "linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)" }}>
        <button onClick={() => goBack()}
          className="text-white mb-3 hover:bg-white/20 px-3 py-1.5 rounded-lg transition text-sm">
          ← Voltar
        </button>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wider">DETALHES DO JOGO</h1>
        <p className="text-blue-100 mt-1 text-xs sm:text-sm">
          📅 {new Date(game.date.slice(0, 10) + "T12:00:00Z").toLocaleDateString("pt-BR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
        {(game.startTime || game.endTime) && (
          <p className="text-blue-200 mt-0.5 text-xs sm:text-sm">
            🕐 {game.startTime ?? "?"}{game.endTime ? ` – ${game.endTime}` : ""}
          </p>
        )}
      </div>

      <div className="p-3 sm:p-5 space-y-4">
        {game.status === "in_progress" && (
          <div className="bg-green-500/20 border-2 border-green-500 rounded-xl p-3 text-center animate-pulse">
            <div className="text-green-300 font-bold text-base sm:text-lg">⚡ JOGO EM ANDAMENTO</div>
            <div className="text-green-400 text-xs sm:text-sm">Lista de participantes bloqueada</div>
          </div>
        )}

        <div className="glass-card rounded-xl p-4">
          <h3 className="text-white font-bold text-base mb-2">⚙️ Configurações</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-2.5 text-center">
              <div className="text-xl font-bold text-blue-400">{game.teamSize}</div>
              <div className="text-gray-300 text-xs">Jogadores/Time</div>
            </div>
            <div className="bg-orange-500/20 border border-orange-500 rounded-lg p-2.5 text-center">
              <div className="text-xl font-bold text-orange-400">{game.pointsPerMatch}</div>
              <div className="text-gray-300 text-xs">Pontos/Partida</div>
            </div>
          </div>
          {game.twoWinsRule && (
            <div className="mt-2 bg-yellow-500/10 border border-yellow-500/40 rounded-lg p-2 text-center text-xs text-yellow-300">
              🏆 Regra "Ganhou 2 Sai" ativa
            </div>
          )}
          <div className="mt-2 bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-2.5 text-xs text-cyan-200">
            <div className="font-bold text-cyan-300 mb-1">
              {game.type === "general" ? "📋 Tipo: Geral (ordem de chegada)" : "📋 Tipo: Mensalista (prioridade)"}
            </div>
            <div>
              Contagem de pagamento a partir das <strong>{game.paymentWindowStart}</strong>, prazo de{" "}
              <strong>{game.paymentDeadlineMinutes} min</strong> para confirmação.
            </div>
          </div>
        </div>

        {(game.arenaName || game.arenaLocation) && (
          <div className="glass-card rounded-xl p-4 flex items-start gap-3">
            <span className="text-2xl">🏟️</span>
            <div className="flex-1 min-w-0">
              {game.arenaName && (
                <div className="text-white font-bold text-sm">{game.arenaName}</div>
              )}
              {game.arenaLocation && (
                <a
                  href={`https://maps.google.com/maps?q=${encodeURIComponent(game.arenaLocation)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1 mt-0.5 underline underline-offset-2 break-words"
                >
                  📍 {game.arenaLocation}
                </a>
              )}
            </div>
          </div>
        )}

        <div className="glass-card rounded-xl p-3 sm:p-4">
          <div className="flex justify-between text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-orange-400">{allPlayers.length}</div>
              <div className="text-gray-400 text-xs">Confirmados</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-400">{Math.max(0, game.maxPlayers - mainPlayers.length)}</div>
              <div className="text-gray-400 text-xs">Vagas</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-blue-400">{game.maxPlayers}</div>
              <div className="text-gray-400 text-xs">Limite</div>
            </div>
          </div>
          <div className="mt-2.5 bg-gray-700 rounded-full h-1.5">
            <div className="bg-orange-500 h-1.5 rounded-full transition-all"
              style={{ width: `${Math.min(100, (mainPlayers.length / game.maxPlayers) * 100)}%` }} />
          </div>
        </div>

        <div className="glass-card rounded-xl p-4 border-2 border-green-500/40">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold text-base">✅ Lista Principal ({mainPlayers.length}/{game.maxPlayers})</h3>
            {isAdmin && game.status === "open" && (
              <button onClick={() => setVisitorModal(true)}
                className="bg-orange-500 hover:bg-orange-400 px-2.5 py-1.5 rounded-lg text-white text-xs font-bold">
                + Visitante
              </button>
            )}
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {mainPlayers.map((p: any, i: number) => {
              const u = getUser(p);
              const uid = getUserId(p);
              const lvl = u.stats?.level ?? u.level ?? 1;
              const deadline = p.paymentType === "daily" && !p.paid ? paymentDeadline(p, game) : null;
              return (
                <div key={uid + i} className="bg-gray-700/50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 font-bold w-6 text-sm">#{i + 1}</span>
                      <span className="text-xl">{u.photo ?? "🏐"}</span>
                      <div>
                        <div className="text-white font-medium text-sm">
                          {u.name}
                          {u.role === "visitor" && <span className="text-yellow-400 text-xs ml-2">(Visitante)</span>}
                          {p.paymentType === "monthly" && <span className="text-green-400 text-xs ml-2">💰</span>}
                          {p.paymentType === "daily" && p.paid && <span className="text-green-400 text-xs ml-2">✅ Pago</span>}
                        </div>
                        <div className="text-gray-400 text-xs">{u.stats?.wins ?? 0}V / {u.stats?.losses ?? 0}D</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${LEVEL_COLORS[lvl] ?? "bg-gray-500"}`}>{lvl}</span>
                      {isAdmin && game.status === "open" && (
                        <button onClick={() => handleRemove(uid)} className="text-red-400 hover:text-red-300 p-1 text-lg">×</button>
                      )}
                    </div>
                  </div>
                  {deadline && (
                    <div className="mt-2 flex items-center justify-between gap-2 bg-yellow-500/10 border border-yellow-500/40 rounded-lg px-2.5 py-1.5">
                      <span className="text-yellow-300 text-xs">⏱ {formatRemaining(deadline)} p/ confirmar pagamento</span>
                      {isAdmin && (
                        <button onClick={() => handleConfirmPayment(uid)} disabled={saving}
                          className="bg-green-600 hover:bg-green-500 px-2.5 py-1 rounded-lg text-white text-xs font-bold whitespace-nowrap">
                          Confirmar Pagamento
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {reservePlayers.length > 0 && (
          <div className="glass-card rounded-xl p-4 border-2 border-yellow-500/40">
            <h3 className="text-white font-bold text-base mb-2">⏳ Suplentes ({reservePlayers.length})</h3>
            <div className="bg-yellow-500/10 border border-yellow-500/40 rounded-lg p-3 mb-3 text-center text-xs text-yellow-300">
              {game.type === "general"
                ? `Sobem para a lista se o pagamento de alguém expirar após as ${game.paymentWindowStart}`
                : `Diaristas entram na lista se houver vaga a partir das ${game.paymentWindowStart}`}
            </div>
            <div className="space-y-2">
              {reservePlayers.map((p: any, i: number) => {
                const u = getUser(p);
                const uid = getUserId(p);
                const lvl = u.stats?.level ?? u.level ?? 1;
                return (
                  <div key={uid + i} className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <span className="text-yellow-400 font-bold w-6 text-sm">#{i + 1}</span>
                      <span className="text-xl">{u.photo ?? "🏐"}</span>
                      <div>
                        <div className="text-white font-medium text-sm">
                          {u.name}
                          <span className="text-cyan-400 text-xs ml-2">🎫 Diarista</span>
                        </div>
                        <div className="text-gray-400 text-xs">{u.stats?.wins ?? 0}V / {u.stats?.losses ?? 0}D</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${LEVEL_COLORS[lvl] ?? "bg-gray-500"}`}>{lvl}</span>
                      {isAdmin && game.status === "open" && (
                        <button onClick={() => handleRemove(uid)} className="text-red-400 hover:text-red-300 p-1 text-lg">×</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {isAdmin && expiredPlayers.length > 0 && (
          <div className="glass-card rounded-xl p-4 border-2 border-red-500/40">
            <h3 className="text-white font-bold text-base mb-2">🚫 Vagas perdidas por falta de pagamento ({expiredPlayers.length})</h3>
            <div className="space-y-2">
              {expiredPlayers.map((p: any, i: number) => {
                const u = getUser(p);
                const uid = getUserId(p);
                return (
                  <div key={uid + i} className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl opacity-60">{u.photo ?? "🏐"}</span>
                      <div className="text-gray-300 text-sm">{u.name}</div>
                    </div>
                    {game.status === "open" && (
                      <button onClick={() => handleRemove(uid)} className="text-red-400 hover:text-red-300 p-1 text-lg">×</button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {game.status === "open" && (
          <div className="space-y-2 sm:space-y-3">
            {!userIsIn && !isAdmin && (
              <button onClick={handleJoin} disabled={saving}
                className="btn-primary w-full py-3 sm:py-4 rounded-xl text-white font-bold text-base sm:text-lg">
                + PARTICIPAR
              </button>
            )}
            {userIsIn && !isAdmin && (
              <button onClick={handleLeave} disabled={saving}
                className="w-full py-3 sm:py-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-base sm:text-lg">
                Sair do Jogo {userInReserve ? "(Suplente)" : ""}
              </button>
            )}
            {isAdmin && mainPlayers.length >= game.teamSize * 2 && (
              <button onClick={handleStart} disabled={saving}
                className="btn-primary w-full py-3 sm:py-4 rounded-xl text-white font-bold text-base sm:text-lg">
                🎯 CRIAR TIMES E INICIAR
              </button>
            )}
            {isAdmin && mainPlayers.length < game.teamSize * 2 && (
              <div className="bg-yellow-500/20 border border-yellow-500 rounded-xl p-3 text-center text-yellow-300 text-xs sm:text-sm">
                ⚠️ Mínimo de {game.teamSize * 2} jogadores para iniciar ({game.teamSize} por time)
              </div>
            )}
          </div>
        )}

        {game.status === "in_progress" && (
          <button onClick={() => { goBack(); goToPlay(); }}
            className="w-full py-3 sm:py-4 rounded-xl bg-green-500 hover:bg-green-400 text-white font-bold text-base sm:text-lg animate-pulse">
            ▶ IR PARA O JOGO
          </button>
        )}
      </div>

      {visitorModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setVisitorModal(false)} />
          <div className="relative glass-card rounded-2xl p-6 w-full max-w-md border border-white/10 z-10">
            <h2 className="text-white font-bold text-xl mb-4">👤 Adicionar Visitante</h2>
            <form onSubmit={handleAddVisitor} className="space-y-4">
              <div>
                <label className="text-white font-medium block mb-2">Nome</label>
                <input value={visitorName} onChange={(e) => setVisitorName(e.target.value)} required
                  placeholder="Ex: Carlos Oliveira"
                  className="custom-input w-full px-4 py-3 rounded-lg text-white bg-gray-800/50 border border-gray-600" />
              </div>
              <div>
                <label className="text-white font-medium block mb-2">Nível</label>
                <div className="grid grid-cols-6 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((lvl) => (
                    <button key={lvl} type="button" onClick={() => setVisitorLevel(lvl)}
                      className={`h-10 rounded-full font-bold text-white text-sm transition ${visitorLevel === lvl ? "ring-2 ring-white scale-110" : "opacity-70"} ${LEVEL_COLORS[lvl]}`}>
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setVisitorModal(false)}
                  className="flex-1 py-3 bg-gray-600 hover:bg-gray-500 rounded-lg text-white font-bold">Cancelar</button>
                <button type="submit" disabled={saving}
                  className="flex-1 btn-primary py-3 rounded-lg text-white font-bold">
                  {saving ? "Adicionando..." : "Adicionar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed top-4 right-4 left-4 sm:left-auto px-4 py-3 rounded-lg text-white z-[60] shadow-lg animate-slideIn text-sm ${
          toast.type === "error" ? "bg-red-500" : toast.type === "info" ? "bg-blue-500" : "bg-green-500"
        }`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
