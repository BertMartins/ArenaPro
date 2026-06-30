"use client";

import { useEffect, useState } from "react";
import UserCard from "@/components/users/UserCard";
import UserLevelModal from "@/components/users/UserLevelModal";
import BottomNav from "@/components/dashboard/BottomNav";

export default function UsersAdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // filtros
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // modal de nível
  const [levelModalUser, setLevelModalUser] = useState<any>(null);

  async function loadUsers() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();

      if (!res.ok || !Array.isArray(data)) {
        setUsers([]);
      } else {
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchRole = roleFilter === "all" ? true : u.role === roleFilter;
    const matchType = typeFilter === "all" ? true : u.paymentType === typeFilter;

    return matchSearch && matchRole && matchType;
  });

  return (
    <div className="p-3 sm:p-5 space-y-4 pb-24 max-w-2xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-white">USUÁRIOS</h1>
      <p className="text-xs sm:text-sm text-gray-400">Gerenciar jogadores da plataforma</p>

      {/* FILTROS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
        <input
          type="text"
          placeholder="Buscar usuário..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#111827] text-white py-2.5 px-3 rounded-lg border border-white/10 focus:border-orange-400 outline-none text-sm"
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-[#111827] text-white py-2.5 px-3 rounded-lg border border-white/10 text-sm"
        >
          <option value="all">Todos os perfis</option>
          <option value="admin">Admins</option>
          <option value="player">Jogadores</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-[#111827] text-white py-2.5 px-3 rounded-lg border border-white/10 text-sm"
        >
          <option value="all">Todos os tipos</option>
          <option value="monthly">Mensalistas</option>
          <option value="daily">Diaristas</option>
        </select>
      </div>

      {/* LISTAGEM */}
      {loading && (
        <div className="text-gray-400 mt-6">Carregando usuários...</div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-gray-500 bg-[#0f172a] p-6 rounded-xl mt-4">
          Nenhum usuário encontrado.
        </div>
      )}

      <div className="space-y-6">
        {filtered.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onRefresh={loadUsers}
            onEditLevel={() => setLevelModalUser(user)}
          />
        ))}
      </div>

      {/* MODAL DE NÍVEL */}
      {levelModalUser && (
        <UserLevelModal
          user={levelModalUser}
          onClose={() => setLevelModalUser(null)}
          onSaved={() => {
            setLevelModalUser(null);
            loadUsers();
          }}
        />
      )}
      
    <BottomNav active="home" role="admin" />
    </div>
  );
}
