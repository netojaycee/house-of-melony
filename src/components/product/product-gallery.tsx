"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ImagePlaceholder } from "@/components/product/image-placeholder";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!api) return;
    setSelected(api.selectedScrollSnap());
    api.on("select", () => setSelected(api.selectedScrollSnap()));
  }, [api]);

  if (images.length === 0) {
    return (
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-melony-gold/20 bg-melony-black-soft">
        <ImagePlaceholder />
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-melony-gold/20 bg-melony-black-soft">
        <Image
          src={images[0]}
          alt={alt}
          fill
          priority
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent className="-ml-0">
          {images.map((src, i) => (
            <CarouselItem key={src} className="pl-0">
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-melony-gold/20 bg-melony-black-soft">
                <Image
                  src={src}
                  alt={`${alt} — photo ${i + 1}`}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <button
          type="button"
          onClick={() => api?.scrollPrev()}
          aria-label="Previous photo"
          className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full border border-melony-gold/30 bg-melony-black/70 p-2 text-melony-cream backdrop-blur-sm transition-colors hover:bg-melony-black"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => api?.scrollNext()}
          aria-label="Next photo"
          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full border border-melony-gold/30 bg-melony-black/70 p-2 text-melony-cream backdrop-blur-sm transition-colors hover:bg-melony-black"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <div className="absolute right-3 bottom-3 rounded-full bg-melony-black/70 px-3 py-1 text-xs text-melony-cream backdrop-blur-sm">
          {selected + 1} / {images.length}
        </div>
      </Carousel>

      <div className="flex justify-center gap-2">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            aria-label={`Go to photo ${i + 1}`}
            onClick={() => api?.scrollTo(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === selected
                ? "w-6 bg-melony-gold"
                : "w-1.5 bg-melony-gold/25 hover:bg-melony-gold/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
