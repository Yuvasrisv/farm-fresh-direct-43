import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { dashboardPathFor, useCurrentUser } from "@/lib/auth";

export const Route = createFileRoute("/redirect")({
  ssr: false,
  component: RedirectPage,
});

function RedirectPage() {
  const { user, isLoading, isAuthenticated } = useCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate({ to: "/login", replace: true });
      return;
    }
    navigate({ to: dashboardPathFor(user?.role ?? null), replace: true });
  }, [isLoading, isAuthenticated, user?.role, navigate]);

  return (
    <div className="grid min-h-screen place-items-center">
      <p className="text-sm text-muted-foreground">Taking you to your dashboard…</p>
    </div>
  );
}
