"use client";

import { useEffect, useState } from "react";

// =======================================
// Tipo do usuário vindo da API
// =======================================
interface DashboardUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "player" | "visitor";
  paymentType: "monthly" | "daily";
  wins: number;
  losses: number;
  titles: number;
  level: number;
}

// =======================================
// Página principal
// =======================================
export default function UsersPage() {
  const [allUsers, setAllUsers] = useState<DashboardUser[]>([]);
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "admin" | "player">("all");
  const [filterPayment, setFilterPayment] = useState<"all" | "monthly" | "daily">("all");

  // =======================================
  // Carregar usuários da API
  // =======================================
  async function loadUsers() {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setAllUsers(data.users as DashboardUser[]);
      setUsers(data.users as DashboardUser[]);
    } catch (e) {
      console.error("Erro ao carregar usuários:", e);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  // =======================================
  // Filtros / Busca
  // =======================================
  useEffect(() => {
    let filtered = [...allUsers];

    // Filtro por role
    if (filterRole !== "all") {
      filtered = filtered.filter((u) => u.role === filterRole);
    }

    // Filtro por mensalista / diarista
    if (filterPayment !== "all") {
      filtered = filtered.filter((u) => u.paymentType === filterPayment);
    }

    // Busca
    if (search.trim() !== "") {
      filtered = filtered.filter((u) =>
        (u.name + u.email).toLowerCase().includes(search.toLowerCase())
      );
    }

    setUsers(filtered);
  }, [search, filterRole, filterPayment, allUsers]);

  // =======================================
  // Render
  // =======================================
  return (
    <div className="text-white p-4 space-y-6">

      {/* Título */}
      <div>
        <h1 className="text-2xl font-bold">Usuários</h1>
        <p className="text-white/70">Gerenciar jogadores da plataforma</p>
      </div>

      {/* Contadores */}
      <div className="bg-neutral-900 p-4 rounded-xl flex items-center justify-between">
        <p>👥 Total de usuários: {allUsers.length}</p>
        <p>⭐ Admins: {allUsers.filter((u) => u.role === "admin").length}</p>
      </div>

      {/* Barra de busca */}
      <input
        type="text"
        placeholder="Buscar usuário..."
        className="w-full p-3 rounded-xl bg-neutral-800 text-white"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Filtros */}
      <div className="flex gap-3">
        <select
          className="bg-neutral-800 p-2 rounded-xl"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value as any)}
        >
          <option value="all">Todos</option>
          <option value="admin">Admins</option>
          <option value="player">Jogadores</option>
        </select>

        <select
          className="bg-neutral-800 p-2 rounded-xl"
          value={filterPayment}
          onChange={(e) => setFilterPayment(e.target.value as any)}
        >
          <option value="all">Todos</option>
          <option value="monthly">Mensalistas</option>
          <option value="daily">Diaristas</option>
        </select>
      </div>

      {/* Lista de usuários */}
      <div className="space-y-4">
        {users.map((u) => (
          <div
            key={u.id}
            className="bg-neutral-900 rounded-xl p-4 border border-neutral-800"
          >
            {/* Header do Card */}
            <div className="flex justify-between items-center mb-3">
              <div>
                <h2 className="text-xl font-bold">{u.name}</h2>
                <p className="text-white/60">{u.email}</p>
              </div>

              <div className="bg-orange-500 text-white font-bold w-10 h-10 rounded-full flex items-center justify-center">
                {u.level}
              </div>
            </div>

            {/* Tags */}
            <div className="flex gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-blue-700 text-xs">
                {u.role === "admin" ? "Admin" : "Jogador"}
              </span>

              <span
                className={`px-3 py-1 rounded-full text-xs ${
                  u.paymentType === "monthly"
                    ? "bg-green-700"
                    : "bg-teal-700"
                }`}
              >
                {u.paymentType === "monthly" ? "Mensalista" : "Diarista"}
              </span>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-neutral-800 p-3 rounded-lg text-center">
                <p className="text-lg font-bold">{u.wins}</p>
                <p className="text-xs text-white/60">Vitórias</p>
              </div>

              <div className="bg-neutral-800 p-3 rounded-lg text-center">
                <p className="text-lg font-bold">{u.losses}</p>
                <p className="text-xs text-white/60">Derrotas</p>
              </div>

              <div className="bg-neutral-800 p-3 rounded-lg text-center">
                <p className="text-lg font-bold">{u.titles}</p>
                <p className="text-xs text-white/60">Títulos</p>
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-3">
              <button className="flex-1 py-2 rounded bg-blue-600 font-bold">
                ✏️ Nível
              </button>

              <button className="flex-1 py-2 rounded bg-orange-500 font-bold">
                🔄 Perfil
              </button>
            </div>

            {/* Botão de troca de mensalista/diarista */}
            <button className="mt-3 w-full py-2 rounded bg-green-600 font-bold">
              {u.paymentType === "monthly"
                ? "Trocar para Diarista"
                : "Trocar para Mensalista"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
