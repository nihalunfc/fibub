import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { existsSync } from 'node:fs';

// A translated tool page whose guide is still in English is marked noindex, so it stays out of the
// sitemap too: /ml/science/sky-tonight/ is listed only once src/i18n/guides/ml/sky-tonight.md exists.
const listed = (page) => {
  const m = new URL(page).pathname.match(/^\/([a-z]{2})\/[a-z-]+\/([a-z0-9-]+)\/$/);
  if (!m || !existsSync(`src/tools/${m[2]}`)) return true;
  return existsSync(`src/i18n/guides/${m[1]}/${m[2]}.md`);
};

export default defineConfig({
  site: 'https://fibub.com',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: listed })],
  build: { format: 'directory', inlineStylesheets: 'always' },
  // Never inline scripts: the CSP (public/_headers) allows only script files from this site.
  vite: { build: { assetsInlineLimit: 0 } },
});
