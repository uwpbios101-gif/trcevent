import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/events", label: "Events" },
  { to: "/djs", label: "Selectors" },
  { to: "/venues", label: "Venues" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <img src={logo} alt="TRC Events" width={40} height={40} className="size-9 object-contain" />
          <span className="font-display text-lg font-bold tracking-wide">
            TRC <span className="text-gold">Events</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-gold [&.active]:text-gold"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button asChild variant="ghost" size="sm">
            <Link to="/djs">Sign In</Link>
          </Button>
          <Button asChild variant="gold" size="sm">
            <Link to="/djs">Make the Connection</Link>
          </Button>
        </div>

        <button
          className="text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="flex flex-col px-4 py-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-gold [&.active]:text-gold"
              >
                {l.label}
              </Link>
            ))}
            <Button asChild variant="gold" size="sm" className="mt-2">
              <Link to="/djs" onClick={() => setOpen(false)}>
                Make the Connection
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}