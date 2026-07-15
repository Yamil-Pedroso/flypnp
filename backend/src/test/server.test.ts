import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../server/server";

describe("API bootstrap", () => {
  it("exposes a health endpoint", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, service: "flypnp-api" });
  });

  it("returns JSON for unknown API routes", async () => {
    const response = await request(app).get("/api/v1/does-not-exist");
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });
});
