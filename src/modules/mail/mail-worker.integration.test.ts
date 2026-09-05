import { createServer, type Server } from "node:net";

import { eq } from "drizzle-orm";
import { afterEach, describe, expect, it, vi } from "vitest";

import { db } from "@/db";
import { mailOutbox } from "@/db/schema";
import { resetEnvironmentForTests } from "@/shared/env";

const integrationTest = process.env.TEST_DATABASE_URL ? it : it.skip;
let server: Server | undefined;

afterEach(async () => {
  vi.unstubAllEnvs();
  resetEnvironmentForTests();
  if (server) await new Promise<void>((resolve) => server?.close(() => resolve()));
  server = undefined;
});

async function startSmtpServer(): Promise<{ port: number; received: string[] }> {
  const received: string[] = [];
  server = createServer((socket) => {
    socket.setEncoding("utf8");
    socket.write("220 test-smtp ESMTP\r\n");
    let buffer = "";
    let readingMessage = false;

    socket.on("data", (chunk: string) => {
      buffer += chunk;
      while (buffer.length > 0) {
        if (readingMessage) {
          const end = buffer.indexOf("\r\n.\r\n");
          if (end === -1) return;
          received.push(buffer.slice(0, end));
          buffer = buffer.slice(end + 5);
          readingMessage = false;
          socket.write("250 queued\r\n");
          continue;
        }

        const lineEnd = buffer.indexOf("\r\n");
        if (lineEnd === -1) return;
        const line = buffer.slice(0, lineEnd);
        buffer = buffer.slice(lineEnd + 2);

        if (line.startsWith("EHLO")) socket.write("250-test-smtp\r\n250 OK\r\n");
        else if (line === "DATA") {
          readingMessage = true;
          socket.write("354 End data with <CR><LF>.<CR><LF>\r\n");
        } else if (line === "QUIT") {
          socket.write("221 Bye\r\n");
          socket.end();
        } else socket.write("250 OK\r\n");
      }
    });
  });

  await new Promise<void>((resolve) => server?.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("SMTP server did not bind");
  return { port: address.port, received };
}

describe("mail worker", () => {
  integrationTest("delivers queued mail once and removes the token-bearing body", async () => {
    const smtp = await startSmtpServer();
    vi.stubEnv("SMTP_HOST", "127.0.0.1");
    vi.stubEnv("SMTP_PORT", String(smtp.port));
    resetEnvironmentForTests();

    const [queued] = await db
      .insert(mailOutbox)
      .values({
        kind: "account_notification",
        recipient: "student@example.test",
        subject: "Mensaje de prueba",
        textBody: "A one-time secret is present only until delivery.",
      })
      .returning({ id: mailOutbox.id });
    if (!queued) throw new Error("Could not queue test mail");

    const { processOneMail } = await import("@/worker/mail-worker");
    for (let attempt = 0; attempt < 30; attempt += 1) {
      const [current] = await db.select({ status: mailOutbox.status }).from(mailOutbox).where(eq(mailOutbox.id, queued.id));
      if (current?.status === "sent") break;
      await expect(processOneMail(db)).resolves.toBe(true);
    }

    const [delivered] = await db
      .select()
      .from(mailOutbox)
      .where(eq(mailOutbox.id, queued.id))
      .limit(1);
    expect(delivered).toMatchObject({
      status: "sent",
      attempts: 1,
      textBody: "[message content removed after delivery]",
      htmlBody: null,
    });
    expect(delivered?.sentAt).toBeInstanceOf(Date);
    expect(smtp.received.join("\n")).toContain("Mensaje de prueba");
  });
});
