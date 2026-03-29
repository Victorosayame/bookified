import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb", // Set the body size limit to 100mb for server actions added this to allow upload of books with large file sizes, especially PDFs with lots of images
    }
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: { remotePatterns: [
    {
      protocol: "https",
      hostname: "covers.openlibrary.org",
    },
    {
      protocol: "https",
      hostname: "s5aa8ikh73z6x9v3.public.blob.vercel-storage.com",
    },
    {
      protocol: "https",
      hostname: "3A%2F%2Fs5aa8ikh73z6x9v3.public.blob.vercel-storage.com",
    }
  ]}
};

export default nextConfig;
