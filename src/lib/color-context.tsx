import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { hslToHex, hexToHsl, type HSL } from "./color";

export interface Palette {
  id: string;
  name: string;
  colors: string[];
}

interface ColorState {
  hsl: HSL;
  hex: string;
  setHsl: (h: HSL) => void;
  setHex: (hex: string) => void;
  palettes: Palette[];
  savePalette: (name: string, colors: string[]) => void;
  removePalette: (id: string) => void;
}

const ColorContext = createContext<ColorState | null>(null);

const DEFAULT_HSL: HSL = { h: 205, s: 85, l: 55 };

export function ColorProvider({ children }: { children: ReactNode }) {
  const [hsl, setHslState] = useState<HSL>(() => {
    if (typeof window === "undefined") return DEFAULT_HSL;
    try {
      const raw = window.localStorage.getItem("chromapick:color");
      if (raw) return JSON.parse(raw) as HSL;
    } catch {
      /* ignore */
    }
    return DEFAULT_HSL;
  });

  const [palettes, setPalettes] = useState<Palette[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem("chromapick:palettes");
      if (raw) return JSON.parse(raw) as Palette[];
    } catch {
      /* ignore */
    }
    return [];
  });

  useEffect(() => {
    window.localStorage.setItem("chromapick:color", JSON.stringify(hsl));
  }, [hsl]);

  useEffect(() => {
    window.localStorage.setItem("chromapick:palettes", JSON.stringify(palettes));
  }, [palettes]);

  const setHsl = (h: HSL) => setHslState(h);
  const setHex = (hex: string) => setHslState(hexToHsl(hex));

  const savePalette = (name: string, colors: string[]) =>
    setPalettes((p) => [
      { id: crypto.randomUUID(), name, colors },
      ...p,
    ]);

  const removePalette = (id: string) =>
    setPalettes((p) => p.filter((pl) => pl.id !== id));

  return (
    <ColorContext.Provider
      value={{
        hsl,
        hex: hslToHex(hsl),
        setHsl,
        setHex,
        palettes,
        savePalette,
        removePalette,
      }}
    >
      {children}
    </ColorContext.Provider>
  );
}

export function useColor(): ColorState {
  const ctx = useContext(ColorContext);
  if (!ctx) throw new Error("useColor must be used inside ColorProvider");
  return ctx;
}
