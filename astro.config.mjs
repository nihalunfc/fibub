import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://fibub.com',
  trailingSlash: 'always',
  integrations: [sitemap()],
  build: { format: 'directory', inlineStylesheets: 'always' },
});
