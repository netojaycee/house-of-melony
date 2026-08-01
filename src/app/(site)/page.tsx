import Image from "next/image";
import { getActiveProduct, formatNaira } from "@/lib/data/product";
import { getSiteSettings } from "@/lib/data/settings";
import { ImagePlaceholder } from "@/components/product/image-placeholder";
import { siteButtonClass } from "@/lib/site-button";
import { FadeIn, RevealOnScroll } from "@/components/motion/reveal";
import { TapLink } from "@/components/motion/tap-link";

export const metadata = { alternates: { canonical: "/" } };

export default async function Home() {
  const [product, settings] = await Promise.all([
    getActiveProduct(),
    getSiteSettings(),
  ]);

  return (
    <main className="flex flex-1 flex-col">
      <section className="flex flex-col items-center gap-8 px-6 pt-20 pb-24 text-center sm:pt-28">
        <FadeIn>
          <Image
            src="/brand/logo.jpeg"
            alt="House of Melony"
            width={120}
            height={120}
            className="rounded-full border border-melony-gold/30"
            priority
          />
        </FadeIn>
        <FadeIn delay={0.1} className="flex flex-col items-center gap-4">
          <p className="text-sm tracking-[0.3em] text-melony-gold uppercase">
            House of Melony
          </p>
          <h1 className="font-display max-w-3xl text-5xl italic text-melony-cream sm:text-7xl">
            {settings.heroHeadline}
          </h1>
          <p className="max-w-md text-melony-cream/70">{settings.heroSubcopy}</p>
        </FadeIn>
        {product && (
          <FadeIn delay={0.2}>
            <TapLink
              href={`/product/${product.slug}`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`mt-4 ${siteButtonClass("primary", "lg")}`}
            >
              Shop the set
            </TapLink>
          </FadeIn>
        )}
      </section>

      <section className="border-t border-melony-gold/10 bg-melony-black-soft px-6 py-20">
        <RevealOnScroll className="mx-auto flex max-w-3xl flex-col gap-6 text-melony-cream/85">
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
        </RevealOnScroll>
      </section>

      {product && (
        <section className="px-6 py-20">
          <RevealOnScroll className="mx-auto flex max-w-5xl flex-col items-center gap-10 rounded-2xl border border-melony-gold/15 bg-melony-black-soft p-10 sm:flex-row sm:p-14">
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
              <TapLink
                href={`/product/${product.slug}`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`mx-auto sm:mx-0 ${siteButtonClass("secondary", "md")}`}
              >
                View details &amp; buy
              </TapLink>
            </div>
          </RevealOnScroll>
        </section>
      )}
    </main>
  );
}
