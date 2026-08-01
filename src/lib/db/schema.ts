import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  uuid,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline"),
  story: text("story").notNull(),
  priceKobo: integer("price_kobo").notNull(),
  currency: text("currency").notNull().default("NGN"),
  images: text("images").array().notNull().default([]),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const productVariants = pgTable("product_variants", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  sku: text("sku").notNull().unique(),
  stockQty: integer("stock_qty").notNull().default(0),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orderStatusValues = [
  "pending",
  "paid",
  "failed",
  "fulfilled",
  "shipped",
] as const;
export type OrderStatus = (typeof orderStatusValues)[number];

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderNumber: text("order_number").notNull().unique(),
    variantId: uuid("variant_id")
      .notNull()
      .references(() => productVariants.id),
    qty: integer("qty").notNull(),
    amountKobo: integer("amount_kobo").notNull(),
    currency: text("currency").notNull().default("NGN"),
    status: text("status", { enum: orderStatusValues })
      .notNull()
      .default("pending"),
    customerName: text("customer_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    deliveryAddress: text("delivery_address").notNull(),
    deliveryCity: text("delivery_city").notNull(),
    deliveryState: text("delivery_state").notNull(),
    notes: text("notes"),
    paystackReference: text("paystack_reference").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [uniqueIndex("orders_reference_idx").on(table.paystackReference)],
);

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  heroHeadline: text("hero_headline"),
  heroSubcopy: text("hero_subcopy"),
  announcement: text("announcement"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
