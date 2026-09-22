import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { SiteShell, PageHeader } from "@/components/site/SiteShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Farm Link — our mission" },
      {
        name: "description",
        content:
          "Farm Link exists to put farmers and buyers in direct contact, so growers earn more and food arrives fresher.",
      },
      { property: "og:title", content: "About Farm Link" },
      {
        property: "og:description",
        content: "Why we built a farm-direct produce marketplace.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-3xl px-4 py-14">
        <PageHeader
          title="About Farm Link"
          subtitle="A marketplace built around one simple idea: the person who grows the food should meet the person who eats it."
        />
        <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted-foreground">
          <p>
            Across most produce supply chains, a crop changes hands four or five times
            before it reaches a kitchen. Every handover takes a cut and adds a day. The
            farmer ends up with the smallest share and the buyer with the oldest produce.
          </p>
          <p>
            Farm Link removes those steps. Farmers list what they've harvested, set their
            own price, and sell straight to households and retailers. Buyers see exactly
            which farm their food came from and when it was picked.
          </p>
          <p>
            We keep the platform deliberately simple so it works on a basic phone in the
            middle of a field, with patchy signal and one hand free.
          </p>
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/signup/farmer">Join as Farmer</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/browse">Shop Now</Link>
          </Button>
        </div>
      </div>
    </SiteShell>
  );
}
