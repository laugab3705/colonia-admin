import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Limpiando datos previos...");
  await prisma.expense.deleteMany();
  await prisma.expenseCategory.deleteMany();
  await prisma.employeePayment.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.studentPayment.deleteMany();
  await prisma.student.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.user.deleteMany();

  console.log("Creando usuarios...");
  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.user.createMany({
    data: [
      {
        email: "admin@colonia.com",
        nombre: "Mariano Gómez",
        passwordHash,
        rol: "ADMIN",
      },
      {
        email: "coord@colonia.com",
        nombre: "Lucía Pérez",
        passwordHash,
        rol: "COORDINADOR",
      },
    ],
  });

  console.log("Creando planes de colonia...");
  const planTemporada = await prisma.plan.create({
    data: {
      nombre: "Temporada Completa (Dic-Feb)",
      precioBase: 250000,
      descripcion: "Acceso completo a todos los meses turno extendido",
    },
  });

  const planEnero = await prisma.plan.create({
    data: {
      nombre: "Enero 2027 - Turno Mañana",
      precioBase: 120000,
      descripcion: "Lunes a viernes de 09:00 a 13:00 hs con merienda incluida",
    },
  });

  const planTarde = await prisma.plan.create({
    data: {
      nombre: "Enero 2027 - Turno Tarde",
      precioBase: 110000,
      descripcion: "Lunes a viernes de 14:00 a 18:00 hs",
    },
  });

  console.log("Creando categorías de gastos...");
  const catAlquiler = await prisma.expenseCategory.create({
    data: { nombre: "Alquiler de Predio y Canchas" },
  });
  const catMerienda = await prisma.expenseCategory.create({
    data: { nombre: "Merienda / Alimentos" },
  });
  const catSeguro = await prisma.expenseCategory.create({
    data: { nombre: "Seguro de Accidentes Personales" },
  });
  const catMateriales = await prisma.expenseCategory.create({
    data: { nombre: "Materiales Didácticos y Pelotas" },
  });
  const catEmergencias = await prisma.expenseCategory.create({
    data: { nombre: "Emergencias Médicas / Área Protegida" },
  });

  console.log("Creando alumnos y cobros...");
  const alumno1 = await prisma.student.create({
    data: {
      nombre: "Mateo",
      apellido: "Fernández",
      dni: "54231890",
      tutorContacto: "Carolina Díaz (Mamá) - 11-4567-8901",
      fichaMedica: "Alérgico a picaduras de abeja. Lleva medicación.",
      planId: planEnero.id,
      estado: "ACTIVO",
    },
  });

  const alumno2 = await prisma.student.create({
    data: {
      nombre: "Sofía",
      apellido: "Álvarez",
      dni: "55123984",
      tutorContacto: "Esteban Álvarez (Papá) - 11-9876-5432",
      planId: planTemporada.id,
      estado: "ACTIVO",
    },
  });

  const alumno3 = await prisma.student.create({
    data: {
      nombre: "Bautista",
      apellido: "Ríos",
      dni: "53891234",
      tutorContacto: "Marcela Varela - 11-3322-1100",
      planId: planTarde.id,
      estado: "ACTIVO",
    },
  });

  await prisma.studentPayment.create({
    data: {
      studentId: alumno1.id,
      montoPagado: 120000,
      mesAplicado: "2027-01",
      medioPago: "TRANSFERENCIA",
      comprobanteRef: "TRF-98231",
      notas: "Pago total mes de enero",
    },
  });

  await prisma.studentPayment.create({
    data: {
      studentId: alumno2.id,
      montoPagado: 100000,
      mesAplicado: "2027-01",
      medioPago: "EFECTIVO",
      comprobanteRef: "REC-0012",
      notas: "Seña inicial temporada",
    },
  });

  console.log("Creando empleados y pagos...");
  const empleado1 = await prisma.employee.create({
    data: {
      nombre: "Nicolás",
      apellido: "Rossi",
      dni: "38920192",
      telefono: "11-4455-6677",
      rolPuesto: "PROFE",
      sueldoAcordado: 180000,
      modalidad: "MENSUAL",
    },
  });

  const empleado2 = await prisma.employee.create({
    data: {
      nombre: "Valeria",
      apellido: "Sosa",
      dni: "40112334",
      telefono: "11-8899-0011",
      rolPuesto: "GUARDAVIDAS",
      sueldoAcordado: 220000,
      modalidad: "MENSUAL",
    },
  });

  await prisma.employeePayment.create({
    data: {
      employeeId: empleado1.id,
      mesAplicado: "2027-01",
      montoPagado: 180000,
      estado: "PAGADO",
      fechaPago: new Date("2027-01-10"),
      medioPago: "TRANSFERENCIA",
      notas: "Sueldo Enero acreditado",
    },
  });

  await prisma.employeePayment.create({
    data: {
      employeeId: empleado2.id,
      mesAplicado: "2027-01",
      montoPagado: 220000,
      estado: "PENDIENTE",
      notas: "A liquidar el 20 de Enero",
    },
  });

  console.log("Creando gastos...");
  await prisma.expense.createMany({
    data: [
      {
        categoriaId: catAlquiler.id,
        descripcion: "Alquiler predio Club Náutico Enero",
        fechaGasto: new Date("2027-01-02"),
        mesAplicado: "2027-01",
        monto: 150000,
        medioPago: "TRANSFERENCIA",
        comprobanteRef: "FAC-B-0004-00123",
      },
      {
        categoriaId: catMerienda.id,
        descripcion: "Compra mayorista de frutas y galletitas",
        fechaGasto: new Date("2027-01-05"),
        mesAplicado: "2027-01",
        monto: 35000,
        medioPago: "EFECTIVO",
        comprobanteRef: "TK-9812",
      },
      {
        categoriaId: catSeguro.id,
        descripcion: "Póliza cobertura accidentes 100 colonos",
        fechaGasto: new Date("2027-01-03"),
        mesAplicado: "2027-01",
        monto: 42000,
        medioPago: "TRANSFERENCIA",
        comprobanteRef: "POL-77123",
      },
    ],
  });

  console.log("Seed completado exitosamente.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
