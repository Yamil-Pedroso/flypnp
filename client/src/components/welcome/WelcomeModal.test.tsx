import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import WelcomeModal from "./WelcomeModal";

const { authState } = vi.hoisted(() => ({
  authState: {
    user: null as null | { name: string },
    authenticationEvent: null as null | { id: number; user: { name: string } },
  },
}));

vi.mock("../../lib/hooks", () => ({
  useAuth: () => authState,
}));

describe("WelcomeModal", () => {
  it("shows the general welcome once and greets a newly authenticated user once", async () => {
    const user = userEvent.setup();
    const view = render(<WelcomeModal />);

    expect(await screen.findByRole("dialog", { name: "Welcome to Flypnp" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Start exploring" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

    view.unmount();
    authState.user = { name: "Sofia Moretti" };
    const restoredView = render(<WelcomeModal />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    authState.authenticationEvent = { id: 1, user: authState.user };
    restoredView.rerender(<WelcomeModal />);

    expect(await screen.findByRole("dialog", { name: "Welcome, Sofia!" })).toBeInTheDocument();
    await user.click(screen.getByTestId("welcome-modal-backdrop"));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

    restoredView.rerender(<WelcomeModal />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
