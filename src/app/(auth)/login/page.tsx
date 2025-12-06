"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  async function handleLogin(e: any) {
    e.preventDefault();
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      toast("Login realizado!", "success");

      if (data.user.role === "admin") {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/player";
      }
    } else {
      toast(data.error || "Erro ao fazer login", "error");
    }

    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="text-center mb-8">
        <div className="inline-block text-6xl mb-4">🏐</div>
        <h1 className="font-bold text-5xl">VOLEIPRO</h1>
        <p className="text-gray-400">Gestão Profissional de Jogos</p>
      </div>

      <div className="bg-white/10 p-6 rounded-xl w-full max-w-md border border-white/20">
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              name="email"
              type="email"
              required
              defaultValue="admin@volei.com"
              className="w-full px-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-700"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Senha</label>
            <input
              name="password"
              type="password"
              required
              defaultValue="123"
              className="w-full px-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-700"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg"
          >
            {loading ? "Entrando..." : "ENTRAR"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <a href="/register" className="text-orange-400 text-sm">Cadastre-se</a>
        </div>
        <div className="mt-2 text-center">
          <a href="/forgot-password" className="text-gray-400 text-sm">Esqueceu a senha?</a>
        </div>
      </div>
    </div>
  );
}
