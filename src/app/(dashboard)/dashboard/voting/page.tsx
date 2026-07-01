"use client";

import { useRouter } from "next/navigation";
import VotingPanel from "@/components/shell/panels/VotingPanel";
import BottomNav from "@/components/dashboard/BottomNav";

export default function VotingAdminPage() {
  const router = useRouter();
  return (
    <>
      <VotingPanel onClose={() => router.push("/dashboard")} />
      <BottomNav active="home" role="admin" />
    </>
  );
}
