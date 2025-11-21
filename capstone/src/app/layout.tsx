import type { Metadata } from "next";
import { GeistSans, GeistMono } from 'geist/font';
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthProviderWrapper from "@/components/AuthProvider";
import QueryProvider from "@/components/QueryProvider";
import { defaultMetadata } from '../app/metadata';

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans min-h-screen flex flex-col antialiased`}>
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