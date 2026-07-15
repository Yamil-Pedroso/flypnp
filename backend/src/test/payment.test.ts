import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { createIntent } = vi.hoisted(() => ({ createIntent: vi.fn() }));
vi.mock("../config/stripe", () => ({
  stripe: {
    paymentIntents: { create: createIntent, cancel: vi.fn() },
    webhooks: { constructEvent: vi.fn() },
  },
}));
vi.mock("../models/Payment", () => ({
  Payment: { create: vi.fn() },
}));
vi.mock("../models/Place", () => ({
  Place: { findById: vi.fn() },
}));

import { Payment } from "../models/Payment";
import { Place } from "../models/Place";
import { createPayment } from "../controllers/paymentController";

const responseMock = () => {
  const response = { status: vi.fn(), json: vi.fn() };
  response.status.mockReturnValue(response);
  return response as unknown as Response;
};

describe("createPayment", () => {
  beforeEach(() => {
    vi.mocked(Place.findById).mockResolvedValue({
      _id: "place-1",
      id: "place-1",
      price: 125,
    } as never);
    createIntent.mockResolvedValue({ id: "pi_test", client_secret: "secret_test" });
    vi.mocked(Payment.create).mockImplementation(async (value) => value as never);
  });

  it("ignores a client-provided amount", async () => {
    const request = {
      user: { _id: "user-1", id: "user-1", name: "Ada", isAdmin: false },
      body: { placeId: "place-1", amount: 1, currency: "chf" },
    } as unknown as Request;
    await createPayment(request, responseMock());
    expect(createIntent).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 12500, currency: "chf" })
    );
    expect(Payment.create).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 12500, status: "pending" })
    );
  });
});
