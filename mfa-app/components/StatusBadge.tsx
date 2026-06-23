'use client';

import { cn } from "@/lib/utils";
import { prettyStatus, statusTone } from "@/lib/data";

// Maps your backend tones directly to your Tailwind v4 Heartwood palette
const toneClasses: Record<string, string> = {
  /* caramel/pending maps beautifully to your signature amber tint */
  caramel: "bg-palette-amber/12 text-palette-amber border-palette-amber/20",
  
  /* teal/active maps cleanly to your organic moss green */
  teal: "bg-palette-moss/12 text-palette-moss border-palette-moss/25",
  
  /* success maps to an enriched moss mix */
  success: "bg-palette-moss/15 text-palette-moss border-palette-moss/30",
  
  /* destructive maps straight to your brick clay token */
  destructive: "bg-palette-brick/12 text-palette-brick border-palette-brick/25",
  
  /* muted transitions cleanly into your ink-muted/slate profile */
  muted: "bg-palette-linen-deep/30 text-palette-ink-muted border-palette-rule/60",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  // Keeps your dynamic Lovable data parser mapping intact
  const tone = statusTone(status);
  
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium select-none whitespace-nowrap transition-colors",
        toneClasses[tone] || toneClasses.muted, // Fallback safety guard
        className,
      )}
    >
      {/* Small status dot utilizing text-current to automatically inherit color */}
      <span className="size-1.5 rounded-full bg-current opacity-75" />
      {prettyStatus(status)}
    </span>
  );
}