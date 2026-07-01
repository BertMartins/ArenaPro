"use client";

import { useRouter } from "next/navigation";
import FinanceiroPanel from "@/components/shell/panels/FinanceiroPanel";
import BottomNav from "@/components/dashboard/BottomNav";

export default function FinanceiroPage() {
  const router = useRouter();
  return (
    <>
      <FinanceiroPanel onClose={() => router.push("/dashboard")} />
      <BottomNav active="home" role="admin" />
    </>
  );
}
