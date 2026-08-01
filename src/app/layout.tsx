import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const title = "House of Melony — Òkè Wúrà Set";
const description =
  "Òkè Wúrà — a handcrafted iro & buba adire set from House of Melony. Hand-cut, hand-finished, limited pieces per launch.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s · House of Melony",
  },
  description,
  openGraph: {
    title,
    description,
    siteName: "House of Melony",
    type: "website",
    images: ["/brand/logo.jpeg"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/brand/logo.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
