import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { siteSettings } from "@/lib/db/schema";

const defaults = {
  heroHeadline: "Òkè Wúrà Set",
  heroSubcopy:
    "Golden hills. A fourteen-year journey back to where it started — needle, fabric, and patience.",
  announcement: null as string | null,
};

export async function getSiteSettings() {
  const row = await db.query.siteSettings.findFirst({
    where: eq(siteSettings.id, 1),
  });

  return {
    heroHeadline: row?.heroHeadline || defaults.heroHeadline,
    heroSubcopy: row?.heroSubcopy || defaults.heroSubcopy,
    announcement: row?.announcement ?? defaults.announcement,
  };
}
