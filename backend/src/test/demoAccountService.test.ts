import { beforeEach, describe, expect, it, vi } from "vitest";

const userModel = vi.hoisted(() => ({
  findOne: vi.fn(),
  create: vi.fn(),
}));

vi.mock("../models/User", () => ({ User: userModel }));

import { DEMO_ACCOUNT } from "../config/demoAccount";
import { getOrRestoreDemoAccount } from "../services/demoAccountService";

describe("demo account service", () => {
  beforeEach(() => vi.clearAllMocks());

  it("creates the real MongoDB demo user when it does not exist", async () => {
    const createdUser = { _id: "demo-1", ...DEMO_ACCOUNT, isAdmin: false };
    userModel.findOne.mockResolvedValue(null);
    userModel.create.mockResolvedValue(createdUser);

    await expect(getOrRestoreDemoAccount()).resolves.toBe(createdUser);
    expect(userModel.findOne).toHaveBeenCalledWith({ email: "demo@example.com" });
    expect(userModel.create).toHaveBeenCalledWith({ ...DEMO_ACCOUNT, isAdmin: false });
  });

  it("restores shared demo credentials and removes admin access", async () => {
    const existingUser = {
      name: "Changed name",
      email: DEMO_ACCOUNT.email,
      password: "changed-password",
      avatar: "/changed.jpg",
      isAdmin: true,
      isValidatedPassword: vi.fn().mockResolvedValue(false),
      save: vi.fn().mockResolvedValue(undefined),
    };
    userModel.findOne.mockResolvedValue(existingUser);

    await expect(getOrRestoreDemoAccount()).resolves.toBe(existingUser);
    expect(existingUser).toMatchObject({
      name: DEMO_ACCOUNT.name,
      password: DEMO_ACCOUNT.password,
      avatar: DEMO_ACCOUNT.avatar,
      isAdmin: false,
    });
    expect(existingUser.save).toHaveBeenCalledOnce();
  });
});
