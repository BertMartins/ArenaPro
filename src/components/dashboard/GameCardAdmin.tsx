"use client";

export default function GameCardAdmin({ game, onUpdate }: { game: any; onUpdate: () => void; }) {
  async function handleJoin() {
    const res = await fetch(`/api/games/${game.id}/join`, { method: "POST" });
    const data = await res.json();
    if (!res.ok) return alert(data.error || "Erro ao entrar");
    alert("Participação confirmada");
    onUpdate();
  }

  async function handleFinish() {
    if (!confirm("Finalizar jogo?")) return;
    const res = await fetch(`/api/games/${game.id}/finish`, { method: "POST" });
    if (res.ok) {
      alert("Jogo finalizado");
      onUpdate();
    } else {
      const data = await res.json();
      alert(data.error || "Erro");
    }
  }

  const date = new Date(game.date).toLocaleDateString("pt-BR");
  const playersCount = game.players?.length ?? 0;
  const percent = Math.round((playersCount / game.maxPlayers) * 100);

  return (
    <div className="glass-card p-4 rounded-xl flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-bold text-white">{date}</div>
          <div className="text-sm text-gray-400 flex items-center gap-2 mt-1">
            <span className="text-gray-300">👥</span>
            {playersCount}/{game.maxPlayers} jogadores
          </div>
        </div>

        <div className="text-2xl">🏐</div>
      </div>

      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-400" style={{ width: `${percent}%` }} />
      </div>

      <div className="flex gap-3 items-center">
        <button onClick={handleJoin} className="flex-1 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold">＋ PARTICIPAR</button>

        <button onClick={() => window.location.href = `/dashboard/game/${game.id}`} className="w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center">👁️</button>

        <button onClick={handleFinish} className="w-12 h-12 rounded-lg bg-red-600 text-white flex items-center justify-center">⏹</button>
      </div>
    </div>
  );
}
