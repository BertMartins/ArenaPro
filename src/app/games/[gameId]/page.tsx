"use client";

import { useParams, useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";
import GameDetailPanel from "@/components/shell/panels/GameDetailPanel";

export default function GameDetailPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const router = useRouter();

  return (
    <>
      <GameDetailPanel
        gameId={gameId}
        onBack={() => router.back()}
        onGoToPlay={() => router.push("/play")}
      />
      <BottomNav active="games" />
    </>
  );
}
