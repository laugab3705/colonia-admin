"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Receipt,
  LogOut,
  Sun,
} from "lucide-react";
import { signOut } from "next-auth/react";

const navigation = [
  { name: "Resumen Financiero", href: "/", icon: LayoutDashboard },
  { name: "Alumnos y Cobros", href: "/alumnos", icon: Users },
  { name: "Personal y Sueldos", href: "/empleados", icon: Briefcase },
  { name: "Gastos Operativos", href: "/gastos", icon: Receipt },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-white border-r border-slate-800">
      <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
          <Sun className="w-5 h-5" />
        </div>
        <div>
          <span className="font-extrabold text-base tracking-tight text-white block">
            ColoniaAdmin
          </span>
          <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
            Gestión Operativa
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all " +
                (isActive
                  ? "bg-blue-600 text-white shadow-sm font-semibold"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white")
              }
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
