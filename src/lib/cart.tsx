import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type CartItem = {
  listingId: string;
  name: string;
  price: number;
  unit: string;
  farmerId: string;
  farmerName: string;
  image: string | null;
  quantity: number;
  maxQuantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  setQuantity: (listingId: string, quantity: number) => void;
  remove: (listingId: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "farmlink.cart.v1";
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore corrupt cart */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    return {
      items,
      count: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: items.reduce((sum, i) => sum + i.quantity * i.price, 0),
      add: (item, quantity = 1) =>
        setItems((prev) => {
          const existing = prev.find((i) => i.listingId === item.listingId);
          if (existing) {
            return prev.map((i) =>
              i.listingId === item.listingId
                ? {
                    ...i,
                    quantity: Math.min(i.quantity + quantity, i.maxQuantity || 999),
                  }
                : i,
            );
          }
          return [...prev, { ...item, quantity }];
        }),
      setQuantity: (listingId, quantity) =>
        setItems((prev) =>
          prev.map((i) =>
            i.listingId === listingId
              ? { ...i, quantity: Math.max(1, Math.min(quantity, i.maxQuantity || 999)) }
              : i,
          ),
        ),
      remove: (listingId) =>
        setItems((prev) => prev.filter((i) => i.listingId !== listingId)),
      clear: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
