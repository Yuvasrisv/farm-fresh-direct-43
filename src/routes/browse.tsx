import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { BadgePercent, Search, SlidersHorizontal, Sprout, Wallet } from "lucide-react";

import { ListingCard } from "@/components/site/ListingCard";
import { SiteShell, PageHeader } from "@/components/site/SiteShell";
import { EmptyState, ErrorState, LoadingGrid } from "@/components/site/States";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, UNITS } from "@/lib/farmlink";
import { fetchPublicListings } from "@/lib/queries";

export const Route = createFileRoute("/browse")({
  head: () => ({
    meta: [
      { title: "Browse Produce — Farm Link" },
      {
        name: "description",
        content:
          "Browse fresh produce listed directly by farmers. Filter by category, price and freshness, and add to your basket.",
      },
      { property: "og:title", content: "Browse Produce — Farm Link" },
      {
        property: "og:description",
        content: "Fresh produce straight from farms, at farmer-set prices.",
      },
    ],
  }),
  component: Browse,
});

/** Deterministic per-listing offer so every visit shows the same deal. */
function offerFor(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  const bucket = hash % 4; // 0..3
  return [0, 5, 10, 15][bucket] ?? 0;
}

type SortKey = "newest" | "price-asc" | "price-desc";

function Browse() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["browse-listings"],
    queryFn: () => fetchPublicListings(),
  });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [unit, setUnit] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sort, setSort] = useState<SortKey>("newest");

  const filtered = useMemo(() => {
    let rows = data ?? [];
    const q = search.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.farmerName.toLowerCase().includes(q) ||
          (l.farmLocation ?? "").toLowerCase().includes(q),
      );
    }
    if (category !== "all") rows = rows.filter((l) => l.category === category);
    if (unit !== "all") rows = rows.filter((l) => l.unit === unit);
    const cap = Number(maxPrice);
    if (maxPrice && !Number.isNaN(cap)) rows = rows.filter((l) => Number(l.price) <= cap);
    if (sort === "price-asc") rows = [...rows].sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === "price-desc") rows = [...rows].sort((a, b) => Number(b.price) - Number(a.price));
    return rows;
  }, [data, search, category, unit, maxPrice, sort]);

  const dealCount = (data ?? []).filter((l) => offerFor(l.id) > 0).length;

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-6xl px-4 pt-10">
        <PageHeader
          title="Browse fresh produce"
          subtitle="Every listing comes straight from a farm. Prices are set by the grower — no middleman markup."
        />
      </div>

      {/* Filters */}
      <section className="mx-auto w-full max-w-6xl px-4">
        <div className="field-card flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search produce, farms or places…"
              className="pl-9"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-auto">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger aria-label="Category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger aria-label="Unit">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any unit</SelectItem>
                {UNITS.map((u) => (
                  <SelectItem key={u} value={u}>
                    per {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="Max ₹"
              inputMode="numeric"
              aria-label="Maximum price"
            />
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger aria-label="Sort by">
                <SlidersHorizontal className="mr-1 size-3.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="price-asc">Price: low to high</SelectItem>
                <SelectItem value="price-desc">Price: high to low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <BadgePercent className="size-3.5 text-harvest" />
            {dealCount} listings on offer today
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Wallet className="size-3.5 text-primary" />
            Pay by UPI, card or cash on delivery at checkout
          </span>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto w-full max-w-6xl px-4 py-10">
        {isLoading ? (
          <LoadingGrid count={6} />
        ) : isError ? (
          <ErrorState message="We couldn't load listings just now." onRetry={() => refetch()} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Sprout className="size-7" />}
            title="Nothing matches those filters"
            description="Try clearing the search or widening the price range."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((listing) => (
              <ListingCard key={listing.id} listing={listing} offerPercent={offerFor(listing.id)} />
            ))}
          </div>
        )}
      </section>
    </SiteShell>
  );
}
