export interface HSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export function hslToHex({ h, s, l }: HSL): string {
  const sn = s / 100;
  const ln = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n: number) =>
    ln - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const to = (v: number) =>
    Math.round(v * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${to(f(0))}${to(f(8))}${to(f(4))}`.toUpperCase();
}

export function hexToHsl(hex: string): HSL {
  let c = hex.replace("#", "");
  if (c.length === 3)
    c = c
      .split("")
      .map((x) => x + x)
      .join("");
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h *= 60;
  }
  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToRgb({ h, s, l }: HSL): [number, number, number] {
  const hex = hslToHex({ h, s, l });
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

export function isValidHex(v: string): boolean {
  return /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v.trim());
}

export function normalizeHex(v: string): string {
  let c = v.trim().replace("#", "");
  if (c.length === 3)
    c = c
      .split("")
      .map((x) => x + x)
      .join("");
  return `#${c}`.toUpperCase();
}

export function harmonies({ h, s, l }: HSL): {
  name: string;
  colors: string[];
}[] {
  const wrap = (d: number) => ((d % 360) + 360) % 360;
  const make = (hue: number, sat = s, light = l) =>
    hslToHex({ h: wrap(hue), s: sat, l: light });
  return [
    { name: "Complementary", colors: [make(h), make(h + 180)] },
    {
      name: "Analogous",
      colors: [make(h - 30), make(h), make(h + 30)],
    },
    {
      name: "Triadic",
      colors: [make(h), make(h + 120), make(h + 240)],
    },
    {
      name: "Split-complementary",
      colors: [make(h), make(h + 150), make(h + 210)],
    },
    {
      name: "Tetradic",
      colors: [make(h), make(h + 90), make(h + 180), make(h + 270)],
    },
  ];
}

export function shadesAndTints({ h, s }: HSL): { hex: string; l: number }[] {
  const steps = [10, 20, 30, 40, 50, 60, 70, 80, 90];
  return steps.map((l) => ({ hex: hslToHex({ h, s, l }), l }));
}

function luminance([r, g, b]: [number, number, number]): number {
  const f = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

export function contrastRatio(hexA: string, hexB: string): number {
  const rgb = (hex: string): [number, number, number] => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
  const l1 = luminance(rgb(hexA));
  const l2 = luminance(rgb(hexB));
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

export function wcagLabel(ratio: number): string {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA Large";
  return "Fail";
}

export function readableText(hex: string): string {
  return contrastRatio(hex, "#FFFFFF") >= contrastRatio(hex, "#101418")
    ? "#FFFFFF"
    : "#101418";
}
