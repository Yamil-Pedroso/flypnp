import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import Profile from "./Profile";

const authMocks = vi.hoisted(() => ({
  logout: vi.fn().mockResolvedValue({ success: true }),
  updateUser: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("../../lib/hooks", () => ({
  useAuth: () => ({
    user: {
      _id: "user-1",
      name: "Yami Traveler",
      email: "yami@example.com",
      avatar: "",
      isAdmin: false,
    },
    logout: authMocks.logout,
    updateUser: authMocks.updateUser,
  }),
  useWishlist: () => ({ wishlist: [{ _id: "wish-1" }, { _id: "wish-2" }] }),
}));

describe("Profile", () => {
  it("keeps profile navigation and opens the editor", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <Routes><Route path="/profile" element={<Profile />} /></Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Your next story starts here." })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Wishlist/ })).toHaveAttribute("href", "/wishlist");
    expect(screen.getByRole("link", { name: /Trips/ })).toHaveAttribute("href", "/trips");
    expect(screen.getByText("2")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Edit profile" }));
    expect(screen.getByRole("dialog", { name: "Edit profile" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close profile editor" }));
    expect(screen.queryByRole("dialog", { name: "Edit profile" })).not.toBeInTheDocument();
  });
});
