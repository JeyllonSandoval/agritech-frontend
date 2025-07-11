"use client";
import NavbarH from "@/components/features/layouts/navbarH";
import "@/app/globals.css";
import { Providers } from './providers';
import ModalCreated from "@/components/features/modals/modalCreated";
import MobileRestriccion from "@/components/features/layouts/MobileRestriccion";
import { NavbarLateralProvider } from "@/context/navbarLateralContext";
import { LanguageProvider } from '@/context/languageContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>AgriTech</title>
        <meta name="description" content="AgriTech - Agricultural Technology Solutions" />
        <link rel="icon" type="image/webp" href="/icon/AgriTech-Logo-_transparent_.webp" />
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"/>
      </head>
      <body className="min-h-screen bg-gradient-to-br from-black to-[#022510] scrollbar">
        <LanguageProvider>
          <Providers>
            <NavbarLateralProvider>
              <header className="w-full flex justify-center items-center">
                <NavbarH />
              </header>
              <main className="w-full aspect-screen mt-24">
                {children}
                <ModalCreated />
              </main>
            </NavbarLateralProvider>
          </Providers>
        </LanguageProvider>
      </body>
    </html>
  );
}
