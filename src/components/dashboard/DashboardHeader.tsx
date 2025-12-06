"use client";

export default function DashboardHeader({
  name,
  level,
  wins,
  taxa,
}: {
  name: string;
  level: number;
  wins: number;
  taxa: number;
}) {
  return (
    <div className="px-4 mt-6">
      <div className="flex items-center justify-between">
        {/* Info do usuário */}
        <div>
          <h1 className="text-2xl font-bold">Olá, {name} 👋</h1>
          <p className="text-gray-300 text-sm mt-1">
            Nível {level} • {wins} vitórias • {taxa}% taxa
          </p>
        </div>

        {/* Avatar */}
        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-orange-500 shadow-lg">
          <img
            src="https://i.pravatar.cc/150?img=12"
            alt="avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
