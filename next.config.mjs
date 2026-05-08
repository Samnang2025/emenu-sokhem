import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig = {
// akk
  experimental: {
    serverComponentsExternalPackages: ['puppeteer', 'pdf-to-printer'],
  },
};
// end akk

export default nextConfig;

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
initOpenNextCloudflareForDev();
