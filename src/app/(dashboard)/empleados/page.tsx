"use client";

import React, { useEffect, useState, useTransition } from "react";
import {
  Download,
  Calendar,
  Send,
} from "lucide-react";
import { getEmployeesData, recordSalaryPayment } from "@/actions/employees";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { exportToCSV } from "@/lib/export-csv";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("2027-01");
  const [isPending, startTransition] = useTransition();

  const loadData = () => {
    startTransition(async () => {
      const res = await getEmployeesData(selectedMonth);
      if (res.success && res.data) {
        setEmployees(res.data);
      }
    });
  };

  useEffect(() => {
    loadData();
  }, [selectedMonth]);

  const handleLiquidate = async (empId: string, monto: number) => {
    if (confirm("¿Liquidar sueldo de " + formatCurrency(monto) + " para el período " + selectedMonth + "?")) {
      await recordSalaryPayment({
        employeeId: empId,
        mesAplicado: selectedMonth,
        montoPagado: monto,
        estado: "PAGADO",
        medioPago: "TRANSFERENCIA",
      });
      loadData();
    }
  };

  const handleExportCSV = () => {
    const rows = employees.map((e) => {
      const pagoMes = e.pagos[0];
      return {
        ID: e.id,
        Nombre: e.apellido + ", " + e.nombre,
        Puesto: e.rolPuesto,
        Modalidad: e.modalidad,
        SueldoAcordado: e.sueldoAcordado,
        EstadoMes: pagoMes ? pagoMes.estado : "NO_GENERADO",
        MontoMes: pagoMes ? pagoMes.montoPagado : e.sueldoAcordado,
      };
    });
    exportToCSV("Personal_Colonia", rows);
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Personal y Sueldos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Plantel de profesores, guardavidas, coordinadores y control de nómina
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="rounded-xl shadow-sm">
            <Download className="w-4 h-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm w-fit">
        <Calendar className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-bold text-slate-500 uppercase">Período de Nómina:</span>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="text-xs sm:text-sm font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
        >
          <option value="2026-12">Diciembre 2026</option>
          <option value="2027-01">Enero 2027</option>
          <option value="2027-02">Febrero 2027</option>
        </select>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Empleado</th>
                <th className="py-3.5 px-4">Puesto / Rol</th>
                <th className="py-3.5 px-4">Modalidad</th>
                <th className="py-3.5 px-4">Sueldo Acordado</th>
                <th className="py-3.5 px-4">Estado de Liquidación</th>
                <th className="py-3.5 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((emp) => {
                const pago = emp.pagos[0];
                const estaPagado = pago?.estado === "PAGADO";

                return (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="font-bold text-slate-900">
                        {emp.apellido}, {emp.nombre}
                      </div>
                      <div className="text-[11px] text-slate-400">{emp.telefono || "Sin tel."}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg text-xs">
                        {emp.rolPuesto}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {emp.modalidad}
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-800">
                      {formatCurrency(emp.sueldoAcordado)}
                    </td>
                    <td className="py-3.5 px-4">
                      {estaPagado ? (
                        <Badge variant="success">Liquidado ({formatDate(pago.fechaPago)})</Badge>
                      ) : (
                        <Badge variant="warning">Pendiente de Pago</Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {!estaPagado ? (
                        <Button
                          size="sm"
                          onClick={() => handleLiquidate(emp.id, emp.sueldoAcordado)}
                          className="rounded-xl text-xs py-1.5 h-8 bg-emerald-600 hover:bg-emerald-700"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Liquidar Sueldo
                        </Button>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Completado</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
