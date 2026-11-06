import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://fibub.com',
  trailingSlash: 'always',
  integrations: [sitemap()],
  build: { format: 'directory', inlineStylesheets: 'always' },
  // Never inline scripts: the CSP (public/_headers) allows only script files from this site.
  vite: { build: { assetsInlineLimit: 0 } },
});
