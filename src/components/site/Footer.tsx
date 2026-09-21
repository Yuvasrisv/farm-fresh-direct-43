import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Leaf, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-secondary/60">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground">
              <Leaf className="size-4" />
            </span>
            <span className="font-display text-lg">Farm Link</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            A direct line from the field to your kitchen. Fair prices for farmers,
            fresher produce for buyers, nobody in between.
          </p>
        </div>

        <div className="text-sm">
          <h3 className="font-display text-base">Company</h3>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li>
              <Link to="/about" className="hover:text-foreground">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-foreground">
                Terms
              </Link>
            </li>
          </ul>
        </div>

        <div className="text-sm">
          <h3 className="font-display text-base">Marketplace</h3>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li>
              <Link to="/browse" className="hover:text-foreground">
                Browse produce
              </Link>
            </li>
            <li>
              <Link to="/signup/farmer" className="hover:text-foreground">
                Sell as a farmer
              </Link>
            </li>
            <li>
              <Link to="/signup/buyer" className="hover:text-foreground">
                Buy as a retailer
              </Link>
            </li>
          </ul>
        </div>

        <div className="text-sm">
          <h3 className="font-display text-base">Follow the harvest</h3>
          <div className="mt-3 flex gap-3">
            <a
              href="https://instagram.com"
              aria-label="Instagram"
              className="grid size-9 place-items-center rounded-full border border-border hover:bg-accent"
            >
              <Instagram className="size-4" />
            </a>
            <a
              href="https://twitter.com"
              aria-label="Twitter"
              className="grid size-9 place-items-center rounded-full border border-border hover:bg-accent"
            >
              <Twitter className="size-4" />
            </a>
            <a
              href="https://facebook.com"
              aria-label="Facebook"
              className="grid size-9 place-items-center rounded-full border border-border hover:bg-accent"
            >
              <Facebook className="size-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/70 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Farm Link. Grown and shipped with care.
      </div>
    </footer>
  );
}
