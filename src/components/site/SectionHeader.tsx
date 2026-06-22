import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function SectionHeader({
  eyebrow,
  title,
  to,
  linkLabel,
}: {
  eyebrow?: string;
  title: string;
  to?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
      </div>
      {to && (
        <Link
          to={to}
          className="group hidden shrink-0 items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-gold sm:flex"
        >
          {linkLabel ?? "View all"}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}