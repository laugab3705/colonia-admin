"use client";

import React from "react";
import { Modal } from "@/components/ui/modal";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { CreditCard, HeartPulse, User, Phone } from "lucide-react";

interface StudentDetailProps {
  isOpen: boolean;
  onClose: () => void;
  student: any;
}

export function StudentDetailModal({ isOpen, onClose, student }: StudentDetailProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ficha Integral del Alumno"
      description={"Legajo de " + student.nombre + " " + student.apellido}
    >
      <div className="space-y-6 text-xs">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2.5">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <User className="w-4 h-4 text-blue-600" />
            <span>DNI: {student.dni || "No especificado"}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>{student.tutorContacto}</span>
          </div>
          {student.fichaMedica && (
            <div className="mt-2 pt-2 border-t border-slate-200/80 flex items-start gap-2 text-rose-700 bg-rose-50/50 p-2.5 rounded-xl">
              <HeartPulse className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <div>
                <span className="font-bold block">Ficha Médica / Alergias:</span>
                <span>{student.fichaMedica}</span>
              </div>
            </div>
          )}
        </div>

        <div>
          <h4 className="font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-slate-400" />
            Historial de Pagos Registrados
          </h4>
          {student.pagos?.length === 0 ? (
            <p className="text-slate-400 italic bg-slate-50 p-3 rounded-xl">
              No registra pagos para la temporada.
            </p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {student.pagos.map((p: any) => (
                <div
                  key={p.id}
                  className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-slate-800">
                      {formatCurrency(p.montoPagado)}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {formatDate(p.fechaPago)} • {p.medioPago} • Mes: {p.mesAplicado}
                    </div>
                    {p.comprobanteRef && (
                      <div className="text-[10px] text-blue-600 font-mono">
                        Ref: {p.comprobanteRef}
                      </div>
                    )}
                  </div>
                  {p.notas && (
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md max-w-[150px] truncate">
                      {p.notas}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
