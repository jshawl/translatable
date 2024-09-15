import { beforeEach, describe, expect, test, vi } from "vitest";
import { translatable } from ".";
import { randomUUID } from "crypto";

describe("translatable", () => {
  let mockFetch = vi.fn().mockImplementation(() => ({
    json: () => Promise.resolve({}),
  }));

  const mockResponse = (response) =>
    mockFetch.mockImplementationOnce(() => ({
      json: () => Promise.resolve(response),
    }));

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
  });

  test("constructor", () => {
    const t = translatable();
    expect(typeof t).toBe("function");
  });

  test("t(key) 200", async () => {
    mockResponse({ value: "Bonjour" });
    const t = translatable();
    const translated = await t("Hello");
    console.log("t is...", translated);
    expect(translated).toBe("Bonjour");
  });

  test("t(key) 404 falls back to the key", async () => {
    mockResponse({ error: "Not Found" });
    const t = translatable();
    const key = randomUUID();
    const translated = await t(key);
    expect(translated).toBe(key);
  });
});
