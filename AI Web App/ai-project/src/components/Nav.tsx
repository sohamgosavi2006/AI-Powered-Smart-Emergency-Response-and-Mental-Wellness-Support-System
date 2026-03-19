"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  const links = [
    { href: "/data", label: "📊 Data Core" },
    { href: "/", label: "🏠 Home" },
    { href: "/emergency", label: "🚑 Emergency" },
    { href: "/chatbot", label: "🧠 Chatbot" },
  ];

  return (
    <nav className="fixed top-0 inset-x-0 z-50 px-6 lg:px-10 py-4 flex items-center justify-between bg-[#050810]/80 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center gap-2 font-display font-bold text-lg tracking-tight">
        <span className="text-xl">🤖</span>
        <span>
          AI<span className="text-[#ff4757]">.</span>Project
        </span>
      </div>
      <div className="flex items-center gap-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                isActive
                  ? "text-white bg-white/10 border-white/20"
                  : "text-slate-400 border-transparent hover:text-white hover:bg-white/5 hover:border-white/10"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
