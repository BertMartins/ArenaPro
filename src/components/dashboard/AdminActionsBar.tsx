"use client";

import { useRouter } from "next/navigation";

export default function AdminActionsBar({ onCreate }: { onCreate: () => void }) {
  const router = useRouter();

  return (
    <div className="space-y-3">
      <button
        onClick={onCreate}
        className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 text-base"
      >
        <span>＋</span> CRIAR NOVO JOGO
      </button>

      <div className="grid grid-cols-3 gap-2">
        <button
          className="py-2 sm:py-3 rounded-xl bg-blue-500 text-white font-bold text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1"
          onClick={() => router.push("/dashboard/users")}
        >
          <span>👥</span>
          <span>USUÁRIOS</span>
        </button>

        <button
          className="py-2 sm:py-3 rounded-xl bg-green-600 text-white font-bold text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1"
          onClick={() => router.push("/dashboard/mensalistas")}
        >
          <span>💳</span>
          <span>MENSALISTA</span>
        </button>

        <button
          className="py-2 sm:py-3 rounded-xl bg-purple-600 text-white font-bold text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 leading-tight"
          onClick={() => router.push("/dashboard/financeiro")}
        >
          <span>📈</span>
          <span>FINANCEIRO</span>
        </button>
      </div>
    </div>
  );
}
