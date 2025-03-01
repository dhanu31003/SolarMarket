import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  }
};
module.exports = {
  async redirects() {
    return [
      {
        source: "/blog",
        destination: "/blog/index.html",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
