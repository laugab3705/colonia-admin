export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/",
    "/alumnos/:path*",
    "/empleados/:path*",
    "/gastos/:path*",
  ],
};
