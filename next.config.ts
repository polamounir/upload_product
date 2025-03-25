import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["ecommerce.zerobytetools.com"],
    remotePatterns: [
      { protocol: "https", hostname: "placehold.jp" },
      { protocol: "https", hostname: "cdn.dummyjson.com" },
      { protocol: "https", hostname: "ecommerce.zerobytetools.com" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: "https://ecommerce.zerobytetools.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
