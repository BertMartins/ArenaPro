"use client";

export default function GameCardPlayer({
  game,
  userId,
  onUpdate,
}: {
  game: any;
  userId: string | null;
  onUpdate: () => void;
}) {
  const date = new Date(game.date).toLocaleDateString("pt-BR");
  const playersCount = game.players?.length ?? 0;
  const percent = Math.round((playersCount / game.maxPlayers) * 100);
  const isInGame = userId ? game.players.some((p: any) => p.userId === userId) : false;

  async function join() {
    const res = await fetch(`/api/games/${game.id}/join`, { method: "POST" });
    const data = await res.json();
    if (!res.ok) return alert(data.error || "Erro ao entrar");
    alert("Você entrou no jogo!");
    onUpdate();
  }

  async function leave() {
    const res = await fetch(`/api/games/${game.id}/leave`, { method: "POST" });
    const data = await res.json();
    if (!res.ok) return alert(data.error || "Erro ao sair");
    alert("Você saiu do jogo.");
    onUpdate();
  }

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
        {!isInGame ? (
          <button onClick={join} className="flex-1 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold">👥 PARTICIPAR</button>
        ) : (
          <button onClick={leave} className="flex-1 py-3 rounded-lg bg-red-600 text-white font-bold">❌ SAIR</button>
        )}

        <button onClick={() => (window.location.href = `/player/game/${game.id}`)} className="w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center">👁️</button>
      </div>
    </div>
  );
}
