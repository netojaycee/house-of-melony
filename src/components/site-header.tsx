import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-melony-gold/15 bg-melony-black/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/brand/logo.jpeg"
            alt="House of Melony"
            width={36}
            height={36}
            className="rounded-full"
          />
          <span className="font-display text-lg tracking-wide text-melony-cream">
            House of Melony
          </span>
        </Link>
        <Link
          href="/product/oke-wura-set"
          className="rounded-full border border-melony-gold/40 px-4 py-2 text-sm text-melony-gold transition-colors hover:bg-melony-gold hover:text-melony-black"
        >
          Shop Òkè Wúrà
        </Link>
      </div>
    </header>
  );
}
