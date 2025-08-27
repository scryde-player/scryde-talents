import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      new URL("http://localhost:3000/**"),
      new URL("http://195.140.146.251:4001//**"),
    ],
  },
};

export default nextConfig;
