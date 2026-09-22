import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SignupShell } from "@/components/site/SignupShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/signup/farmer")({
  head: () => ({
    meta: [
      { title: "Sign up as a farmer — Farm Link" },
      {
        name: "description",
        content:
          "Create a Farm Link farmer account: list your harvest, set your price and sell direct to buyers.",
      },
      { property: "og:title", content: "Sign up as a farmer — Farm Link" },
      {
        property: "og:description",
        content: "Sell your harvest direct, keep more of every rupee.",
      },
    ],
  }),
  component: FarmerSignup,
});

function FarmerSignup() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    farmName: "",
    location: "",
    crops: "",
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          role: "farmer",
          full_name: form.fullName,
          phone: form.phone,
          farm_name: form.farmName,
          location: form.location,
          crops: form.crops,
        },
      },
    });
    setSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    if (!data.session) {
      setConfirmEmail(form.email);
      return;
    }
    toast.success("Welcome to Farm Link!");
    navigate({ to: "/farmer" });
  };

  return (
    <SignupShell
      title="Join as a Farmer"
      subtitle="Tell us about your farm so buyers know who they're buying from."
      confirmEmail={confirmEmail}
    >
      <form onSubmit={onSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" required value={form.fullName} onChange={set("fullName")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone number</Label>
          <Input
            id="phone"
            required
            inputMode="tel"
            value={form.phone}
            onChange={set("phone")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={form.email} onChange={set("email")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={set("password")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="farmName">Farm name</Label>
          <Input id="farmName" required value={form.farmName} onChange={set("farmName")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Farm location (state / district)</Label>
          <Input
            id="location"
            required
            placeholder="e.g. Nashik, Maharashtra"
            value={form.location}
            onChange={set("location")}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="crops">Primary crops grown</Label>
          <Textarea
            id="crops"
            required
            rows={3}
            placeholder="Tomatoes, onions, wheat…"
            value={form.crops}
            onChange={set("crops")}
          />
        </div>
        <Button type="submit" className="sm:col-span-2" disabled={submitting}>
          {submitting ? "Creating account…" : "Create farmer account"}
        </Button>
      </form>
    </SignupShell>
  );
}
