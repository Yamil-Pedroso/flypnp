import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SucceededPayment from "./SucceededPayment";

const successMocks = vi.hoisted(() => ({
  confirm: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock("../../services", () => ({
  paymentsService: { confirm: successMocks.confirm },
  getErrorMessage: (cause: unknown, fallback: string) => cause instanceof Error ? cause.message : fallback,
}));

vi.mock("../../lib/hooks", () => ({
  useBooking: () => ({ refresh: successMocks.refresh }),
}));

describe("SucceededPayment", () => {
  beforeEach(() => {
    successMocks.confirm.mockReset().mockResolvedValue({ status: "confirmed" });
    successMocks.refresh.mockReset().mockResolvedValue(undefined);
  });

  it("verifies Stripe and refreshes the confirmed booking", async () => {
    render(<MemoryRouter initialEntries={["/succeeded-payment?payment=payment-1"]}><SucceededPayment /></MemoryRouter>);

    await waitFor(() => expect(successMocks.confirm).toHaveBeenCalledWith("payment-1"));
    expect(successMocks.refresh).toHaveBeenCalled();
    expect(await screen.findByRole("heading", { name: "Payment Successful!" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View my trips" })).toHaveAttribute("href", "/trips");
  });
});
