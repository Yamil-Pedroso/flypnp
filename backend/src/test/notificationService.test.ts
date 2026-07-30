import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../models/User", () => ({
  User: { findById: vi.fn() },
}));
vi.mock("../models/Notification", () => ({
  Notification: { create: vi.fn() },
}));
vi.mock("../models/EmailDelivery", () => ({
  EmailDelivery: {
    create: vi.fn(),
    findOneAndUpdate: vi.fn(),
  },
}));

import { User } from "../models/User";
import { Notification } from "../models/Notification";
import { EmailDelivery } from "../models/EmailDelivery";
import { notifyUser } from "../services/notificationService";

describe("notifyUser", () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = "re_test";
    process.env.EMAIL_FROM = "Flypnp <notifications@example.com>";
    vi.mocked(User.findById).mockReturnValue({
      select: vi.fn().mockResolvedValue({
        _id: "user-1",
        name: "Ada",
        email: "ada@example.com",
      }),
    } as never);
    vi.mocked(Notification.create).mockResolvedValue({} as never);
    vi.mocked(EmailDelivery.create).mockResolvedValue({} as never);
  });

  afterEach(() => {
    delete process.env.RESEND_API_KEY;
    delete process.env.EMAIL_FROM;
    vi.clearAllMocks();
  });

  it("persists both the in-app notification and an email outbox item", async () => {
    await notifyUser({
      userId: "user-1",
      type: "service_quote",
      title: "Quote ready",
      message: "Review your quote.",
      actionUrl: "/services",
      dedupeKey: "service-quote:1",
      emailSubject: "Your quote is ready",
      emailText: "Sign in to review your quote.",
    });

    expect(Notification.create).toHaveBeenCalledWith(expect.objectContaining({
      user: "user-1",
      type: "service_quote",
      actionUrl: "/services",
      dedupeKey: "service-quote:1",
    }));
    expect(EmailDelivery.create).toHaveBeenCalledWith(expect.objectContaining({
      recipient: "ada@example.com",
      status: "pending",
      dedupeKey: "service-quote:1",
    }));
  });
});
