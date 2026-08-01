import { getSiteSettings } from "@/lib/data/settings";
import { SettingsForm } from "@/components/admin/settings-form";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="font-display mb-6 text-2xl text-melony-cream">
        Settings
      </h1>
      <SettingsForm
        heroHeadline={settings.heroHeadline}
        heroSubcopy={settings.heroSubcopy}
        announcement={settings.announcement ?? ""}
      />
    </div>
  );
}
