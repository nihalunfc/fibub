import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { SHELF_IDS } from './site';
import { ICON_NAMES } from './lib/icons';

// Each tool is one folder in src/tools/<id>/ holding:
//   guide.md   - the tool's name, shelf and summary (frontmatter) and its explainer text (body)
//   Tool.astro - the tool itself (markup + script). It must run entirely in the browser.
const tools = defineCollection({
  loader: glob({ pattern: '*/guide.md', base: './src/tools', generateId: ({ entry }) => entry.split('/')[0] }),
  schema: z.object({
    name: z.string(),
    shelf: z.enum(SHELF_IDS),
    summary: z.string(),          // one sentence for cards and the meta description
    title: z.string(),            // the <title> and H1, written the way people search
    status: z.enum(['live', 'soon']).default('live'),
    ads: z.boolean().default(false), // false on any page that handles personal files or bank data
    order: z.number().default(100),
    num: z.number().int().positive().optional(), // the tool's permanent #number (1, 2, 3...): never changed or reused
    updated: z.coerce.date(),
    // The picture at the top of the tool page: 3 or 4 steps, one short label each so the
    // row fits a 320 px phone screen without wrapping. Required for live tools.
    // 'offline': once the page is open it keeps working with no internet. 'online': needs internet
    // while in use (for example live currency rates). Shown on every card and tool page.
    icon: z.enum(ICON_NAMES),     // shown on the tool's card
    section: z.string().optional(), // a group within the shelf (see SECTIONS in src/site.ts)
    // Tools that go well with this one. Links show both ways automatically, so list each pair once.
    related: z.array(z.string()).default([]),
    works: z.enum(['offline', 'online']),
    flow: z.array(z.object({ icon: z.enum(ICON_NAMES), label: z.string().max(12) })).min(3).max(4).optional(),
  }),
});

// Translated tool guides: src/i18n/guides/<lang>/<tool id>.md holds the guide (the body of the tool's
// guide.md) in that language. A tool without one shows its English guide, with a note.
const guides = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './src/i18n/guides', generateId: ({ entry }) => entry.replace(/\.md$/, '') }),
  schema: z.object({
    // The date of the English guide.md this translation was made from ("updated" in its frontmatter).
    // When the English guide changes, re-translate and bump this date; tests list guides that are behind.
    source: z.coerce.date(),
  }),
});

export const collections = { tools, guides };
