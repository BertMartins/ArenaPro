"use client";
import { useEffect, useState, useCallback } from "react";
import { useNav } from "@/context/NavContext";
import Image from "next/image";

type Team = { id: string; name: string; color: string; players: any[] };
type ActiveMatch = {
  gameId: string;
  team1: Team; team2: Team;
  team1Index: number; team2Index: number;
  score1: number; score2: number;
  maxPoints: number;
  matchNumber: number;
  finished: boolean;
};

const LEVEL_COLORS: Record<number, string> = {
  1: "#6B7280", 2: "#22C55E", 3: "#004B9A",
  4: "#A855F7", 5: "#FB9A14", 6: "#EF4444",
};

export default function PlayTab() {
  const nav = useNav()!;
  const [game, setGame] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matchHistory, setMatchHistory] = useState<any[]>([]);
  const [activeMatch, setActiveMatch] = useState<ActiveMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);

  function showToast(msg: string, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  const loadGame = useCallback(async () => {
    const [gamesRes, meRes] = await Promise.all([fetch("/api/games"), fetch("/api/auth/me")]);
    if (meRes.ok) { const d = await meRes.json(); setUser(d.user); }
    if (!gamesRes.ok) { setLoading(false); return; }
    const allGames = await gamesRes.json();
    const active = allGames.find((g: any) => g.status === "in_progress");
    if (!active) { setLoading(false); return; }
    setGame(active);
    const [teamsRes, matchesRes] = await Promise.all([
      fetch(`/api/games/${active.id}/teams`),
      fetch(`/api/games/${active.id}/matches`),
    ]);
    if (teamsRes.ok) setTeams(await teamsRes.json());
    if (matchesRes.ok) setMatchHistory(await matchesRes.json());
    try {
      const saved = localStorage.getItem(`activeMatch_${active.id}`);
      if (saved) setActiveMatch(JSON.parse(saved));
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { loadGame(); }, [loadGame]);

  useEffect(() => {
    if (!game) return;
    if (activeMatch) localStorage.setItem(`activeMatch_${game.id}`, JSON.stringify(activeMatch));
    else localStorage.removeItem(`activeMatch_${game.id}`);
  }, [activeMatch, game]);

  function teamIdx(teamId: string) { return teams.findIndex((t) => t.id === teamId); }

  function checkConsecutiveWins(winnerIndex: number, count: number): boolean {
    if (matchHistory.length < count) return false;
    for (let i = 0; i < count; i++) {
      const m = matchHistory[matchHistory.length - 1 - i];
      const winIdx = m.score1 > m.score2 ? teamIdx(m.team1Id) : teamIdx(m.team2Id);
      if (winIdx !== winnerIndex) return false;
    }
    return true;
  }

  function getNextMatchTeams(): { t1: Team; t1i: number; t2: Team; t2i: number } | null {
    if (teams.length < 2) return null;
    if (matchHistory.length === 0) return { t1: teams[0], t1i: 0, t2: teams[1], t2i: 1 };
    const last = matchHistory[matchHistory.length - 1];
    const t1i = teamIdx(last.team1Id); const t2i = teamIdx(last.team2Id);
    const winnerIdx = last.score1 > last.score2 ? t1i : t2i;
    const loserIdx  = last.score1 > last.score2 ? t2i : t1i;
    if (teams.length === 2) return { t1: teams[0], t1i: 0, t2: teams[1], t2i: 1 };
    if (teams.length === 3) {
      const nextIdx = [0,1,2].find((i) => i !== winnerIdx && i !== loserIdx)!;
      return { t1: teams[winnerIdx], t1i: winnerIdx, t2: teams[nextIdx], t2i: nextIdx };
    }
    if (teams.length === 4) {
      const outTeams = [0,1,2,3].filter((i) => i !== t1i && i !== t2i);
      const twoWins = game?.twoWinsRule && checkConsecutiveWins(winnerIdx, 2);
      if (twoWins) return { t1: teams[outTeams[0]], t1i: outTeams[0], t2: teams[outTeams[1]], t2i: outTeams[1] };
      return { t1: teams[winnerIdx], t1i: winnerIdx, t2: teams[outTeams[0]], t2i: outTeams[0] };
    }
    return null;
  }

  function handleStartMatch() {
    const next = getNextMatchTeams();
    if (!next || !game) return;
    setActiveMatch({
      gameId: game.id,
      team1: next.t1, team2: next.t2,
      team1Index: next.t1i, team2Index: next.t2i,
      score1: 0, score2: 0,
      maxPoints: game.pointsPerMatch ?? 25,
      matchNumber: matchHistory.length + 1,
      finished: false,
    });
    showToast("Partida iniciada! Boa sorte");
  }

  async function updateScore(team: 1 | 2, delta: number) {
    if (!activeMatch || activeMatch.finished) return;
    const updated = { ...activeMatch };
    if (team === 1) updated.score1 = Math.max(0, updated.score1 + delta);
    else updated.score2 = Math.max(0, updated.score2 + delta);
    const { score1, score2, maxPoints } = updated;
    const w1 = score1 >= maxPoints && score1 - score2 >= 2;
    const w2 = score2 >= maxPoints && score2 - score1 >= 2;
    if (w1 || w2) {
      updated.finished = true;
      setActiveMatch(updated);
      await saveMatch(updated);
      showToast(`Time ${w1 ? updated.team1.name : updated.team2.name} venceu!`);
    } else {
      setActiveMatch(updated);
    }
  }

  async function saveMatch(m: ActiveMatch) {
    if (!game) return;
    setSaving(true);
    try {
      await fetch(`/api/games/${game.id}/matches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchNumber: m.matchNumber,
          team1Id: m.team1.id, team2Id: m.team2.id,
          team1Index: m.team1Index, team2Index: m.team2Index,
          score1: m.score1, score2: m.score2,
          winner: m.score1 > m.score2 ? m.team1.name : m.team2.name,
        }),
      });
      await loadGame();
    } finally {
      setSaving(false);
    }
  }

  async function handleNextMatch() {
    setActiveMatch(null);
    setTimeout(handleStartMatch, 100);
  }

  async function handleFinishGame() {
    if (!game) return;
    if (!confirm("Finalizar o jogo? Esta ação não pode ser desfeita.")) return;
    setSaving(true);
    await fetch(`/api/games/${game.id}/finish`, { method: "POST" });
    localStorage.removeItem(`activeMatch_${game.id}`);
    setSaving(false);
    showToast("Jogo finalizado!");
    setTimeout(() => nav.setTab("home"), 1500);
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: "#FB6600", borderTopColor: "transparent" }} />
    </div>
  );

  if (!game || teams.length === 0) return (
    <div className="pb-24 p-4 max-w-2xl mx-auto animate-fadeIn">
      <div
        className="rounded-2xl p-8 sm:p-10 text-center mt-8"
        style={{ background: "rgba(0,26,70,0.6)", border: "1px solid rgba(2,115,208,0.2)" }}
      >
        <div className="animate-bounceSoft inline-block mb-4">
          <Image src="/logo.png" alt="Bolinha Club" width={64} height={64} className="opacity-60" />
        </div>
        <h3 className="text-white text-lg sm:text-xl font-bold mb-2">Nenhum Jogo em Andamento</h3>
        <p className="text-sm mb-6" style={{ color: "#5A6F8D" }}>Crie times a partir de um jogo para começar</p>
        <button
          onClick={() => nav.setTab("home")}
          className="btn-primary px-6 py-3 rounded-xl text-white font-bold"
        >
          <i className="fas fa-home mr-2" /> Ir para Jogos
        </button>
      </div>
    </div>
  );

  const isAdmin = user?.role === "admin";
  const teamWins: Record<string, number> = {};
  matchHistory.forEach((m) => { teamWins[m.winner] = (teamWins[m.winner] || 0) + 1; });

  return (
    <div className="pb-24 animate-fadeIn max-w-2xl mx-auto">

      {/* HEADER */}
      <div
        className="p-4 sm:p-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #001A46 0%, #004B9A 65%, #0273D0 100%)",
          borderBottom: "2px solid rgba(34,197,94,0.5)"
        }}
      >
        <div style={{
          position: "absolute", top: "-30px", right: "-20px",
          width: 140, height: 140, borderRadius: "50%",
          background: "rgba(34,197,94,0.08)", pointerEvents: "none"
        }} />
        <div className="flex items-center gap-3 relative z-10">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "rgba(34,197,94,0.2)", border: "2px solid rgba(34,197,94,0.5)" }}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse block" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wider">JOGO EM ANDAMENTO</h1>
            <p className="text-xs" style={{ color: "#5A6F8D" }}>
              <i className="fas fa-calendar-days mr-1" />
              {new Date(game.date.slice(0, 10) + "T12:00:00Z").toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{ background: "linear-gradient(90deg, transparent, #22C55E, #4ADE80, transparent)" }}
        />
      </div>

      <div className="p-3 sm:p-5 space-y-4">

        {/* PLACAR ATIVO */}
        {activeMatch && (
          <div className="glass-card rounded-2xl p-4 sm:p-5">
            <div className="text-center mb-4">
              <h3 className="text-white font-black text-base sm:text-lg">
                Partida #{activeMatch.matchNumber}
              </h3>
              <div className="text-xs mt-0.5" style={{ color: "#5A6F8D" }}>
                Até {activeMatch.maxPoints} pontos (diferença de 2)
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Time 1 */}
              <div className="text-center">
                <div
                  className="inline-block px-3 py-1.5 rounded-full text-white font-bold mb-3 text-xs sm:text-sm"
                  style={{ background: activeMatch.team1.color, boxShadow: `0 0 12px ${activeMatch.team1.color}66` }}
                >
                  {activeMatch.team1.name}
                </div>
                <div
                  className="text-6xl sm:text-7xl font-black mb-3"
                  style={{ color: activeMatch.score1 > activeMatch.score2 ? "#FB9A14" : "#FDFDFD" }}
                >
                  {activeMatch.score1}
                </div>
                {isAdmin && !activeMatch.finished && (
                  <div className="flex gap-2 justify-center">
                    <button onClick={() => updateScore(1, -1)}
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-full font-black text-xl text-white transition"
                      style={{ background: "rgba(239,68,68,0.8)" }}>−</button>
                    <button onClick={() => updateScore(1, 1)}
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-full font-black text-xl text-white transition"
                      style={{ background: "rgba(34,197,94,0.8)" }}>+</button>
                  </div>
                )}
              </div>
              {/* Time 2 */}
              <div className="text-center">
                <div
                  className="inline-block px-3 py-1.5 rounded-full text-white font-bold mb-3 text-xs sm:text-sm"
                  style={{ background: activeMatch.team2.color, boxShadow: `0 0 12px ${activeMatch.team2.color}66` }}
                >
                  {activeMatch.team2.name}
                </div>
                <div
                  className="text-6xl sm:text-7xl font-black mb-3"
                  style={{ color: activeMatch.score2 > activeMatch.score1 ? "#FB9A14" : "#FDFDFD" }}
                >
                  {activeMatch.score2}
                </div>
                {isAdmin && !activeMatch.finished && (
                  <div className="flex gap-2 justify-center">
                    <button onClick={() => updateScore(2, -1)}
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-full font-black text-xl text-white transition"
                      style={{ background: "rgba(239,68,68,0.8)" }}>−</button>
                    <button onClick={() => updateScore(2, 1)}
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-full font-black text-xl text-white transition"
                      style={{ background: "rgba(34,197,94,0.8)" }}>+</button>
                  </div>
                )}
              </div>
            </div>

            {activeMatch.finished && (
              <div className="text-center pt-2 border-t" style={{ borderColor: "rgba(251,154,20,0.3)" }}>
                <div className="text-4xl mb-2">🏆</div>
                <div className="font-black text-lg sm:text-xl mb-4" style={{ color: "#FB9A14" }}>
                  Time {activeMatch.score1 > activeMatch.score2 ? activeMatch.team1.name : activeMatch.team2.name} Venceu!
                </div>
                {isAdmin && (
                  <button
                    onClick={handleNextMatch}
                    className="btn-primary px-6 py-3 rounded-xl text-white font-bold"
                  >
                    <i className="fas fa-forward mr-2" /> Próxima Partida
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* TIMES */}
        {teams.map((team, idx) => (
          <div
            key={team.id}
            className="rounded-2xl overflow-hidden"
            style={{
              background: "rgba(0,26,70,0.6)",
              border: "1px solid rgba(2,115,208,0.2)"
            }}
          >
            <div
              className="p-3 sm:p-4 text-white flex items-center justify-between"
              style={{
                background: `linear-gradient(135deg, ${team.color}cc, ${team.color}66)`,
                borderBottom: `1px solid ${team.color}44`
              }}
            >
              <div>
                <h3 className="font-black text-base sm:text-lg flex items-center gap-2">
                  <i className="fas fa-shield-halved" />
                  Time {team.name}
                </h3>
                {team.players.length > 0 && (
                  <p className="text-white/70 text-xs mt-0.5">
                    Nível médio: {(team.players.reduce((s: number, p: any) => s + (p.user?.stats?.level ?? p.user?.level ?? 1), 0) / team.players.length).toFixed(1)}
                  </p>
                )}
              </div>
              {/* Vitórias */}
              {matchHistory.length > 0 && (
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-black text-lg text-white"
                  style={{ background: "rgba(0,0,0,0.3)" }}
                >
                  {teamWins[team.name] ?? 0}
                </div>
              )}
            </div>

            <div className="p-3 sm:p-4 space-y-2.5">
              {team.players.map((p: any) => {
                const u = p.user;
                const lvl = u?.stats?.level ?? u?.level ?? 1;
                return (
                  <div key={p.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-lg sm:text-xl">{u?.photo ?? "🏐"}</span>
                      <div>
                        <div className="text-white font-semibold text-sm">{u?.name}</div>
                        <div className="text-xs" style={{ color: "#5A6F8D" }}>
                          {u?.stats?.wins ?? 0}V / {u?.stats?.losses ?? 0}D
                        </div>
                      </div>
                    </div>
                    <div
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                      style={{ background: LEVEL_COLORS[lvl] ?? "#6B7280", boxShadow: `0 0 8px ${LEVEL_COLORS[lvl]}66` }}
                    >
                      {lvl}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* HISTÓRICO */}
        {matchHistory.length > 0 && (
          <div className="glass-card rounded-2xl p-4 sm:p-5">
            <h3 className="text-white font-bold text-base mb-3 flex items-center gap-2">
              <i className="fas fa-clock-rotate-left" style={{ color: "#FB6600" }} />
              Histórico ({matchHistory.length} partida{matchHistory.length > 1 ? "s" : ""})
            </h3>

            {/* Placar geral */}
            <div className="space-y-2 mb-4">
              {teams.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between rounded-xl p-2.5"
                  style={{ background: "rgba(0,26,70,0.5)", border: "1px solid rgba(2,115,208,0.15)" }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-full" style={{ background: t.color, boxShadow: `0 0 6px ${t.color}88` }} />
                    <span className="text-white font-bold text-sm">{t.name}</span>
                  </div>
                  <span className="text-xl font-black text-green-400">{teamWins[t.name] ?? 0}</span>
                </div>
              ))}
            </div>

            {/* Lista de partidas */}
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {[...matchHistory].reverse().map((m: any) => (
                <div
                  key={m.id}
                  className="rounded-xl p-2.5"
                  style={{ background: "rgba(0,26,70,0.4)", border: "1px solid rgba(2,115,208,0.1)" }}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs" style={{ color: "#5A6F8D" }}>Partida #{m.matchNumber}</span>
                    <span className="text-xs font-bold" style={{ color: "#FB9A14" }}>
                      <i className="fas fa-trophy mr-1" />{m.winner}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 items-center text-center">
                    <div>
                      <div className="text-white font-bold text-xs">{m.team1Name ?? "Time 1"}</div>
                      <div className={`text-xl font-black ${m.score1 > m.score2 ? "text-green-400" : "text-gray-500"}`}>{m.score1}</div>
                    </div>
                    <div className="font-bold text-sm" style={{ color: "#5A6F8D" }}>×</div>
                    <div>
                      <div className="text-white font-bold text-xs">{m.team2Name ?? "Time 2"}</div>
                      <div className={`text-xl font-black ${m.score2 > m.score1 ? "text-green-400" : "text-gray-500"}`}>{m.score2}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AÇÕES ADMIN */}
        {isAdmin && (
          <div className="space-y-3">
            {!activeMatch && (
              <button
                onClick={handleStartMatch}
                disabled={saving}
                className="btn-primary w-full py-4 rounded-2xl text-white font-black text-base tracking-wide flex items-center justify-center gap-2"
              >
                <i className="fas fa-play-circle text-lg" />
                {matchHistory.length === 0 ? "INICIAR PRIMEIRA PARTIDA" : "INICIAR PRÓXIMA PARTIDA"}
              </button>
            )}
            <button
              onClick={handleFinishGame}
              disabled={saving}
              className="w-full py-3.5 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 transition"
              style={{
                background: "rgba(239,68,68,0.8)",
                border: "1px solid rgba(239,68,68,0.5)"
              }}
            >
              <i className="fas fa-flag-checkered" /> FINALIZAR JOGO
            </button>
          </div>
        )}
      </div>

      {/* TOAST */}
      {toast && (
        <div
          className="fixed top-4 right-4 left-4 sm:left-auto px-5 py-3 rounded-xl text-white z-[60] shadow-2xl animate-slideIn font-semibold"
          style={{
            background: toast.type === "error"
              ? "#EF4444"
              : "linear-gradient(135deg,#FB6600,#FB9A14)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)"
          }}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
