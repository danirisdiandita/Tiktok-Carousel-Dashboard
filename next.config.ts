import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage-ugc.widya.ai",
        pathname: "/carousel/**",
      },
    ],
  },
};

export default nextConfig;
