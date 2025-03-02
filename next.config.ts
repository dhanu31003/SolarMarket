import { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
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

module.exports = nextConfig;
