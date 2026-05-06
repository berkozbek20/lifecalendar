import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/wallpaper": [
      "./node_modules/@fontsource/roboto/files/roboto-latin-ext-400-normal.woff",
    ],
  },
};

export default nextConfig;
