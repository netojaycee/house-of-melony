import Image from "next/image";
import Link from "next/link";
import { getActiveProduct, formatNaira } from "@/lib/data/product";
import { getSiteSettings } from "@/lib/data/settings";
import { ImagePlaceholder } from "@/components/product/image-placeholder";

export const metadata = { alternates: { canonical: "/" } };

export default async function Home() {
  const [product, settings] = await Promise.all([
    getActiveProduct(),
    getSiteSettings(),
  ]);

  return (
    <main className="flex flex-1 flex-col">
      <section className="flex flex-col items-center gap-8 px-6 pt-20 pb-24 text-center sm:pt-28">
        <Image
          src="/brand/logo.jpeg"
          alt="House of Melony"
          width={120}
          height={120}
          className="rounded-full border border-melony-gold/30"
          priority
        />
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm tracking-[0.3em] text-melony-gold uppercase">
            House of Melony
          </p>
          <h1 className="font-display max-w-3xl text-5xl italic text-melony-cream sm:text-7xl">
            {settings.heroHeadline}
          </h1>
          <p className="max-w-md text-melony-cream/70">{settings.heroSubcopy}</p>
        </div>
        {product && (
          <Link
            href={`/product/${product.slug}`}
            className="mt-4 rounded-full bg-melony-gold px-8 py-3 font-medium text-melony-black transition-colors hover:bg-melony-gold-light"
          >
            Shop the set
          </Link>
        )}
      </section>

      <section className="border-t border-melony-gold/10 bg-melony-black-soft px-6 py-20">
        <div className="mx-auto flex max-w-3xl flex-col gap-6 text-melony-cream/85">
          <p className="font-display text-sm tracking-[0.3em] text-melony-gold uppercase">
            The story
          </p>
          <p className="text-lg leading-relaxed">
            Named for the hills of Lokoja, where this story first began.{" "}
            <em>Òkè Wúrà</em>
            {" means "}
            &ldquo;golden hills&rdquo; — because some things you carry with
            you are worth more than what they cost to make.
          </p>
          <p className="text-lg leading-relaxed">
            This set is cut and stitched by hand from authentic adire, one
            piece at a time. No mass production, no two sets identical. What
            you&rsquo;re holding is a piece of a fourteen-year journey back to
            where it started.
          </p>
          <p className="font-display text-xl italic text-melony-gold-light">
            Built to last beyond a season, the way a hill stands no matter
            what moves around it.
          </p>
        </div>
      </section>

      {product && (
        <section className="px-6 py-20">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 rounded-2xl border border-melony-gold/15 bg-melony-black-soft p-10 sm:flex-row sm:p-14">
            <div className="relative aspect-square w-full max-w-xs shrink-0 overflow-hidden rounded-xl border border-melony-gold/20">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 320px"
                  className="object-cover"
                />
              ) : (
                <ImagePlaceholder />
              )}
            </div>
            <div className="flex flex-col gap-4 text-center sm:text-left">
              <p className="text-sm tracking-[0.25em] text-melony-gold uppercase">
                {product.tagline}
              </p>
              <h2 className="font-display text-3xl text-melony-cream">
                {product.name}
              </h2>
              <p className="text-melony-cream/70">
                {formatNaira(product.priceKobo)} · Limited pieces per launch
              </p>
              <Link
                href={`/product/${product.slug}`}
                className="mx-auto rounded-full border border-melony-gold px-6 py-3 text-melony-gold transition-colors hover:bg-melony-gold hover:text-melony-black sm:mx-0"
              >
                View details &amp; buy
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
