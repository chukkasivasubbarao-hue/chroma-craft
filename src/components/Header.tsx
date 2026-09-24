import { Link } from "@tanstack/react-router";
import { useColor } from "@/lib/color-context";

const links = [
  { to: "/", label: "Picker" },
  { to: "/palettes", label: "Palettes" },
  { to: "/contrast", label: "Contrast" },
] as const;

export function Header() {
  const { hex } = useColor();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <span
            className="size-4 shrink-0 rounded-md ring-1 ring-white/20 transition-colors duration-300"
            style={{ backgroundColor: hex }}
          />
          <span className="truncate font-mono text-sm font-bold tracking-tight">
            chroma.pick
          </span>
        </Link>
        <nav className="ml-auto flex items-center gap-1 rounded-full bg-secondary p-1 ring-1 ring-border">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: true }}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:px-4"
              activeProps={{
                className:
                  "rounded-full px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground sm:px-4",
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
