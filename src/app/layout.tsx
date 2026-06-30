import "./globals.css";
import { ToastProvider } from "@/components/ui/ToastProvider";

export const metadata = {
  title: "BolinhaClub",
  description: "Sistema de Gestão de Jogos",
  
  icons: {
    icon: "/logo.png",    
    apple: "/logo.png",        
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>

      <body className="bg-[#0F172A] text-white min-h-screen font-sans">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}

