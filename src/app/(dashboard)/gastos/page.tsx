"use client";

import React, { useEffect, useState, useTransition } from "react";
import {
  PlusCircle,
  Download,
  Filter,
  Trash2,
  Calendar,
} from "lucide-react";
import { getExpensesData, deleteExpense } from "@/actions/expenses";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { exportToCSV } from "@/lib/export-csv";
import { Button } from "@/components/ui/button";
import { ExpenseModal } from "@/components/modules/expense-modal";

export default function ExpensesPage() {
  const [data, setData] = useState<{
    expenses: any[];
    categories: any[];
    totalFiltrado: number;
  }>({
    expenses: [],
    categories: [],
    totalFiltrado: 0,
  });

  const [selectedMonth, setSelectedMonth] = useState("2027-01");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const loadExpenses = () => {
    startTransition(async () => {
      const res = await getExpensesData(selectedMonth, selectedCategory);
      if (res.success && res.data) {
        setData(res.data);
      }
    });
  };

  useEffect(() => {
    loadExpenses();
  }, [selectedMonth, selectedCategory]);

  const handleExportCSV = () => {
    const rows = data.expenses.map((e) => ({
      ID: e.id,
      Fecha: formatDate(e.fechaGasto),
      MesImputado: e.mesAplicado,
      Categoria: e.categoria.nombre,
      Descripcion: e.descripcion,
      Monto: e.monto,
      MedioPago: e.medioPago,
      ComprobanteRef: e.comprobanteRef || "N/A",
    }));
    exportToCSV("Gastos_Operativos", rows);
  };

  const handleDelete = async (id: string, desc: string) => {
    if (confirm("¿Eliminar gasto \"" + desc + "\"?")) {
      await deleteExpense(id);
      loadExpenses();
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Control de Gastos Operativos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Registro clasificado de compras, servicios, alquileres y suministros
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
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Cargar Gasto
          </Button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 rounded-3xl shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Total Gastos Filtrados ({selectedMonth === "ALL" ? "Temporada" : selectedMonth})
          </span>
          <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {formatCurrency(data.totalFiltrado)}
          </span>
        </div>
        <div className="text-xs text-slate-400 bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700">
          Registros mostrados: <strong className="text-white">{data.expenses.length}</strong>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 flex-1">
          <Calendar className="w-4 h-4 text-slate-400 ml-2" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full py-1.5 text-xs sm:text-sm font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="2026-12">Diciembre 2026</option>
            <option value="2027-01">Enero 2027</option>
            <option value="2027-02">Febrero 2027</option>
            <option value="ALL">Todos los Meses</option>
          </select>
        </div>

        <div className="flex items-center gap-2 flex-1 border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-3">
          <Filter className="w-4 h-4 text-slate-400 ml-2" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full py-1.5 text-xs sm:text-sm font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="ALL">Todas las Categorías</option>
            {data.categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Fecha</th>
                <th className="py-3.5 px-4">Categoría</th>
                <th className="py-3.5 px-4">Concepto / Descripción</th>
                <th className="py-3.5 px-4">Medio de Pago</th>
                <th className="py-3.5 px-4">Comprobante</th>
                <th className="py-3.5 px-4 text-right">Monto</th>
                <th className="py-3.5 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.expenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No se registran gastos con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                data.expenses.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 text-slate-600 font-medium whitespace-nowrap">
                      {formatDate(e.fechaGasto)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg text-xs">
                        {e.categoria.nombre}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900 max-w-xs truncate">
                      {e.descripcion}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{e.medioPago}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      {e.comprobanteRef || "-"}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-rose-600 whitespace-nowrap">
                      {formatCurrency(e.monto)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        title="Eliminar Gasto"
                        onClick={() => handleDelete(e.id, e.descripcion)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={data.categories}
        onSuccess={loadExpenses}
      />
    </div>
  );
}
