import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    allowedDevOrigins: [
    "yuemi.com.np",
    "yuemiecosystemnepal.vercel.app",
    "localhost:3000",
  ],
  async redirects() {
    return [
      {
        source: "/index.php",
        destination: "/home",
        permanent: true,
      },
      {
        source: "/index.plx",
        destination: "/home",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https", //for server host for local change to http
        hostname: "yuemiecosystemnepal.vercel.app", //for server host for local change api url
        pathname: "/**",
      },
      {
        protocol: "http", //for server host for local change to http
        hostname: "localhost", //for server host for local change api url
        port: "3000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "yuemi.com.np",
        pathname: "/**",
      },
      
    ],
  },
};

export default nextConfig;



