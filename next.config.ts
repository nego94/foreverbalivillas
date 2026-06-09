import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://maps.googleapis.com https://www.googletagmanager.com https://connect.facebook.net https://snap.licdn.com", // unsafe-eval needed for GSAP
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://maps.gstatic.com https://maps.googleapis.com https://*.googleapis.com https://foreverbalivillas.com https://api.foreverbalivillas.com https://*.mybluehost.me",
              "media-src 'self' https://foreverbalivillas.com https://api.foreverbalivillas.com https://*.mybluehost.me",
              "connect-src 'self' https://maps.googleapis.com https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://www.facebook.com https://foreverbalivillas.com https://api.foreverbalivillas.com https://*.mybluehost.me",
              // Allow Google Maps iframe to embed
              "frame-src https://www.google.com",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
  // Redirect old Bluehost image paths to new api subdomain
  async redirects() {
    return [
      {
        source: '/fbv-api/:path*',
        destination: 'https://api.foreverbalivillas.com/:path*',
        permanent: true,
      },
    ];
  },

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85, 90],
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: 'https', hostname: 'foreverbalivillas.com' },
      { protocol: 'https', hostname: '*.mybluehost.me' },
      { protocol: 'https', hostname: 'api.foreverbalivillas.com' },
    ],
  },
};

export default nextConfig;
