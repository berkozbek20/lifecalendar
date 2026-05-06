import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/wallpaper": ["./node_modules/dejavu-fonts-ttf/ttf/DejaVuSans.ttf"],
  },
};

export default nextConfig;
