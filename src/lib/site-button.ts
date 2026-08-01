type Variant = "primary" | "secondary";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center rounded-full font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-melony-gold text-melony-black hover:bg-melony-gold-light",
  secondary:
    "border border-melony-gold text-melony-gold hover:bg-melony-gold hover:text-melony-black",
};

const sizes: Record<Size, string> = {
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function siteButtonClass(variant: Variant = "primary", size: Size = "md") {
  return `${base} ${variants[variant]} ${sizes[size]}`;
}
