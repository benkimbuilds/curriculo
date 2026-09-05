import { sql } from "drizzle-orm";
import nodemailer from "nodemailer";

import { db, type Database } from "@/db";
import { mailOutbox } from "@/db/schema";
import { getEnvironment } from "@/shared/env";
import { logger } from "@/shared/logger";

type ClaimedMail = {
  id: string;
  recipient: string;
  subject: string;
  textBody: string;
  htmlBody: string | null;
  attempts: number;
};

async function claimNextMail(database: Database): Promise<ClaimedMail | null> {
  return database.transaction(async (transaction) => {
    const result = await transaction.execute<{
      id: string;
      recipient: string;
      subject: string;
      text_body: string;
      html_body: string | null;
      attempts: number;
    }>(sql`
      select id, recipient, subject, text_body, html_body, attempts
      from mail_outbox
      where (
        (status in ('pending', 'failed') and available_at <= now())
        or (status = 'processing' and locked_at < now() - interval '5 minutes')
      )
        and attempts < 5
      order by created_at asc
      for update skip locked
      limit 1
    `);
    const row = result.rows[0];
    if (!row) return null;

    await transaction
      .update(mailOutbox)
      .set({ status: "processing", lockedAt: new Date(), attempts: row.attempts + 1 })
      .where(sql`${mailOutbox.id} = ${row.id}`);

    return {
      id: row.id,
      recipient: row.recipient,
      subject: row.subject,
      textBody: row.text_body,
      htmlBody: row.html_body,
      attempts: row.attempts + 1,
    };
  });
}

export async function processOneMail(database: Database = db): Promise<boolean> {
  const message = await claimNextMail(database);
  if (!message) return false;

  const environment = getEnvironment();
  const transport = nodemailer.createTransport({
    host: environment.SMTP_HOST,
    port: environment.SMTP_PORT,
    secure: environment.SMTP_SECURE,
    auth:
      environment.SMTP_USER && environment.SMTP_PASSWORD
        ? { user: environment.SMTP_USER, pass: environment.SMTP_PASSWORD }
        : undefined,
  });

  try {
    await transport.sendMail({
      from: environment.SMTP_FROM,
      to: message.recipient,
      subject: message.subject,
      text: message.textBody,
      html: message.htmlBody ?? undefined,
    });
    await database
      .update(mailOutbox)
      .set({
        status: "sent",
        sentAt: new Date(),
        lockedAt: null,
        lastError: null,
        textBody: "[message content removed after delivery]",
        htmlBody: null,
      })
      .where(sql`${mailOutbox.id} = ${message.id}`);
    logger.info({ mailId: message.id }, "Mail sent");
  } catch (error) {
    const retryDelaySeconds = Math.min(60 * 30, 2 ** message.attempts * 15);
    const finalFailure = message.attempts >= 5;
    await database
      .update(mailOutbox)
      .set({
        status: "failed",
        lockedAt: null,
        availableAt: new Date(Date.now() + retryDelaySeconds * 1000),
        lastError: error instanceof Error ? error.message.slice(0, 2_000) : "Unknown mail error",
      })
      .where(sql`${mailOutbox.id} = ${message.id}`);
    logger[finalFailure ? "error" : "warn"](
      { err: error, mailId: message.id, attempt: message.attempts },
      finalFailure ? "Mail exhausted its retries" : "Mail delivery failed; retry scheduled",
    );
  } finally {
    transport.close();
  }
  return true;
}
