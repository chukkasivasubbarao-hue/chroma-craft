import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Pipette } from "lucide-react";
import { useColor } from "@/lib/color-context";
import {
  contrastRatio,
  wcagLabel,
  isValidHex,
  normalizeHex,
  readableText,
} from "@/lib/color";

export const Route = createFileRoute("/contrast")({
  head: () => ({
    meta: [
      { title: "Contrast checker — chroma.pick" },
      {
        name: "description",
        content:
          "Check WCAG contrast ratios between your picked color and text colors for accessible design.",
      },
      { property: "og:title", content: "Contrast checker — chroma.pick" },
      {
        property: "og:description",
        content:
          "Check WCAG contrast ratios between your picked color and text colors for accessible design.",
      },
    ],
  }),
  component: ContrastPage,
});

function SwatchInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (hex: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState(false);

  useEffect(() => {
    setDraft(value);
    setError(false);
  }, [value]);


  const apply = (v: string) => {
    setDraft(v);
    if (isValidHex(v)) {
      onChange(normalizeHex(v));
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-w-0">
      <label className="mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => apply(e.target.value)}
          className="size-10 shrink-0 cursor-pointer rounded-lg border border-input bg-transparent p-0.5"
          aria-label={`${label} color input`}
        />
        <input
          value={draft}
          onChange={(e) => apply(e.target.value)}
          className={`min-w-0 flex-1 rounded-xl border bg-background px-3 py-2 font-mono text-sm uppercase outline-none focus:ring-2 focus:ring-ring ${
            error ? "border-destructive" : "border-input"
          }`}
        />
      </div>
    </div>
  );
}

function ContrastCard({ bg, fg }: { bg: string; fg: string }) {
  const ratio = contrastRatio(bg, fg);
  const label = wcagLabel(ratio);
  const ok = ratio >= 4.5;

  return (
    <div
      className="rounded-3xl p-6 ring-1 ring-border sm:p-8"
      style={{ backgroundColor: bg }}
    >
      <p
        className="text-xl font-semibold tracking-tight sm:text-2xl"
        style={{ color: fg }}
      >
        The quick brown fox
      </p>
      <p className="mt-1 text-sm" style={{ color: fg }}>
        Body copy sample at normal reading size.
      </p>
      <div className="mt-5 flex items-center justify-between gap-3">
        <span
          className="font-mono text-3xl font-bold sm:text-4xl"
          style={{ color: fg }}
        >
          {ratio.toFixed(2)}
          <span className="text-base opacity-60">:1</span>
        </span>
        <span
          className={`rounded-full px-3 py-1 font-mono text-xs font-semibold ${
            ok ? "bg-emerald-500/90 text-white" : "bg-red-500/90 text-white"
          }`}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

function ContrastPage() {
  const { hex, setHex } = useColor();
  const [textColor, setTextColor] = useState("#FFFFFF");
  const suggested = readableText(hex);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Accessibility
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Contrast checker
          </h1>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">
            WCAG 2.1 needs at least 4.5:1 for normal text (AA) and 3:1 for
            large text. 7:1 earns AAA.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          <Pipette className="size-4" />
          Change base color
        </Link>
      </div>

      {/* Controls */}
      <section className="grid gap-4 rounded-3xl bg-card p-5 ring-1 ring-border sm:grid-cols-2 sm:p-6">
        <SwatchInput label="Background (your pick)" value={hex} onChange={setHex} />
        <SwatchInput label="Text color" value={textColor} onChange={setTextColor} />
      </section>

      {/* Live preview */}
      <section className="mt-6">
        <h2 className="mb-3 text-lg font-semibold tracking-tight">
          Your combination
        </h2>
        <ContrastCard bg={hex} fg={textColor} />
        {contrastRatio(hex, textColor) < 4.5 && (
          <button
            onClick={() => setTextColor(suggested)}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 font-mono text-xs font-medium text-primary-foreground transition-opacity hover:opacity-85"
          >
            Use {suggested === "#FFFFFF" ? "white" : "dark"} text instead (
            {contrastRatio(hex, suggested).toFixed(2)}:1)
          </button>
        )}
      </section>

      {/* Quick checks */}
      <section className="mt-10">
        <h2 className="mb-3 text-lg font-semibold tracking-tight">
          Quick checks on {hex}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <ContrastCard bg={hex} fg="#FFFFFF" />
          <ContrastCard bg={hex} fg="#101418" />
        </div>
      </section>
    </div>
  );
}
