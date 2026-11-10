// The Blog's articles (src/blog/<kind>/<slug>.md) and how they tie to tools: each tool page links to
// its guide ("Read the full guide") and lists the other articles that mention it ("Featured in").
import { getCollection, type CollectionEntry } from 'astro:content';
import { BLOG_KINDS } from '../content.config';

export type Article = CollectionEntry<'blog'>;
export type Kind = (typeof BLOG_KINDS)[number];
export const KINDS: { id: Kind; name: string; one: string; blurb: string }[] = [
  { id: 'guides', name: 'Tool guides', one: 'Guide', blurb: 'One guide for every tool: what it is for, the idea behind it, how to use it, real uses and a worked example.' },
  { id: 'howto', name: 'How to', one: 'How to', blurb: 'Step-by-step answers to the things students, researchers and everyone else search for, done with free fibub tools.' },
  { id: 'together', name: 'Using tools together', one: 'Together', blurb: 'Real jobs that take more than one tool, step by step, and how one tool helps in many fields.' },
  { id: 'kids', name: 'For students', one: 'For students', blurb: 'Short, friendly guides for school students on using the Learn activities and tools properly.' },
  { id: 'discoveries', name: 'Discoveries', one: 'Discovery', blurb: 'New research from open-access papers, in plain words, and how to check the numbers with fibub tools.' },
];
export const kindOf = (a: Article) => a.id.split('/')[0] as Kind;
export const slugOf = (a: Article) => a.id.split('/').slice(1).join('/');
export const articleUrl = (a: Article) => `/blog/${a.id}/`;

let cache: Article[] | null = null;
/** Every article, newest first (then by title). */
export async function allArticles() {
  if (cache) return cache;
  const list = await getCollection('blog');
  for (const a of list) if (!BLOG_KINDS.includes(kindOf(a))) throw new Error(`src/blog/${a.id}.md: unknown kind "${kindOf(a)}" (use ${BLOG_KINDS.join(', ')})`);
  cache = list.sort((a, b) => b.data.updated.getTime() - a.data.updated.getTime() || a.data.title.localeCompare(b.data.title));
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
