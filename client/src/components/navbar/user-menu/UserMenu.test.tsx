import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import UserMenu from "./UserMenu";

afterEach(cleanup);

vi.mock("../../../lib/hooks", () => ({
  useAuth: () => ({ user: null, logout: vi.fn() }),
  useNotifications: () => ({ notifications: [] }),
  useMessages: () => ({ unreadTotal: 0 }),
}));

vi.mock("../../user-auth/Login", () => ({ default: () => <div>Login</div> }));
vi.mock("../../user-auth/Register", () => ({ default: () => <div>Register</div> }));

describe("UserMenu language modal", () => {
  it("shows only public navigation to signed-out visitors", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><UserMenu /></MemoryRouter>);

    await user.click(screen.getByRole("button", { name: "Open user menu" }));

    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Gift cards" })).toHaveAttribute("href", "/gift-cards");
    expect(screen.getByRole("link", { name: "Help Center" })).toHaveAttribute("href", "/help");
    expect(screen.queryByRole("link", { name: "Trips" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Wishlists" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Messages" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Profile" })).not.toBeInTheDocument();
  });

  it("centers language choices and supports selection and backdrop closing", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><UserMenu /></MemoryRouter>);

    await user.click(screen.getByRole("button", { name: "Language and currency" }));
    expect(screen.getByRole("dialog", { name: "Choose your language" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /English/ })).toHaveAttribute("aria-checked", "true");

    await user.click(screen.getByRole("radio", { name: /Español/ }));
    expect(screen.getByRole("radio", { name: /Español/ })).toHaveAttribute("aria-checked", "true");

    await user.click(screen.getByTestId("language-modal-backdrop"));
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Choose your language" })).not.toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: "Language and currency" }));
    await user.click(screen.getByRole("button", { name: "Close language settings" }));
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Choose your language" })).not.toBeInTheDocument());
  });
});
