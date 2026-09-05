import { db, type Database } from "@/db";
import { mailOutbox } from "@/db/schema";

export type MailMessage = {
  kind: "email_verification" | "password_reset" | "account_notification";
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export async function enqueueMail(
  message: MailMessage,
  database: Pick<Database, "insert"> = db,
): Promise<string> {
  const [queued] = await database
    .insert(mailOutbox)
    .values({
      kind: message.kind,
      recipient: message.to,
      subject: message.subject,
      textBody: message.text,
      htmlBody: message.html,
    })
    .returning({ id: mailOutbox.id });

  if (!queued) throw new Error("Mail outbox insert did not return an id");
  return queued.id;
}
