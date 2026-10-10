import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components is off for Milestone 1: every view renders per request
  // so the mock data layer (and later the real API) stays easy to reason about.
  cacheComponents: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
