import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "https", hostname: "n8n.io" },
      { protocol: "https", hostname: "zapier.com" },
      { protocol: "https", hostname: "cdn.zapier.com" },
      { protocol: "https", hostname: "www.make.com" },
      { protocol: "https", hostname: "images.saasworthy.com" },
      { protocol: "https", hostname: "www.gohighlevel.com" },
      { protocol: "https", hostname: "openai.com" },
      { protocol: "https", hostname: "img.icons8.com" },
      { protocol: "https", hostname: "cdn-icons-png.flaticon.com" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "cdn.worldvectorlogo.com" },
      { protocol: "https", hostname: "assets.cdn.filesafe.space" },
      { protocol: "https", hostname: "icon.horse" },
      { protocol: "https", hostname: "cdn.jsdelivr.net" },
    ],
  },
};

export default nextConfig;
