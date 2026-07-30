import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../models/ServiceRequest", () => ({
  ServiceRequest: {
    create: vi.fn(),
    findById: vi.fn(),
  },
}));
vi.mock("../models/Payment", () => ({
  Payment: { findOne: vi.fn() },
}));
vi.mock("../services/notificationService", () => ({
  notifyUser: vi.fn(),
}));
vi.mock("../config/stripe", () => ({
  stripe: { paymentIntents: { cancel: vi.fn() } },
}));

import { ServiceRequest } from "../models/ServiceRequest";
import { Payment } from "../models/Payment";
import { notifyUser } from "../services/notificationService";
import { cancelServiceRequest, createServiceRequest, quoteServiceRequest } from "../controllers/serviceController";

const responseMock = () => {
  const response = { status: vi.fn(), json: vi.fn() };
  response.status.mockReturnValue(response);
  return response as unknown as Response;
};

describe("service requests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(Payment.findOne).mockResolvedValue(null);
    vi.mocked(ServiceRequest.create).mockImplementation(async (input) => ({
      _id: "service-request-1",
      ...input,
    }) as never);
  });

  it("lets an administrator assign a provider and send a quote", async () => {
    const save = vi.fn();
    const serviceRequest = {
      _id: "service-request-1",
      owner: "user-1",
      serviceType: "airport-transfer",
      status: "requested",
      save,
    };
    vi.mocked(ServiceRequest.findById).mockResolvedValue(serviceRequest as never);
    const request = {
      user: { _id: "admin-1", id: "admin-1", name: "Admin", isAdmin: true },
      params: { id: "service-request-1" },
      body: {
        quotePrice: 120,
        provider: { name: "Alpine Mobility", phone: "+41440000000" },
        adminMessage: "Your driver will meet you at arrivals.",
      },
    } as unknown as Request;

    await quoteServiceRequest(request, responseMock());

    expect(serviceRequest.status).toBe("quoted");
    expect(serviceRequest).toEqual(expect.objectContaining({
      quotePrice: 120,
      provider: expect.objectContaining({ name: "Alpine Mobility" }),
    }));
    expect(save).toHaveBeenCalled();
    expect(notifyUser).toHaveBeenCalledWith(expect.objectContaining({
      userId: "user-1",
      type: "service_quote",
    }));
  });

  it("creates an airport transfer with server-controlled status", async () => {
    const request = {
      user: { _id: "user-1", id: "user-1", name: "Ada", isAdmin: false },
      body: {
        serviceType: "airport-transfer",
        destination: "Zurich",
        date: "2099-08-01",
        time: "14:30",
        participants: 3,
        status: "confirmed",
        details: {
          pickup: "Zurich Airport",
          dropoff: "Niederdorf",
          flightNumber: "LX 123",
        },
      },
    } as unknown as Request;
    const response = responseMock();

    await createServiceRequest(request, response);

    expect(ServiceRequest.create).toHaveBeenCalledWith(expect.objectContaining({
      owner: "user-1",
      serviceType: "airport-transfer",
      status: "requested",
      participants: 3,
      details: expect.objectContaining({
        pickup: "Zurich Airport",
        dropoff: "Niederdorf",
      }),
    }));
    expect(response.status).toHaveBeenCalledWith(201);
  });

  it("does not allow another user to cancel a request", async () => {
    vi.mocked(ServiceRequest.findById).mockResolvedValue({
      owner: { toString: () => "another-user" },
      status: "requested",
      save: vi.fn(),
    } as never);
    const request = {
      user: { _id: "user-1", id: "user-1", name: "Ada", isAdmin: false },
      params: { id: "service-request-1" },
    } as unknown as Request;

    await expect(cancelServiceRequest(request, responseMock()))
      .rejects.toThrow("You cannot cancel this service request");
  });
});
