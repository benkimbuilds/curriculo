"use client";

import Link from "next/link";
import { useId, useState } from "react";

import { AdminSummaryCharts } from "@/components/admin/admin-summary-charts";
import { ArrowRight } from "@/components/icons";
import { Avatar, StatusPill } from "@/components/ui";
import type {
  AccountStatusPoint,
  RoleDistributionPoint,
  SignupsTrendPoint,
} from "@/modules/admin/summary-metrics";

type RecentAccount = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: string;
};

type AdminSummaryTabsProps = {
  signupsTrend: SignupsTrendPoint[];
  accountStatus: AccountStatusPoint[];
  roleDistribution: RoleDistributionPoint[];
  recentAccounts: RecentAccount[];
};

type TabId = "graficas" | "nuevos";

const tabs: { id: TabId; label: string }[] = [
  { id: "graficas", label: "Gráficas" },
  { id: "nuevos", label: "Nuevos usuarios" },
];

export function AdminSummaryTabs({
  signupsTrend,
  accountStatus,
  roleDistribution,
  recentAccounts,
}: AdminSummaryTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("graficas");
  const baseId = useId();

  return (
    <section className="panel admin-summary__tabs-panel">
      <div className="panel__header">
        <div>
          <p className="eyebrow">Operación</p>
          <h2>Resumen</h2>
        </div>
      </div>

      <div className="admin-summary__tabs" role="tablist" aria-label="Secciones del resumen">
        {tabs.map((tab) => {
          const selected = activeTab === tab.id;
          return (
            <button
              aria-controls={`${baseId}-${tab.id}`}
              aria-selected={selected}
              className={selected ? "is-active" : undefined}
              id={`${baseId}-tab-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              type="button"
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        aria-labelledby={`${baseId}-tab-graficas`}
        className="admin-summary__tab-panel"
        hidden={activeTab !== "graficas"}
        id={`${baseId}-graficas`}
        role="tabpanel"
      >
        <AdminSummaryCharts
          accountStatus={accountStatus}
          roleDistribution={roleDistribution}
          signupsTrend={signupsTrend}
        />
      </div>

      <div
        aria-labelledby={`${baseId}-tab-nuevos`}
        className="admin-summary__tab-panel"
        hidden={activeTab !== "nuevos"}
        id={`${baseId}-nuevos`}
        role="tabpanel"
      >
        <div className="panel__header admin-summary__recent-header">
          <div>
            <p className="eyebrow">Actividad reciente</p>
            <h2>Cuentas nuevas</h2>
          </div>
          <Link className="text-link" href="/admin/usuarios">
            Ver directorio <ArrowRight />
          </Link>
        </div>
        <div className="admin-summary__accounts">
          {recentAccounts.length ? (
            recentAccounts.map((account) => (
              <Link className="admin-summary__account" href={`/admin/usuarios/${account.id}`} key={account.id}>
                <Avatar
                  color={account.isActive && account.emailVerified ? "green" : "yellow"}
                  name={account.name}
                  size="sm"
                />
                <span>
                  <strong>{account.name}</strong>
                  <small>{account.email}</small>
                </span>
                <StatusPill tone={account.isActive ? (account.emailVerified ? "good" : "warm") : "neutral"}>
                  {account.isActive ? (account.emailVerified ? "Verificada" : "Pendiente") : "Desactivada"}
                </StatusPill>
                <time dateTime={account.createdAt}>
                  {new Intl.DateTimeFormat("es-MX", { dateStyle: "medium" }).format(new Date(account.createdAt))}
                </time>
                <ArrowRight />
              </Link>
            ))
          ) : (
            <p className="admin-summary__chart-empty">Todavía no hay cuentas registradas.</p>
          )}
        </div>
      </div>
    </section>
  );
}
