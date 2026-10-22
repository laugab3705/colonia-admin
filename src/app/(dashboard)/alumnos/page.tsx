"use client";

import React, { useEffect, useState, useTransition } from "react";
import {
  Search,
  UserPlus,
  Download,
  CreditCard,
  Eye,
  Trash2,
  Phone,
} from "lucide-react";
import { getStudentsData, deleteStudent } from "@/actions/students";
import { formatCurrency } from "@/lib/formatters";
import { exportToCSV } from "@/lib/export-csv";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StudentModal } from "@/components/modules/student-modal";
import { PaymentModal } from "@/components/modules/payment-modal";
import { StudentDetailModal } from "@/components/modules/student-detail";

export default function StudentsPage() {
  const [data, setData] = useState<{ students: any[]; plans: any[] }>({
    students: [],
    plans: [],
  });
  const [search, setSearch] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("ALL");
  const [isPending, startTransition] = useTransition();

  const [isNewStudentOpen, setIsNewStudentOpen] = useState(false);
  const [selectedForPayment, setSelectedForPayment] = useState<any>(null);
  const [selectedForDetail, setSelectedForDetail] = useState<any>(null);

  const loadStudents = () => {
    startTransition(async () => {
      const res = await getStudentsData();
      if (res.success && res.data) {
        setData(res.data);
      }
    });
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const filteredStudents = data.students.filter((s) => {
    const fullName = (s.nombre + " " + s.apellido + " " + (s.dni || "")).toLowerCase();
    const matchesSearch = fullName.includes(search.toLowerCase());
    const matchesPlan = selectedPlan === "ALL" || s.planId === selectedPlan;
    return matchesSearch && matchesPlan;
  });

  const handleExportCSV = () => {
    const exportRows = filteredStudents.map((s) => ({
      ID: s.id,
      Nombre: s.nombre,
      Apellido: s.apellido,
      DNI: s.dni || "N/A",
      Tutor: s.tutorContacto,
      Plan: s.plan.nombre,
      PrecioPlan: s.plan.precioBase,
      TotalPagado: s.totalPagado,
      SaldoPendiente: s.saldoPendiente,
      EstadoCobro: s.estadoCobro,
      EstadoAlumno: s.estado,
    }));
    exportToCSV("Alumnos_Colonia", exportRows);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar a " + name + "?")) {
      await deleteStudent(id);
      loadStudents();
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Alumnos y Cobranzas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gestión de inscriptos, planes asignados y seguimiento de saldos
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="rounded-xl shadow-sm"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </Button>
          <Button
            size="sm"
            onClick={() => setIsNewStudentOpen(true)}
            className="rounded-xl shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            Nuevo Alumno
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, apellido o DNI..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={selectedPlan}
          onChange={(e) => setSelectedPlan(e.target.value)}
          className="px-3 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="ALL">Todos los Planes</option>
          {data.plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Alumno</th>
                <th className="py-3.5 px-4">Plan Asignado</th>
                <th className="py-3.5 px-4">Costo Plan</th>
                <th className="py-3.5 px-4">Pagado</th>
                <th className="py-3.5 px-4">Saldo Pendiente</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No se encontraron alumnos con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="font-bold text-slate-900">
                        {s.apellido}, {s.nombre}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {s.tutorContacto}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-700">{s.plan.nombre}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {formatCurrency(s.plan.precioBase)}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-600">
                      {formatCurrency(s.totalPagado)}
                    </td>
                    <td className="py-3.5 px-4 font-bold">
                      {s.saldoPendiente > 0 ? (
                        <span className="text-rose-600">
                          {formatCurrency(s.saldoPendiente)}
                        </span>
                      ) : (
                        <span className="text-slate-400">$0</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {s.estadoCobro === "AL_DIA" && (
                        <Badge variant="success">Al Día</Badge>
                      )}
                      {s.estadoCobro === "PARCIAL" && (
                        <Badge variant="warning">Pago Parcial</Badge>
                      )}
                      {s.estadoCobro === "DEUDOR" && (
                        <Badge variant="danger">Sin Pagos</Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          title="Registrar Cobro"
                          onClick={() => setSelectedForPayment(s)}
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>
                        <button
                          title="Ver Ficha e Historial"
                          onClick={() => setSelectedForDetail(s)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          title="Eliminar"
                          onClick={() => handleDelete(s.id, s.nombre + " " + s.apellido)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <StudentModal
        isOpen={isNewStudentOpen}
        onClose={() => setIsNewStudentOpen(false)}
        plans={data.plans}
        onSuccess={loadStudents}
      />

      {selectedForPayment && (
        <PaymentModal
          isOpen={!!selectedForPayment}
          onClose={() => setSelectedForPayment(null)}
          student={selectedForPayment}
          onSuccess={loadStudents}
        />
      )}

      {selectedForDetail && (
        <StudentDetailModal
          isOpen={!!selectedForDetail}
          onClose={() => setSelectedForDetail(null)}
          student={selectedForDetail}
        />
      )}
    </div>
  );
}
