"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getExpensesData(selectedMonth: string, categoryId?: string) {
  try {
    const whereClause: any = {};
    if (selectedMonth !== "ALL") {
      whereClause.mesAplicado = selectedMonth;
    }
    if (categoryId && categoryId !== "ALL") {
      whereClause.categoriaId = categoryId;
    }

    const [expenses, categories] = await Promise.all([
      prisma.expense.findMany({
        where: whereClause,
        include: { categoria: true },
        orderBy: { fechaGasto: "desc" },
      }),
      prisma.expenseCategory.findMany({
        orderBy: { nombre: "asc" },
      }),
    ]);

    const totalFiltrado = expenses.reduce((acc, e) => acc + e.monto, 0);

    return {
      success: true,
      data: {
        expenses,
        categories,
        totalFiltrado,
      },
    };
  } catch (error) {
    return { success: false, error: "Error al cargar gastos operativos" };
  }
}

export async function createExpense(data: {
  categoriaId: string;
  descripcion: string;
  fechaGasto: string;
  mesAplicado: string;
  monto: number;
  medioPago: string;
  comprobanteRef?: string;
}) {
  try {
    if (!data.categoriaId || !data.descripcion || data.monto <= 0) {
      return { success: false, error: "Datos de gasto incompletos o inválidos" };
    }

    const expense = await prisma.expense.create({
      data: {
        categoriaId: data.categoriaId,
        descripcion: data.descripcion.trim(),
        fechaGasto: new Date(data.fechaGasto),
        mesAplicado: data.mesAplicado,
        monto: Number(data.monto),
        medioPago: data.medioPago,
        comprobanteRef: data.comprobanteRef?.trim() || null,
      },
    });

    revalidatePath("/gastos");
    revalidatePath("/");
    return { success: true, data: expense };
  } catch (error) {
    return { success: false, error: "Error al registrar el gasto" };
  }
}

export async function deleteExpense(id: string) {
  try {
    await prisma.expense.delete({ where: { id } });
    revalidatePath("/gastos");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al eliminar el gasto" };
  }
}
