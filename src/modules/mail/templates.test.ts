import { describe, expect, it } from "vitest";

import { verificationEmail } from "./templates";

describe("mail templates", () => {
  it("escapes user and URL values in HTML", () => {
    const message = verificationEmail("<script>alert(1)</script>", "https://example.test/?a=1&b=2");
    expect(message.html).not.toContain("<script>");
    expect(message.html).toContain("&lt;script&gt;");
    expect(message.html).toContain("a=1&amp;b=2");
  });
});
