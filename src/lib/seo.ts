// What search engines read: the short <title> and description shown in results, and the structured
// data (JSON-LD) that says what a page is. Pages pass these to Base.astro; tests/run.mjs checks every
// built page keeps within the limits.
import { SITE, shelfById } from '../site';
import type { Tool } from './tools';
import { toolPlace, toolUrl } from './tools';

export const TITLE_MAX = 60; // Google cuts longer titles off in results
export const DESC_MAX = 160;

const fits = (s: string) => s.length <= TITLE_MAX;

/**
 * A tool's title in search results: the words people search (the part of its title before the colon)
 * plus "free online tool" when that fits, else just the name. A guide can set `seoTitle` to choose.
 */
export function toolSeoTitle(t: Tool) {
  const d = t.data;
  if (d.seoTitle) return d.seoTitle;
  const head = d.title.split(/:\s/)[0].trim();
  const free = /\bfree\b/i.test(head);
  const options = [free ? '' : `${head}: free online tool | ${SITE.name}`, `${head} | ${SITE.name}`, `${d.name}: free online tool | ${SITE.name}`, `${d.name} | ${SITE.name}`];
  const pick = options.find((o) => o && fits(o));
  if (pick) return pick;
  // Still too long: cut the name at a word so the build never stops on a title (set seoTitle to choose).
  const room = TITLE_MAX - ` | ${SITE.name}`.length;
  const cut = d.name.slice(0, room + 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:(–-]+$/, '')} | ${SITE.name}`;
}

/** Up to 160 characters: whole sentences where possible, else cut at a word with an ellipsis. */
export function metaDescription(text: string) {
  const s = text.replace(/\s+/g, ' ').trim();
  if (s.length <= DESC_MAX) return s;
  let out = '';
  for (const sentence of s.split(/(?<=[.!?])\s+/)) {
    const next = out ? `${out} ${sentence}` : sentence;
    if (next.length > DESC_MAX) break;
    out = next;
  }
  if (out.length >= 90) return out;
  const cut = s.slice(0, DESC_MAX - 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:.(–-]+$/, '') + '…';
}

export const toolDescription = (t: Tool) => t.data.seoDescription ?? metaDescription(t.data.summary);

const abs = (p: string) => new URL(p, SITE.url).href;
export const ORG_ID = `${SITE.url}/#org`;

export type Crumb = { name: string; url: string };
export const breadcrumbs = (crumbs: Crumb[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: abs(c.url) })),
});

/** Home page: the site and who runs it. */
export const siteLd = () => [
  { '@type': 'WebSite', '@id': `${SITE.url}/#site`, name: SITE.name, alternateName: SITE.meaning, url: `${SITE.url}/`, description: SITE.description, inLanguage: 'en', publisher: { '@id': ORG_ID } },
  { '@type': 'Organization', '@id': ORG_ID, name: SITE.name, url: `${SITE.url}/`, logo: abs('/icon-512.png'), sameAs: ['https://github.com/nihalunfc/fibub'] },
];

/** A shelf or subject page: a collection of tools, with its place on the site. */
export const collectionLd = (name: string, description: string, url: string, crumbs: Crumb[]) => [
  { '@type': 'CollectionPage', name, description, url: abs(url), inLanguage: 'en', isPartOf: { '@id': `${SITE.url}/#site` } },
  breadcrumbs(crumbs),
];

const CATEGORY: Record<string, string> = { money: 'FinanceApplication', documents: 'UtilitiesApplication', everyday: 'UtilitiesApplication', science: 'UtilitiesApplication', collecting: 'UtilitiesApplication' };

/** The tool's breadcrumb trail: Home › Shelf › Subject › Tool. */
export function toolCrumbs(t: Tool): Crumb[] {
  const shelf = shelfById(t.data.shelf);
  const { subject } = toolPlace(t);
  return [
    { name: 'Home', url: '/' },
    { name: shelf.name, url: `/${shelf.id}/` },
    ...(subject ? [{ name: subject.name, url: `/${shelf.id}/${subject.id}/` }] : []),
    { name: t.data.name, url: toolUrl(t) },
  ];
}

/** A tool page: a free web app that runs in the browser, and where it sits on the site. */
export const toolLd = (t: Tool) => [
  {
    '@type': 'WebApplication',
    '@id': `${abs(toolUrl(t))}#app`,
    name: t.data.name,
    alternateName: t.data.title.split(/:\s/)[0].trim(),
    url: abs(toolUrl(t)),
    description: t.data.summary,
    image: abs(`/og/${t.id}.png`),
    applicationCategory: CATEGORY[t.data.shelf] ?? 'UtilitiesApplication',
    operatingSystem: 'Any (runs in a web browser)',
    browserRequirements: 'Requires JavaScript',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    dateModified: t.data.updated.toISOString().slice(0, 10),
    inLanguage: 'en',
    license: 'https://www.apache.org/licenses/LICENSE-2.0',
    publisher: { '@id': ORG_ID },
  },
  breadcrumbs(toolCrumbs(t)),
];
