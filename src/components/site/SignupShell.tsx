import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { SiteShell } from "./SiteShell";

export function SignupShell({
  title,
  subtitle,
  children,
  confirmEmail,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  confirmEmail: string | null;
}) {
  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-2xl px-4 py-14">
        {confirmEmail ? (
          <div className="field-card p-8 text-center">
            <h1 className="font-display text-3xl">Check your inbox</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              We sent a confirmation link to <strong>{confirmEmail}</strong>. Click it to
              activate your Farm Link account, then log in.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Go to log in
            </Link>
          </div>
        ) : (
          <div className="field-card p-7 sm:p-9">
            <h1 className="font-display text-3xl">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            {children}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Log in
              </Link>
            </p>
          </div>
        )}
      </div>
    </SiteShell>
  );
}
