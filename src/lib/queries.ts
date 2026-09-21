import { supabase } from "@/integrations/supabase/client";
import type { ListingCardData } from "@/components/site/ListingCard";

type RawListing = {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  quantity: number;
  harvest_date: string | null;
  images: string[];
  farmer_id: string;
  description: string | null;
  status: string;
  created_at: string;
};

export async function fetchFarmerNames(farmerIds: string[]) {
  const ids = [...new Set(farmerIds)].filter(Boolean);
  if (!ids.length) {
    return { names: {} as Record<string, string>, farms: {} as Record<string, string> };
  }
  const [{ data: profiles }, { data: farms }] = await Promise.all([
    supabase.from("profiles").select("id, full_name").in("id", ids),
    supabase.from("farmer_details").select("user_id, farm_name, location").in("user_id", ids),
  ]);
  const names: Record<string, string> = {};
  const locations: Record<string, string> = {};
  (profiles ?? []).forEach((p) => {
    names[p.id] = p.full_name || "Farm Link farmer";
  });
  (farms ?? []).forEach((f) => {
    if (f.farm_name) names[f.user_id] = f.farm_name;
    if (f.location) locations[f.user_id] = f.location;
  });
  return { names, farms: locations };
}

export async function fetchPublicListings(limit?: number): Promise<ListingCardData[]> {
  let query = supabase
    .from("listings")
    .select(
      "id, name, category, price, unit, quantity, harvest_date, images, farmer_id, description, status, created_at",
    )
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  const rows = (data ?? []) as RawListing[];
  const { names, farms } = await fetchFarmerNames(rows.map((r) => r.farmer_id));

  return rows.map((r) => ({
    ...r,
    price: Number(r.price),
    quantity: Number(r.quantity),
    images: r.images ?? [],
    farmerName: names[r.farmer_id] ?? "Farm Link farmer",
    farmLocation: farms[r.farmer_id] ?? null,
  }));
}
