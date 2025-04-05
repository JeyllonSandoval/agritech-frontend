import NavbarH from "@/modules/common/components/layouts/navbarH";
import "@/app/globals.css";
import { ModalProvider } from '@/modules/common/context/modalContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/webp" href="/AgriTech-Logo-_transparent_.webp" />
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"/>
      </head>
      <body className="min-h-screen bg-gradient-to-br from-green-950/90 via-black to-green-950/90 scrollbar">
        <header className="w-full flex justify-center items-center">
          <NavbarH />
        </header>
        <main className="w-full aspect-screen">
          <ModalProvider>
            {children}
          </ModalProvider>
        </main>
      </body>
    </html>
  );
}
