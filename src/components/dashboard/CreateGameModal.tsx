"use client";

import { useState } from "react";

export default function CreateGameModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"game" | "payment">("game");
  const [gameType, setGameType] = useState<"monthly_priority" | "general">("monthly_priority");

  if (!open) return null;

  async function handleCreate(e: any) {
    e.preventDefault();
    setLoading(true);

    try {
      const form = e.target;

      const payload = {
        date: form.date.value,
        maxPlayers: Number(form.maxPlayers.value),
        teamSize: Number(form.teamSize.value),
        pointsPerMatch: Number(form.pointsPerMatch.value),
        twoWinsRule: form.twoWinsRule.checked,
        type: gameType,
        paymentWindowStart: form.paymentWindowStart.value,
        paymentDeadlineMinutes: Number(form.paymentDeadlineMinutes.value),
        arenaName: form.arenaName.value.trim() || undefined,
        arenaLocation: form.arenaLocation.value.trim() || undefined,
      };

      const res = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Erro ao criar jogo");
      } else {
        onCreated();
      }
    } catch (err) {
      console.error(err);
      alert("Erro interno");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-fadeIn">
      {/* FUNDO */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* CARD */}
      <div className="relative w-full max-w-lg bg-neutral-900 rounded-2xl p-6 shadow-2xl z-10 border border-white/10 animate-scaleIn">
        <h3 className="text-xl font-bold text-white mb-4">Criar Novo Jogo</h3>

        {/* TABS */}
        <div className="flex gap-2 mb-4 border-b border-white/10">
          <button
            type="button"
            onClick={() => setTab("game")}
            className={`px-3 py-2 text-sm font-bold transition border-b-2 ${
              tab === "game" ? "text-orange-400 border-orange-400" : "text-gray-400 border-transparent hover:text-white"
            }`}
          >
            Jogo
          </button>
          <button
            type="button"
            onClick={() => setTab("payment")}
            className={`px-3 py-2 text-sm font-bold transition border-b-2 ${
              tab === "payment" ? "text-orange-400 border-orange-400" : "text-gray-400 border-transparent hover:text-white"
            }`}
          >
            Configurações de Pagamento
          </button>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          {/* ABA: JOGO */}
          <div className={tab === "game" ? "space-y-4" : "hidden"}>
            {/* DATA */}
            <div>
              <label className="text-sm text-gray-300 block mb-1">Data do Jogo</label>
              <input
                name="date"
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                className="w-full p-2 rounded bg-gray-800 text-white border border-white/10 focus:border-orange-400 focus:ring-2 focus:ring-orange-500 transition"
              />
            </div>

            {/* MAX JOGADORES */}
            <div>
              <label className="text-sm text-gray-300 block mb-1">Máximo de Jogadores</label>
              <input
                name="maxPlayers"
                type="number"
                required
                min={2}
                defaultValue={16}
                className="w-full p-2 rounded bg-gray-800 text-white border border-white/10 focus:border-orange-400 focus:ring-2 focus:ring-orange-500 transition"
              />
            </div>

            {/* TIME SIZE */}
            <div>
              <label className="text-sm text-gray-300 block mb-1">Jogadores por Time</label>
              <select
                name="teamSize"
                defaultValue="2"
                className="w-full p-2 rounded bg-gray-800 text-white border border-white/10 focus:border-orange-400 focus:ring-2 focus:ring-orange-500 transition"
              >
                <option value="2">2 vs 2</option>
                <option value="3">3 vs 3</option>
                <option value="4">4 vs 4</option>
              </select>
            </div>

            {/* PONTOS */}
            <div>
              <label className="text-sm text-gray-300 block mb-1">Pontos por Partida</label>
              <input
                name="pointsPerMatch"
                type="number"
                required
                min={5}
                defaultValue={25}
                className="w-full p-2 rounded bg-gray-800 text-white border border-white/10 focus:border-orange-400 focus:ring-2 focus:ring-orange-500 transition"
              />
            </div>

            {/* 2 WINS RULE */}
            <div className="flex items-center gap-2">
              <input type="checkbox" name="twoWinsRule" defaultChecked />
              <label className="text-sm text-gray-300">Regra de 2 vitórias?</label>
            </div>

            {/* ARENA */}
            <div className="border-t border-white/10 pt-4 space-y-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">Arena (opcional)</p>
              <div>
                <label className="text-sm text-gray-300 block mb-1">Nome da Arena</label>
                <input
                  name="arenaName"
                  type="text"
                  placeholder="Ex: Arena Bolinha Club"
                  className="w-full p-2 rounded bg-gray-800 text-white border border-white/10 focus:border-orange-400 focus:ring-2 focus:ring-orange-500 transition"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 block mb-1">Localidade</label>
                <input
                  name="arenaLocation"
                  type="text"
                  placeholder="Ex: Rua das Flores 123, São Paulo"
                  className="w-full p-2 rounded bg-gray-800 text-white border border-white/10 focus:border-orange-400 focus:ring-2 focus:ring-orange-500 transition"
                />
                <p className="text-gray-500 text-xs mt-1">
                  Os jogadores poderão clicar para abrir no mapa.
                </p>
              </div>
            </div>
          </div>

          {/* ABA: PAGAMENTO */}
          <div className={tab === "payment" ? "space-y-4" : "hidden"}>
            <div>
              <label className="text-sm text-gray-300 block mb-2">Tipo de Jogo</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGameType("monthly_priority")}
                  className={`text-left p-3 rounded-lg border-2 transition ${
                    gameType === "monthly_priority"
                      ? "border-orange-400 bg-orange-500/20"
                      : "border-white/10 bg-gray-800 hover:border-white/30"
                  }`}
                >
                  <div className="text-white font-bold text-sm">Mensalista</div>
                  <div className="text-gray-400 text-xs mt-1">
                    Mensalistas entram direto na lista. Diaristas ficam suplentes e só sobem se houver vaga, a partir do horário abaixo.
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setGameType("general")}
                  className={`text-left p-3 rounded-lg border-2 transition ${
                    gameType === "general"
                      ? "border-orange-400 bg-orange-500/20"
                      : "border-white/10 bg-gray-800 hover:border-white/30"
                  }`}
                >
                  <div className="text-white font-bold text-sm">Geral</div>
                  <div className="text-gray-400 text-xs mt-1">
                    Quem se inscrever primeiro entra na lista, independente do tipo de pagamento.
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-300 block mb-1">Horário de início da contagem</label>
              <input
                name="paymentWindowStart"
                type="time"
                required
                defaultValue="12:00"
                className="w-full p-2 rounded bg-gray-800 text-white border border-white/10 focus:border-orange-400 focus:ring-2 focus:ring-orange-500 transition"
              />
              <p className="text-gray-500 text-xs mt-1">
                A partir desse horário no dia do jogo, suplentes diaristas podem subir (se houver vaga) e o prazo de pagamento começa a contar.
              </p>
            </div>

            <div>
              <label className="text-sm text-gray-300 block mb-1">Prazo para confirmar pagamento (minutos)</label>
              <input
                name="paymentDeadlineMinutes"
                type="number"
                required
                min={5}
                defaultValue={60}
                className="w-full p-2 rounded bg-gray-800 text-white border border-white/10 focus:border-orange-400 focus:ring-2 focus:ring-orange-500 transition"
              />
              <p className="text-gray-500 text-xs mt-1">
                Diarista que entrar na lista principal tem esse tempo para o admin confirmar o pagamento. Se expirar, a vaga libera para o próximo suplente.
              </p>
            </div>
          </div>

          {/* BOTÕES */}
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 rounded bg-orange-500 hover:bg-orange-400 text-white font-bold transition disabled:opacity-50"
            >
              {loading ? "Criando..." : "Criar Jogo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
