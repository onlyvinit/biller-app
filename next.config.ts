import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export const config = {
    mongoUri: process.env.MONGO_URL || "",
}

export default nextConfig;