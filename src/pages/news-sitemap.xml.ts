// The Google News sitemap at /news-sitemap.xml: research articles (Discoveries) that went out in the
// last two days, as Google asks (https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap).
// It is rebuilt every day by the morning publish build (.github/workflows/publish.yml). Listed in robots.txt.
import type { APIRoute } from 'astro';
import { allArticles, articleUrl, kindOf, publishedOf, today } from '../lib/blog';
import { SITE } from '../site';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const NEWS_KINDS = new Set(['discoveries']);

export const GET: APIRoute = async () => {
  const cut = new Date(`${today()}T00:00:00Z`).getTime() - 2 * 86400000;
  const list = (await allArticles()).filter((a) => NEWS_KINDS.has(kindOf(a)) && publishedOf(a).getTime() >= cut).slice(0, 1000);
  const urls = list.map((a) => `  <url>
    <loc>${new URL(articleUrl(a), SITE.url).href}</loc>
    <news:news>
      <news:publication><news:name>${esc(SITE.name)}</news:name><news:language>en</news:language></news:publication>
      <news:publication_date>${publishedOf(a).toISOString().slice(0, 10)}</news:publication_date>
      <news:title>${esc(a.data.title)}</news:title>
    </news:news>
  </url>`).join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
