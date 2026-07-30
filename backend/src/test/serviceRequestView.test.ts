import { describe, expect, it } from "vitest";
import { serviceRequestView } from "../utils/serviceRequestView";

describe("serviceRequestView", () => {
  it("hides provider contact details until a service is confirmed", () => {
    const quoted = serviceRequestView({
      status: "quoted",
      provider: {
        name: "Alpine Mobility",
        email: "driver@example.com",
        phone: "+41440000000",
      },
    });

    expect(quoted.provider).toEqual({ name: "Alpine Mobility" });
  });

  it("reveals provider contact details after confirmation", () => {
    const confirmed = serviceRequestView({
      status: "confirmed",
      provider: {
        name: "Alpine Mobility",
        email: "driver@example.com",
        phone: "+41440000000",
      },
    });

    expect(confirmed.provider).toEqual({
      name: "Alpine Mobility",
      email: "driver@example.com",
      phone: "+41440000000",
    });
  });
});
