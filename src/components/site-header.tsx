import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-melony-gold/15 bg-melony-black/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Image
            src="/brand/logo.jpeg"
            alt="House of Melony"
            width={32}
            height={32}
            className="shrink-0 rounded-full sm:h-9 sm:w-9"
          />
          <span className="font-display truncate text-base tracking-wide text-melony-cream sm:text-lg">
            House of Melony
          </span>
        </Link>
        <Link
          href="/product/oke-wura-set"
          className="shrink-0 rounded-full border border-melony-gold/40 px-3 py-2 text-sm whitespace-nowrap text-melony-gold transition-colors hover:bg-melony-gold hover:text-melony-black sm:px-4"
        >
          <span className="sm:hidden">Shop</span>
          <span className="hidden sm:inline">Shop Òkè Wúrà</span>
        </Link>
      </div>
    </header>
  );
}
