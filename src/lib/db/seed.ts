import { config } from "dotenv";
config({ path: ".env.local" });

import bcrypt from "bcryptjs";
import { db } from "./index";
import { products, productVariants, adminUsers, siteSettings } from "./schema";

async function main() {
  const [product] = await db
    .insert(products)
    .values({
      slug: "oke-wura-set",
      name: "Òkè Wúrà Set",
      tagline: "Iro & Buba — Adire, handcrafted",
      story: `Named for the hills of Lokoja, where this story first began. Òkè Wúrà means "golden hills" — because some things you carry with you are worth more than what they cost to make.

This set is cut and stitched by hand from authentic adire, one piece at a time. No mass production, no two sets identical. What you're holding is a piece of a fourteen-year journey back to where it started — needle, fabric, and patience.

Built to last beyond a season, the way a hill stands no matter what moves around it.

Òkè Wúrà. Worn once, remembered always.`,
      priceKobo: 8500000,
      currency: "NGN",
      images: ["/brand/logo.jpeg"],
      active: true,
    })
    .onConflictDoNothing({ target: products.slug })
    .returning();

  const existingProduct =
    product ??
    (await db.query.products.findFirst({
      where: (p, { eq }) => eq(p.slug, "oke-wura-set"),
    }));

  if (!existingProduct) throw new Error("Failed to create or find product");

  await db
    .insert(productVariants)
    .values([
      {
        productId: existingProduct.id,
        label: "UK 10–13 (to be confirmed)",
        sku: "OWS-A",
        stockQty: 10,
        sortOrder: 1,
      },
      {
        productId: existingProduct.id,
        label: "UK 14–16 (to be confirmed)",
        sku: "OWS-B",
        stockQty: 10,
        sortOrder: 2,
      },
    ])
    .onConflictDoNothing({ target: productVariants.sku });

  await db
    .insert(siteSettings)
    .values({
      id: 1,
      heroHeadline: "Òkè Wúrà",
      heroSubcopy: "Worn once, remembered always.",
      announcement: null,
    })
    .onConflictDoNothing({ target: siteSettings.id });

  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await db
      .insert(adminUsers)
      .values({ email: adminEmail, passwordHash })
      .onConflictDoNothing({ target: adminUsers.email });
    console.log(`Seeded admin user: ${adminEmail}`);
  } else {
    console.log(
      "Skipped admin seed — set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env.local to create one.",
    );
  }

  console.log("Seed complete.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
