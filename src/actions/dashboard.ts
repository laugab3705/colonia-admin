"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardMetrics(selectedMonth: string) {
  try {
    const isAll = selectedMonth === "ALL";

    const studentPayments = await prisma.studentPayment.findMany({
      where: isAll ? {} : { mesAplicado: selectedMonth },
      include: { student: { include: { plan: true } } },
    });
    const totalIngresos = studentPayments.reduce((acc, p) => acc + p.montoPagado, 0);

    const expenses = await prisma.expense.findMany({
      where: isAll ? {} : { mesAplicado: selectedMonth },
    });
    const totalGastos = expenses.reduce((acc, e) => acc + e.monto, 0);

    const employeePayments = await prisma.employeePayment.findMany({
      where: isAll ? {} : { mesAplicado: selectedMonth },
      include: { employee: true },
    });
    const sueldosPagados = employeePayments
      .filter((p) => p.estado === "PAGADO")
      .reduce((acc, p) => acc + p.montoPagado, 0);

    const sueldosPendientes = employeePayments
      .filter((p) => p.estado === "PENDIENTE")
      .reduce((acc, p) => acc + p.montoPagado, 0);

    const balanceNeto = totalIngresos - (totalGastos + sueldosPagados);

    const activeStudents = await prisma.student.findMany({
      where: { estado: "ACTIVO" },
      include: {
        plan: true,
        pagos: true,
      },
    });

    const facturacionEsperada = activeStudents.reduce(
      (acc, s) => acc + s.plan.precioBase,
      0
    );

    const totalCobradoGeneral = activeStudents.reduce(
      (acc, s) => acc + s.pagos.reduce((pAcc, p) => pAcc + p.montoPagado, 0),
      0
    );

    const porcentajeCobranza =
      facturacionEsperada > 0
        ? Math.min(100, Math.round((totalCobradoGeneral / facturacionEsperada) * 100))
        : 0;

    const alumnosDeudores = activeStudents
      .map((s) => {
        const pagado = s.pagos.reduce((acc, p) => acc + p.montoPagado, 0);
        const saldo = s.plan.precioBase - pagado;
        return {
          id: s.id,
          nombre: s.nombre + " " + s.apellido,
          tutorContacto: s.tutorContacto,
          plan: s.plan.nombre,
          precioBase: s.plan.precioBase,
          pagado,
          saldo,
        };
      })
      .filter((s) => s.saldo > 0)
      .slice(0, 5);

    const empleadosPendientes = employeePayments
      .filter((p) => p.estado === "PENDIENTE")
      .map((p) => ({
        id: p.id,
        nombre: p.employee.nombre + " " + p.employee.apellido,
        rol: p.employee.rolPuesto,
        monto: p.montoPagado,
        mes: p.mesAplicado,
      }));

    const availableMonths = ["2026-12", "2027-01", "2027-02"];
    const monthlyFlow = await Promise.all(
      availableMonths.map(async (mes) => {
        const [incomes, exp, wages] = await Promise.all([
          prisma.studentPayment.aggregate({
            _sum: { montoPagado: true },
            where: { mesAplicado: mes },
          }),
          prisma.expense.aggregate({
            _sum: { monto: true },
            where: { mesAplicado: mes },
          }),
          prisma.employeePayment.aggregate({
            _sum: { montoPagado: true },
            where: { mesAplicado: mes, estado: "PAGADO" },
          }),
        ]);

        return {
          mes,
          ingresos: incomes._sum.montoPagado || 0,
          egresos: (exp._sum.monto || 0) + (wages._sum.montoPagado || 0),
        };
      })
    );

    return {
      success: true,
      data: {
        totalIngresos,
        totalGastos,
        sueldosPagados,
        sueldosPendientes,
        balanceNeto,
        facturacionEsperada,
        porcentajeCobranza,
        alumnosDeudores,
        empleadosPendientes,
        monthlyFlow,
      },
    };
  } catch (error) {
    console.error("Error al obtener métricas del dashboard:", error);
    return { success: false, error: "Error al calcular métricas financieras" };
  }
}
