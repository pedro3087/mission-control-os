import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow external image domains if needed in future
  images: { unoptimized: true },
  // No CORS issues for API routes
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ];
  },
};

export default nextConfig;
