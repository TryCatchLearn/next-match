import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {protocol: 'https', hostname: 'randomuser.me'},
      {protocol: 'https', hostname: 'res.cloudinary.com'}
    ]
  }
};

export default nextConfig;
