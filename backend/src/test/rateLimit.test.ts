import type { NextFunction, Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../models/RateLimitBucket", () => ({
  RateLimitBucket: { findOneAndUpdate: vi.fn() },
}));

import { RateLimitBucket } from "../models/RateLimitBucket";
import { rateLimit } from "../middlewares/rateLimit";

describe("rateLimit", () => {
  beforeEach(() => vi.clearAllMocks());

  it("allows requests within the distributed limit", async () => {
    vi.mocked(RateLimitBucket.findOneAndUpdate).mockResolvedValue({ count: 2 } as never);
    const headers = new Map<string, string>();
    const request = {
      user: { id: "user-1" },
      socket: {},
    } as unknown as Request;
    const response = {
      setHeader: (name: string, value: string) => headers.set(name, value),
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    await rateLimit({ scope: "test", windowMs: 60_000, max: 3 })(request, response, next);

    expect(next).toHaveBeenCalledWith();
    expect(headers.get("RateLimit-Remaining")).toBe("1");
  });

  it("returns a 429 error through Express after the limit", async () => {
    vi.mocked(RateLimitBucket.findOneAndUpdate).mockResolvedValue({ count: 4 } as never);
    const request = {
      user: { id: "user-1" },
      socket: {},
    } as unknown as Request;
    const response = { setHeader: vi.fn() } as unknown as Response;
    const next = vi.fn() as NextFunction;

    await rateLimit({ scope: "test", windowMs: 60_000, max: 3 })(request, response, next);

    const error = vi.mocked(next).mock.calls[0][0] as unknown as Error & { statusCode: number };
    expect(error.statusCode).toBe(429);
    expect(error.message).toMatch(/too many requests/i);
  });
});
