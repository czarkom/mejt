import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MEJT",
  description: "Digital logbook for boat trips and maintenance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="bg-blue-600 text-white p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <img 
                src="/mejt_white_letters.png" 
                alt="Mejt" 
                className="h-10"
              />
            </div>
            <div className="space-x-4">
              <Link href="/" className="hover:underline">
                Informacje
              </Link>
              <Link href="/logbook" className="hover:underline">
                Dziennik pokładowy
              </Link>
              <Link href="/inventory" className="hover:underline">
                Zapasy
              </Link>
              <Link href="/calendar" className="hover:underline">
                Kalendarz
              </Link>
            </div>
          </div>
        </nav>
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  );
}
