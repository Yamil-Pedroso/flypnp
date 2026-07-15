import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { createIntent, retrieveIntent, constructEvent } = vi.hoisted(() => ({ createIntent: vi.fn(), retrieveIntent: vi.fn(), constructEvent: vi.fn() }));
vi.mock("../config/stripe", () => ({
  stripe: {
    paymentIntents: { create: createIntent, retrieve: retrieveIntent, cancel: vi.fn() },
    customers: { create: vi.fn() },
    webhooks: { constructEvent },
  },
}));
vi.mock("../models/Payment", () => ({
  Payment: { create: vi.fn(), findOne: vi.fn(), findById: vi.fn(), findOneAndUpdate: vi.fn() },
}));
vi.mock("../models/Booking", () => ({
  Booking: { findById: vi.fn(), findByIdAndUpdate: vi.fn() },
}));

import { Payment } from "../models/Payment";
import { Booking } from "../models/Booking";
import { confirmPayment, createPayment, handleStripeWebhook } from "../controllers/paymentController";

const responseMock = () => {
  const response = { status: vi.fn(), json: vi.fn() };
  response.status.mockReturnValue(response);
  return response as unknown as Response;
};

describe("createPayment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(Booking.findById).mockResolvedValue({
      _id: "booking-1",
      id: "booking-1",
      owner: { toString: () => "user-1" },
      place: { toString: () => "place-1" },
      price: 500,
      status: "pending",
    } as never);
    createIntent.mockResolvedValue({ id: "pi_test", client_secret: "secret_test" });
    vi.mocked(Payment.findOne).mockResolvedValue(null);
    vi.mocked(Payment.create).mockImplementation(async (value) => ({ ...value, id: "payment-1" }) as never);
  });

  it("calculates the amount from the pending booking and ignores client amounts", async () => {
    const request = {
      user: { _id: "user-1", id: "user-1", name: "Ada", email: "ada@example.com", stripeCustomerId: "cus_test", isAdmin: false },
      body: { bookingId: "booking-1", amount: 1, currency: "chf" },
    } as unknown as Request;
    await createPayment(request, responseMock());
    expect(createIntent).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 55000, currency: "chf", customer: "cus_test" }),
      { idempotencyKey: "flypnp-booking-booking-1" },
    );
    expect(Payment.create).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 55000, status: "pending", booking: "booking-1" })
    );
  });

  it("verifies Stripe before confirming the linked booking", async () => {
    const paymentSave = vi.fn();
    const bookingSave = vi.fn();
    const payment = {
      _id: "payment-1",
      user: { toString: () => "user-1" },
      booking: "booking-1",
      stripeId: "pi_test",
      status: "pending",
      paymentMethod: "",
      save: paymentSave,
    };
    const booking = {
      owner: { toString: () => "user-1" },
      status: "pending",
      save: bookingSave,
    };
    vi.mocked(Payment.findById).mockResolvedValue(payment as never);
    vi.mocked(Booking.findById).mockResolvedValueOnce(booking as never);
    retrieveIntent.mockResolvedValue({ status: "succeeded", payment_method: "pm_card" });

    const request = {
      user: { _id: "user-1", id: "user-1", name: "Ada", isAdmin: false },
      params: { id: "payment-1" },
    } as unknown as Request;
    await confirmPayment(request, responseMock());

    expect(retrieveIntent).toHaveBeenCalledWith("pi_test");
    expect(payment.status).toBe("confirmed");
    expect(booking.status).toBe("confirmed");
    expect(paymentSave).toHaveBeenCalled();
    expect(bookingSave).toHaveBeenCalled();
  });

  it("reuses the payment intent when a guest returns to a pending booking", async () => {
    const existingPayment = {
      id: "payment-1",
      stripeId: "pi_existing",
      status: "pending",
      save: vi.fn(),
    };
    vi.mocked(Payment.findOne).mockResolvedValue(existingPayment as never);
    retrieveIntent.mockResolvedValue({
      id: "pi_existing",
      status: "requires_payment_method",
      client_secret: "secret_existing",
    });
    const response = responseMock();
    const request = {
      user: { _id: "user-1", id: "user-1", name: "Ada", email: "ada@example.com", stripeCustomerId: "cus_test", isAdmin: false },
      body: { bookingId: "booking-1", currency: "chf" },
    } as unknown as Request;

    await createPayment(request, response);

    expect(createIntent).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining({ clientSecret: "secret_existing" }));
  });

  it("confirms the booking from a signed Stripe webhook", async () => {
    const body = Buffer.from("stripe-event");
    constructEvent.mockReturnValue({
      type: "payment_intent.succeeded",
      data: { object: { id: "pi_test", payment_method: "pm_card" } },
    });
    vi.mocked(Payment.findOneAndUpdate).mockResolvedValue({ booking: "booking-1" } as never);
    const response = responseMock();
    const request = {
      body,
      headers: { "stripe-signature": "signature" },
    } as unknown as Request;

    await handleStripeWebhook(request, response);

    expect(constructEvent).toHaveBeenCalledWith(body, "signature", process.env.STRIPE_WEBHOOK_SECRET);
    expect(Booking.findByIdAndUpdate).toHaveBeenCalledWith("booking-1", { status: "confirmed" });
    expect(response.status).toHaveBeenCalledWith(200);
  });
});
