import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['puppeteer', 'pdf-to-printer'],
  },
};

export default nextConfig;

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
initOpenNextCloudflareForDev();
