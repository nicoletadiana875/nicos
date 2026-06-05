/** @type {import('next').NextConfig} */

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  // Blocca il sito dall'essere messo in iframe su altri siti (clickjacking)
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Impedisce al browser di indovinare il tipo MIME dei file
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Limita le informazioni nell'header Referer
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Forza HTTPS per 2 anni, inclusi sottodomini
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Disabilita accesso a camera, microfono, geolocalizzazione
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  // Content Security Policy
  { key: "Content-Security-Policy", value: CSP },
];

const nextConfig = {
  reactStrictMode: true,
  // Rimuove l'header "X-Powered-By: Next.js" che rivela la tecnologia usata
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
