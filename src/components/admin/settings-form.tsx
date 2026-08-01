"use client";

import { useActionState } from "react";
import { updateSiteSettings, type UpdateSettingsState } from "@/app/actions/admin";

const initialState: UpdateSettingsState = { status: "idle" };

const inputClass =
  "w-full rounded-lg border border-melony-gold/25 bg-melony-black px-4 py-3 text-melony-cream placeholder:text-melony-cream/30 focus:border-melony-gold focus:outline-none";

export function SettingsForm({
  heroHeadline,
  heroSubcopy,
  announcement,
}: {
  heroHeadline: string;
  heroSubcopy: string;
  announcement: string;
}) {
  const [state, formAction, isPending] = useActionState(
    updateSiteSettings,
    initialState,
  );

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm text-melony-cream/60">
        Hero headline
        <input
          name="heroHeadline"
          defaultValue={heroHeadline}
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-melony-cream/60">
        Hero subcopy
        <input
          name="heroSubcopy"
          defaultValue={heroSubcopy}
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-melony-cream/60">
        Announcement banner (leave blank to hide)
        <input
          name="announcement"
          defaultValue={announcement}
          className={inputClass}
        />
      </label>

      {state.status !== "idle" && (
        <p
          className={
            state.status === "success" ? "text-melony-gold" : "text-red-400"
          }
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 self-start rounded-full bg-melony-gold px-6 py-3 font-medium text-melony-black hover:bg-melony-gold-light disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
