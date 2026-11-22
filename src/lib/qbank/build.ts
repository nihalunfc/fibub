// Build-time access to question bank data (public/qbank/<bank>/), for search-indexable pages and counts.
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import temml from 'temml';
import { topicItems, topicGens } from './core.mjs';
import type { QBankIndex, QTopicFile } from './types';

const url = (p: string) => pathToFileURL(resolve(process.cwd(), 'public/qbank', p)).href;
export async function bankIndex(bank: string): Promise<QBankIndex> {
  return (await import(/* @vite-ignore */ url(`${bank}/index.js`))).default;
}
export async function bankTopic(bank: string, topic: string): Promise<QTopicFile> {
  return (await import(/* @vite-ignore */ url(`${bank}/${topic}.js`))).default;
}
/** Counts per topic and in total: written items by type and level, and templates. */
export async function bankCounts(bank: string) {
  const idx = await bankIndex(bank);
  const topics: Record<string, { items: number; gens: number; byType: Record<string, number>; byLevel: Record<number, number>; exams: Record<string, number> }> = {};
  for (const u of idx.units) for (const t of u.topics) {
    const f = await bankTopic(bank, t.id).catch(() => null);
    const c = { items: 0, gens: 0, byType: {} as Record<string, number>, byLevel: {} as Record<number, number>, exams: {} as Record<string, number> };
    if (f) {
      for (const it of f.items) { c.items++; c.byType[it.type] = (c.byType[it.type] ?? 0) + 1; c.byLevel[it.level] = (c.byLevel[it.level] ?? 0) + 1; for (const e of it.exams ?? []) c.exams[e] = (c.exams[e] ?? 0) + 1; }
      for (const g of topicGens(f)) { c.gens++; for (const e of g.exams ?? []) c.exams[e] = (c.exams[e] ?? 0) + 1; }
    }
    topics[t.id] = c;
  }
  const total = Object.values(topics).reduce((a, c) => ({ items: a.items + c.items, gens: a.gens + c.gens }), { items: 0, gens: 0 });
  return { idx, topics, total };
}
/** Turn $...$ / $$...$$ TeX in question HTML into MathML at build time. */
export function texHtml(html: string) {
  if (!html) return '';
  const r = (t: string, d: boolean) => { try { return temml.renderToString(t, { displayMode: d, annotate: false }); } catch { return t; } };
  return html.replace(/\$\$([\s\S]+?)\$\$/g, (_, t) => r(t, true)).replace(/(^|[^\\])\$([^$]+?)\$/g, (_, pre, t) => pre + r(t, false)).replace(/\\\$/g, '$');
}
export { topicItems };
