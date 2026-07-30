import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import UserMenu from "./UserMenu";

vi.mock("../../../lib/hooks", () => ({
  useAuth: () => ({
    user: { _id: "host-1", name: "Host", email: "host@example.com", avatar: "/avatar.jpg", isAdmin: false },
    logout: vi.fn(),
  }),
  useNotifications: () => ({ notifications: [] }),
}));

vi.mock("../../user-auth/Login", () => ({ default: () => <div>Login</div> }));
vi.mock("../../user-auth/Register", () => ({ default: () => <div>Register</div> }));

describe("UserMenu host navigation", () => {
  it("links List your home to the host dashboard", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><UserMenu /></MemoryRouter>);

    await user.click(screen.getByRole("button", { name: "Open user menu" }));

    expect(screen.getByRole("link", { name: "List your home" })).toHaveAttribute("href", "/host");
    expect(screen.getAllByRole("link", { name: "Services" })).toHaveLength(1);
  });
});
