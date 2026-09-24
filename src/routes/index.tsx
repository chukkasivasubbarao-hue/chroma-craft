import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shuffle, ArrowRight } from "lucide-react";
import { useColor } from "@/lib/color-context";
import { CopyButton } from "@/components/CopyButton";
import {
  hslToRgb,
  hslToHex,
  isValidHex,
  normalizeHex,
  readableText,
  shadesAndTints,
} from "@/lib/color";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Picker — chroma.pick" },
      {
        name: "description",
        content:
          "Pick any color and copy its HEX, RGB, and HSL values. Explore shades and tints instantly.",
      },
      { property: "og:title", content: "Picker — chroma.pick" },
      {
        property: "og:description",
        content:
          "Pick any color and copy its HEX, RGB, and HSL values. Explore shades and tints instantly.",
      },
    ],
  }),
  component: PickerPage,
});

function PickerPage() {
  const { hsl, hex, setHsl, setHex } = useColor();
  const [hexInput, setHexInput] = useState("");
  const [hexError, setHexError] = useState(false);
  const [r, g, b] = hslToRgb(hsl);
  const shades = shadesAndTints(hsl);
  const textOnPick = readableText(hex);

  const randomColor = () =>
    setHsl({
      h: Math.floor(Math.random() * 360),
      s: 55 + Math.floor(Math.random() * 45),
      l: 40 + Math.floor(Math.random() * 25),
    });

  const applyHex = () => {
    if (isValidHex(hexInput)) {
      setHex(normalizeHex(hexInput));
      setHexInput("");
      setHexError(false);
    } else {
      setHexError(true);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Live swatch + controls */}
      <section className="grid gap-6 lg:grid-cols-5">
        <div
          className="grid min-h-64 place-items-center rounded-3xl ring-1 ring-border transition-colors duration-300 sm:min-h-80 lg:col-span-3"
          style={{ backgroundColor: hex }}
        >
          <div className="text-center" style={{ color: textOnPick }}>
            <p className="font-mono text-4xl font-bold tracking-tighter sm:text-6xl">
              {hex}
            </p>
            <p className="mt-2 font-mono text-xs opacity-80 sm:text-sm">
              rgb({r} {g} {b}) · hsl({hsl.h} {hsl.s}% {hsl.l}%)
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5 rounded-3xl bg-card p-5 ring-1 ring-border sm:p-6 lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Controls
            </p>
            <button
              onClick={randomColor}
              className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 font-mono text-xs font-medium transition-colors hover:bg-accent"
            >
              <Shuffle className="size-3.5" />
              Random
            </button>
          </div>

          {/* Hue */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Hue
              </label>
              <span className="font-mono text-xs">{hsl.h}°</span>
            </div>
            <input
              type="range"
              min={0}
              max={360}
              value={hsl.h}
              onChange={(e) => setHsl({ ...hsl, h: Number(e.target.value) })}
              className="color-slider w-full"
              style={{
                background:
                  "linear-gradient(90deg,hsl(0 100% 50%),hsl(60 100% 50%),hsl(120 100% 50%),hsl(180 100% 50%),hsl(240 100% 50%),hsl(300 100% 50%),hsl(360 100% 50%))",
              }}
              aria-label="Hue"
            />
          </div>

          {/* Saturation */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Saturation
              </label>
              <span className="font-mono text-xs">{hsl.s}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={hsl.s}
              onChange={(e) => setHsl({ ...hsl, s: Number(e.target.value) })}
              className="color-slider w-full"
              style={{
                background: `linear-gradient(90deg, ${hslToHex({ ...hsl, s: 0 })}, ${hslToHex({ ...hsl, s: 100 })})`,
              }}
              aria-label="Saturation"
            />
          </div>

          {/* Lightness */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Lightness
              </label>
              <span className="font-mono text-xs">{hsl.l}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={hsl.l}
              onChange={(e) => setHsl({ ...hsl, l: Number(e.target.value) })}
              className="color-slider w-full"
              style={{
                background: `linear-gradient(90deg, #000, ${hslToHex({ ...hsl, l: 50 })}, #fff)`,
              }}
              aria-label="Lightness"
            />
          </div>

          {/* Hex input */}
          <div>
            <label className="mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Enter a hex code
            </label>
            <div className="flex gap-2">
              <input
                value={hexInput}
                onChange={(e) => {
                  setHexInput(e.target.value);
                  setHexError(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && applyHex()}
                placeholder="#1A8CFF"
                className={`min-w-0 flex-1 rounded-xl border bg-background px-3 py-2 font-mono text-sm outline-none focus:ring-2 focus:ring-ring ${
                  hexError ? "border-destructive" : "border-input"
                }`}
              />
              <button
                onClick={applyHex}
                className="shrink-0 rounded-xl bg-primary px-4 py-2 font-mono text-xs font-medium text-primary-foreground transition-opacity hover:opacity-85"
              >
                Apply
              </button>
            </div>
            {hexError && (
              <p className="mt-1.5 font-mono text-xs text-destructive">
                Not a valid hex code.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Readouts */}
      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "HEX", value: hex },
          { label: "RGB", value: `${r}, ${g}, ${b}` },
          { label: "HSL", value: `${hsl.h}, ${hsl.s}%, ${hsl.l}%` },
        ].map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-3 rounded-2xl bg-card px-4 py-3.5 ring-1 ring-border"
          >
            <div className="flex min-w-0 items-baseline gap-3">
              <span className="w-8 shrink-0 font-mono text-[11px] text-muted-foreground">
                {row.label}
              </span>
              <span className="truncate font-mono text-sm font-medium sm:text-base">
                {row.value}
              </span>
            </div>
            <CopyButton value={row.value} />
          </div>
        ))}
      </section>

      {/* Shades & tints */}
      <section className="mt-8">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-lg font-semibold tracking-tight">
            Shades &amp; tints
          </h2>
          <span className="font-mono text-xs text-muted-foreground">
            tap a step to pick it
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-9">
          {shades.map(({ hex: c, l }) => (
            <button
              key={l}
              onClick={() => setHex(c)}
              className="group grid h-20 place-items-end rounded-xl p-2 ring-1 ring-border transition-transform hover:-translate-y-0.5 sm:h-24"
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
      </section>

      {/* Next step */}
      <section className="mt-8 flex flex-wrap gap-3">
        <Link
          to="/palettes"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-85"
        >
          Build palettes from this color
          <ArrowRight className="size-4" />
        </Link>
        <Link
          to="/contrast"
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
        >
          Check its contrast
        </Link>
      </section>
    </div>
  );
}
