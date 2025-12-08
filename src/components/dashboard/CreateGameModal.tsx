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

        <form onSubmit={handleCreate} className="space-y-4">
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
