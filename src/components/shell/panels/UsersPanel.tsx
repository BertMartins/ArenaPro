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
    const matchRole   = roleFilter === "all" || u.role === roleFilter;
    const matchType   = typeFilter === "all" || u.paymentType === typeFilter;
    return matchSearch && matchRole && matchType;
  });

  return (
    <div className="pb-24 animate-fadeIn max-w-2xl mx-auto">

      {/* HEADER */}
      <div
        className="p-4 sm:p-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #001A46 0%, #004B9A 65%, #0273D0 100%)",
          borderBottom: "2px solid rgba(251,102,0,0.4)"
        }}
      >
        <div style={{
          position: "absolute", top: "-30px", right: "-20px",
          width: 140, height: 140, borderRadius: "50%",
          background: "rgba(251,102,0,0.08)", pointerEvents: "none"
        }} />
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "rgba(251,102,0,0.2)", border: "2px solid rgba(251,102,0,0.4)" }}
            >
              <i className="fas fa-users" style={{ color: "#FB9A14" }} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-wider">USUÁRIOS</h1>
              <p className="text-xs" style={{ color: "#5A6F8D" }}>Gerenciar jogadores da plataforma</p>
            </div>
          </div>
          <button
            onClick={() => nav.popView()}
            className="p-2 rounded-xl transition"
            style={{ background: "rgba(255,255,255,0.1)", color: "white" }}
          >
            <i className="fas fa-times" />
          </button>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{ background: "linear-gradient(90deg, transparent, #FB6600, #FB9A14, transparent)" }}
        />
      </div>

      <div className="p-3 sm:p-5 space-y-4">

        {/* FILTROS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            type="text"
            placeholder="Buscar usuário..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="custom-input py-2.5 px-3 rounded-xl text-white text-sm"
            style={{ border: "1px solid rgba(2,115,208,0.3)" }}
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="custom-input py-2.5 px-3 rounded-xl text-white text-sm"
            style={{ border: "1px solid rgba(2,115,208,0.3)" }}
          >
            <option value="all">Todos os perfis</option>
            <option value="admin">Admins</option>
            <option value="player">Jogadores</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="custom-input py-2.5 px-3 rounded-xl text-white text-sm"
            style={{ border: "1px solid rgba(2,115,208,0.3)" }}
          >
            <option value="all">Todos os tipos</option>
            <option value="monthly">Mensalistas</option>
            <option value="daily">Diaristas</option>
          </select>
        </div>

        {loading && (
          <div className="space-y-3 mt-2">
            {[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-xl" />)}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div
            className="p-8 rounded-2xl text-center"
            style={{ background: "rgba(0,26,70,0.5)", border: "1px solid rgba(2,115,208,0.2)" }}
          >
            <i className="fas fa-user-slash text-4xl mb-3 block opacity-30" style={{ color: "#5A6F8D" }} />
            <div style={{ color: "#5A6F8D" }}>Nenhum usuário encontrado.</div>
          </div>
        )}

        <div className="space-y-3">
          {filtered.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onRefresh={loadUsers}
              onEditLevel={() => setLevelModalUser(user)}
            />
          ))}
        </div>

        {levelModalUser && (
          <UserLevelModal
            user={levelModalUser}
            onClose={() => setLevelModalUser(null)}
            onSaved={() => { setLevelModalUser(null); loadUsers(); }}
          />
        )}
      </div>
    </div>
  );
}
