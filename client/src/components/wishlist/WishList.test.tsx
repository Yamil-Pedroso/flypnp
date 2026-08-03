import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import WishList from "./WishList";

const wishlistMocks = vi.hoisted(() => ({
  deleteWishlist: vi.fn().mockResolvedValue(undefined),
  refresh: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../../lib/hooks", () => ({
  useWishlist: () => ({
    wishlist: [{ _id: "wish-1", place: "place-1", category: "trending", title: "Alpine hideaway", picture: "/uploads/alpine.jpg" }],
    loading: false,
    error: null,
    refresh: wishlistMocks.refresh,
    deleteWishlist: wishlistMocks.deleteWishlist,
  }),
}));

describe("WishList", () => {
  it("confirms before removing a saved place", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><WishList /></MemoryRouter>);

    expect(screen.getByRole("heading", { name: "Alpine hideaway" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Reserve" })).toHaveAttribute("href", "/place/trending/place-1#reservation");
    await user.click(screen.getByRole("button", { name: "Remove Alpine hideaway from wishlist" }));
    expect(screen.getByRole("dialog", { name: "Remove saved place" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Remove place" }));

    expect(wishlistMocks.deleteWishlist).toHaveBeenCalledWith("place-1");
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Remove saved place" })).not.toBeInTheDocument());
  });
});
