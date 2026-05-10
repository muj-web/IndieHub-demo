import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import AuthGuard from "@/lib/components/AuthGuard";
import { ThemeProvider } from "@/lib/components/ThemeProvider";
import { ConfirmProvider } from "@/lib/components/ConfirmProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chameleon OS - Radek Čech",
  description: "Interní CRM, web builder a fakturační systém",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="cs" 
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <ConfirmProvider>
            <AuthGuard>
              {children}
            </AuthGuard>
          </ConfirmProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}