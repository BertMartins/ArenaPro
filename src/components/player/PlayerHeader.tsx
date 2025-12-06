"use client";

export default function PlayerHeader({
  name,
  level,
  wins,
  losses,
  titles,
}: {
  name: string;
  level: number;
  wins: number;
  losses: number;
  titles: number;
}) {
  return (
    <div className="px-4 mt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Olá, {name} 👊</h1>
          <p className="text-gray-300 text-sm mt-1">
            Nível {level} • {wins} vitórias • {losses} derrotas • {titles} títulos
          </p>
        </div>

        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-orange-500 shadow-lg">
          <img
            src="https://i.pravatar.cc/150?img=32"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
