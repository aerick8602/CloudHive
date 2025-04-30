// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com", // Required domain for Google Drive images
      "drive-thirdparty.googleusercontent.com", // Another possible domain for Google Drive images
    ],
  },
};

export default nextConfig;
