export function InitialsAvatar({
  name,
  accent,
  className = "",
}: {
  name: string;
  accent: string;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <div
      className={`flex items-center justify-center font-display font-bold text-background ${className}`}
      style={{ backgroundImage: accent }}
      aria-hidden
    >
      {initials}
    </div>
  );
}