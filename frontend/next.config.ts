import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "1000logos.net",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "cdn.growbeansprout.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "tiongbahruplaza.com.sg",
        pathname: "**",
      }
    ]
  }
};

export default nextConfig;
