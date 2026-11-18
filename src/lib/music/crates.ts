// Crate tagger maths: reading track lists, tags, filters and exports (plain TypeScript, no DOM).
import { splitLine } from './mixplan.ts';

export type Tag = string;
export type Row = { id: string; name: string; file: string; bpm: string; key: string; tags: Tag[]; rating: number; energy: number; notes: string };
export const GROUPS: { id: string; name: string; tags: Tag[] }[] = [
  { id: 'vibe', name: 'Vibe', tags: ['deep', 'driving', 'euphoric', 'dark'] },
  { id: 'time', name: 'Set time', tags: ['warm-up', 'peak', 'closing'] },
  { id: 'crowd', name: 'Crowd', tags: ['wedding', 'club', 'bar'] },
];
/** The ten preset tags in order: keys 1 to 9 and 0 toggle them. */
export const PRESETS = GROUPS.flatMap((g) => g.tags);

/** A tag written the way it goes in a comment field: lower case, no spaces or #. */
export const slug = (s: string) => s.toLowerCase().replace(/^#+/, '').replace(/[^\p{L}\p{N}_-]+/gu, '-').replace(/^-+|-+$/g, '').slice(0, 30);
export const groupOf = (t: Tag) => GROUPS.find((g) => g.tags.includes(t))?.id ?? 'custom';
export const idOf = (s: string) => s.trim().toLowerCase();
export const baseOf = (path: string) => path.replace(/^.*[\\/]/, '').replace(/\.[^.]+$/, '');
export const blank = (name: string, file = ''): Row => ({ id: idOf(file || name), name, file, bpm: '', key: '', tags: [], rating: 0, energy: 0, notes: '' });

/** Read an M3U or M3U8 playlist: #EXTINF titles are used when present, else the file name. */
export function parseM3U(text: string): Row[] {
  const out: Row[] = []; let title = '';
  for (const raw of text.replace(/^﻿/, '').split(/\r?\n/)) {
    const l = raw.trim();
    if (!l) continue;
    if (l.startsWith('#')) { const m = l.match(/^#EXTINF:[^,]*,(.*)$/i); if (m) title = m[1].trim(); continue; }
    out.push(blank(title || baseOf(l), l)); title = '';
  }
  return out;
}
/** Read a CSV (header with file/path/title/name/bpm/key/camelot columns, such as the Track analyser's) or a plain list, one name per line. */
export function parseList(text: string): Row[] {
  const lines = text.replace(/^﻿/, '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (!lines.length) return [];
  if (/^#EXTM3U/i.test(lines[0]) || /^#EXTINF/i.test(lines[0])) return parseM3U(text);
  const head = splitLine(lines[0]).map((h) => h.toLowerCase());
  const col = (...n: string[]) => head.findIndex((h) => n.includes(h));
  const cF = col('file', 'path', 'location'), cT = col('title', 'name', 'track', 'filename'), cB = col('bpm', 'tempo'), cC = col('camelot'), cK = col('key', 'initial key');
  if ((cF >= 0 || cT >= 0) && lines.length > 1 && (cB >= 0 || cK >= 0 || cC >= 0 || (cF >= 0 && cT >= 0) || head.length > 1)) {
    return lines.slice(1).map((l) => {
      const c = splitLine(l), file = cF >= 0 ? c[cF] ?? '' : '', name = (cT >= 0 ? c[cT] : '') || baseOf(file);
      if (!name) return null;
      const r = blank(name, file); r.bpm = cB >= 0 ? c[cB] ?? '' : ''; r.key = (cC >= 0 && c[cC]) || (cK >= 0 && c[cK]) || ''; return r;
    }).filter((r): r is Row => !!r);
  }
  return lines.filter((l) => !l.startsWith('#')).map((l) => blank(baseOf(l) || l, /[\\/]|\.\w{2,4}$/.test(l) ? l : ''));
}

/** Add imported rows to the library: a track already there (same file or name) keeps its tags and gets the new BPM and key. */
export function mergeRows(lib: Row[], add: Row[]): { rows: Row[]; added: number } {
  const map = new Map(lib.map((r) => [r.id, r])); let added = 0;
  for (const a of add) {
    const old = map.get(a.id);
    if (old) { old.bpm = a.bpm || old.bpm; old.key = a.key || old.key; old.file = a.file || old.file; }
    else { map.set(a.id, a); added++; }
  }
  return { rows: [...map.values()], added };
}

export type Filter = { tags: Tag[]; mode: 'and' | 'or'; q: string; minRating: number };
export function filterRows(rows: Row[], f: Filter): Row[] {
  const q = f.q.trim().toLowerCase();
  return rows.filter((r) => {
    if (r.rating < f.minRating) return false;
    if (f.tags.length && !(f.mode === 'and' ? f.tags.every((t) => r.tags.includes(t)) : f.tags.some((t) => r.tags.includes(t)))) return false;
    return !q || (r.name + ' ' + r.file + ' ' + r.tags.join(' ') + ' ' + r.notes).toLowerCase().includes(q);
  });
}

export const commentText = (r: Row) => r.tags.map((t) => '#' + t).join(' ');
/** One line per track, "Name: #peak #dark", for pasting into a tag editor's comment field. Tracks without tags are left out. */
export const commentLines = (rows: Row[]) => rows.filter((r) => r.tags.length).map((r) => `${r.name}: ${commentText(r)}`).join('\n');
export const toM3U8 = (rows: Row[]) => '#EXTM3U\n' + rows.map((r) => `#EXTINF:-1,${r.name}\n${r.file || r.name}\n`).join('');
const cell = (v: string) => (/[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
export const toCsv = (rows: Row[]) => 'name,file,bpm,key,tags,rating,energy,notes\r\n' +
  rows.map((r) => [r.name, r.file, r.bpm, r.key, r.tags.join(' '), r.rating || '', r.energy || '', r.notes].map((v) => cell(String(v))).join(',')).join('\r\n') + '\r\n';

/** The whole tag database as JSON, and back. Unknown or broken entries are dropped. */
export const toJson = (rows: Row[]) => JSON.stringify({ app: 'fibub-crate-tagger', v: 1, tracks: rows }, null, 1);
export function fromJson(text: string): Row[] | null {
  try {
    const d = JSON.parse(text);
    if (!d || d.app !== 'fibub-crate-tagger' || !Array.isArray(d.tracks)) return null;
    return d.tracks.filter((t: any) => t && typeof t.name === 'string' && typeof t.id === 'string').map((t: any): Row => ({
      id: t.id, name: t.name, file: String(t.file ?? ''), bpm: String(t.bpm ?? ''), key: String(t.key ?? ''),
      tags: Array.isArray(t.tags) ? t.tags.map((x: unknown) => slug(String(x))).filter(Boolean) : [],
      rating: Math.min(5, Math.max(0, Math.round(+t.rating) || 0)), energy: Math.min(10, Math.max(0, Math.round(+t.energy) || 0)), notes: String(t.notes ?? '').slice(0, 2000),
    }));
  } catch { return null; }
}
