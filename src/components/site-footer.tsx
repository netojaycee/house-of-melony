export function SiteFooter() {
  return (
    <footer className="border-t border-melony-gold/15 px-6 py-10 text-center">
      <p className="font-display italic text-melony-gold">House of Melony</p>
      <p className="mt-2 text-sm text-melony-cream/60">
        Handcrafted adire, made in Nigeria · Nationwide delivery
      </p>
      <p className="mt-6 text-xs text-melony-cream/40">
        © {new Date().getFullYear()} House of Melony. All rights reserved.
      </p>
    </footer>
  );
}
