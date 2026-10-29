import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ReduxProvider from "@/redux/ReduxProvider";
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
  title: "Pulse — Personalized Content Dashboard",
  description:
    "An interactive, user-centric dashboard unifying real-time news, entertainment recommendations, and social media trends with customizable preferences, drag-and-drop reordering, and dark mode.",
  keywords: [
    "Personalized Dashboard",
    "News API",
    "TMDB Recommendations",
    "Social Feed",
    "Next.js",
    "Redux Toolkit",
    "Framer Motion",
  ],
  authors: [{ name: "Dhara M.", url: "https://github.com" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased selection:bg-indigo-500 selection:text-white`}
      >
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
