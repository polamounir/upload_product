import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
