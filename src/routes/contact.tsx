import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";

import { SiteShell, PageHeader } from "@/components/site/SiteShell";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Farm Link" },
      {
        name: "description",
        content: "Reach the Farm Link team for help with listings, orders or deliveries.",
      },
      { property: "og:title", content: "Contact Farm Link" },
      {
        property: "og:description",
        content: "Questions about selling or buying on Farm Link? Talk to us.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-3xl px-4 py-14">
        <PageHeader
          title="Contact us"
          subtitle="Support for farmers and buyers, seven days a week during harvest season."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="field-card p-5">
            <Mail className="size-5 text-primary" />
            <p className="mt-3 text-sm font-semibold">Email</p>
            <p className="text-sm text-muted-foreground">hello@farmlink.example</p>
          </div>
          <div className="field-card p-5">
            <Phone className="size-5 text-primary" />
            <p className="mt-3 text-sm font-semibold">Phone</p>
            <p className="text-sm text-muted-foreground">+91 00000 00000</p>
          </div>
          <div className="field-card p-5">
            <MapPin className="size-5 text-primary" />
            <p className="mt-3 text-sm font-semibold">Office</p>
            <p className="text-sm text-muted-foreground">Pune, Maharashtra</p>
          </div>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          These contact details are placeholders — send us your real email, phone and
          address and we'll put them in.
        </p>
      </div>
    </SiteShell>
  );
}
