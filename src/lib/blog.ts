// The Blog's articles (src/blog/<kind>/<slug>.md) and how they tie to tools: each tool page links to
// its guide ("Read the full guide") and lists the other articles that mention it ("Featured in").
import { getCollection, type CollectionEntry } from 'astro:content';
import { existsSync } from 'node:fs';
import { BLOG_KINDS } from '../content.config';

export type Article = CollectionEntry<'blog'>;
export type Kind = (typeof BLOG_KINDS)[number];
export const KINDS: { id: Kind; name: string; one: string; blurb: string }[] = [
  { id: 'guides', name: 'Tool guides', one: 'Guide', blurb: 'One guide for every tool: what it is for, the idea behind it, how to use it, real uses and a worked example.' },
  { id: 'howto', name: 'How to', one: 'How to', blurb: 'Step-by-step answers to the things students, researchers and everyone else search for, done with free fibub tools.' },
  { id: 'life', name: 'Life guides', one: 'Life guide', blurb: 'Evergreen, step-by-step guides for students and workers: benefits, work, money and paperwork, starting with Canada. Each one is checked against official sources and links the free tools that help.' },
  { id: 'together', name: 'Using tools together', one: 'Together', blurb: 'Real jobs that take more than one tool, step by step, and how one tool helps in many fields.' },
  { id: 'kids', name: 'For students', one: 'For students', blurb: 'Short, friendly guides for school students on using the Learn activities and tools properly.' },
  { id: 'discoveries', name: 'Discoveries', one: 'Discovery', blurb: 'New research from open-access papers, in plain words, and how to check the numbers with fibub tools.' },
  { id: 'nobel', name: 'Nobel Prize series', one: 'Nobel series', blurb: 'The research behind each year\'s science Nobel Prizes, told as short numbered series with animated, hands-on explainers: plain enough for school, deep enough for experts.' },
];
export const kindOf = (a: Article) => a.id.split('/')[0] as Kind;
export const slugOf = (a: Article) => a.id.split('/').slice(1).join('/');
export const articleUrl = (a: Article) => `/blog/${a.id}/`;

/** The day an article went (or goes) live: `published`, else `updated`. */
export const publishedOf = (a: Article) => a.data.published ?? a.data.updated;
/** Today (UTC) as YYYY-MM-DD; FIBUB_TODAY overrides it for tests. */
export const today = () => process.env.FIBUB_TODAY ?? new Date().toISOString().slice(0, 10);
/** True when the article's publish day has come (articles with a later `published` are not built yet). */
export const isOut = (a: Article) => publishedOf(a).toISOString().slice(0, 10) <= today();

/** The share and Discover image: a research article's own card (its verified plot, made by
 *  `npm run images`), else a card for the article, else its main tool's card. */
export function articleImage(a: Article) {
  const own = `/og/blog/${kindOf(a)}-${slugOf(a)}.png`;
  if (existsSync(`public${own}`)) return own;
  return a.data.tools[0] ? `/og/${a.data.tools[0]}.png` : '/og/home.png';
}

let cache: Article[] | null = null;
/** Every article that is out, newest first (then by title). */
export async function allArticles() {
  if (cache) return cache;
  const list = (await getCollection('blog')).filter(isOut);
  for (const a of list) if (!BLOG_KINDS.includes(kindOf(a))) throw new Error(`src/blog/${a.id}.md: unknown kind "${kindOf(a)}" (use ${BLOG_KINDS.join(', ')})`);
  cache = list.sort((a, b) => publishedOf(b).getTime() - publishedOf(a).getTime() || b.data.updated.getTime() - a.data.updated.getTime() || a.data.title.localeCompare(b.data.title));
  return cache;
}

/** Tool ids an article mentions: its `tools` list and every [[tool-id]] in its text. */
export const mentions = (a: Article) => new Set([...a.data.tools, ...[...(a.body ?? '').matchAll(/\[\[([a-z0-9-]+)(?:\|[^\]]+)?\]\]/g)].map((m) => m[1])]);

/** The guide for a tool, and the other articles that mention it (guides of other tools left out). */
export async function articlesFor(toolId: string) {
  const all = await allArticles();
  const guide = all.find((a) => kindOf(a) === 'guides' && a.data.tools[0] === toolId);
  const featured = all.filter((a) => a !== guide && kindOf(a) !== 'guides' && mentions(a).has(toolId));
  return { guide, featured };
}

// Where an article sits, taken from its main tool (the first in `tools:`): area (shelf), subject and
// subfield (section). Used by the Blog's filters. Articles without a live main tool get no place.
export async function articlePlaces() {
  const { allTools, toolPlace } = await import('./tools');
  const { shelfById } = await import('../site');
  const tools = new Map((await allTools()).filter((t) => t.data.status === 'live').map((t) => [t.id, t]));
  const out = new Map<string, { area?: string; subject?: string; sub?: string }>();
  for (const a of await allArticles()) {
    const t = tools.get(a.data.tools[0]);
    if (!t) { out.set(a.id, {}); continue; }
    const { section, subject } = toolPlace(t);
    out.set(a.id, { area: shelfById(t.data.shelf).name, subject: subject?.name, sub: section?.name });
  }
  return out;
}
