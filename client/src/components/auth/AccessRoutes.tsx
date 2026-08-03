import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../lib/hooks";

const AccessLoading = () => (
  <main className="grid min-h-[40vh] place-items-center px-4" role="status" aria-label="Checking your session">
    <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
      <span className="size-5 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" aria-hidden="true" />
      Checking your session…
    </div>
  </main>
);

export const RequireAuth = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <AccessLoading />;
  if (!user) {
    return (
      <Navigate
        to="/"
        replace
        state={{ authRequired: true, returnTo: `${location.pathname}${location.search}` }}
      />
    );
  }

  return <Outlet />;
};

export const RequireAdmin = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <AccessLoading />;
  if (!user) {
    return (
      <Navigate
        to="/"
        replace
        state={{ authRequired: true, returnTo: `${location.pathname}${location.search}` }}
      />
    );
  }
  if (!user.isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
};
