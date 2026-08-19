import { beforeEach, describe, expect, it } from "vitest";
import { exceedsLimit, resetLimits } from "./rate-limit";

describe("exceedsLimit", () => {
  beforeEach(resetLimits);

  it("allows attempts up to the limit and blocks the next one", () => {
    const now = 1_000_000;
    expect(exceedsLimit("ip", 3, 60_000, now)).toBe(false);
    expect(exceedsLimit("ip", 3, 60_000, now)).toBe(false);
    expect(exceedsLimit("ip", 3, 60_000, now)).toBe(false);
    expect(exceedsLimit("ip", 3, 60_000, now)).toBe(true);
  });

  it("counts each key separately", () => {
    const now = 1_000_000;
    exceedsLimit("a", 1, 60_000, now);
    expect(exceedsLimit("a", 1, 60_000, now)).toBe(true);
    expect(exceedsLimit("b", 1, 60_000, now)).toBe(false);
  });

  it("forgets attempts once the window has passed", () => {
    const now = 1_000_000;
    exceedsLimit("ip", 1, 60_000, now);
    expect(exceedsLimit("ip", 1, 60_000, now)).toBe(true);
    // A minute and a bit later the earlier attempts no longer count.
    expect(exceedsLimit("ip", 1, 60_000, now + 60_001)).toBe(false);
  });
});
