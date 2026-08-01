import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// React/Turbopack need eval() in dev for Fast Refresh and stack traces;
// production never uses eval(), so we only relax the policy locally.
const scriptSrc = isDev
  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.paystack.co https://*.paystack.co"
  : "script-src 'self' 'unsafe-inline' https://js.paystack.co https://*.paystack.co";

const csp = [
  "default-src 'self'",
  scriptSrc,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://api.paystack.co https://*.paystack.co",
  "frame-src https://checkout.paystack.com https://*.paystack.co",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
