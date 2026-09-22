import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteShell } from "@/components/site/SiteShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset your password — Farm Link" },
      {
        name: "description",
        content: "Send yourself a password reset link for your Farm Link account.",
      },
      { property: "og:title", content: "Reset your password — Farm Link" },
      {
        property: "og:description",
        content: "Get back into your Farm Link account.",
      },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSent(true);
  };

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-md px-4 py-16">
        <div className="field-card p-7">
          <h1 className="font-display text-3xl">Forgot your password?</h1>
          {sent ? (
            <p className="mt-3 text-sm text-muted-foreground">
              We've emailed a reset link to <strong>{email}</strong>. Open it on this
              device to choose a new password.
            </p>
          ) : (
            <>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter your email and we'll send you a link to set a new password.
              </p>
              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Sending…" : "Send reset link"}
                </Button>
              </form>
            </>
          )}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Back to log in
            </Link>
          </p>
        </div>
      </div>
    </SiteShell>
  );
}
