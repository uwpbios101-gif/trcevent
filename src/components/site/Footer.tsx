import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Twitter } from "lucide-react";
import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <img src={logo} alt="TRC Events" width={44} height={44} className="size-10 object-contain" />
              <span className="font-display text-xl font-bold tracking-wide">
                TRC <span className="text-gold">Events</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              The Right Connection. The Reggae Connection. Chicago's home for reggae DJs,
              promoters, venues, and the community that keeps the sound alive.
            </p>
            <div className="mt-5 flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-gold hover:text-gold"
                  aria-label="Social link"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="eyebrow mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link to="/events" className="hover:text-gold">Events</Link></li>
              <li><Link to="/djs" className="hover:text-gold">Selectors</Link></li>
              <li><Link to="/venues" className="hover:text-gold">Venues</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="eyebrow mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-gold">About TRC</a></li>
              <li><a href="#" className="hover:text-gold">Contact</a></li>
              <li><a href="#" className="hover:text-gold">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-gold">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} TRC Events. Built for Chicago's sound.</p>
          <p className="italic">The Right Connection. The Reggae Connection.</p>
        </div>
      </div>
    </footer>
  );
}