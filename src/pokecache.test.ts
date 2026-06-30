import { Cache } from "./pokecache.js";
import { describe, expect, test } from "vitest";

describe.each([
  {
    key: "https://example.com",
    val: "testdata",
    interval: 500,
  },
  {
    key: "https://example.com/path",
    val: "moretestdata",
    interval: 1000,
  },
])("Test Caching ($interval ms)", ({ key, val, interval }) => {
  test(`stores and retrieves "${val}"`, () => {
    const cache = new Cache(interval);

    cache.add(key, val);
    const cached = cache.get<string>(key);
    expect(cached).toBe(val);

    // A missing key returns undefined.
    expect(cache.get("does-not-exist")).toBe(undefined);

    cache.stopReapLoop();
  });
});

test.concurrent.each([
  {
    key: "https://example.com",
    val: "testdata",
    interval: 50,
    waitFor: 150,
  },
  {
    key: "https://example.com/path",
    val: "moretestdata",
    interval: 100,
    waitFor: 250,
  },
])(
  "Reaping ($interval ms, wait $waitFor ms)",
  async ({ key, val, interval, waitFor }) => {
    const cache = new Cache(interval);

    cache.add(key, val);
    // Present immediately after adding.
    expect(cache.get(key)).toBe(val);

    // After waiting longer than the interval, the entry is reaped.
    await new Promise((resolve) => setTimeout(resolve, waitFor));
    expect(cache.get(key)).toBe(undefined);

    cache.stopReapLoop();
  },
);
