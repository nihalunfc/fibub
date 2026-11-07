import { getCollection, type CollectionEntry } from 'astro:content';
import { SECTIONS, sectionLabel } from '../site';

export type Tool = CollectionEntry<'tools'>;

// Every tool's Tool.astro, keyed by folder id. A tool marked `live` must have one.
const components = import.meta.glob('../tools/*/Tool.astro', { eager: true }) as Record<string, { default: any }>;
export const toolComponent = (id: string) => components[`../tools/${id}/Tool.astro`]?.default;

export async function allTools() {
  const tools = await getCollection('tools');
  const ids = new Set(tools.map((t) => t.id));
  const nums = new Map<number, string>();
  for (const t of tools) {
    const n = t.data.num;
    if (t.data.status === 'live' && !n) throw new Error(`Tool "${t.id}" is live but has no num (its #number). Give it the next free number: ${Math.max(0, ...tools.map((x) => x.data.num ?? 0)) + 1}`);
    if (n && nums.has(n)) throw new Error(`Tools "${nums.get(n)}" and "${t.id}" both have num ${n}. Numbers are permanent: give the newer tool the next free one`);
    if (n) nums.set(n, t.id);
    if (t.data.status === 'live' && !toolComponent(t.id)) throw new Error(`Tool "${t.id}" is live but has no Tool.astro`);
    if (t.data.status === 'live' && !t.data.flow) throw new Error(`Tool "${t.id}" is live but has no flow (the picture of its steps) in guide.md`);
    for (const r of t.data.related) if (!ids.has(r)) throw new Error(`Tool "${t.id}" lists unknown related tool "${r}"`);
    if (t.data.section && !SECTIONS[t.data.shelf]?.some((s) => s.id === t.data.section)) throw new Error(`Tool "${t.id}" has unknown section "${t.data.section}" for shelf "${t.data.shelf}"`);
  }
  const live = (t: Tool) => (t.data.status === 'live' ? 0 : 1);
  return tools.sort((a, b) => live(a) - live(b) || a.data.order - b.data.order || a.data.name.localeCompare(b.data.name));
}

export const toolUrl = (t: Tool) => `/${t.data.shelf}/${t.id}/`;

/**
 * Tools to link from a tool page. Pairs listed in `related` link both ways; then tools in the same
 * section, then the same shelf, so every page links to its neighbours.
 */
export function relatedTools(tool: Tool, tools: Tool[], max = 6) {
  const live = tools.filter((t) => t.data.status === 'live' && t.id !== tool.id);
  const direct = live.filter((t) => tool.data.related.includes(t.id) || t.data.related.includes(tool.id));
  const section = tool.data.section ? live.filter((t) => t.data.section === tool.data.section) : [];
  const shelf = live.filter((t) => t.data.shelf === tool.data.shelf);
  const out: Tool[] = [];
  for (const t of [...direct, ...section, ...shelf]) if (!out.includes(t)) out.push(t);
  return { direct, all: out.slice(0, Math.max(max, direct.length)) };
}

/** Live and coming tools on a shelf, grouped by section (tools without one go in a final group). */
export function bySection(shelf: string, tools: Tool[]) {
  const mine = tools.filter((t) => t.data.shelf === shelf);
  const groups: { id: string; name: string; blurb: string; subject?: string; label: string; tools: Tool[] }[] =
    (SECTIONS[shelf] ?? []).map((s) => ({ ...s, label: sectionLabel(s), tools: mine.filter((t) => t.data.section === s.id) }));
  const rest = mine.filter((t) => !t.data.section || !groups.some((g) => g.id === t.data.section));
  if (rest.length) groups.push({ id: 'other', name: groups.length ? 'More tools' : '', label: groups.length ? 'More tools' : '', blurb: '', tools: rest });
  return groups.filter((g) => g.tools.length);
}

/** The same groups, gathered by subject (Astronomy, ...). Sections without a subject share one unnamed subject. */
export function bySubject(shelf: string, tools: Tool[]) {
  const out: { subject: string; groups: ReturnType<typeof bySection> }[] = [];
  for (const g of bySection(shelf, tools)) {
    const name = g.subject ?? '';
    let s = out.find((x) => x.subject === name);
    if (!s) out.push((s = { subject: name, groups: [] }));
    s.groups.push(g);
  }
  return out;
}
