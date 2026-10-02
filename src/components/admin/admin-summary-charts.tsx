"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  AccountStatusPoint,
  RoleDistributionPoint,
  SignupsTrendPoint,
} from "@/modules/admin/summary-metrics";

type AdminSummaryChartsProps = {
  signupsTrend: SignupsTrendPoint[];
  accountStatus: AccountStatusPoint[];
  roleDistribution: RoleDistributionPoint[];
};

const tooltipStyle = {
  background: "#fffdf7",
  border: "1px solid #ded8ca",
  borderRadius: 10,
  color: "#0f3028",
  fontSize: 12,
};

function ChartEmpty({ message }: { message: string }) {
  return <p className="admin-summary__chart-empty">{message}</p>;
}

export function AdminSummaryCharts({
  signupsTrend,
  accountStatus,
  roleDistribution,
}: AdminSummaryChartsProps) {
  const hasSignups = signupsTrend.some((point) => point.value > 0);
  const hasStatus = accountStatus.some((point) => point.value > 0);
  const hasRoles = roleDistribution.some((point) => point.value > 0);
  const statusTotal = accountStatus.reduce((sum, point) => sum + point.value, 0);

  return (
    <div className="admin-summary__charts">
      <section aria-label="Registros por semana" className="admin-summary__chart">
        <div className="panel__header">
          <div>
            <p className="eyebrow">Tendencia</p>
            <h2>Registros por semana</h2>
          </div>
          <small>Últimas 12 semanas</small>
        </div>
        {hasSignups ? (
          <div className="admin-summary__chart-canvas">
            <ResponsiveContainer height={240} width="100%">
              <AreaChart data={signupsTrend} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="signupsFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#173f35" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#173f35" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#ded8ca" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "#68746f", fontSize: 11 }} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: "#68746f", fontSize: 11 }} tickLine={false} width={36} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [Number(value ?? 0), "Registros"]} />
                <Area
                  dataKey="value"
                  fill="url(#signupsFill)"
                  name="Registros"
                  stroke="#173f35"
                  strokeWidth={2}
                  type="monotone"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <ChartEmpty message="Aún no hay registros en las últimas 12 semanas." />
        )}
      </section>

      <section aria-label="Estado de cuentas" className="admin-summary__chart">
        <div className="panel__header">
          <div>
            <p className="eyebrow">Cuentas</p>
            <h2>Estado actual</h2>
          </div>
          <small>{statusTotal} en total</small>
        </div>
        {hasStatus ? (
          <div className="admin-summary__chart-canvas admin-summary__chart-canvas--donut">
            <ResponsiveContainer height={240} width="100%">
              <PieChart>
                <Pie
                  cx="50%"
                  cy="50%"
                  data={accountStatus}
                  dataKey="value"
                  innerRadius={58}
                  nameKey="label"
                  outerRadius={84}
                  paddingAngle={2}
                  stroke="none"
                >
                  {accountStatus.map((entry) => (
                    <Cell fill={entry.color} key={entry.key} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(value, name) => [Number(value ?? 0), String(name)]} />
                <Legend
                  formatter={(value) => <span className="admin-summary__legend">{value}</span>}
                  iconType="circle"
                  verticalAlign="bottom"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <ChartEmpty message="No hay cuentas para graficar." />
        )}
      </section>

      <section aria-label="Distribución de roles" className="admin-summary__chart admin-summary__chart--roles">
        <div className="panel__header">
          <div>
            <p className="eyebrow">Acceso</p>
            <h2>Roles asignados</h2>
          </div>
          <small>Por organización</small>
        </div>
        {hasRoles ? (
          <div className="admin-summary__chart-canvas">
            <ResponsiveContainer height={240} width="100%">
              <BarChart
                data={roleDistribution}
                layout="vertical"
                margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
              >
                <CartesianGrid horizontal={false} stroke="#ded8ca" strokeDasharray="3 3" />
                <XAxis allowDecimals={false} tick={{ fill: "#68746f", fontSize: 11 }} type="number" />
                <YAxis
                  dataKey="label"
                  tick={{ fill: "#0f3028", fontSize: 11 }}
                  tickLine={false}
                  type="category"
                  width={120}
                />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [Number(value ?? 0), "Asignaciones"]} />
                <Bar dataKey="value" fill="#78aeda" name="Asignaciones" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <ChartEmpty message="Todavía no hay roles asignados en la organización." />
        )}
      </section>
    </div>
  );
}
