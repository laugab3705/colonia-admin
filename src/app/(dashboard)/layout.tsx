import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans antialiased text-slate-800">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-20 lg:pb-6">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
