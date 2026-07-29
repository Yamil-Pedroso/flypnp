import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../models/Place", () => ({
  Place: { findById: vi.fn() },
}));
vi.mock("../models/Experience", () => ({
  Experience: { findById: vi.fn() },
}));
vi.mock("../models/WishList", () => ({
  WishList: { findOneAndUpdate: vi.fn() },
}));

import { Experience } from "../models/Experience";
import { WishList } from "../models/WishList";
import { addPlaceToWishlist } from "../controllers/wishlistController";

const responseMock = () => {
  const response = { status: vi.fn(), json: vi.fn() };
  response.status.mockReturnValue(response);
  return response as unknown as Response;
};

describe("wishlist experiences", () => {
  beforeEach(() => {
    vi.mocked(Experience.findById).mockResolvedValue({
      _id: "experience-1",
      title: "Zurich photo walk",
      images: ["/photo-walk.jpg"],
    } as never);
    vi.mocked(WishList.findOneAndUpdate).mockResolvedValue({
      _id: "wish-1",
      experience: "experience-1",
      itemType: "experience",
    } as never);
  });

  it("stores an experience with its own type and image", async () => {
    const request = {
      user: { _id: "user-1" },
      body: { experienceId: "experience-1" },
    } as unknown as Request;
    const response = responseMock();

    await addPlaceToWishlist(request, response);

    expect(WishList.findOneAndUpdate).toHaveBeenCalledWith(
      { owner: "user-1", experience: "experience-1" },
      expect.objectContaining({
        owner: "user-1",
        experience: "experience-1",
        itemType: "experience",
        title: "Zurich photo walk",
        picture: "/photo-walk.jpg",
      }),
      expect.objectContaining({ upsert: true }),
    );
    expect(response.status).toHaveBeenCalledWith(201);
  });
});
