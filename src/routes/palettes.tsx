import { createFileRoute, Link } from "@tanstack/react-router";
import { BookmarkPlus, Trash2, Pipette } from "lucide-react";
import { useColor } from "@/lib/color-context";
import { CopyButton } from "@/components/CopyButton";
import { harmonies, readableText } from "@/lib/color";

export const Route = createFileRoute("/palettes")({
  head: () => ({
    meta: [
      { title: "Palettes — chroma.pick" },
      {
        name: "description",
        content:
          "Generate complementary, analogous, triadic, and more harmony palettes from any color, and save your favorites.",
      },
      { property: "og:title", content: "Palettes — chroma.pick" },
      {
        property: "og:description",
        content:
          "Generate complementary, analogous, triadic, and more harmony palettes from any color, and save your favorites.",
      },
    ],
  }),
  component: PalettesPage,
});

function PalettesPage() {
  const { hsl, hex, setHex, palettes, savePalette, removePalette } = useColor();
  const groups = harmonies(hsl);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Harmonies
          </p>
          <h1 className="mt-2 truncate text-3xl font-bold tracking-tight sm:text-4xl">
            Palettes from{" "}
            <span className="font-mono" style={{ color: hex }}>
              {hex}
            </span>
          </h1>
        </div>
        <Link
          to="/"
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <Pipette className="size-4" />
          Change color
        </Link>
      </div>

      {/* Harmony groups */}
      <section className="grid gap-5 md:grid-cols-2">
        {groups.map((g) => (
          <article
            key={g.name}
            className="rounded-3xl bg-card p-4 ring-1 ring-border sm:p-5"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                {g.name}
              </h2>
              <button
                onClick={() => savePalette(g.name, g.colors)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 font-mono text-xs font-medium transition-colors hover:bg-accent"
              >
                <BookmarkPlus className="size-3.5" />
                Save
              </button>
            </div>
            <div className="flex overflow-hidden rounded-2xl ring-1 ring-border">
              {g.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setHex(c)}
                  className="group grid h-24 flex-1 place-items-end p-2 transition-[flex-grow] hover:flex-[1.4] sm:h-28"
                  style={{ backgroundColor: c }}
                  aria-label={`Pick ${c}`}
                >
                  <span
                    className="font-mono text-[10px] opacity-0 transition-opacity group-hover:opacity-90"
                    style={{ color: readableText(c) }}
                  >
                    {c}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {g.colors.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 font-mono text-[11px]"
                >
                  <span
                    className="size-3 rounded-full ring-1 ring-white/20"
                    style={{ backgroundColor: c }}
                  />
                  {c}
                  <CopyButton value={c} />
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>

      {/* Saved palettes */}
      <section className="mt-12">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">
            Saved palettes
          </h2>
          <span className="font-mono text-xs text-muted-foreground">
            {palettes.length} saved
          </span>
        </div>
        {palettes.length === 0 ? (
          <div className="grid place-items-center rounded-3xl border border-dashed border-border py-16 text-center">
            <p className="text-sm text-muted-foreground">
              Nothing saved yet. Hit “Save” on any harmony above.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {palettes.map((p) => (
              <article
                key={p.id}
                className="overflow-hidden rounded-2xl bg-card ring-1 ring-border"
              >
                <div className="flex h-20">
                  {p.colors.map((c, i) => (
                    <div
                      key={`${c}-${i}`}
                      className="flex-1"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">
                      {p.colors.length} colors
                    </p>
                  </div>
                  <button
                    onClick={() => removePalette(p.id)}
                    className="shrink-0 rounded-full p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    aria-label={`Delete palette ${p.name}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
