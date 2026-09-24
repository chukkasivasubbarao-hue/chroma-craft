import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={copy}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 font-mono text-xs font-medium text-primary-foreground transition-transform hover:opacity-80 active:scale-95"
      aria-label={`Copy ${value}`}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
