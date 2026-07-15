import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import AddGuests from "./AddGuests";

describe("AddGuests", () => {
  it("adds an adult automatically when a child is selected", async () => {
    const user = userEvent.setup();
    render(<AddGuests />);

    await user.click(screen.getByRole("button", { name: "Open guest selector" }));
    await user.click(screen.getByRole("button", { name: "Increase Children" }));

    expect(screen.getByLabelText("Adults count")).toHaveTextContent("1");
    expect(screen.getByLabelText("Children count")).toHaveTextContent("1");
    expect(screen.getByRole("button", { name: "Open guest selector" })).toHaveTextContent("2 guests");
    expect(screen.getByRole("button", { name: "Decrease Adults" })).toBeDisabled();
  });
});
