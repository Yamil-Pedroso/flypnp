import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../models/Experience", () => ({
  Experience: { findById: vi.fn() },
}));
vi.mock("../models/ExperienceBooking", () => ({
  ExperienceBooking: { find: vi.fn(), create: vi.fn() },
}));
vi.mock("../models/Payment", () => ({
  Payment: { findOne: vi.fn() },
}));
vi.mock("../config/stripe", () => ({
  stripe: { paymentIntents: { cancel: vi.fn() } },
}));

import { Experience } from "../models/Experience";
import { ExperienceBooking } from "../models/ExperienceBooking";
import { createExperienceBooking } from "../controllers/experienceController";

const responseMock = () => {
  const response = { status: vi.fn(), json: vi.fn() };
  response.status.mockReturnValue(response);
  return response as unknown as Response;
};

describe("createExperienceBooking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(Experience.findById).mockResolvedValue({
      _id: "experience-1",
      price: 65,
      maxGuests: 8,
      availableDays: [0, 1, 2, 3, 4, 5, 6],
      startTimes: ["10:00", "16:00"],
    } as never);
    vi.mocked(ExperienceBooking.find).mockResolvedValue([] as never);
    vi.mocked(ExperienceBooking.create).mockImplementation(async (value) => ({
      ...value,
      populate: vi.fn(),
    }) as never);
  });

  it("calculates the total on the server and forces pending status", async () => {
    const request = {
      user: { _id: "user-1", id: "user-1", name: "Ada", isAdmin: false },
      body: {
        experienceId: "experience-1",
        date: "2099-08-01",
        startTime: "10:00",
        participants: 3,
        price: 1,
        status: "confirmed",
      },
    } as unknown as Request;

    await createExperienceBooking(request, responseMock());

    expect(ExperienceBooking.create).toHaveBeenCalledWith(expect.objectContaining({
      owner: "user-1",
      price: 195,
      participants: 3,
      status: "pending",
    }));
  });

  it("rejects a slot when the remaining capacity is too small", async () => {
    vi.mocked(ExperienceBooking.find).mockResolvedValue([
      { participants: 6 },
    ] as never);
    const request = {
      user: { _id: "user-1", id: "user-1", name: "Ada", isAdmin: false },
      body: {
        experienceId: "experience-1",
        date: "2099-08-01",
        startTime: "10:00",
        participants: 3,
      },
    } as unknown as Request;

    await expect(createExperienceBooking(request, responseMock()))
      .rejects.toThrow("Not enough seats are available");
  });
});
