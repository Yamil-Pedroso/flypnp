import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import NotificationsPage from "./NotificationsPage";

const notificationMocks = vi.hoisted(() => ({
  markAsRead: vi.fn().mockResolvedValue(undefined),
  deleteNotification: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../lib/hooks", () => ({
  useNotifications: () => ({
    notifications: [{
      _id: "notification-1",
      type: "service_quote",
      title: "Airport Transfer quote ready",
      message: "Your request is ready to review and pay.",
      actionUrl: "/services",
      read: false,
      createdAt: "2026-07-30T10:00:00.000Z",
    }],
    markAsRead: notificationMocks.markAsRead,
    deleteNotification: notificationMocks.deleteNotification,
  }),
}));

describe("NotificationsPage", () => {
  it("shows actionable service notifications and marks them as read", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><NotificationsPage /></MemoryRouter>);

    expect(screen.getByRole("heading", { name: "Airport Transfer quote ready" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View details" })).toHaveAttribute("href", "/services");
    await user.click(screen.getByRole("button", { name: /mark as read/i }));
    expect(notificationMocks.markAsRead).toHaveBeenCalledWith("notification-1");
  });
});
