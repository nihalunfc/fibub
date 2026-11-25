// What search engines read: the short <title> and description shown in results, and the structured
// data (JSON-LD) that says what a page is. Pages pass these to Base.astro; tests/run.mjs checks every
// built page keeps within the limits.
import { existsSync } from 'node:fs';
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
/** A course's share card (made by `npm run images`), used by its home and every lesson; else the home card. */
export const courseImage = (id: string) => existsSync(`public/og/course/${id}.png`) ? `/og/course/${id}.png` : '/og/home.png';
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

const CATEGORY: Record<string, string> = { money: 'FinanceApplication', documents: 'UtilitiesApplication', everyday: 'UtilitiesApplication', science: 'UtilitiesApplication', collecting: 'UtilitiesApplication', vehicles: 'UtilitiesApplication' };

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

/** Who writes the Blog: the fibub Science Desk, whose page (/editorial/) says how articles are made and checked. */
export const DESK = { name: 'fibub Science Desk', url: '/editorial/' };
const deskLd = () => ({ '@type': 'Organization', '@id': `${SITE.url}/editorial/#desk`, name: DESK.name, url: abs(DESK.url), parentOrganization: { '@id': ORG_ID } });

/** A Blog article: a NewsArticle for research news (Discoveries), a TechArticle for tool guides, else an
 *  Article; with its image, both dates and its author, as Google News and Discover ask for. */
export const articleLd = (a: { title: string; summary: string; url: string; updated: Date; published: Date; image: string; kindName: string; kindUrl: string; tech: boolean; news: boolean; about?: string[] }) => [
  {
    '@type': a.news ? 'NewsArticle' : a.tech ? 'TechArticle' : 'Article',
    headline: a.title.slice(0, 110),
    description: a.summary,
    url: abs(a.url),
    mainEntityOfPage: abs(a.url),
    image: [abs(a.image)],
    datePublished: a.published.toISOString().slice(0, 10),
    dateModified: (a.updated > a.published ? a.updated : a.published).toISOString().slice(0, 10),
    inLanguage: 'en',
    isAccessibleForFree: true,
    author: deskLd(),
    publisher: { '@id': ORG_ID },
    isPartOf: { '@id': `${SITE.url}/#site` },
    ...(a.about?.length ? { about: a.about.map((u) => ({ '@id': `${abs(u)}#app` })) } : {}),
  },
  breadcrumbs([{ name: 'Home', url: '/' }, { name: 'Blog', url: '/blog/' }, { name: a.kindName, url: a.kindUrl }, { name: a.title, url: a.url }]),
];

/** A Blog article's title in search results: its own title with "| fibub" when that fits, else the part
 *  before the colon, else cut at a word. Set `seoTitle` in the article to choose. */
export function articleSeoTitle(title: string, seoTitle?: string) {
  if (seoTitle) return seoTitle;
  const tail = ` | ${SITE.name}`;
  const head = title.split(/:\s/)[0].trim();
  const pick = [`${title}${tail}`, `${head}${tail}`, title, head].find(fits);
  if (pick) return pick;
  const cut = head.slice(0, TITLE_MAX - tail.length + 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:(–-]+$/, '')}${tail}`;
}

/** Fallback for pages with no structured data of their own (About, Contact, Terms, hubs): a WebPage
 *  that says what the page is and where it sits on the site, so every page has some. */
export const pageLd = (name: string, description: string, path: string) => {
  const type = path === '/about/' ? 'AboutPage' : path === '/contact/' ? 'ContactPage' : 'WebPage';
  const crumbs: Crumb[] = [{ name: 'Home', url: '/' }];
  const segs = path.split('/').filter(Boolean);
  if (segs.length > 1) crumbs.push({ name: segs[0][0].toUpperCase() + segs[0].slice(1), url: `/${segs[0]}/` });
  crumbs.push({ name, url: path });
  return [
    { '@type': type, name, description, url: abs(path), inLanguage: 'en', isPartOf: { '@id': `${SITE.url}/#site` }, publisher: { '@id': ORG_ID } },
    breadcrumbs(crumbs),
  ];
};

// ---- Courses (every lesson page is its own search answer; nihal, 2026-11-22) ----
type CourseLike = { id: string; name: string; title: string; text: string; audience?: string; updated?: string };
const courseUrl = (c: { id: string }) => `/learn/courses/${c.id}/`;
const courseId = (c: { id: string }) => `${abs(courseUrl(c))}#course`;
const provider = { '@type': 'Organization', '@id': ORG_ID, name: SITE.name, url: `${SITE.url}/` };

/** Home > Learn > Courses > <course> (> extra). */
export const courseCrumbs = (c: CourseLike, extra?: Crumb): Crumb[] => [
  { name: 'Home', url: '/' }, { name: 'Learn', url: '/learn/' }, { name: 'Courses', url: '/learn/courses/' },
  { name: c.name, url: courseUrl(c) }, ...(extra ? [extra] : []),
];

/** A course home: Course (free, online, self-paced) with its lessons as parts, plus breadcrumbs. */
export function courseLd(c: CourseLike, lessons: { name: string; url: string }[], hours?: number) {
  const workload = hours ? `PT${Math.max(1, Math.round(hours))}H` : undefined;
  return [
    {
      '@type': 'Course', '@id': courseId(c), name: c.title, alternateName: c.name !== c.title ? c.name : undefined,
      description: c.text, url: abs(courseUrl(c)), inLanguage: 'en', isAccessibleForFree: true,
      educationalLevel: 'Beginner', audience: c.audience ? { '@type': 'Audience', audienceType: c.audience } : undefined,
      provider, publisher: { '@id': ORG_ID }, dateModified: c.updated,
      offers: { '@type': 'Offer', category: 'Free', price: 0, priceCurrency: 'CAD', availability: 'https://schema.org/InStock' },
      hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'Online', courseWorkload: workload, inLanguage: 'en' },
      numberOfLessons: lessons.length || undefined,
      hasPart: lessons.map((l) => ({ '@type': 'LearningResource', name: l.name, url: abs(l.url) })),
    },
    breadcrumbs(courseCrumbs(c)),
  ];
}

/** One lesson: a LearningResource (also an Article for search) that is part of its course, with breadcrumbs. */
export function lessonLd(c: CourseLike, l: { n: string; title: string; summary: string; slug: string; minutes: number; updated: Date; module: string; quiz: number }, image = '/og/home.png') {
  const url = abs(`${courseUrl(c)}${l.slug}/`);
  const date = l.updated.toISOString().slice(0, 10);
  return [
    {
      '@type': ['LearningResource', 'Article'], '@id': `${url}#lesson`, name: l.title, headline: l.title.slice(0, 110),
      description: l.summary, url, mainEntityOfPage: url, inLanguage: 'en', isAccessibleForFree: true,
      learningResourceType: l.quiz ? ['Lesson', 'Quiz'] : 'Lesson', educationalLevel: 'Beginner',
      timeRequired: `PT${l.minutes}M`, position: l.n, about: l.module, dateModified: date, datePublished: date,
      author: provider, publisher: { '@id': ORG_ID }, image: abs(image),
      isPartOf: { '@type': 'Course', '@id': courseId(c), name: c.title, url: abs(courseUrl(c)) },
    },
    breadcrumbs(courseCrumbs(c, { name: l.title, url: `${courseUrl(c)}${l.slug}/` })),
  ];
}

/** Any other course page (cheat sheet and so on): a WebPage inside the course, plus breadcrumbs. */
export const coursePageLd = (c: CourseLike, name: string, description: string, slug: string) => [
  { '@type': 'WebPage', name: `${name}: ${c.title}`, description: description || undefined, url: abs(`${courseUrl(c)}${slug}/`), inLanguage: 'en', isPartOf: { '@id': courseId(c) }, publisher: { '@id': ORG_ID } },
  breadcrumbs(courseCrumbs(c, { name, url: `${courseUrl(c)}${slug}/` })),
];
