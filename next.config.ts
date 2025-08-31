// next.config.ts
import type { NextConfig } from "next";

const repo = "professional-next";
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
    output: "export",                 // statinis export į ./out
    images: { unoptimized: true },    // kad <Image> veiktų be Image Optimization
    basePath: isProd ? `/${repo}` : undefined,
    assetPrefix: isProd ? `/${repo}/` : undefined,
};

export default nextConfig;
