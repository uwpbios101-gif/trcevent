import { Link } from "@tanstack/react-router";
import { Ticket } from "lucide-react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";

const EVENT_LINKS = [
  { to: "/jamaica64", label: "Jamaica64" },
  { to: "/jamaicaday", label: "Jamaica Independence Celebration" },
  { to: "/st-catherine-linkup", label: "St. Catherine Link-Up" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <img
              src={logo}
              alt="TRC Events"
              width={40}
              height={40}
              className="size-9 object-contain"
            />
            <span className="font-display text-lg font-bold tracking-wide">
              TRC <span className="text-gold">Events</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-5 sm:flex">
            {EVENT_LINKS.map((event) => (
              <Link
                key={event.to}
                to={event.to}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-gold [&.active]:text-gold"
              >
                {event.label}
              </Link>
            ))}
          </nav>
        </div>

        <Button asChild variant="gold" size="sm">
          <a href="/charly-black#tickets">
            <Ticket className="size-4" /> Get Tickets
          </a>
        </Button>
      </div>
    </header>
  );
}
