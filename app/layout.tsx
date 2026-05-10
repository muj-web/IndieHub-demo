import type { Metadata } from "next";
import { Jost, Playfair_Display } from "next/font/google";
import "./globals.css";

const fontJost = Jost({ 
  subsets: ["latin", "latin-ext"],
  variable: '--font-jost',
  display: 'swap',
});

const fontPlayfair = Playfair_Display({ 
  subsets: ["latin", "latin-ext"],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Digitální tvůrce",
  description: "Moderní weby a SEO, které fungují",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&family=Lexend:wght@300;400;700;900&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&display=swap" rel="stylesheet" />
      </head>
      <body 
        className={`${fontJost.variable} ${fontPlayfair.variable} font-sans antialiased min-h-screen selection:bg-dt-accent/40 selection:text-white`}
        suppressHydrationWarning
      >   
        {children}
      </body>
    </html>
  );
}