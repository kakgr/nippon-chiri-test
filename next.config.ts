import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: process.env.GITHUB_ACTIONS ? "/nippon-chiri-test" : "",
  assetPrefix: process.env.GITHUB_ACTIONS ? "/nippon-chiri-test/" : "",
};

export default nextConfig;
