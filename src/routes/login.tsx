import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Leaf } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteShell } from "@/components/site/SiteShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — Farm Link" },
      {
        name: "description",
        content: "Log in to your Farm Link account to sell or buy farm-fresh produce.",
      },
      { property: "og:title", content: "Log in — Farm Link" },
      {
        property: "og:description",
        content: "Access your Farm Link farmer or buyer dashboard.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back to Farm Link");
    navigate({ to: "/redirect" });
  };

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-md px-4 py-16">
        <div className="field-card p-7">
          <span className="grid size-11 place-items-center rounded-full bg-primary text-primary-foreground">
            <Leaf className="size-5" />
          </span>
          <h1 className="mt-5 font-display text-3xl">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Log in to manage your produce, orders and deliveries.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary underline-offset-2 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Logging in…" : "Log in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New to Farm Link?{" "}
            <Link to="/signup" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </SiteShell>
  );
}
