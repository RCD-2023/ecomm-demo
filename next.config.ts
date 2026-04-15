import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'psh01v3u99.ufs.sh',
        port: '/f/*',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
        pathname: '/f/*',
      },
    ],
  },
};

export default nextConfig;
 