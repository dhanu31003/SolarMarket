import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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