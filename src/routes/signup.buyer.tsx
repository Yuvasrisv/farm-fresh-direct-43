import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SignupShell } from "@/components/site/SignupShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/signup/buyer")({
  head: () => ({
    meta: [
      { title: "Sign up as a buyer — Farm Link" },
      {
        name: "description",
        content:
          "Create a Farm Link buyer account and shop fresh produce straight from nearby farms.",
      },
      { property: "og:title", content: "Sign up as a buyer — Farm Link" },
      {
        property: "og:description",
        content: "Shop farm-direct produce for your home or your shop.",
      },
    ],
  }),
  component: BuyerSignup,
});

function BuyerSignup() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState<string | null>(null);
  const [buyerType, setBuyerType] = useState("individual");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
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
          role: "buyer",
          full_name: form.fullName,
          phone: form.phone,
          address: form.address,
          buyer_type: buyerType,
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
    navigate({ to: "/buyer" });
  };

  return (
    <SignupShell
      title="Join as a Buyer"
      subtitle="Tell us where to deliver and whether you're buying for home or for a shop."
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
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="address">Delivery address</Label>
          <Textarea
            id="address"
            required
            rows={3}
            value={form.address}
            onChange={set("address")}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Buyer type</Label>
          <Select value={buyerType} onValueChange={setBuyerType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">Individual / household</SelectItem>
              <SelectItem value="retailer">Retailer / shop</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="sm:col-span-2" disabled={submitting}>
          {submitting ? "Creating account…" : "Create buyer account"}
        </Button>
      </form>
    </SignupShell>
  );
}
