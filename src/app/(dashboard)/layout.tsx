export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pb-20"> 
      {/* Conteúdo */}
      <main className="p-4">{children}</main>
    </div>
  );
}
