// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**", // Allow all thumbnails
      },
      {
        protocol: "https",
        hostname: "drive-thirdparty.googleusercontent.com",
        pathname: "/**", // Allow all third-party Drive images
      },
    ],
  },
};

export default nextConfig;
