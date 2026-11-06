import { getCollection, type CollectionEntry } from 'astro:content';

export type Tool = CollectionEntry<'tools'>;

// Every tool's Tool.astro, keyed by folder id. A tool marked `live` must have one.
const components = import.meta.glob('../tools/*/Tool.astro', { eager: true }) as Record<string, { default: any }>;
export const toolComponent = (id: string) => components[`../tools/${id}/Tool.astro`]?.default;

export async function allTools() {
  const tools = await getCollection('tools');
  for (const t of tools) {
    if (t.data.status === 'live' && !toolComponent(t.id)) throw new Error(`Tool "${t.id}" is live but has no Tool.astro`);
  }
  const live = (t: Tool) => (t.data.status === 'live' ? 0 : 1);
  return tools.sort((a, b) => live(a) - live(b) || a.data.order - b.data.order || a.data.name.localeCompare(b.data.name));
}

export const toolUrl = (t: Tool) => `/${t.data.shelf}/${t.id}/`;
