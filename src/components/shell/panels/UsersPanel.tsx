"use client";
import { useEffect, useState } from "react";
import UserCard from "@/components/users/UserCard";
import UserLevelModal from "@/components/users/UserLevelModal";
import { useNav } from "@/context/NavContext";

export default function UsersPanel() {
  const nav = useNav()!;
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [levelModalUser, setLevelModalUser] = useState<any>(null);

  async function loadUsers() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(!res.ok || !Array.isArray(data) ? [] : data);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadUsers(); }, []);

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchType = typeFilter === "all" || u.paymentType === typeFilter;
    return matchSearch && matchRole && matchType;
  });

  return (
    <div className="pb-24 animate-fadeIn max-w-2xl mx-auto">
      <div className="p-4 sm:p-6" style={{ background: "linear-gradient(135deg, #ff7a18, #ff9e32)" }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wider">USUÁRIOS</h1>
            <p className="text-orange-100 text-sm">Gerenciar jogadores da plataforma</p>
          </div>
          <button onClick={() => nav.popView()} className="text-white hover:bg-white/20 p-2 rounded-lg text-xl">✕</button>
        </div>
      </div>

      <div className="p-3 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          <input type="text" placeholder="Buscar usuário..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="bg-[#111827] text-white py-2.5 px-3 rounded-lg border border-white/10 focus:border-orange-400 outline-none text-sm" />
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[#111827] text-white py-2.5 px-3 rounded-lg border border-white/10 text-sm">
            <option value="all">Todos os perfis</option>
            <option value="admin">Admins</option>
            <option value="player">Jogadores</option>
          </select>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[#111827] text-white py-2.5 px-3 rounded-lg border border-white/10 text-sm">
            <option value="all">Todos os tipos</option>
            <option value="monthly">Mensalistas</option>
            <option value="daily">Diaristas</option>
          </select>
        </div>

        {loading && <div className="text-gray-400 mt-6">Carregando usuários...</div>}
        {!loading && filtered.length === 0 && (
          <div className="text-gray-500 bg-[#0f172a] p-6 rounded-xl mt-4">Nenhum usuário encontrado.</div>
        )}

        <div className="space-y-6">
          {filtered.map((user) => (
            <UserCard key={user.id} user={user} onRefresh={loadUsers} onEditLevel={() => setLevelModalUser(user)} />
          ))}
        </div>

        {levelModalUser && (
          <UserLevelModal user={levelModalUser} onClose={() => setLevelModalUser(null)}
            onSaved={() => { setLevelModalUser(null); loadUsers(); }} />
        )}
      </div>
    </div>
  );
}
