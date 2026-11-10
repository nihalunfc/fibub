import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { SHELF_IDS } from './site';
import { ICON_NAMES } from './lib/icons';

// Each tool is one folder in src/tools/<id>/ holding:
//   guide.md   - the tool's name, shelf and summary (frontmatter) and its explainer text (body)
//   Tool.astro - the tool itself (markup + script). It must run entirely in the browser.
const tools = defineCollection({
  // FIBUB_ONLY=a,b builds just those tools (quick checks while building; never for a real deploy).
  loader: glob({ pattern: process.env.FIBUB_ONLY ? `{${process.env.FIBUB_ONLY},${process.env.FIBUB_ONLY}}/guide.md` : '*/guide.md', base: './src/tools', generateId: ({ entry }) => entry.split('/')[0] }),
  schema: z.object({
    name: z.string(),
    shelf: z.enum(SHELF_IDS),
    summary: z.string(),          // one sentence for cards and the meta description
    title: z.string(),            // the H1, written the way people search
    // Optional: the title and description shown in search results. Left out, they are made from
    // `title` and `summary` (see src/lib/seo.ts); set them when the automatic ones read badly.
    seoTitle: z.string().max(60).optional(),
    seoDescription: z.string().max(160).optional(),
    status: z.enum(['live', 'soon']).default('live'),
    ads: z.boolean().default(false), // false on any page that handles personal files or bank data
    order: z.number().default(100),
    // The tool's ID code, shown as #T12 or #L3: one letter per area (CODES in src/site.ts), counted
    // without gaps. Permanent: never changed or reused. `npm run new-tool` hands out the next one.
    code: z.string().regex(/^[A-Z]+[1-9]\d*$/).optional(),
    // The old plain #number (before 2026-11-10), kept so "#3" still finds the tool, and as the order
    // tools were added in (newest lists). New tools get the next one from the generator.
    num: z.number().int().positive().optional(),
    updated: z.coerce.date(),
    // The picture at the top of the tool page: 3 or 4 steps, one short label each so the
    // row fits a 320 px phone screen without wrapping. Required for live tools.
    // 'offline': once the page is open it keeps working with no internet. 'online': needs internet
    // while in use (for example live currency rates). Shown on every card and tool page.
    icon: z.enum(ICON_NAMES),     // shown on the tool's card
    section: z.string().optional(), // a group within the shelf (see SECTIONS in src/site.ts)
    // Tools that go well with this one. Links show both ways automatically, so list each pair once.
    related: z.array(z.string()).default([]),
    // Where the tool's reference numbers come from (shown on the page with a link for removal requests).
    sources: z.array(z.string()).default([]),
    works: z.enum(['offline', 'online']),
    flow: z.array(z.object({ icon: z.enum(ICON_NAMES), label: z.string().max(12) })).min(3).max(4).optional(),
  }),
});

// The Blog (/blog/): one Markdown file per article in src/blog/<kind>/<slug>.md, shown at
// /blog/<kind>/<slug>/. Kinds: guides (one per tool: what it is, how to use it, real uses, worked
// example), together (several tools in one job), kids (for school students, per chapter or subject)
// and discoveries (new research, in our own words, and how to check it with fibub tools).
// Links: tool names link themselves on first mention, [[tool-id]] links a tool, and
// [[blog:<kind>/<slug>]] (or [[blog:<kind>/<slug>|words]]) links another article (src/lib/autolink.mjs).
export const BLOG_KINDS = ['guides', 'together', 'kids', 'discoveries'] as const;
const blog = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './src/blog' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),          // one or two sentences for cards and the meta description
    seoTitle: z.string().max(60).optional(),
    seoDescription: z.string().max(160).optional(),
    // The tools the article is about, main one first. A guide's first tool is the tool it explains:
    // that tool's page links to it as "Read the full guide".
    tools: z.array(z.string()).default([]),
    updated: z.coerce.date(),
    // For students: the class or level it is written for, e.g. "Class 8" or "Age 12 and up".
    level: z.string().optional(),
    // Discoveries: the paper, credited in full. Our own words only: no copied tables or figures.
    paper: z.object({
      title: z.string(), authors: z.string(), journal: z.string(), year: z.number().int(),
      doi: z.string().optional(), url: z.string().url(), licence: z.string(),
      reviewed: z.boolean(),      // false for preprints: the page says "not yet peer-reviewed"
    }).optional(),
    sources: z.array(z.string()).default([]),
  }),
});

export const collections = { tools, blog };
