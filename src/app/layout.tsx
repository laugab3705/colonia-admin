import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ColoniaAdmin - Gestión de Colonia de Verano",
  description: "Sistema integral de finanzas, cobranzas y nómina para colonias",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
