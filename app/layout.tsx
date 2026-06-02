import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DailyQuest",
  description: "Gamified productivity app",
  manifest: "/manifest.webmanifest",
  applicationName: "DailyQuest",
  themeColor: "#8b5cf6",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DailyQuest",
  },
  icons: {
    icon: "/6045432.jpg",
    apple: "/logres.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col"
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}