// The Blog's search index: every article's title, summary, kind, date, link and place (area, subject,
// subfield, from its main tool). The filter bar on the Blog pages loads it once, the first time someone
// types or picks a filter; it is a plain file and sends nothing about the visitor.
import type { APIRoute } from 'astro';
import { allArticles, articlePlaces, articleUrl, kindOf, KINDS } from '../../lib/blog';

export const GET: APIRoute = async () => {
  const places = await articlePlaces();
  const rows = (await allArticles()).map((a) => {
    const p = places.get(a.id) ?? {};
    return {
      u: articleUrl(a),
      t: a.data.title,
      s: a.data.summary,
      k: kindOf(a),
      o: KINDS.find((k) => k.id === kindOf(a))!.one,
      d: a.data.updated.toISOString().slice(0, 10),
      l: a.data.level,
      a: p.area, j: p.subject, b: p.sub,
    };
  });
  return new Response(JSON.stringify(rows), { headers: { 'Content-Type': 'application/json' } });
};
