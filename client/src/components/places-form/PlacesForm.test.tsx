import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import PlacesForm from "./PlacesForm";

const placeMocks = vi.hoisted(() => ({
  create: vi.fn(),
  uploadFromLink: vi.fn(),
  geocode: vi.fn(),
}));

vi.mock("../../lib/hooks", () => ({
  useAuth: () => ({
    user: { _id: "host-1", name: "Ada Host", email: "ada@example.com", avatar: "", isAdmin: false },
  }),
}));

vi.mock("../../services", async (importOriginal) => {
  const original = await importOriginal<typeof import("../../services")>();
  return {
    ...original,
    placesService: {
      ...original.placesService,
      create: placeMocks.create,
      uploadFromLink: placeMocks.uploadFromLink,
      geocode: placeMocks.geocode,
    },
  };
});

describe("PlacesForm", () => {
  it("publishes a listing owned by the signed-in host", async () => {
    placeMocks.uploadFromLink.mockResolvedValueOnce("https://cdn.example.com/home.jpg");
    placeMocks.create.mockResolvedValueOnce({ _id: "place-1" });
    placeMocks.geocode.mockResolvedValueOnce({ latitude: 46.0207, longitude: 7.7491, country: "Switzerland", countryCode: "CH", geocodedAddress: "Zermatt, Switzerland", geocodedAt: new Date().toISOString() });
    const user = userEvent.setup();
    render(<MemoryRouter><PlacesForm /></MemoryRouter>);

    await user.type(screen.getByLabelText("Listing title"), "Alpine home");
    await user.type(screen.getByLabelText("Address"), "Zermatt, Switzerland");
    await user.clear(screen.getByLabelText("Nightly price (CHF)"));
    await user.type(screen.getByLabelText("Nightly price (CHF)"), "200");
    await user.clear(screen.getByLabelText("Maximum guests"));
    await user.type(screen.getByLabelText("Maximum guests"), "4");
    await user.type(screen.getByLabelText("Perks"), "Wi-Fi, Kitchen");
    await user.type(screen.getByLabelText("Description"), "A bright home near the mountain.");
    await user.type(screen.getByLabelText("House rules and extra information"), "Quiet hours after 22:00.");
    await user.type(screen.getByPlaceholderText("Paste a public image URL"), "https://example.com/home.jpg");
    await user.click(screen.getByRole("button", { name: "Add link" }));
    await user.click(screen.getByRole("button", { name: "Publish listing" }));

    await waitFor(() => expect(placeMocks.geocode).toHaveBeenCalledWith("Zermatt, Switzerland"));

    await waitFor(() => expect(placeMocks.create).toHaveBeenCalledWith(expect.objectContaining({
      title: "Alpine home",
      address: "Zermatt, Switzerland",
      price: 200,
      maxGuests: 4,
      perks: ["Wi-Fi", "Kitchen"],
      photos: [{ main: "https://cdn.example.com/home.jpg", thumbnails: [] }],
    })));
  });
});
