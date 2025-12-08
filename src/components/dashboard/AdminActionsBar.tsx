"use client";

export default function AdminActionsBar({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="space-y-4">
      <div>
        <button
          onClick={onCreate}
          className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-3"
        >
          <span className="text-xl">＋</span> CRIAR NOVO JOGO
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <button className="py-3 rounded-xl bg-blue-500 text-white font-bold">👥 USUÁRIOS</button>
        <button className="py-3 rounded-xl bg-green-600 text-white font-bold">💳 MENSALIDADES</button>
        <button className="py-3 rounded-xl bg-purple-600 text-white font-bold">📈 CONTROLE FINANCEIRO</button>
      </div>
    </div>
  );
}
