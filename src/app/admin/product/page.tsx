import { getFirstProduct } from "@/lib/data/product";
import { ProductForm } from "@/components/admin/product-form";
import { ImageManager } from "@/components/admin/image-manager";
import { VariantManager } from "@/components/admin/variant-manager";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex max-w-2xl flex-col gap-4 border-t border-melony-gold/15 pt-6 first:border-0 first:pt-0">
      <p className="text-sm tracking-[0.2em] text-melony-gold uppercase">
        {title}
      </p>
      {children}
    </section>
  );
}

export default async function AdminProductPage() {
  const product = await getFirstProduct();

  if (!product) {
    return <p className="text-melony-cream/60">No product found.</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-display text-2xl text-melony-cream">Product</h1>

      <Section title="Details">
        <ProductForm
          productId={product.id}
          name={product.name}
          tagline={product.tagline}
          story={product.story}
          priceNaira={product.priceKobo / 100}
          active={product.active}
        />
      </Section>

      <Section title="Photos">
        <ImageManager productId={product.id} images={product.images} />
      </Section>

      <Section title="Sizes">
        <VariantManager
          productId={product.id}
          variants={product.variants.map((v) => ({
            id: v.id,
            label: v.label,
            stockQty: v.stockQty,
            active: v.active,
          }))}
        />
      </Section>
    </div>
  );
}
