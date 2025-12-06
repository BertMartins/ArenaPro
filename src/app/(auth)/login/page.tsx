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
    <div className="flex flex-col items-center justify-center min-h-screen px-6 page-animate">

      {/* LOGO */}
      <div className="text-center mb-10 animate-fadeIn">
        <div className="inline-block text-6xl mb-4 animate-bounceSoft">🏐</div>
        <h1 className="title-font font-bold text-5xl text-white">ARENA PRO</h1>
        <p className="text-gray-400 mt-1">Gestão Profissional de Jogos</p>
      </div>

      {/* CARD */}
      <div className="glass-card p-8 rounded-2xl w-full max-w-md animate-slideIn">

        <form className="space-y-6" onSubmit={handleLogin}>

          {/* EMAIL */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Email</label>
            <input
              name="email"
              type="email"
              required
              placeholder="Digite seu login"
              className="w-full px-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:ring focus:ring-orange-500"
            />
          </div>

          {/* SENHA */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Senha</label>
            <input
              name="password"
              type="password"
              required
              placeholder="Digite sua senha"
              className="w-full px-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:ring focus:ring-orange-500"
            />
          </div>

          {/* BOTÃO */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 rounded-lg text-white font-bold text-lg"
          >
            {loading ? "Entrando..." : "ENTRAR"}
          </button>
        </form>

        {/* LINKS */}
        <div className="mt-6 text-center">
          <a href="/register" className="text-orange-400 hover:text-orange-300 font-medium">
            Não tem conta? Cadastre-se
          </a>
        </div>

        <div className="mt-2 text-center">
          <a href="/forgot-password" className="text-gray-400 hover:text-gray-200 text-sm">
            Esqueceu sua senha?
          </a>
        </div>

      </div>
    </div>
  );
}
