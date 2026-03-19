import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import SmoothScroll from "@/components/SmoothScroll";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "AI Project Hub — Emergency Response & Mental Health",
  description: "AI-powered Emergency Response System and Mental Health Chatbot — Semester 4 AI Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-[#050810] text-[#f0f4ff] min-h-screen antialiased overflow-x-hidden`}>
        <SmoothScroll>
          <Nav />
          <main className="relative z-10 pt-20 pb-12 min-h-screen">
            {children}
          </main>
        </SmoothScroll>
      </body>
    </html>
  );
}
