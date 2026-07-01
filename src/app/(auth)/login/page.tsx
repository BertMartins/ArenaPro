"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";
import Image from "next/image";

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
      headers: { "Content-Type": "application/json" },
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
    <div
      className="flex flex-col items-center justify-center min-h-screen px-4 py-10 page-animate"
      style={{ background: "linear-gradient(160deg, #0B1431 0%, #001A46 55%, #0B1431 100%)" }}
    >
      {/* Decoração de fundo */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div style={{
          position: "absolute", top: "-15%", right: "-10%",
          width: 340, height: 340, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(251,102,0,0.12) 0%, transparent 70%)"
        }} />
        <div style={{
          position: "absolute", bottom: "-10%", left: "-10%",
          width: 280, height: 280, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,75,154,0.25) 0%, transparent 70%)"
        }} />
      </div>

      {/* LOGO + NOME */}
      <div className="text-center mb-8 animate-fadeIn relative z-10">
        <div className="animate-bounceSoft inline-block mb-4">
          <Image
            src="/logo.png"
            alt="Bolinha Club"
            width={96}
            height={96}
            className="drop-shadow-[0_0_20px_rgba(251,102,0,0.5)]"
            priority
          />
        </div>
        <h1
          className="font-black text-4xl sm:text-5xl tracking-wider"
          style={{ color: "#FB6600", textShadow: "0 0 30px rgba(251,102,0,0.4)" }}
        >
          BOLINHA<span style={{ color: "#FDFDFD" }}>CLUB</span>
        </h1>
        <p className="mt-1 text-sm sm:text-base" style={{ color: "#5A6F8D" }}>
          Gestão Profissional de Jogos
        </p>
      </div>

      {/* CARD */}
      <div className="relative z-10 w-full max-w-md animate-scaleIn">
        {/* Linha laranja decorativa no topo do card */}
        <div className="h-[3px] rounded-t-xl" style={{ background: "linear-gradient(90deg, #FB6600, #FB9A14)" }} />

        <div
          className="p-6 sm:p-8 rounded-b-2xl"
          style={{
            background: "rgba(0,26,70,0.75)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(2,115,208,0.2)",
            borderTop: "none",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)"
          }}
        >
          <form className="space-y-5" onSubmit={handleLogin}>

            {/* EMAIL */}
            <div>
              <label className="block mb-1.5 text-sm font-semibold" style={{ color: "#5A6F8D" }}>
                <i className="fas fa-envelope mr-2" style={{ color: "#FB6600" }} />Email
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="Digite seu email"
                className="custom-input w-full px-4 py-3 rounded-xl text-white text-sm"
              />
            </div>

            {/* SENHA */}
            <div>
              <label className="block mb-1.5 text-sm font-semibold" style={{ color: "#5A6F8D" }}>
                <i className="fas fa-lock mr-2" style={{ color: "#FB6600" }} />Senha
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="Digite sua senha"
                className="custom-input w-full px-4 py-3 rounded-xl text-white text-sm"
              />
            </div>

            {/* BOTÃO */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 rounded-xl text-white font-bold text-base tracking-wide mt-2 flex items-center justify-center gap-2"
            >
              {loading
                ? <><i className="fas fa-circle-notch fa-spin" /> Entrando...</>
                : <><i className="fas fa-sign-in-alt" /> ENTRAR</>
              }
            </button>
          </form>

          {/* LINK CADASTRO */}
          <div className="mt-5 text-center">
            <a
              href="/register"
              className="text-sm font-medium transition-colors"
              style={{ color: "#0273D0" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#FB6600")}
              onMouseLeave={e => (e.currentTarget.style.color = "#0273D0")}
            >
              Não tem conta? <span className="font-bold">Cadastre-se</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
