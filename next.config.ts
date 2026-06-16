import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {
    optimizePackageImports: ["@hugeicons/core-free-icons"],
  },
}

export default nextConfig
