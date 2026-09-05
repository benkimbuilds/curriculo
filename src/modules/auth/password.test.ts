import { describe, expect, it } from "vitest";

import { hashPassword, verifyPassword } from "./password";

describe("password hashing", () => {
  it("uses a salted Argon2id hash", async () => {
    const first = await hashPassword("correct horse battery staple");
    const second = await hashPassword("correct horse battery staple");

    expect(first).toMatch(/^\$argon2id\$/);
    expect(second).not.toBe(first);
    await expect(verifyPassword(first, "correct horse battery staple")).resolves.toBe(true);
    await expect(verifyPassword(first, "wrong password")).resolves.toBe(false);
  });
});
