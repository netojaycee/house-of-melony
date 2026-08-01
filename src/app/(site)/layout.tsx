import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getSiteSettings } from "@/lib/data/settings";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      {settings.announcement && (
        <div className="bg-melony-gold px-4 py-2 text-center text-sm font-medium text-melony-black">
          {settings.announcement}
        </div>
      )}
      <SiteHeader />
      <div className="flex flex-1 flex-col">{children}</div>
      <SiteFooter />
    </div>
  );
}
