import type { Database } from "@/db";
import { auditEvents } from "@/db/schema";

export type AuditEventInput = {
  eventType: string;
  subjectType: string;
  subjectId?: string;
  actorUserId?: string;
  organizationId?: string;
  metadata?: Record<string, unknown>;
  requestId?: string;
  ipAddress?: string;
};

export async function recordAuditEvent(
  database: Pick<Database, "insert">,
  event: AuditEventInput,
): Promise<void> {
  await database.insert(auditEvents).values({
    eventType: event.eventType,
    subjectType: event.subjectType,
    subjectId: event.subjectId,
    actorUserId: event.actorUserId,
    organizationId: event.organizationId,
    metadata: event.metadata ?? {},
    requestId: event.requestId,
    ipAddress: event.ipAddress,
  });
}
