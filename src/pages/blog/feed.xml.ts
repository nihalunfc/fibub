// The Blog's RSS 2.0 feed at /blog/feed.xml: the 50 newest articles, for feed readers and search
// engines (it can be submitted to Google Search Console next to the sitemap). Plain XML, no library.
import type { APIRoute } from 'astro';
import { allArticles, articleUrl, KINDS, kindOf } from '../../lib/blog';
import { SITE } from '../../site';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async () => {
  const list = (await allArticles()).slice(0, 50);
  const self = new URL('/blog/feed.xml', SITE.url).href;
  const items = list.map((a) => {
    const link = new URL(articleUrl(a), SITE.url).href;
    const kind = KINDS.find((k) => k.id === kindOf(a))?.name ?? kindOf(a);
    return `    <item>
      <title>${esc(a.data.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${a.data.updated.toUTCString()}</pubDate>
      <category>${esc(kind)}</category>
      <description>${esc(a.data.summary)}</description>
    </item>`;
  }).join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE.name)} Blog</title>
    <link>${new URL('/blog/', SITE.url).href}</link>
    <atom:link href="${self}" rel="self" type="application/rss+xml" />
    <description>Guides, how-tos and research discoveries for fibub's free in-browser tools.</description>
    <language>en</language>
    <lastBuildDate>${(list[0]?.data.updated ?? new Date()).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
