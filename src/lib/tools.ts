import { getCollection, type CollectionEntry } from 'astro:content';
import { SECTIONS, SUBJECTS, sectionLabel, LEARN_PAGES, codePrefix } from '../site';

export type Tool = CollectionEntry<'tools'>;

// Every tool's Tool.astro, keyed by folder id. A tool marked `live` must have one.
const components = import.meta.glob('../tools/*/Tool.astro', { eager: true }) as Record<string, { default: any }>;
export const toolComponent = (id: string) => components[`../tools/${id}/Tool.astro`]?.default;

export async function allTools() {
  const tools = await getCollection('tools');
  const ids = new Set(tools.map((t) => t.id));
  const nums = new Map<number, string>();
  const codes = new Map<string, string>();
  for (const t of tools) {
    const n = t.data.num, c = t.data.code;
    if (t.data.status === 'live' && !c) throw new Error(`Tool "${t.id}" is live but has no code (its #ID, like T12 or L3). Run: node scripts/renumber.mjs`);
    if (c && c.replace(/\d+$/, '') !== codePrefix(t.data.shelf)) throw new Error(`Tool "${t.id}" has code ${c} but tools on the ${t.data.shelf} shelf use ${codePrefix(t.data.shelf)} (CODES in src/site.ts)`);
    if (c && codes.has(c)) throw new Error(`Tools "${codes.get(c)}" and "${t.id}" both have code ${c}. Codes are permanent: give the newer tool the next free one`);
    if (c) codes.set(c, t.id);
    if (n && nums.has(n)) throw new Error(`Tools "${nums.get(n)}" and "${t.id}" both have num ${n}. Old numbers are permanent: give the newer tool the next free one`);
    if (n) nums.set(n, t.id);
    if (t.data.status === 'live' && !toolComponent(t.id)) throw new Error(`Tool "${t.id}" is live but has no Tool.astro`);
    if (t.data.status === 'live' && !t.data.flow) throw new Error(`Tool "${t.id}" is live but has no flow (the picture of its steps) in guide.md`);
    if (process.env.FIBUB_ONLY) t.data.related = t.data.related.filter((r) => ids.has(r));
    for (const r of t.data.related) if (!ids.has(r)) throw new Error(`Tool "${t.id}" lists unknown related tool "${r}"`);
    if (t.data.section && !SECTIONS[t.data.shelf]?.some((s) => s.id === t.data.section)) throw new Error(`Tool "${t.id}" has unknown section "${t.data.section}" for shelf "${t.data.shelf}"`);
    if (SUBJECTS[t.data.shelf]?.some((s) => s.id === t.id)) throw new Error(`Tool id "${t.id}" is also a subject id: both would live at /${t.data.shelf}/${t.id}/`);
    if (t.data.shelf === 'learn' && LEARN_PAGES.includes(t.id)) throw new Error(`Tool id "${t.id}" is also a Learn page: both would live at /learn/${t.id}/`);
    if (t.data.status === 'live' && t.data.shelf === 'learn' && !t.data.section) throw new Error(`Tool "${t.id}" is on the learn shelf but has no section (school-physics, school-chemistry, school-biology, school-maths or school-earth)`);
    if (t.data.status === 'live' && SUBJECTS[t.data.shelf] && !t.data.section) throw new Error(`Tool "${t.id}" is on the ${t.data.shelf} shelf but has no section (see SECTIONS in src/site.ts)`);
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
  const groups: { id: string; name: string; blurb?: string; subject?: string; label: string; tools: Tool[] }[] =
    (SECTIONS[shelf] ?? []).map((s) => ({ ...s, label: sectionLabel(s, shelf), tools: mine.filter((t) => t.data.section === s.id) }));
  const rest = mine.filter((t) => !t.data.section || !groups.some((g) => g.id === t.data.section));
  if (rest.length) groups.push({ id: 'other', name: groups.length ? 'More tools' : '', label: groups.length ? 'More tools' : '', tools: rest });
  return groups.filter((g) => g.tools.length);
}

export type SubjectGroup = { id: string; name: string; blurb: string; url: string; count: number; groups: ReturnType<typeof bySection> };
export const subjectUrl = (shelf: string, id: string) => `/${shelf}/${id}/`;

/**
 * The same groups, gathered by subject (Physics, Astronomy, ...), in the order of SUBJECTS. Only
 * subjects with tools are returned. On a shelf without subjects, everything is one unnamed subject.
 */
export function bySubject(shelf: string, tools: Tool[]): SubjectGroup[] {
  const groups = bySection(shelf, tools);
  const subs = SUBJECTS[shelf];
  if (!subs) return groups.length ? [{ id: '', name: '', blurb: '', url: `/${shelf}/`, count: groups.reduce((n, g) => n + g.tools.length, 0), groups }] : [];
  return subs.map((s) => {
    const gs = groups.filter((g) => g.subject === s.id);
    return { ...s, url: subjectUrl(shelf, s.id), count: gs.reduce((n, g) => n + g.tools.length, 0), groups: gs };
  }).filter((s) => s.count);
}

/** Where a tool sits, for search results and the tool page: "Science › Physics › Optics and photonics". */
export function toolPlace(t: Tool) {
  const sec = SECTIONS[t.data.shelf]?.find((s) => s.id === t.data.section);
  const sj = SUBJECTS[t.data.shelf]?.find((s) => s.id === sec?.subject);
  return { section: sec, subject: sj };
}
