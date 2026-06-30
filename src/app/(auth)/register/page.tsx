"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LEVEL_LABELS: Record<number, string> = {
  1: "Aprendendo",
  2: "Iniciante",
  3: "Intermediário",
  4: "Avançado",
  5: "Expert",
  6: "Muito experiente",
};

const LEVEL_COLORS: Record<number, string> = {
  1: "from-gray-500 to-gray-400",
  2: "from-green-600 to-green-400",
  3: "from-blue-600 to-blue-400",
  4: "from-purple-600 to-purple-400",
  5: "from-yellow-500 to-yellow-300",
  6: "from-red-600 to-red-400",
};

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentType, setPaymentType] = useState<"monthly" | "daily">("monthly");
  const [level, setLevel] = useState<number>(0);

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (level === 0) {
      alert("Por favor, selecione seu nível de jogador.");
      return;
    }
    setLoading(true);

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, paymentType, level }),
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

            {/* Nível do Jogador */}
            <div>
              <label className="block text-white font-medium mb-1 text-sm">
                🏐 Qual é o seu nível como jogador?
              </label>
              <p className="text-gray-400 text-xs mb-3">
                1 = ainda aprendendo &nbsp;·&nbsp; 6 = muita experiência
              </p>
              <div className="grid grid-cols-6 gap-2">
                {([1, 2, 3, 4, 5, 6] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setLevel(lvl)}
                    title={LEVEL_LABELS[lvl]}
                    className={`flex flex-col items-center justify-center h-14 rounded-xl border-2 transition-all font-bold text-white text-lg bg-gradient-to-br ${LEVEL_COLORS[lvl]} ${
                      level === lvl
                        ? "border-white ring-2 ring-orange-400 scale-110 shadow-lg"
                        : "border-transparent opacity-50 hover:opacity-80"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
              {level > 0 && (
                <p className="text-center text-orange-300 text-xs mt-2 font-medium">
                  Nível {level} — {LEVEL_LABELS[level]}
                </p>
              )}
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
