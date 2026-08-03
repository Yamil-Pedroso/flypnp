import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { SearchProvider } from "../SearchContext";
import DestinationPicker from "./DestinationPicker";

const mapLifecycle = vi.hoisted(() => ({ mounted: vi.fn(), unmounted: vi.fn() }));

vi.mock("../../../lib/hooks", () => ({
  usePlaces: () => ({ places: [] }),
}));

vi.mock("./DestinationMap", async () => {
  const { useEffect } = await import("react");
  return {
    default: ({ expanded }: { expanded?: boolean }) => {
      useEffect(() => {
        mapLifecycle.mounted();
        return () => mapLifecycle.unmounted();
      }, []);
      return <div data-testid="mock-destination-map" data-expanded={String(expanded)}>Map</div>;
    },
  };
});

describe("DestinationPicker map explorer", () => {
  it("expands to the viewport without remounting the map portal", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <SearchProvider>
          <DestinationPicker />
        </SearchProvider>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("combobox", { name: "Where" }));
    await user.click(screen.getByRole("button", { name: /Europe/ }));
    await screen.findByTestId("mock-destination-map");

    expect(mapLifecycle.mounted).toHaveBeenCalledTimes(1);
    expect(mapLifecycle.unmounted).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Open map in full screen" }));
    expect(screen.getByRole("button", { name: "Exit full screen map" })).toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "Explore destinations" })).toHaveClass("h-dvh", "max-w-none", "rounded-none");
    expect(screen.getByTestId("mock-destination-map")).toHaveAttribute("data-expanded", "true");
    expect(mapLifecycle.mounted).toHaveBeenCalledTimes(1);
    expect(mapLifecycle.unmounted).not.toHaveBeenCalled();

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.getByRole("button", { name: "Open map in full screen" })).toBeInTheDocument());
    expect(screen.getByRole("dialog", { name: "Explore destinations" })).not.toHaveClass("h-dvh");
    expect(screen.getByTestId("mock-destination-map")).toHaveAttribute("data-expanded", "false");
    expect(mapLifecycle.mounted).toHaveBeenCalledTimes(1);
    expect(mapLifecycle.unmounted).not.toHaveBeenCalled();
  });
});
