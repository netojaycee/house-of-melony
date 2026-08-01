import { getFirstProduct } from "@/lib/data/product";
import { ProductForm } from "@/components/admin/product-form";

export default async function AdminProductPage() {
  const product = await getFirstProduct();

  if (!product) {
    return <p className="text-melony-cream/60">No product found.</p>;
  }

  return (
    <div>
      <h1 className="font-display mb-6 text-2xl text-melony-cream">Product</h1>
      <ProductForm
        productId={product.id}
        name={product.name}
        tagline={product.tagline}
        story={product.story}
        priceNaira={product.priceKobo / 100}
        active={product.active}
        images={product.images}
        variants={product.variants.map((v) => ({
          id: v.id,
          label: v.label,
          stockQty: v.stockQty,
        }))}
      />
    </div>
  );
}
