import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import Services from "./Services";

vi.mock("../../lib/hooks", () => ({
  useAuth: () => ({ user: null }),
}));

vi.mock("../../services", async (importOriginal) => {
  const original = await importOriginal<typeof import("../../services")>();
  return {
    ...original,
    travelServicesService: {
      listRequests: vi.fn(),
      createRequest: vi.fn(),
      cancelRequest: vi.fn(),
    },
  };
});

describe("Services", () => {
  it("shows all three services and switches the request form", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Services /></MemoryRouter>);

    expect(screen.getByRole("heading", { name: /thoughtful extras/i })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { name: "Airport Transfer" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("heading", { name: "Pet Care" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("heading", { name: "Local Guide" }).length).toBeGreaterThan(0);

    const petCard = screen.getAllByRole("heading", { name: "Pet Care" })[0].closest("article");
    expect(petCard).not.toBeNull();
    await user.click(within(petCard!).getByRole("button", { name: /request/i }));

    expect(screen.getByLabelText("Pet type")).toBeInTheDocument();
    expect(screen.getByLabelText("Number of pets")).toBeInTheDocument();
  });
});
