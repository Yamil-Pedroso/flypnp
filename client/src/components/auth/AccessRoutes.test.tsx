import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthContext, type AuthContextValue } from "../../lib/hooks/useAuth";
import { RequireAdmin, RequireAuth } from "./AccessRoutes";

afterEach(cleanup);

const authValue = (user: AuthContextValue["user"]): AuthContextValue => ({
  user,
  authenticationEvent: null,
  loading: false,
  error: null,
  setUser: vi.fn(),
  getAllUsers: vi.fn(),
  register: vi.fn(),
  login: vi.fn(),
  demoLogin: vi.fn(),
  googleLogin: vi.fn(),
  logout: vi.fn(),
  updateUser: vi.fn(),
  uploadPicture: vi.fn(),
});

const Landing = () => {
  const location = useLocation();
  const state = location.state as { authRequired?: boolean; returnTo?: string } | null;
  return <div>Landing {state?.authRequired ? `login:${state.returnTo}` : "public"}</div>;
};

const renderRoute = (guard: "auth" | "admin", user: AuthContextValue["user"]) => render(
  <AuthContext.Provider value={authValue(user)}>
    <MemoryRouter initialEntries={["/private?tab=active"]}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={guard === "admin" ? <RequireAdmin /> : <RequireAuth />}>
          <Route path="/private" element={<div>Private page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  </AuthContext.Provider>,
);

describe("route access guards", () => {
  it("redirects guests to login and remembers the requested page", () => {
    renderRoute("auth", null);

    expect(screen.queryByText("Private page")).not.toBeInTheDocument();
    expect(screen.getByText("Landing login:/private?tab=active")).toBeInTheDocument();
  });

  it("allows an authenticated user into private pages", () => {
    renderRoute("auth", { _id: "user-1", name: "Guest", email: "guest@example.com", avatar: "", isAdmin: false });

    expect(screen.getByText("Private page")).toBeInTheDocument();
  });

  it("keeps non-admin users out of admin pages", () => {
    renderRoute("admin", { _id: "user-1", name: "Guest", email: "guest@example.com", avatar: "", isAdmin: false });

    expect(screen.queryByText("Private page")).not.toBeInTheDocument();
    expect(screen.getByText("Landing public")).toBeInTheDocument();
  });
});
