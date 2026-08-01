import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 px-6 py-24 text-center">
      <Image
        src="/brand/logo.jpeg"
        alt="House of Melony"
        width={160}
        height={160}
        className="rounded-full border border-melony-gold/30"
        priority
      />
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm tracking-[0.3em] text-melony-gold uppercase">
          House of Melony
        </p>
        <h1 className="font-display max-w-2xl text-4xl italic text-melony-cream sm:text-6xl">
          Òkè Wúrà
        </h1>
        <p className="max-w-md text-melony-cream/70">
          Worn once, remembered always. The full site is being woven together
          — check back soon.
        </p>
      </div>
    </main>
  );
}
