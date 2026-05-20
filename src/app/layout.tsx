import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "A LA 2 RESTO-BAR",
  description: "Domicilios y Menú Interactivo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark h-full antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-background min-h-screen relative overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
