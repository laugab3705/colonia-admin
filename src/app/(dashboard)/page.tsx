"use client";

import React, { useEffect, useState, useTransition } from "react";
import {
  TrendingUp,
  Receipt,
  Users,
  Wallet,
  AlertTriangle,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { getDashboardMetrics } from "@/actions/dashboard";
import { formatCurrency, formatMonthLabel } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState("2027-01");
  const [metrics, setMetrics] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  const loadData = (month: string) => {
    startTransition(async () => {
      const res = await getDashboardMetrics(month);
      if (res.success) {
        setMetrics(res.data);
      }
    });
  };

  useEffect(() => {
    loadData(selectedMonth);
  }, [selectedMonth]);

  const kpis = metrics
    ? [
        {
          title: "Total Ingresos (Cobranzas)",
          value: formatCurrency(metrics.totalIngresos),
          icon: TrendingUp,
          color: "text-emerald-600",
          bg: "bg-emerald-50",
          subtext: "Cobranza: " + metrics.porcentajeCobranza + "%",
        },
        {
          title: "Gastos Operativos",
          value: formatCurrency(metrics.totalGastos),
          icon: Receipt,
          color: "text-rose-600",
          bg: "bg-rose-50",
          subtext: "Predio, merienda, seguros",
        },
        {
          title: "Sueldos Pagados",
          value: formatCurrency(metrics.sueldosPagados),
          icon: Users,
          color: "text-amber-600",
          bg: "bg-amber-50",
          subtext: "Pendiente: " + formatCurrency(metrics.sueldosPendientes),
        },
        {
          title: "Balance Neto",
          value: formatCurrency(metrics.balanceNeto),
          icon: Wallet,
          color: metrics.balanceNeto >= 0 ? "text-blue-600" : "text-rose-600",
          bg: metrics.balanceNeto >= 0 ? "bg-blue-50" : "bg-rose-50",
          badge: metrics.balanceNeto >= 0 ? "SUPERÁVIT" : "DÉFICIT",
        },
      ]
    : [];

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Resumen Financiero
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Supervisión integral de ingresos, costos y nómina de la colonia
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-sm">
          <Calendar className="w-4 h-4 text-slate-400" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="text-xs sm:text-sm font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="2026-12">Diciembre 2026</option>
            <option value="2027-01">Enero 2027</option>
            <option value="2027-02">Febrero 2027</option>
            <option value="ALL">Temporada Completa</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {kpi.title}
              </span>
              <div className={"p-2.5 rounded-xl " + kpi.bg}>
                <kpi.icon className={"w-5 h-5 " + kpi.color} />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight mb-2">
              {kpi.value}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{kpi.subtext}</span>
              {kpi.badge && (
                <Badge variant={metrics.balanceNeto >= 0 ? "success" : "danger"}>
                  {kpi.badge}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Comparativa Mensual: Ingresos vs. Egresos
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Flujo de fondos histórico consolidado por mes
            </p>
          </div>

          <div className="space-y-6">
            {metrics?.monthlyFlow?.map((item: any) => {
              const maxVal = Math.max(item.ingresos, item.egresos, 1);
              const incomePct = Math.round((item.ingresos / (maxVal * 1.2)) * 100);
              const expensePct = Math.round((item.egresos / (maxVal * 1.2)) * 100);

              return (
                <div key={item.mes} className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span>{formatMonthLabel(item.mes)}</span>
                    <span className="text-slate-400 font-normal">
                      Neto: {formatCurrency(item.ingresos - item.egresos)}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Ingresos</span>
                      <span className="font-semibold text-emerald-600">
                        {formatCurrency(item.ingresos)}
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: incomePct + "%" }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Egresos (Gastos + Sueldos)</span>
                      <span className="font-semibold text-rose-500">
                        {formatCurrency(item.egresos)}
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-400 rounded-full transition-all duration-500"
                        style={{ width: expensePct + "%" }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-4 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>Ingresos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <span>Egresos Totales</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h4 className="text-sm font-bold text-slate-900">
                  Alumnos con Saldo Pendiente
                </h4>
              </div>
              <Badge variant="warning">{metrics?.alumnosDeudores?.length || 0}</Badge>
            </div>
            <div className="divide-y divide-slate-100">
              {metrics?.alumnosDeudores?.length === 0 ? (
                <p className="text-xs text-slate-400 py-3">Todos los alumnos están al día.</p>
              ) : (
                metrics?.alumnosDeudores?.map((a: any) => (
                  <div key={a.id} className="py-2.5 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{a.nombre}</p>
                      <p className="text-[10px] text-slate-400">{a.plan}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-rose-600 block">
                        {formatCurrency(a.saldo)}
                      </span>
                      <span className="text-[10px] text-slate-400">Pendiente</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-500" />
                <h4 className="text-sm font-bold text-slate-900">
                  Sueldos Pendientes del Mes
                </h4>
              </div>
              <Badge variant="danger">{metrics?.empleadosPendientes?.length || 0}</Badge>
            </div>
            <div className="divide-y divide-slate-100">
              {metrics?.empleadosPendientes?.length === 0 ? (
                <p className="text-xs text-slate-400 py-3">No hay pagos de nómina pendientes.</p>
              ) : (
                metrics?.empleadosPendientes?.map((p: any) => (
                  <div key={p.id} className="py-2.5 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{p.nombre}</p>
                      <p className="text-[10px] text-slate-400">{p.rol}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-800 block">
                        {formatCurrency(p.monto)}
                      </span>
                      <span className="text-[10px] text-amber-600 font-semibold">
                        Por liquidar
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
