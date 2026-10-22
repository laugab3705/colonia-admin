"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { registerStudentPayment } from "@/actions/students";
import { formatCurrency } from "@/lib/formatters";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: any;
  onSuccess: () => void;
}

export function PaymentModal({
  isOpen,
  onClose,
  student,
  onSuccess,
}: PaymentModalProps) {
  const [monto, setMonto] = useState<number>(student.saldoPendiente || 0);
  const [mesAplicado, setMesAplicado] = useState("2027-01");
  const [medioPago, setMedioPago] = useState("TRANSFERENCIA");
  const [comprobanteRef, setComprobanteRef] = useState("");
  const [notas, setNotas] = useState("");
  const [loading, setLoading] = useState(false);

  const nuevoSaldoEstimado = Math.max(0, student.saldoPendiente - (Number(monto) || 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (monto <= 0) {
      alert("El monto debe ser superior a cero.");
      return;
    }

    setLoading(true);
    const res = await registerStudentPayment({
      studentId: student.id,
      montoPagado: Number(monto),
      mesAplicado,
      medioPago,
      comprobanteRef,
      notas,
    });

    setLoading(false);
    if (res.success) {
      onSuccess();
      onClose();
    } else {
      alert(res.error || "Error al registrar el pago");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Cobro de Alumno"
      description={student.apellido + ", " + student.nombre + " • Plan: " + student.plan.nombre}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-3 gap-2 text-center">
          <div>
            <span className="text-slate-400 block font-medium">Precio Plan</span>
            <span className="font-bold text-slate-800">
              {formatCurrency(student.plan.precioBase)}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Pagado</span>
            <span className="font-bold text-emerald-600">
              {formatCurrency(student.totalPagado)}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Saldo Actual</span>
            <span className="font-extrabold text-rose-600">
              {formatCurrency(student.saldoPendiente)}
            </span>
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 uppercase mb-1">
            Monto a Cobrar ($ ARS)
          </label>
          <input
            type="number"
            min="1"
            step="100"
            required
            value={monto}
            onChange={(e) => setMonto(parseFloat(e.target.value) || 0)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1">
            <span>Saldo posterior al cobro:</span>
            <span className="font-bold text-slate-700">
              {formatCurrency(nuevoSaldoEstimado)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Mes Imputado
            </label>
            <select
              value={mesAplicado}
              onChange={(e) => setMesAplicado(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="2026-12">Diciembre 2026</option>
              <option value="2027-01">Enero 2027</option>
              <option value="2027-02">Febrero 2027</option>
              <option value="TEMPORADA">Temporada Completa</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">
              Medio de Pago
            </label>
            <select
              value={medioPago}
              onChange={(e) => setMedioPago(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="TRANSFERENCIA">Transferencia</option>
              <option value="EFECTIVO">Efectivo</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 uppercase mb-1">
            N° de Comprobante / Recibo
          </label>
          <input
            type="text"
            value={comprobanteRef}
            onChange={(e) => setComprobanteRef(e.target.value)}
            placeholder="ej: TRF-109283 o REC-0043"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 uppercase mb-1">
            Notas u Observaciones
          </label>
          <textarea
            rows={2}
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Comentarios adicionales..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" size="sm" disabled={loading}>
            {loading ? "Registrando..." : "Confirmar Cobro"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
