"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

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
  1: "bg-gray-500", 2: "bg-green-500", 3: "bg-blue-500",
  4: "bg-purple-500", 5: "bg-yellow-500", 6: "bg-red-500",
};

export default function PlayPage() {
  const router = useRouter();
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
    const [gamesRes, meRes] = await Promise.all([
      fetch("/api/games"),
      fetch("/api/auth/me"),
    ]);

    if (meRes.ok) {
      const d = await meRes.json();
      setUser(d.user);
    }

    if (!gamesRes.ok) { setLoading(false); return; }
    const allGames = await gamesRes.json();
    const active = allGames.find((g: any) => g.status === "in_progress");

    if (!active) { setLoading(false); return; }
    setGame(active);

    // Load teams and matches
    const [teamsRes, matchesRes] = await Promise.all([
      fetch(`/api/games/${active.id}/teams`),
      fetch(`/api/games/${active.id}/matches`),
    ]);

    if (teamsRes.ok) {
      const t = await teamsRes.json();
      setTeams(t);
    }
    if (matchesRes.ok) {
      const m = await matchesRes.json();
      setMatchHistory(m);
    }

    // Restore active match from localStorage
    try {
      const saved = localStorage.getItem(`activeMatch_${active.id}`);
      if (saved) setActiveMatch(JSON.parse(saved));
    } catch {}

    setLoading(false);
  }, []);

  useEffect(() => { loadGame(); }, [loadGame]);

  // Persist active match
  useEffect(() => {
    if (!game) return;
    if (activeMatch) {
      localStorage.setItem(`activeMatch_${game.id}`, JSON.stringify(activeMatch));
    } else {
      localStorage.removeItem(`activeMatch_${game.id}`);
    }
  }, [activeMatch, game]);

  // Resolve team index from team ID (since DB doesn't store team1Index/team2Index)
  function teamIdx(teamId: string): number {
    return teams.findIndex((t) => t.id === teamId);
  }

  function checkConsecutiveWins(winnerIndex: number, count: number): boolean {
    if (matchHistory.length < count) return false;
    for (let i = 0; i < count; i++) {
      const m = matchHistory[matchHistory.length - 1 - i];
      const t1i = teamIdx(m.team1Id);
      const t2i = teamIdx(m.team2Id);
      const winIdx = m.score1 > m.score2 ? t1i : t2i;
      if (winIdx !== winnerIndex) return false;
    }
    return true;
  }

  function getNextMatchTeams(): { t1: Team; t1i: number; t2: Team; t2i: number } | null {
    if (teams.length < 2) return null;
    if (matchHistory.length === 0) {
      return { t1: teams[0], t1i: 0, t2: teams[1], t2i: 1 };
    }

    const last = matchHistory[matchHistory.length - 1];
    const t1i = teamIdx(last.team1Id);
    const t2i = teamIdx(last.team2Id);
    const winnerIdx = last.score1 > last.score2 ? t1i : t2i;
    const loserIdx = last.score1 > last.score2 ? t2i : t1i;

    if (teams.length === 2) {
      return { t1: teams[0], t1i: 0, t2: teams[1], t2i: 1 };
    }

    if (teams.length === 3) {
      const nextIdx = [0, 1, 2].find((i) => i !== winnerIdx && i !== loserIdx)!;
      return { t1: teams[winnerIdx], t1i: winnerIdx, t2: teams[nextIdx], t2i: nextIdx };
    }

    if (teams.length === 4) {
      const playingNow = [t1i, t2i];
      const outTeams = [0, 1, 2, 3].filter((i) => !playingNow.includes(i));
      const twoWins = game?.twoWinsRule && checkConsecutiveWins(winnerIdx, 2);

      if (twoWins) {
        return { t1: teams[outTeams[0]], t1i: outTeams[0], t2: teams[outTeams[1]], t2i: outTeams[1] };
      } else {
        return { t1: teams[winnerIdx], t1i: winnerIdx, t2: teams[outTeams[0]], t2i: outTeams[0] };
      }
    }

    return null;
  }

  function handleStartMatch() {
    const next = getNextMatchTeams();
    if (!next || !game) return;
    const newMatch: ActiveMatch = {
      gameId: game.id,
      team1: next.t1, team2: next.t2,
      team1Index: next.t1i, team2Index: next.t2i,
      score1: 0, score2: 0,
      maxPoints: game.pointsPerMatch ?? 25,
      matchNumber: matchHistory.length + 1,
      finished: false,
    };
    setActiveMatch(newMatch);
    showToast("Partida iniciada! Boa sorte 🏐");
  }

  async function updateScore(team: 1 | 2, delta: number) {
    if (!activeMatch || activeMatch.finished) return;

    const updated = { ...activeMatch };
    if (team === 1) updated.score1 = Math.max(0, updated.score1 + delta);
    else updated.score2 = Math.max(0, updated.score2 + delta);

    const { score1, score2, maxPoints } = updated;
    const winner1 = score1 >= maxPoints && score1 - score2 >= 2;
    const winner2 = score2 >= maxPoints && score2 - score1 >= 2;

    if (winner1 || winner2) {
      updated.finished = true;
      setActiveMatch(updated);
      await saveMatch(updated);
      showToast(`Time ${winner1 ? updated.team1.name : updated.team2.name} venceu! 🏆`);
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
    showToast("Jogo finalizado! 🏆");
    setTimeout(() => router.push("/dashboard"), 1500);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!game || teams.length === 0) {
    return (
      <div className="pb-24 p-6">
        <div className="glass-card rounded-xl p-8 text-center mt-8">
          <div className="text-6xl mb-4">🏐</div>
          <h3 className="text-white text-xl font-bold mb-2">Nenhum Jogo em Andamento</h3>
          <p className="text-gray-400 mb-6">Crie times a partir de um jogo para começar</p>
          <button onClick={() => router.push("/dashboard")} className="btn-primary px-6 py-3 rounded-lg text-white font-bold">
            Ir para Jogos
          </button>
        </div>
        <BottomNav active="play" />
      </div>
    );
  }

  const isAdmin = user?.role === "admin";

  // Contagem de vitórias por time
  const teamWins: Record<string, number> = {};
  matchHistory.forEach((m) => {
    teamWins[m.winner] = (teamWins[m.winner] || 0) + 1;
  });

  return (
    <div className="pb-24 animate-fadeIn">
      {/* Header */}
      <div className="p-6" style={{ background: "linear-gradient(135deg, #ff7a18, #ff9e32)" }}>
        <h1 className="text-3xl font-black text-white tracking-wider">⚡ JOGO EM ANDAMENTO</h1>
        <p className="text-orange-100">📅 {new Date(game.date).toLocaleDateString("pt-BR")}</p>
      </div>

      <div className="p-6 space-y-5">
        {/* Partida atual */}
        {activeMatch && (
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-white font-bold text-lg mb-4 text-center">🏐 Partida #{activeMatch.matchNumber}</h3>
            <div className="text-center text-gray-400 text-xs mb-4">Até {activeMatch.maxPoints} pontos (diff. 2)</div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Time 1 */}
              <div className="text-center">
                <div className="inline-block px-4 py-2 rounded-full text-white font-bold mb-3 text-sm"
                  style={{ background: activeMatch.team1.color }}>
                  {activeMatch.team1.name}
                </div>
                <div className="text-6xl font-black text-white mb-3">{activeMatch.score1}</div>
                {isAdmin && !activeMatch.finished && (
                  <div className="flex gap-2 justify-center">
                    <button onClick={() => updateScore(1, -1)}
                      className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-400 text-white font-bold text-xl">−</button>
                    <button onClick={() => updateScore(1, 1)}
                      className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-400 text-white font-bold text-xl">+</button>
                  </div>
                )}
              </div>
              {/* Time 2 */}
              <div className="text-center">
                <div className="inline-block px-4 py-2 rounded-full text-white font-bold mb-3 text-sm"
                  style={{ background: activeMatch.team2.color }}>
                  {activeMatch.team2.name}
                </div>
                <div className="text-6xl font-black text-white mb-3">{activeMatch.score2}</div>
                {isAdmin && !activeMatch.finished && (
                  <div className="flex gap-2 justify-center">
                    <button onClick={() => updateScore(2, -1)}
                      className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-400 text-white font-bold text-xl">−</button>
                    <button onClick={() => updateScore(2, 1)}
                      className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-400 text-white font-bold text-xl">+</button>
                  </div>
                )}
              </div>
            </div>
            {activeMatch.finished && (
              <div className="text-center py-4">
                <div className="text-4xl mb-2">🏆</div>
                <div className="text-yellow-400 font-bold text-xl mb-3">
                  Time {activeMatch.score1 > activeMatch.score2 ? activeMatch.team1.name : activeMatch.team2.name} Venceu!
                </div>
                {isAdmin && (
                  <button onClick={handleNextMatch} className="btn-primary px-6 py-3 rounded-lg text-white font-bold">
                    Próxima Partida →
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Times */}
        {teams.map((team, idx) => (
          <div key={team.id} className="glass-card rounded-xl overflow-hidden"
            style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className="p-4 text-white" style={{ background: `${team.color}cc` }}>
              <h3 className="font-bold text-lg">🛡 Time {team.name}</h3>
              {team.players.length > 0 && (
                <p className="text-white/80 text-sm">
                  Nível médio: {(team.players.reduce((s: number, p: any) => s + (p.user?.stats?.level ?? p.user?.level ?? 1), 0) / team.players.length).toFixed(1)}
                </p>
              )}
            </div>
            <div className="p-4 space-y-3">
              {team.players.map((p: any) => {
                const u = p.user;
                const lvl = u?.stats?.level ?? u?.level ?? 1;
                return (
                  <div key={p.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{u?.photo ?? "🏐"}</span>
                      <div>
                        <div className="text-white font-medium text-sm">{u?.name}</div>
                        <div className="text-gray-400 text-xs">{u?.stats?.wins ?? 0}V / {u?.stats?.losses ?? 0}D</div>
                      </div>
                    </div>
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${LEVEL_COLORS[lvl] ?? "bg-gray-500"}`}>
                      {lvl}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Histórico */}
        {matchHistory.length > 0 && (
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-white font-bold text-lg mb-4">📜 Histórico ({matchHistory.length} partida{matchHistory.length > 1 ? "s" : ""})</h3>

            {/* Placar geral */}
            <div className="space-y-2 mb-4">
              {teams.map((t) => (
                <div key={t.id} className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ background: t.color }} />
                    <span className="text-white font-bold">{t.name}</span>
                  </div>
                  <span className="text-2xl font-bold text-green-400">{teamWins[t.name] ?? 0}</span>
                </div>
              ))}
            </div>

            {/* Lista */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {[...matchHistory].reverse().map((m: any) => (
                <div key={m.id} className="bg-gray-700/50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-400 text-xs">Partida #{m.matchNumber}</span>
                    <span className="text-yellow-400 text-xs">🏆 {m.winner}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center text-center">
                    <div>
                      <div className="text-white font-bold text-sm">{m.team1Name ?? "Time 1"}</div>
                      <div className={`text-2xl font-bold ${m.score1 > m.score2 ? "text-green-400" : "text-gray-500"}`}>{m.score1}</div>
                    </div>
                    <div className="text-gray-500 font-bold">×</div>
                    <div>
                      <div className="text-white font-bold text-sm">{m.team2Name ?? "Time 2"}</div>
                      <div className={`text-2xl font-bold ${m.score2 > m.score1 ? "text-green-400" : "text-gray-500"}`}>{m.score2}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ações admin */}
        {isAdmin && (
          <div className="space-y-3">
            {!activeMatch && (
              <button
                onClick={handleStartMatch}
                disabled={saving}
                className="btn-primary w-full py-4 rounded-xl text-white font-bold text-lg animate-pulse"
              >
                ▶ {matchHistory.length === 0 ? "INICIAR PRIMEIRA PARTIDA" : "INICIAR PRÓXIMA PARTIDA"}
              </button>
            )}
            <button
              onClick={handleFinishGame}
              disabled={saving}
              className="w-full py-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-lg"
            >
              🏁 FINALIZAR JOGO
            </button>
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

      <BottomNav active="play" />
    </div>
  );
}
