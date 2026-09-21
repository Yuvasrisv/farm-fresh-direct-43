import { Link } from "@tanstack/react-router";
import { Heart, MapPin, ShoppingBasket } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import {
  PLACEHOLDER_IMAGE,
  formatMoney,
  freshnessLabel,
} from "@/lib/farmlink";

export type ListingCardData = {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  quantity: number;
  harvest_date: string | null;
  images: string[];
  farmer_id: string;
  farmerName: string;
  farmLocation?: string | null;
};

export function ListingCard({
  listing,
  favorite,
  onToggleFavorite,
}: {
  listing: ListingCardData;
  favorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}) {
  const cart = useCart();
  const image = listing.images?.[0] || PLACEHOLDER_IMAGE;

  return (
    <article className="field-card group flex flex-col overflow-hidden transition-shadow hover:shadow-lift">
      <Link
        to="/listing/$listingId"
        params={{ listingId: listing.id }}
        className="relative block h-44 overflow-hidden bg-muted"
      >
        <img
          src={image}
          alt={listing.name}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
          {listing.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-lg leading-tight">
              <Link to="/listing/$listingId" params={{ listingId: listing.id }}>
                {listing.name}
              </Link>
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              by {listing.farmerName}
            </p>
          </div>
          {onToggleFavorite ? (
            <button
              type="button"
              aria-label="Save to wishlist"
              onClick={() => onToggleFavorite(listing.id)}
              className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-accent"
            >
              <Heart
                className={`size-4 ${favorite ? "fill-destructive text-destructive" : ""}`}
              />
            </button>
          ) : null}
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          {freshnessLabel(listing.harvest_date)}
        </p>
        {listing.farmLocation ? (
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" /> {listing.farmLocation}
          </p>
        ) : null}

        <div className="mt-4 flex items-end justify-between gap-2">
          <p className="font-display text-xl text-primary">
            {formatMoney(listing.price)}
            <span className="text-xs font-normal text-muted-foreground">
              {" "}
              / {listing.unit}
            </span>
          </p>
          <Button
            size="sm"
            className="gap-1.5"
            disabled={Number(listing.quantity) <= 0}
            onClick={() => {
              cart.add({
                listingId: listing.id,
                name: listing.name,
                price: Number(listing.price),
                unit: listing.unit,
                farmerId: listing.farmer_id,
                farmerName: listing.farmerName,
                image,
                maxQuantity: Number(listing.quantity),
              });
              toast.success(`${listing.name} added to cart`);
            }}
          >
            <ShoppingBasket className="size-4" />
            {Number(listing.quantity) <= 0 ? "Sold out" : "Add"}
          </Button>
        </div>
      </div>
    </article>
  );
}
