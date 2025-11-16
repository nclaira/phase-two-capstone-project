import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthProviderWrapper from "@/components/AuthProvider";
import QueryProvider from "@/components/QueryProvider";
import { defaultMetadata } from '../app/metadata';
import { Inter } from 'next/font/google';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${inter.className} ${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <QueryProvider>
          <AuthProviderWrapper>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthProviderWrapper>
        </QueryProvider>
      </body>
    </html>
  );
}
