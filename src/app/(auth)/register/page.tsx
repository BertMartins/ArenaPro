"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentType, setPaymentType] = useState<"monthly" | "daily">("monthly");

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, paymentType }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      setLoading(false);
      return;
    }

    const loginRes = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const loginData = await loginRes.json();
    setLoading(false);

    if (loginRes.ok) {
      if (loginData.user.role === "admin") {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/player";
      }
    } else {
      router.push("/login");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 page-animate">
      <div className="w-full max-w-md">

        {/* Topo */}
        <div className="text-center mb-4 sm:mb-6">
          <a href="/login" className="text-gray-400 hover:text-white mb-3 inline-block text-sm">
            ← Voltar
          </a>
          <h1 className="title-font text-3xl sm:text-4xl text-white">CRIAR CONTA</h1>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-5 sm:p-8 shadow-2xl border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-white mb-1 text-sm font-medium">Nome Completo</label>
              <input
                name="name"
                required
                className="custom-input w-full px-3 py-2.5 rounded-lg text-white bg-gray-800/40 border border-gray-700 text-sm"
              />
            </div>

            <div>
              <label className="block text-white mb-1 text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                required
                className="custom-input w-full px-3 py-2.5 rounded-lg text-white bg-gray-800/40 border border-gray-700 text-sm"
              />
            </div>

            <div>
              <label className="block text-white mb-1 text-sm font-medium">Senha</label>
              <input
                type="password"
                name="password"
                required
                className="custom-input w-full px-3 py-2.5 rounded-lg text-white bg-gray-800/40 border border-gray-700 text-sm"
              />
            </div>

            {/* Tipo de Pagamento */}
            <div>
              <label className="block text-white font-medium mb-2 text-sm">💳 Tipo de Pagamento</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentType("monthly")}
                  className={`p-3 rounded-lg border-2 text-center transition ${
                    paymentType === "monthly"
                      ? "border-orange-500 bg-orange-500/20"
                      : "border-gray-600 bg-gray-800/40 hover:border-gray-500"
                  }`}
                >
                  <div className="text-xl mb-1">📅</div>
                  <div className="text-white font-bold text-xs">Mensalista</div>
                  <div className="text-gray-400 text-xs">Pag. mensal</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentType("daily")}
                  className={`p-3 rounded-lg border-2 text-center transition ${
                    paymentType === "daily"
                      ? "border-blue-500 bg-blue-500/20"
                      : "border-gray-600 bg-gray-800/40 hover:border-gray-500"
                  }`}
                >
                  <div className="text-xl mb-1">🎫</div>
                  <div className="text-white font-bold text-xs">Diarista</div>
                  <div className="text-gray-400 text-xs">Pag. por jogo</div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 rounded-lg text-white font-bold text-base disabled:opacity-60"
            >
              {loading ? "Criando conta..." : "CRIAR CONTA"}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}
