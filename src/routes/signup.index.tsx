import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingBasket, Sprout } from "lucide-react";

import { SiteShell } from "@/components/site/SiteShell";

export const Route = createFileRoute("/signup/")({
  head: () => ({
    meta: [
      { title: "Join Farm Link — sell or buy farm-direct" },
      {
        name: "description",
        content:
          "Create a Farm Link account as a farmer to sell your harvest, or as a buyer to shop farm-direct produce.",
      },
      { property: "og:title", content: "Join Farm Link" },
      {
        property: "og:description",
        content: "Choose your path: sell your harvest or shop farm-direct.",
      },
    ],
  }),
  component: SignupChoice,
});

function SignupChoice() {
  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-4xl px-4 py-16">
        <h1 className="text-center font-display text-4xl">How will you use Farm Link?</h1>
        <p className="mx-auto mt-3 max-w-lg text-center text-sm text-muted-foreground">
          Pick the account that fits you. You can always reach out to us later if you
          need to change it.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <Link
            to="/signup/farmer"
            className="field-card grain-bg group p-7 transition-shadow hover:shadow-lift"
          >
            <span className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground">
              <Sprout className="size-6" />
            </span>
            <h2 className="mt-5 font-display text-2xl">I'm a farmer</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              List your harvest, set your own price, and sell straight to households
              and shops. Track orders and earnings in one place.
            </p>
            <span className="mt-5 inline-block text-sm font-semibold text-primary">
              Join as Farmer →
            </span>
          </Link>

          <Link
            to="/signup/buyer"
            className="field-card grain-bg group p-7 transition-shadow hover:shadow-lift"
          >
            <span className="grid size-12 place-items-center rounded-full bg-harvest text-harvest-foreground">
              <ShoppingBasket className="size-6" />
            </span>
            <h2 className="mt-5 font-display text-2xl">I'm a buyer</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Shop fresh produce from nearby farms at honest prices — whether for your
              home kitchen or your shop's shelves.
            </p>
            <span className="mt-5 inline-block text-sm font-semibold text-primary">
              Shop Now →
            </span>
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}
