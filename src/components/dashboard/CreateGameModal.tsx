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
      };

      const res = await fetch("/api/games", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Erro ao criar jogo");
      } else {
        onCreated();
      }
    } catch (e) {
      console.error(e);
      alert("Erro interno");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-neutral-900 rounded-2xl p-6 glass-card shadow-2xl z-10">
        <h3 className="text-xl font-bold text-white mb-4">Criar Novo Jogo</h3>

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="text-sm text-gray-300">Data do Jogo</label>
            <input name="date" type="date" required className="w-full p-2 rounded bg-gray-800 text-white"
              min={new Date().toISOString().split("T")[0]} />
          </div>

          <div>
            <label className="text-sm text-gray-300">Máximo de Jogadores</label>
            <input name="maxPlayers" type="number" required min={2} defaultValue={16}
              className="w-full p-2 rounded bg-gray-800 text-white" />
          </div>

          <div>
            <label className="text-sm text-gray-300">Jogadores por Time</label>
            <select name="teamSize" defaultValue="2" className="w-full p-2 rounded bg-gray-800 text-white">
              <option value="2">2 vs 2</option>
              <option value="3">3 vs 3</option>
              <option value="4">4 vs 4</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-300">Pontos por Partida</label>
            <input name="pointsPerMatch" type="number" required defaultValue={25} min={5}
              className="w-full p-2 rounded bg-gray-800 text-white" />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" name="twoWinsRule" defaultChecked />
            <label className="text-sm text-gray-300">Regra de 2 vitórias?</label>
          </div>

          <div className="flex gap-3 mt-4">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded bg-gray-700 text-white">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 py-2 rounded bg-orange-500 text-white font-bold">
              {loading ? "Criando..." : "Criar Jogo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
