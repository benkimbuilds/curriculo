import { count, eq, gte, sql } from "drizzle-orm";

import { db } from "@/db";
import { roleAssignments, user } from "@/db/schema";

export const ROLE_LABELS = {
  student: "Estudiante",
  instructor: "Mentor",
  administrator: "Administración",
  curriculum_editor: "Edición curricular",
  developer_administrator: "Administración técnica",
} as const;

export type AccountStatusKey = "verified" | "pending" | "inactive";

export type SignupsTrendPoint = {
  weekKey: string;
  label: string;
  value: number;
};

export type AccountStatusPoint = {
  key: AccountStatusKey;
  label: string;
  value: number;
  color: string;
};

export type RoleDistributionPoint = {
  role: keyof typeof ROLE_LABELS;
  label: string;
  value: number;
};

const WEEK_COUNT = 12;
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

function startOfIsoWeek(date: Date): Date {
  const result = new Date(date);
  const day = result.getUTCDay();
  const daysFromMonday = day === 0 ? 6 : day - 1;
  result.setUTCDate(result.getUTCDate() - daysFromMonday);
  result.setUTCHours(0, 0, 0, 0);
  return result;
}

function weekKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function buildEmptyTrend(now = new Date()): SignupsTrendPoint[] {
  const latestWeek = startOfIsoWeek(now);
  const formatter = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", timeZone: "UTC" });
  return Array.from({ length: WEEK_COUNT }, (_, index) => {
    const week = new Date(latestWeek.getTime() - (WEEK_COUNT - 1 - index) * MS_PER_WEEK);
    return {
      weekKey: weekKey(week),
      label: formatter.format(week),
      value: 0,
    };
  });
}

export async function loadAdminSummaryCharts(organizationId: string) {
  const trendScaffold = buildEmptyTrend();
  const rangeStart = new Date(trendScaffold[0]!.weekKey + "T00:00:00.000Z");

  const [signupRows, [statusRow], roleRows] = await Promise.all([
    db
      .select({
        week: sql<string>`date_trunc('week', ${user.createdAt} AT TIME ZONE 'UTC')`.as("week"),
        value: count(),
      })
      .from(user)
      .where(gte(user.createdAt, rangeStart))
      .groupBy(sql`date_trunc('week', ${user.createdAt} AT TIME ZONE 'UTC')`),
    db
      .select({
        verified: sql<number>`cast(count(*) filter (where ${user.isActive} and ${user.emailVerified}) as integer)`,
        pending: sql<number>`cast(count(*) filter (where ${user.isActive} and not ${user.emailVerified}) as integer)`,
        inactive: sql<number>`cast(count(*) filter (where not ${user.isActive}) as integer)`,
      })
      .from(user),
    db
      .select({
        role: roleAssignments.role,
        value: count(),
      })
      .from(roleAssignments)
      .where(eq(roleAssignments.organizationId, organizationId))
      .groupBy(roleAssignments.role),
  ]);

  const signupByWeek = new Map(
    signupRows.map((row) => {
      const week = startOfIsoWeek(new Date(String(row.week)));
      return [weekKey(week), Number(row.value)];
    }),
  );

  const signupsTrend: SignupsTrendPoint[] = trendScaffold.map((point) => ({
    ...point,
    value: signupByWeek.get(point.weekKey) ?? 0,
  }));

  const accountStatus: AccountStatusPoint[] = [
    {
      key: "verified",
      label: "Verificada",
      value: Number(statusRow?.verified ?? 0),
      color: "#70a885",
    },
    {
      key: "pending",
      label: "Pendiente",
      value: Number(statusRow?.pending ?? 0),
      color: "#f7cd56",
    },
    {
      key: "inactive",
      label: "Desactivada",
      value: Number(statusRow?.inactive ?? 0),
      color: "#68746f",
    },
  ];

  const roleDistribution: RoleDistributionPoint[] = roleRows
    .map((row) => ({
      role: row.role,
      label: ROLE_LABELS[row.role],
      value: Number(row.value),
    }))
    .sort((left, right) => right.value - left.value || left.label.localeCompare(right.label, "es"));

  return { signupsTrend, accountStatus, roleDistribution };
}
