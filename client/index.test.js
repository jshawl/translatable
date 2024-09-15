import { describe, expect, test } from "vitest";
import { translatable } from ".";

describe("translatable", () => {
  test("constructor", () => {
    const t = translatable();
    expect(typeof t).toBe("function");
  });
  test("t()", () => {
    const t = translatable();
    expect(t("a translatable key")).toBe("a translatable key");
  });
});
