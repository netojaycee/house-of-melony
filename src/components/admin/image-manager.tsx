"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { X, Upload } from "lucide-react";
import {
  uploadProductImageAction,
  removeProductImageAction,
} from "@/app/actions/admin";

export function ImageManager({
  productId,
  images,
}: {
  productId: string;
  images: string[];
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    const formData = new FormData();
    formData.set("file", file);

    startTransition(async () => {
      const result = await uploadProductImageAction(productId, formData);
      if (result.status === "error") {
        setError(result.message);
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    });
  }

  function handleRemove(url: string) {
    setError(null);
    startTransition(async () => {
      await removeProductImageAction(productId, url);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4">
        {images.map((url) => (
          <div
            key={url}
            className="group relative h-28 w-28 overflow-hidden rounded-lg border border-melony-gold/20"
          >
            <Image src={url} alt="" fill className="object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(url)}
              disabled={isPending}
              className="absolute top-1 right-1 rounded-full bg-melony-black/80 p-1 text-melony-cream opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Remove image"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        <label className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-melony-gold/30 text-melony-gold/60 transition-colors hover:border-melony-gold hover:text-melony-gold">
          <Upload className="h-5 w-5" />
          <span className="text-[11px]">Upload</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={handleFileChange}
            disabled={isPending}
          />
        </label>
      </div>

      {isPending && <p className="text-sm text-melony-cream/50">Uploading…</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}
      <p className="text-xs text-melony-cream/40">
        First photo is used as the main image. JPEG, PNG, WebP or AVIF, up to
        8MB.
      </p>
    </div>
  );
}
