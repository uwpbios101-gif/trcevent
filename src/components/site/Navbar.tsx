import { Link } from "@tanstack/react-router";
import { Ticket } from "lucide-react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logo} alt="TRC Events" width={40} height={40} className="size-9 object-contain" />
          <span className="font-display text-lg font-bold tracking-wide">
            TRC <span className="text-gold">Events</span>
          </span>
        </Link>

        <Button asChild variant="gold" size="sm">
          <a href="/charly-black#tickets">
            <Ticket className="size-4" /> Get Tickets
          </a>
        </Button>
      </div>
    </header>
  );
}
