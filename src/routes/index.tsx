import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  BadgeIndianRupee,
  ClipboardList,
  Leaf,
  PackageCheck,
  Search,
  ShoppingBasket,
  Sprout,
  Truck,
  Quote,
} from "lucide-react";

import heroImage from "@/assets/hero-farm.jpg";
import { Button } from "@/components/ui/button";
import { ListingCard } from "@/components/site/ListingCard";
import { SiteShell } from "@/components/site/SiteShell";
import { EmptyState, ErrorState, LoadingGrid } from "@/components/site/States";
import { fetchPublicListings } from "@/lib/queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Farm Link — Buy produce straight from the farmer" },
      {
        name: "description",
        content:
          "Farm Link is a marketplace where farmers sell their harvest directly to households and retailers. Fairer prices for growers, fresher produce for buyers.",
      },
      { property: "og:title", content: "Farm Link — Buy produce straight from the farmer" },
      {
        property: "og:description",
        content:
          "No middlemen. Farmers list their harvest, buyers order direct, everyone wins.",
      },
    ],
  }),
  component: Landing,
});

const farmerSteps = [
  {
    icon: Sprout,
    title: "List your harvest",
    body: "Add your produce with price, quantity and harvest date in under a minute.",
  },
  {
    icon: ClipboardList,
    title: "Receive direct orders",
    body: "Households and shops order from you. You see every order as it comes in.",
  },
  {
    icon: BadgeIndianRupee,
    title: "Get paid fairly",
    body: "You set the price and keep the margin the middlemen used to take.",
  },
];

const buyerSteps = [
  {
    icon: Search,
    title: "Browse nearby farms",
    body: "Filter by category, price, location and how recently it was harvested.",
  },
  {
    icon: ShoppingBasket,
    title: "Fill your basket",
    body: "Mix produce from several farms in one cart and check out in one go.",
  },
  {
    icon: Truck,
    title: "Track to your door",
    body: "Follow every order from confirmed to shipped to delivered.",
  },
];

const testimonials = [
  {
    quote:
      "I used to hand over my tomatoes at whatever rate the trader offered. Now I set my own price and know exactly who is eating my crop.",
    name: "Ramesh Patil",
    role: "Tomato farmer, Nashik",
  },
  {
    quote:
      "My restaurant gets greens harvested the same morning. The quality difference is obvious and it costs me less.",
    name: "Aisha Khan",
    role: "Retailer, Pune",
  },
  {
    quote:
      "Ordering for my family is as easy as any shopping app, except the money reaches the person who grew the food.",
    name: "Deepa Nair",
    role: "Household buyer, Kochi",
  },
];

function Landing() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["featured-listings"],
    queryFn: () => fetchPublicListings(6),
  });

  return (
    <SiteShell>
      {/* Hero */}
      <section className="grain-bg border-b border-border">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              <Leaf className="size-3.5" /> Farm to table, no detours
            </span>
            <h1 className="mt-5 font-display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
              The harvest goes straight from the field to your kitchen.
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground">
              Farm Link connects farmers directly with households and retailers. Growers
              keep the margin that used to disappear in the supply chain, and buyers get
              produce picked days — not weeks — ago.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/signup/farmer">Join as Farmer</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/browse">Shop Now</Link>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 text-center">
              {[
                ["0", "middlemen"],
                ["100%", "farmer-set prices"],
                ["24h", "from harvest to order"],
              ].map(([value, label]) => (
                <div key={label} className="field-card px-3 py-4">
                  <dt className="font-display text-2xl text-primary">{value}</dt>
                  <dd className="mt-1 text-xs text-muted-foreground">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <img
              src={heroImage}
              alt="Farmers holding crates of freshly harvested tomatoes and greens at sunset"
              width={1600}
              height={1104}
              className="aspect-[4/3] w-full rounded-2xl object-cover shadow-lift"
            />
            <div className="field-card absolute -bottom-6 left-4 hidden items-center gap-3 px-4 py-3 sm:flex">
              <PackageCheck className="size-5 text-primary" />
              <p className="text-sm">
                <strong>Fresh today:</strong> produce listed by real farms
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured listings */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl">Trending on Farm Link</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A preview of what farms are selling right now.
            </p>
          </div>
          <Button asChild variant="ghost">
            <Link to="/browse">See all produce →</Link>
          </Button>
        </div>

        <div className="mt-8">
          {isLoading ? (
            <LoadingGrid count={3} />
          ) : isError ? (
            <ErrorState
              message="We couldn't load listings just now."
              onRetry={() => refetch()}
            />
          ) : !data || data.length === 0 ? (
            <EmptyState
              icon={<Sprout className="size-7" />}
              title="No produce listed yet"
              description="Farms are just joining. Be the first to list your harvest."
              action={
                <Button asChild>
                  <Link to="/signup/farmer">Join as Farmer</Link>
                </Button>
              }
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {data.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-secondary/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-16">
          <h2 className="font-display text-3xl">How Farm Link works</h2>
          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            {[
              { label: "For farmers", steps: farmerSteps },
              { label: "For buyers", steps: buyerSteps },
            ].map((group) => (
              <div key={group.label}>
                <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  {group.label}
                </h3>
                <ol className="mt-5 space-y-4">
                  {group.steps.map((step, i) => (
                    <li key={step.title} className="field-card flex gap-4 p-5">
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                        <step.icon className="size-5" />
                      </span>
                      <div>
                        <p className="font-display text-lg">
                          {i + 1}. {step.title}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16">
        <h2 className="font-display text-3xl">Voices from both sides of the field</h2>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="field-card flex flex-col p-6">
              <Quote className="size-6 text-harvest" />
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground">
                {t.quote}
              </blockquote>
              <figcaption className="mt-5 text-sm">
                <span className="font-semibold">{t.name}</span>
                <span className="block text-xs text-muted-foreground">{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-4">
        <div className="grain-bg field-card flex flex-col items-center gap-5 px-6 py-12 text-center">
          <h2 className="font-display text-3xl">Ready to cut out the middlemen?</h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            Whether you grow it or cook with it, Farm Link puts you one step from the
            other side of the field.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/signup/farmer">Join as Farmer</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/browse">Shop Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
