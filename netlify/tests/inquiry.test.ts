import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Exercise the real handler and pricing engine; replace only external effects.
const { send, promotions } = vi.hoisted(() => ({
  send: vi.fn(),
  promotions: [] as Array<{
    id: string;
    label: string;
    from: string;
    through: string;
    percentOff: number;
  }>,
}));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));
vi.mock("../functions/lib/feeds", () => ({
  feedUrls: () => [],
  loadBlockedDates: vi.fn(),
}));
vi.mock("../functions/lib/rate-limit", () => ({ exceedsLimit: () => false }));
vi.mock("../../shared/pricing-promotions", () => ({
  ACTIVE_PROMOTIONS: promotions,
}));
import inquiry from "../functions/inquiry";

const request = (to: string) =>
  new Request("http://localhost/api/inquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "2026-10-01",
      to,
      guests: 2,
      children: 2,
      name: "Test Family",
      email: "test@example.invalid",
      // A forged frontend amount must never control the server quote.
      total: 1,
    }),
  });

describe("inquiry quote consistency", () => {
  beforeEach(() => {
    send.mockReset().mockResolvedValue({ data: { id: "mock" }, error: null });
    promotions.splice(0);
    vi.stubEnv("RESEND_API_KEY", "test-only");
    vi.stubEnv("OWNER_EMAIL", "owner@example.invalid");
  });
  afterEach(() => vi.unstubAllEnvs());

  it("rejects an unbounded quote request before sending or allocating nightly rows", async () => {
    const response = await inquiry(request("9999-12-31"));
    expect(response.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it("recomputes six nights without a weekly discount in both emails", async () => {
    const response = await inquiry(request("2026-10-07"));
    expect(response.status).toBe(200);
    expect(send).toHaveBeenCalledTimes(2);
    for (const [email] of send.mock.calls) {
      expect(email.text).toContain("380 €/noc · 2280 € za 6 nocí");
      expect(email.text).toContain("Cena spolu: 2280 €");
      expect(email.text).not.toContain("Zľava za 7");
      expect(email.text).not.toContain("Bookingu");
    }
  });

  it("quotes the same 20% family discount to the owner and guest at seven nights", async () => {
    const response = await inquiry(request("2026-10-08"));
    expect(await response.json()).toEqual({ ok: true, confirmationSent: true });
    for (const [email] of send.mock.calls) {
      expect(email.text).toContain("380 €/noc · 2660 € za 7 nocí");
      expect(email.text).toContain("Zľava za 7 a viac nocí (20 %): −532 €");
      expect(email.text).toContain("Cena spolu: 2128 €");
    }
    expect(send.mock.calls[1][0].text).not.toContain("24 hodín");
  });

  it("uses the shared dated offer and never stacks it with the weekly discount", async () => {
    promotions.push({
      id: "test-offer",
      label: "Test dated offer",
      from: "2026-10-01",
      through: "2026-10-07",
      percentOff: 30,
    });
    await inquiry(request("2026-10-08"));
    for (const [email] of send.mock.calls) {
      expect(email.text).toContain("Akciová zľava: −798 €");
      expect(email.text).toContain("Akcia: Test dated offer");
      expect(email.text).toContain("Cena spolu: 1862 €");
      expect(email.text).not.toContain("Zľava za 7");
    }
  });
});
