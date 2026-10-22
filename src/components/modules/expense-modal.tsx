"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { createExpense } from "@/actions/expenses";

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: any[];
  onSuccess: () => void;
}

export function ExpenseModal({ isOpen, onClose, categories, onSuccess }: ExpenseModalProps) {
  const [categoriaId, setCategoriaId] = useState(categories[0]?.id || "");
  const [descripcion, setDescripcion] = useState("");
  const [fechaGasto, setFechaGasto] = useState(new Date().toISOString().slice(0, 10));
  const [mesAplicado, setMesAplicado] = useState("2027-01");
  const [monto, setMonto] = useState<number>(0);
  const [medioPago, setMedioPago] = useState("TRANSFERENCIA");
  const [comprobanteRef, setComprobanteRef] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (monto <= 0) {
      alert("El monto debe ser mayor a 0");
      return;
    }

    setLoading(true);
    const res = await createExpense({
      categoriaId: categoriaId || categories[0]?.id,
      descripcion,
      fechaGasto,
      mesAplicado,
      monto: Number(monto),
      medioPago,
      comprobanteRef,
    });

    setLoading(false);
    if (res.success) {
      onSuccess();
      onClose();
      setDescripcion("");
      setMonto(0);
      setComprobanteRef("");
    } else {
      alert(res.error || "Error al cargar gasto");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Carga Rápida de Gasto Operativo"
      description="Registra egresos de predio, insumos, seguros o emergencias"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-bold text-slate-700 uppercase mb-1">Categoría</label>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-700 uppercase mb-1">Concepto / Descripción</label>
          <input
            type="text"
            required
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="ej: Compra de galletitas y jugos para merienda"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Monto ($ ARS)</label>
            <input
              type="number"
              min="1"
              required
              value={monto}
              onChange={(e) => setMonto(parseFloat(e.target.value) || 0)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Fecha de Factura</label>
            <input
              type="date"
              required
              value={fechaGasto}
              onChange={(e) => setFechaGasto(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Mes Imputado</label>
            <select
              value={mesAplicado}
              onChange={(e) => setMesAplicado(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="2026-12">Diciembre 2026</option>
              <option value="2027-01">Enero 2027</option>
              <option value="2027-02">Febrero 2027</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Medio de Pago</label>
            <select
              value={medioPago}
              onChange={(e) => setMedioPago(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="TRANSFERENCIA">Transferencia</option>
              <option value="EFECTIVO">Efectivo</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 uppercase mb-1">
            N° Comprobante / Factura (Opcional)
          </label>
          <input
            type="text"
            value={comprobanteRef}
            onChange={(e) => setComprobanteRef(e.target.value)}
            placeholder="ej: FAC-B-0001-00239"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" size="sm" disabled={loading}>
            {loading ? "Guardando..." : "Registrar Gasto"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
