"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { createStudent } from "@/actions/students";

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: any[];
  onSuccess: () => void;
}

export function StudentModal({ isOpen, onClose, plans, onSuccess }: StudentModalProps) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const [tutorContacto, setTutorContacto] = useState("");
  const [tutorTelefono, setTutorTelefono] = useState("");
  const [fichaMedica, setFichaMedica] = useState("");
  const [planId, setPlanId] = useState(plans[0]?.id || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await createStudent({
      nombre,
      apellido,
      dni,
      tutorContacto,
      tutorTelefono,
      fichaMedica,
      planId: planId || plans[0]?.id,
    });

    setLoading(false);
    if (res.success) {
      onSuccess();
      onClose();
      setNombre("");
      setApellido("");
      setDni("");
      setTutorContacto("");
      setTutorTelefono("");
      setFichaMedica("");
    } else {
      alert(res.error || "Error al inscribir alumno");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Inscribir Nuevo Alumno"
      description="Completa los datos del colono y asigna su plan de temporada"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Nombre</label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ej: Lucas"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Apellido</label>
            <input
              type="text"
              required
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ej: Martínez"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">DNI del Alumno</label>
            <input
              type="text"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ej: 54123980"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Plan de Colonia</label>
            <select
              value={planId}
              onChange={(e) => setPlanId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 uppercase mb-1">
            Contacto Tutor (Nombre y Vínculo)
          </label>
          <input
            type="text"
            required
            value={tutorContacto}
            onChange={(e) => setTutorContacto(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="ej: María Gómez (Madre) - Cel: 11-4567-8900"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 uppercase mb-1">
            Ficha Médica / Alergias / Medicación
          </label>
          <textarea
            rows={2}
            value={fichaMedica}
            onChange={(e) => setFichaMedica(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Alergias a picaduras, asma, grupo sanguíneo..."
          />
        </div>

        <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" size="sm" disabled={loading}>
            {loading ? "Guardando..." : "Inscribir Alumno"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
