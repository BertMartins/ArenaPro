import DashboardCards from "@/components/dashboard/DashboardCards";
import DashboardChart from "@/components/dashboard/DashboardChart";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardCards />
      <DashboardChart />
    </div>
  );
}
