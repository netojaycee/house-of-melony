import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, formatNaira } from "@/lib/data/product";
import { VariantSelector } from "@/components/product/variant-selector";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const description = `${product.tagline ?? ""} ${formatNaira(product.priceKobo)}. ${product.story.slice(0, 140)}`;

  return {
    title: product.name,
    description,
    openGraph: {
      title: `${product.name} · House of Melony`,
      description,
      images: product.images.length ? [product.images[0]] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-16 sm:flex-row sm:py-24">
      <div className="relative aspect-square w-full max-w-xl shrink-0 overflow-hidden rounded-2xl border border-melony-gold/20 bg-melony-black-soft sm:w-1/2">
        <Image
          src={product.images[0] ?? "/brand/logo.jpeg"}
          alt={product.name}
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-6">
        <div>
          <p className="text-sm tracking-[0.25em] text-melony-gold uppercase">
            {product.tagline}
          </p>
          <h1 className="font-display mt-2 text-4xl text-melony-cream sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-3 text-xl text-melony-cream/80">
            {formatNaira(product.priceKobo)}
          </p>
        </div>

        <VariantSelector
          variants={product.variants.map((v) => ({
            id: v.id,
            label: v.label,
            stockQty: v.stockQty,
          }))}
          priceKobo={product.priceKobo}
        />

        <div className="mt-4 whitespace-pre-line border-t border-melony-gold/15 pt-6 text-melony-cream/70">
          {product.story}
        </div>
      </div>
    </main>
  );
}
