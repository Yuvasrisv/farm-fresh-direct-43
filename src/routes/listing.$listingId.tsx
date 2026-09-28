import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, MapPin, Minus, Plus, ShoppingBasket, Wallet } from "lucide-react";
import { toast } from "sonner";

import { SiteShell } from "@/components/site/SiteShell";
import { ErrorState, LoadingGrid } from "@/components/site/States";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/lib/cart";
import { PLACEHOLDER_IMAGE, formatMoney, freshnessLabel } from "@/lib/farmlink";

export const Route = createFileRoute("/listing/$listingId")({
  head: () => ({
    meta: [
      { title: "Produce Details — Farm Link" },
      { name: "description", content: "View this farm listing on Farm Link." },
      { property: "og:title", content: "Produce Details — Farm Link" },
      { property: "og:description", content: "Fresh produce direct from the farm." },
    ],
  }),
  component: ListingDetail,
});

function ListingDetail() {
  const { listingId } = useParams({ from: "/listing/$listingId" });
  const cart = useCart();
  const [qty, setQty] = useState(1);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["listing", listingId],
    queryFn: async () => {
      const { data: listing, error } = await supabase
        .from("listings")
        .select("id, name, category, price, unit, quantity, harvest_date, images, farmer_id, description")
        .eq("id", listingId)
        .single();
      if (error) throw error;
      const [{ data: profile }, { data: farm }] = await Promise.all([
        supabase.from("profiles").select("full_name").eq("id", listing.farmer_id).maybeSingle(),
        supabase.from("farmer_details").select("farm_name, location").eq("user_id", listing.farmer_id).maybeSingle(),
      ]);
      return {
        ...listing,
        price: Number(listing.price),
        quantity: Number(listing.quantity),
        farmerName: farm?.farm_name || profile?.full_name || "Farm Link farmer",
        farmLocation: farm?.location ?? null,
      };
    },
  });

  if (isLoading) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-5xl px-4 py-12">
          <LoadingGrid count={1} />
        </div>
      </SiteShell>
    );
  }
  if (isError || !data) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-5xl px-4 py-12">
          <ErrorState message="We couldn't load this listing." onRetry={() => refetch()} />
        </div>
      </SiteShell>
    );
  }

  const image = data.images?.[0] || PLACEHOLDER_IMAGE;
  const soldOut = data.quantity <= 0;

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-5xl px-4 py-10">
        <Button asChild variant="ghost" size="sm" className="mb-6 gap-1.5">
          <Link to="/browse">
            <ArrowLeft className="size-4" /> Back to browse
          </Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-2">
          <img
            src={image}
            alt={data.name}
            className="aspect-[4/3] w-full rounded-2xl object-cover shadow-lift"
          />
          <div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              {data.category}
            </span>
            <h1 className="mt-3 font-display text-4xl">{data.name}</h1>
            <p className="mt-2 text-sm text-muted-foreground">by {data.farmerName}</p>
            {data.farmLocation ? (
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-3.5" /> {data.farmLocation}
              </p>
            ) : null}
            <p className="mt-2 text-sm text-muted-foreground">{freshnessLabel(data.harvest_date)}</p>

            <p className="mt-6 font-display text-3xl text-primary">
              {formatMoney(data.price)}
              <span className="text-sm font-normal text-muted-foreground"> / {data.unit}</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {soldOut ? "Sold out" : `${data.quantity} ${data.unit} available`}
            </p>

            {data.description ? (
              <p className="mt-5 text-sm leading-relaxed text-foreground">{data.description}</p>
            ) : null}

            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center rounded-md border border-border">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  className="p-2"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-10 text-center text-sm font-semibold">{qty}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  className="p-2"
                  onClick={() => setQty((q) => Math.min(data.quantity || 999, q + 1))}
                >
                  <Plus className="size-4" />
                </button>
              </div>
              <Button
                className="gap-1.5"
                disabled={soldOut}
                onClick={() => {
                  cart.add(
                    {
                      listingId: data.id,
                      name: data.name,
                      price: data.price,
                      unit: data.unit,
                      farmerId: data.farmer_id,
                      farmerName: data.farmerName,
                      image,
                      maxQuantity: data.quantity,
                    },
                    qty,
                  );
                  toast.success(`${qty} × ${data.name} added to cart`);
                }}
              >
                <ShoppingBasket className="size-4" />
                {soldOut ? "Sold out" : "Add to cart"}
              </Button>
            </div>

            <p className="mt-6 flex items-center gap-2 rounded-lg bg-secondary/60 px-4 py-3 text-xs text-muted-foreground">
              <Wallet className="size-4 shrink-0 text-primary" />
              Pay by UPI, card or cash on delivery at checkout.
            </p>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
