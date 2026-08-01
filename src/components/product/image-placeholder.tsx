import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ImagePlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-3 border border-dashed border-melony-gold/25 bg-melony-black-soft text-melony-gold/40",
        className,
      )}
    >
      <ImageIcon className="h-10 w-10" strokeWidth={1.25} />
      <p className="text-xs tracking-[0.15em] uppercase">
        Photography coming soon
      </p>
    </div>
  );
}
