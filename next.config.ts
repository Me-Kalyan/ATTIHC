import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: '/today',
        destination: '/',
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
