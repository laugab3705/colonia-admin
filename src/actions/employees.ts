"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getEmployeesData(selectedMonth: string) {
  try {
    const employees = await prisma.employee.findMany({
      where: { activo: true },
      include: {
        pagos: {
          where: selectedMonth === "ALL" ? {} : { mesAplicado: selectedMonth },
          orderBy: { fechaPago: "desc" },
        },
      },
      orderBy: { apellido: "asc" },
    });

    return { success: true, data: employees };
  } catch (error) {
    return { success: false, error: "Error al obtener empleados" };
  }
}

export async function createEmployee(data: {
  nombre: string;
  apellido: string;
  dni?: string;
  telefono?: string;
  rolPuesto: string;
  sueldoAcordado: number;
  modalidad: string;
}) {
  try {
    if (!data.nombre || !data.apellido || data.sueldoAcordado <= 0) {
      return { success: false, error: "Datos de empleado inválidos" };
    }

    const employee = await prisma.employee.create({
      data: {
        nombre: data.nombre.trim(),
        apellido: data.apellido.trim(),
        dni: data.dni?.trim() || null,
        telefono: data.telefono?.trim() || null,
        rolPuesto: data.rolPuesto,
        sueldoAcordado: Number(data.sueldoAcordado),
        modalidad: data.modalidad,
      },
    });

    revalidatePath("/empleados");
    return { success: true, data: employee };
  } catch (error) {
    return { success: false, error: "Error al guardar empleado" };
  }
}

export async function recordSalaryPayment(data: {
  employeeId: string;
  mesAplicado: string;
  montoPagado: number;
  estado: string;
  medioPago?: string;
  notas?: string;
}) {
  try {
    const existing = await prisma.employeePayment.findFirst({
      where: {
        employeeId: data.employeeId,
        mesAplicado: data.mesAplicado,
      },
    });

    if (existing) {
      await prisma.employeePayment.update({
        where: { id: existing.id },
        data: {
          montoPagado: Number(data.montoPagado),
          estado: data.estado,
          fechaPago: data.estado === "PAGADO" ? new Date() : null,
          medioPago: data.medioPago || null,
          notas: data.notas || null,
        },
      });
    } else {
      await prisma.employeePayment.create({
        data: {
          employeeId: data.employeeId,
          mesAplicado: data.mesAplicado,
          montoPagado: Number(data.montoPagado),
          estado: data.estado,
          fechaPago: data.estado === "PAGADO" ? new Date() : null,
          medioPago: data.medioPago || null,
          notas: data.notas || null,
        },
      });
    }

    revalidatePath("/empleados");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al registrar la liquidación" };
  }
}
