import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { SearchProvider } from "../search/SearchContext";
import Experiences from "./Experiences";

const experienceMocks = vi.hoisted(() => ({
  refresh: vi.fn().mockResolvedValue(undefined),
  experiences: [{
    _id: "experience-1",
    slug: "zurich-street-stories",
    title: "Zurich through a street photographer's lens",
    city: "Zurich",
    country: "Switzerland",
    address: "Niederdorf",
    category: "creative" as const,
    kind: "moment" as const,
    summary: "Learn to notice the city.",
    description: "A thoughtful photo walk.",
    images: ["/experience.jpg"],
    host: { name: "Noah", avatar: "/noah.jpg", bio: "Photographer", yearsHosting: 4 },
    durationMinutes: 150,
    languages: ["English"],
    maxGuests: 6,
    price: 54,
    rating: 4.92,
    reviews: 97,
    meetingPoint: "Central",
    included: ["Coffee"],
    bring: ["Camera"],
    highlights: ["Hidden passages"],
    availableDays: [0, 2, 4, 6],
    startTimes: ["09:00"],
    featured: true,
  }],
}));

vi.mock("../../lib/hooks", () => ({
  useExperiences: () => ({
    experiences: experienceMocks.experiences,
    loading: false,
    error: null,
    refresh: experienceMocks.refresh,
  }),
  useWishlist: () => ({ wishlist: [] }),
}));

describe("Experiences", () => {
  it("shows the catalog and applies category filters", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/experiences"]}>
        <SearchProvider><Experiences /></SearchProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: /Don't just visit/ })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Zurich through a street photographer/ }).length).toBeGreaterThan(0);
    const saveButtons = screen.getAllByRole("button", { name: /Save Zurich through a street photographer/ });
    expect(saveButtons.length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "Creative" }));
    expect(experienceMocks.refresh).toHaveBeenCalledWith(expect.objectContaining({
      category: "creative",
      guests: 1,
    }));

    await user.click(saveButtons[0]);
    expect(screen.getByRole("heading", { name: "Create wishlist" })).toBeInTheDocument();
  });
});
