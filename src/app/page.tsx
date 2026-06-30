import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-black text-white px-6">
      <main className="max-w-2xl w-full text-center flex flex-col items-center gap-10 animate-fadeIn">
        
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-7xl">🏐</div>
          <h1 className="text-5xl font-extrabold tracking-tight">BolinhaClub</h1>
          <p className="text-zinc-400 text-sm">Gestão moderna de jogos esportivos</p>
        </div>

        {/* Texto principal */}
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold">
            Organize partidas, gerencie inscrições e controle tudo em um só lugar.
          </h2>

          <p className="text-lg text-zinc-300 leading-relaxed">
            Com o BolinhaClub você cria jogos, monta times automaticamente,
            gerencia mensalidades, controla visitantes e ainda acompanha
            placares ao vivo — tudo de forma simples e rápida.
          </p>
        </div>

        {/* Botão principal */}
        <Link
          href="/login"
          className="bg-orange-500 hover:bg-orange-600 transition-all px-10 py-4 rounded-full text-lg font-bold shadow-lg shadow-orange-600/20"
        >
          Acessar Plataforma
        </Link>

        {/* Rodapé */}
        <p className="text-xs text-zinc-500 pt-6">
          Desenvolvido por Heberte • BolinhaClub © {new Date().getFullYear()}
        </p>
      </main>
    </div>
  );
}
