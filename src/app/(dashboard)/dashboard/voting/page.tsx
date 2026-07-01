"use client";

import { useRouter } from "next/navigation";
import VotingPanel from "@/components/shell/panels/VotingPanel";

export default function VotingAdminPage() {
  const router = useRouter();
  return <VotingPanel onClose={() => router.push("/dashboard")} />;
}
