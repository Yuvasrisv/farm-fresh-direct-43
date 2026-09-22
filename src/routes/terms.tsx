import { createFileRoute } from "@tanstack/react-router";

import { SiteShell, PageHeader } from "@/components/site/SiteShell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of use — Farm Link" },
      {
        name: "description",
        content: "The terms that govern buying and selling produce on Farm Link.",
      },
      { property: "og:title", content: "Terms of use — Farm Link" },
      {
        property: "og:description",
        content: "How listings, orders and payouts work on Farm Link.",
      },
    ],
  }),
  component: TermsPage,
});

const sections = [
  {
    title: "Listings",
    body: "Farmers are responsible for the accuracy of the produce, price, quantity and harvest date they publish. Listings may be removed if they are inaccurate or flagged by buyers.",
  },
  {
    title: "Orders",
    body: "An order is a direct agreement between the buyer and the farms in that order. Farm Link records the order and its status but does not take ownership of the produce.",
  },
  {
    title: "Payments",
    body: "Payment collection is shown as a placeholder step in this version of Farm Link. No real money changes hands until a payment provider is connected.",
  },
  {
    title: "Conduct",
    body: "Accounts that misrepresent produce, refuse delivery without cause, or abuse other members may be suspended by an administrator.",
  },
];

function TermsPage() {
  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-3xl px-4 py-14">
        <PageHeader
          title="Terms of use"
          subtitle="Plain-language terms for a marketplace between growers and buyers."
        />
        <div className="mt-8 space-y-6">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="font-display text-xl">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
