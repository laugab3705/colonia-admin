"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Briefcase, Receipt } from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Alumnos", href: "/alumnos", icon: Users },
    { name: "Personal", href: "/empleados", icon: Briefcase },
    { name: "Gastos", href: "/gastos", icon: Receipt },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-slate-200 px-3 py-2">
      <nav className="flex items-center justify-around">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={
                "flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-medium transition-colors " +
                (isActive ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-900")
              }
            >
              <link.icon className="w-5 h-5" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
