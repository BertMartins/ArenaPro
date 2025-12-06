import "./globals.css";
import { ToastProvider } from "@/components/ui/ToastProvider";

export const metadata = {
  title: "Arenapro",
  description: "Sistema de Gestão de Jogos",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#0F172A] text-white min-h-screen font-sans">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
