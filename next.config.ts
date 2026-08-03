import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Logos are local, trusted SVG and PNG files under /public/logos.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
