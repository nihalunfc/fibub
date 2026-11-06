import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { SHELF_IDS } from './site';

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
    updated: z.coerce.date(),
  }),
});

export const collections = { tools };
