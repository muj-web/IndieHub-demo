import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// Přidán import našeho hlídače
import AuthGuard from "../lib/components/AuthGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Upravené titulky pro tvou aplikaci
export const metadata: Metadata = {
  title: "ProjectOS - Radek Čech",
  description: "Interní CRM a fakturační systém",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="cs" // Změněno na češtinu
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Obalení celé aplikace do AuthGuardu */}
        <AuthGuard>
          {children}
        </AuthGuard>
      </body>
    </html>
  );
}