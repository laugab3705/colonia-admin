"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getStudentsData() {
  try {
    const [students, plans] = await Promise.all([
      prisma.student.findMany({
        include: {
          plan: true,
          pagos: {
            orderBy: { fechaPago: "desc" },
          },
        },
        orderBy: { apellido: "asc" },
      }),
      prisma.plan.findMany({ where: { activo: true } }),
    ]);

    const formattedStudents = students.map((s) => {
      const totalPagado = s.pagos.reduce((acc, p) => acc + p.montoPagado, 0);
      const saldoPendiente = Math.max(0, s.plan.precioBase - totalPagado);

      let estadoCobro: "AL_DIA" | "PARCIAL" | "DEUDOR" = "DEUDOR";
      if (saldoPendiente === 0) estadoCobro = "AL_DIA";
      else if (totalPagado > 0) estadoCobro = "PARCIAL";

      return {
        ...s,
        totalPagado,
        saldoPendiente,
        estadoCobro,
      };
    });

    return { success: true, data: { students: formattedStudents, plans } };
  } catch (error) {
    return { success: false, error: "No se pudieron cargar los alumnos." };
  }
}

export async function createStudent(formData: {
  nombre: string;
  apellido: string;
  dni?: string;
  tutorContacto: string;
  tutorTelefono?: string;
  fichaMedica?: string;
  planId: string;
  estado?: string;
}) {
  try {
    if (!formData.nombre.trim() || !formData.apellido.trim() || !formData.planId) {
      return { success: false, error: "Faltan campos obligatorios" };
    }

    const newStudent = await prisma.student.create({
      data: {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        dni: formData.dni?.trim() || null,
        tutorContacto: formData.tutorContacto.trim(),
        tutorTelefono: formData.tutorTelefono?.trim() || null,
        fichaMedica: formData.fichaMedica?.trim() || null,
        planId: formData.planId,
        estado: formData.estado || "ACTIVO",
      },
    });

    revalidatePath("/alumnos");
    revalidatePath("/");
    return { success: true, data: newStudent };
  } catch (error) {
    return { success: false, error: "Error al registrar el alumno." };
  }
}

export async function registerStudentPayment(paymentData: {
  studentId: string;
  montoPagado: number;
  mesAplicado: string;
  medioPago: string;
  notas?: string;
  comprobanteRef?: string;
}) {
  try {
    if (paymentData.montoPagado <= 0) {
      return { success: false, error: "El monto debe ser un valor positivo" };
    }

    const payment = await prisma.studentPayment.create({
      data: {
        studentId: paymentData.studentId,
        montoPagado: Number(paymentData.montoPagado),
        mesAplicado: paymentData.mesAplicado,
        medioPago: paymentData.medioPago,
        notas: paymentData.notas?.trim() || null,
        comprobanteRef: paymentData.comprobanteRef?.trim() || null,
      },
    });

    revalidatePath("/alumnos");
    revalidatePath("/");
    return { success: true, data: payment };
  } catch (error) {
    return { success: false, error: "Error al registrar el pago del alumno." };
  }
}

export async function deleteStudent(id: string) {
  try {
    await prisma.student.delete({ where: { id } });
    revalidatePath("/alumnos");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: "No se pudo eliminar el alumno." };
  }
}
