import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../models/User", () => ({
  User: { findById: vi.fn() },
}));

import { User } from "../models/User";
import { isLoggedIn } from "../middlewares/user";

const mockRequest = (token?: string) =>
  ({
    cookies: {},
    header: vi.fn().mockReturnValue(token ? `Bearer ${token}` : undefined),
  }) as unknown as Request;

const mockResponse = () => {
  const response = {
    status: vi.fn(),
    json: vi.fn(),
  };
  response.status.mockReturnValue(response);
  return response as unknown as Response;
};

describe("isLoggedIn", () => {
  beforeEach(() => vi.mocked(User.findById).mockReset());

  it("rejects a missing token", async () => {
    const response = mockResponse();
    const next = vi.fn() as NextFunction;
    await isLoggedIn(mockRequest(), response, next);
    expect(response.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("attaches the authenticated user", async () => {
    const token = jwt.sign({ id: "user-1" }, process.env.JWT_SECRET!);
    const user = { id: "user-1", isAdmin: false };
    vi.mocked(User.findById).mockResolvedValue(user as never);
    const request = mockRequest(token);
    const next = vi.fn() as NextFunction;
    await isLoggedIn(request, mockResponse(), next);
    expect(request.user).toBe(user);
    expect(next).toHaveBeenCalledOnce();
  });
});
