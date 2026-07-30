import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import AdminServices from "./AdminServices";

const adminMocks = vi.hoisted(() => ({
  listAllRequests: vi.fn(),
  quoteRequest: vi.fn(),
}));

vi.mock("../../lib/hooks", () => ({
  useAuth: () => ({
    user: { _id: "admin-1", name: "Admin", email: "admin@flypnp.com", avatar: "", isAdmin: true },
  }),
}));

vi.mock("../../services", async (importOriginal) => {
  const original = await importOriginal<typeof import("../../services")>();
  return {
    ...original,
    travelServicesService: {
      listAllRequests: adminMocks.listAllRequests,
      quoteRequest: adminMocks.quoteRequest,
      cancelRequest: vi.fn(),
    },
  };
});

describe("AdminServices", () => {
  it("lets an admin prepare and send a provider quote", async () => {
    const request = {
      _id: "request-1",
      owner: { _id: "user-1", name: "Ada", email: "ada@example.com", avatar: "" },
      serviceType: "airport-transfer" as const,
      destination: "Zurich",
      date: "2099-08-01T00:00:00.000Z",
      time: "14:30",
      participants: 2,
      details: { pickup: "Airport", dropoff: "Old Town" },
      status: "requested" as const,
    };
    adminMocks.listAllRequests.mockResolvedValueOnce([request]);
    adminMocks.quoteRequest.mockResolvedValueOnce({
      ...request,
      status: "quoted",
      quotePrice: 120,
      provider: { name: "Alpine Mobility", phone: "+41440000000" },
    });
    const user = userEvent.setup();

    render(<MemoryRouter><AdminServices /></MemoryRouter>);

    expect(await screen.findByRole("heading", { name: "Zurich" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Prepare quote" }));
    await user.type(screen.getByLabelText(/Price before service fee/), "120");
    await user.type(screen.getByLabelText("Provider name"), "Alpine Mobility");
    await user.type(screen.getByLabelText("Provider phone"), "+41440000000");
    await user.click(screen.getByRole("button", { name: "Send quote" }));

    expect(adminMocks.quoteRequest).toHaveBeenCalledWith("request-1", expect.objectContaining({
      quotePrice: 120,
      provider: expect.objectContaining({ name: "Alpine Mobility", phone: "+41440000000" }),
    }));
  });
});
