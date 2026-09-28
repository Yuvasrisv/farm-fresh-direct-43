import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, ShoppingBasket, Trash2, Wallet } from "lucide-react";
import { toast } from "sonner";

import { SiteShell, PageHeader } from "@/components/site/SiteShell";
import { EmptyState } from "@/components/site/States";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { PLACEHOLDER_IMAGE, formatMoney } from "@/lib/farmlink";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Farm Link" },
      { name: "description", content: "Review your basket and check out on Farm Link." },
      { property: "og:title", content: "Your Cart — Farm Link" },
      { property: "og:description", content: "Review your basket and check out." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const cart = useCart();
  const { user, isAuthenticated } = useCurrentUser();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("upi");
  const [placing, setPlacing] = useState(false);

  async function placeOrder() {
    if (!isAuthenticated || !user) {
      toast.info("Please log in to place your order");
      navigate({ to: "/login" });
      return;
    }
    if (!address.trim()) {
      toast.error("Please enter a delivery address");
      return;
    }
    setPlacing(true);
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        buyer_id: user.id,
        total: cart.subtotal,
        delivery_address: address.trim(),
        payment_method: payment,
      })
      .select("id")
      .single();
    if (error || !order) {
      setPlacing(false);
      toast.error(error?.message ?? "Could not place the order");
      return;
    }
    const items = cart.items.map((i) => ({
      order_id: order.id,
      listing_id: i.listingId,
      farmer_id: i.farmerId,
      name_snapshot: i.name,
      unit_snapshot: i.unit,
      quantity: i.quantity,
      price_at_purchase: i.price,
    }));
    const { error: itemsError } = await supabase.from("order_items").insert(items);
    setPlacing(false);
    if (itemsError) {
      toast.error(itemsError.message);
      return;
    }
    cart.clear();
    toast.success("Order placed! The farmer has been notified.");
    navigate({ to: "/buyer/orders" });
  }

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-5xl px-4 py-10">
        <PageHeader title="Your cart" subtitle="Review your basket, then confirm delivery and payment." />

        {cart.items.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              icon={<ShoppingBasket className="size-7" />}
              title="Your basket is empty"
              description="Browse fresh produce and add something tasty."
              action={
                <Button asChild>
                  <Link to="/browse">Browse produce</Link>
                </Button>
              }
            />
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
            <ul className="space-y-4">
              {cart.items.map((item) => (
                <li key={item.listingId} className="field-card flex items-center gap-4 p-4">
                  <img
                    src={item.image || PLACEHOLDER_IMAGE}
                    alt={item.name}
                    className="size-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-display text-lg leading-tight">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.farmerName} · {formatMoney(item.price)} / {item.unit}
                    </p>
                  </div>
                  <div className="flex items-center rounded-md border border-border">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      className="p-2"
                      onClick={() => cart.setQuantity(item.listingId, item.quantity - 1)}
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      className="p-2"
                      onClick={() => cart.setQuantity(item.listingId, item.quantity + 1)}
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <p className="w-20 text-right font-display text-lg">
                    {formatMoney(item.price * item.quantity)}
                  </p>
                  <button
                    type="button"
                    aria-label={`Remove ${item.name}`}
                    className="rounded-full p-2 text-muted-foreground hover:bg-accent"
                    onClick={() => cart.remove(item.listingId)}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>

            <aside className="field-card h-fit space-y-4 p-5">
              <h2 className="font-display text-xl">Checkout</h2>
              <div className="space-y-1.5">
                <Label htmlFor="address">Delivery address</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House, street, city, PIN"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Payment method</Label>
                <Select value={payment} onValueChange={setPayment}>
                  <SelectTrigger>
                    <Wallet className="mr-1 size-3.5" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="cod">Cash on delivery</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground">
                  Demo checkout — no real payment is taken.
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="font-display text-2xl text-primary">{formatMoney(cart.subtotal)}</span>
              </div>
              <Button className="w-full" disabled={placing} onClick={placeOrder}>
                {placing ? "Placing order…" : "Place order"}
              </Button>
            </aside>
          </div>
        )}
      </div>
    </SiteShell>
  );
}
