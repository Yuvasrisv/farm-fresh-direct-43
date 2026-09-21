import { Link, useNavigate } from "@tanstack/react-router";
import { Leaf, LogOut, Menu, ShoppingBasket, User } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { dashboardPathFor, useCurrentUser, useSignOut } from "@/lib/auth";
import { useCart } from "@/lib/cart";

const publicLinks = [
  { to: "/", label: "Home" },
  { to: "/browse", label: "Browse produce" },
] as const;

export function Navbar() {
  const { user, isAuthenticated, isLoading } = useCurrentUser();
  const signOut = useSignOut();
  const navigate = useNavigate();
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/login", replace: true });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground">
            <Leaf className="size-5" />
          </span>
          <span className="font-display text-xl">Farm Link</span>
        </Link>

        <nav className="ml-6 hidden items-center gap-5 text-sm md:flex">
          {publicLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground font-semibold" }}
              activeOptions={{ exact: link.to === "/" }}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && user?.role ? (
            <Link
              to={dashboardPathFor(user.role)}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>
          ) : null}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" className="relative">
            <Link to="/cart" aria-label="Cart">
              <ShoppingBasket className="size-5" />
              {count > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-harvest text-[11px] font-bold text-harvest-foreground">
                  {count}
                </span>
              ) : null}
            </Link>
          </Button>

          {isLoading ? (
            <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
          ) : isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="gap-2">
                  <User className="size-4" />
                  <span className="hidden sm:inline">{user.fullName.split(" ")[0]}</span>
                  <span className="hidden rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary sm:inline">
                    {user.role ?? "member"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate">{user.fullName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={dashboardPathFor(user.role)}>Dashboard</Link>
                </DropdownMenuItem>
                {user.role === "buyer" ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/buyer/orders">My orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/buyer/profile">Profile settings</Link>
                    </DropdownMenuItem>
                  </>
                ) : null}
                {user.role === "farmer" ? (
                  <DropdownMenuItem asChild>
                    <Link to="/farmer/profile">Farm profile</Link>
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 size-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Join Farm Link</Link>
              </Button>
            </div>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="mt-8 flex flex-col gap-3 text-base">
                {publicLinks.map((link) => (
                  <Link key={link.to} to={link.to} onClick={() => setOpen(false)}>
                    {link.label}
                  </Link>
                ))}
                {isAuthenticated && user?.role ? (
                  <Link to={dashboardPathFor(user.role)} onClick={() => setOpen(false)}>
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setOpen(false)}>
                      Log in
                    </Link>
                    <Link to="/signup" onClick={() => setOpen(false)}>
                      Join Farm Link
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
