// Dichotomous keys (plain logic, no DOM): read a key written as couplets, check it for loops, dead ends,
// unreached couplets and taxa, list the path to every taxon, and write it back as text or JSON.

export type Target = { couplet: number } | { taxon: string };
export type Lead = { label: string; text: string; to: Target; line: number };
export type Couplet = { n: number; leads: Lead[] };
export type Key = { title: string; start: number; couplets: Map<number, Couplet> };

const SEP = /\s*(?:\.{2,}|…+|→|->|\t+)\s*/;
/**
 * Read a key, one lead per line: "1a. Wings present ... 2" or "1b Wings absent → Silverfish". Leads are
 * numbered 1a/1b (or 1 and 1' / 1′). The part after "...", "…", "→", "->" or a tab is a couplet number or a
 * taxon name. A first line starting with "Title:" names the key; lines starting with # are notes.
 */
export function parseKey(text: string): { key: Key; errors: string[] } {
  const couplets = new Map<number, Couplet>(), errors: string[] = [];
  let title = '';
  text.split(/\r?\n/).forEach((raw, i) => {
    const line = raw.trim(), ln = i + 1;
    if (!line || line.startsWith('#')) return;
    const t = line.match(/^title\s*:\s*(.*)$/i);
    if (t) { title = t[1].trim(); return; }
    const m = line.match(/^(\d+)\s*([a-z]|['′’])?\s*[.):]?\s+(.*)$/i);
    if (!m) { errors.push(`Line ${ln}: start with the couplet number and a or b, such as "1a. Wings present ... 2".`); return; }
    const n = Number(m[1]), side = (m[2] ?? '').toLowerCase(), parts = m[3].split(SEP);
    if (parts.length < 2 || !parts[parts.length - 1].trim()) { errors.push(`Line ${ln}: end the lead with "..." and where it goes (a couplet number or a taxon name).`); return; }
    const dest = parts.pop()!.trim(), body = parts.join(' ').trim();
    if (!couplets.has(n)) couplets.set(n, { n, leads: [] });
    const c = couplets.get(n)!;
    const label = `${n}${/^[a-z]$/.test(side) ? side : c.leads.length ? String.fromCharCode(97 + c.leads.length) : 'a'}`;
    c.leads.push({ label, text: body, to: /^\d+$/.test(dest) ? { couplet: Number(dest) } : { taxon: dest }, line: ln });
  });
  const order = [...couplets.keys()];
  return { key: { title, start: couplets.has(1) ? 1 : order.length ? Math.min(...order) : 1, couplets }, errors };
}

export type Issue = { level: 'error' | 'warning'; text: string };
export type CheckResult = { issues: Issue[]; taxa: string[]; paths: Map<string, string[][]>; reached: Set<number>; depth: number; meanDepth: number };

/** Check a key: structure, loops, dead ends, unreached couplets, and (optionally) taxa expected but missing. */
export function checkKey(key: Key, expected: string[] = []): CheckResult {
  const issues: Issue[] = [], C = key.couplets;
  if (!C.size) return { issues: [{ level: 'error', text: 'The key has no couplets yet.' }], taxa: [], paths: new Map(), reached: new Set(), depth: 0, meanDepth: 0 };
  if (!C.has(1)) issues.push({ level: 'warning', text: `There is no couplet 1, so the key starts at couplet ${key.start}.` });
  for (const c of [...C.values()].sort((a, b) => a.n - b.n)) {
    if (c.leads.length < 2) issues.push({ level: 'error', text: `Couplet ${c.n} has only one lead; a couplet needs two (${c.n}a and ${c.n}b).` });
    if (c.leads.length > 2) issues.push({ level: 'error', text: `Couplet ${c.n} has ${c.leads.length} leads; a dichotomous key has exactly two per couplet.` });
    const labels = c.leads.map((l) => l.label);
    if (new Set(labels).size < labels.length) issues.push({ level: 'error', text: `Couplet ${c.n} has the same lead (${labels.find((l, i) => labels.indexOf(l) !== i)}) twice.` });
    for (const l of c.leads) {
      if (!l.text) issues.push({ level: 'error', text: `Lead ${l.label} has no description.` });
      if ('couplet' in l.to && !C.has(l.to.couplet)) issues.push({ level: 'error', text: `Dead end: lead ${l.label} goes to couplet ${l.to.couplet}, which does not exist.` });
    }
    if (c.leads.length === 2) {
      const [x, y] = c.leads, same = JSON.stringify(x.to) === JSON.stringify(y.to);
      if (same) issues.push({ level: 'warning', text: `Both leads of couplet ${c.n} go to the same place, so the choice makes no difference.` });
      if (x.text && x.text.toLowerCase() === y.text.toLowerCase()) issues.push({ level: 'warning', text: `Both leads of couplet ${c.n} have the same description.` });
    }
  }
  // Who points to each couplet.
  const into = new Map<number, string[]>();
  for (const c of C.values()) for (const l of c.leads) if ('couplet' in l.to) into.set(l.to.couplet, [...(into.get(l.to.couplet) ?? []), l.label]);
  for (const [n, from] of into) if (C.has(n) && from.length > 1) issues.push({ level: 'warning', text: `Couplet ${n} is reached from ${from.length} leads (${from.join(', ')}); in a dichotomous key each couplet is usually reached once.` });
  // Walk from the start: loops (a couplet already on the current path), reached couplets, paths to taxa.
  const reached = new Set<number>(), paths = new Map<string, string[][]>(), loops = new Set<string>();
  let depth = 0, ends = 0, depthSum = 0;
  const walk = (n: number, path: string[], onPath: number[]) => {
    if (onPath.includes(n)) { loops.add([...onPath.slice(onPath.indexOf(n)), n].join(' → ')); return; }
    const c = C.get(n); if (!c) return;
    reached.add(n);
    if (paths.size > 5000 || path.length > 500) return;
    for (const l of c.leads) {
      const p = [...path, l.label];
      if ('taxon' in l.to) { paths.set(l.to.taxon, [...(paths.get(l.to.taxon) ?? []), p]); depth = Math.max(depth, p.length); depthSum += p.length; ends++; }
      else walk(l.to.couplet, p, [...onPath, n]);
    }
  };
  walk(key.start, [], []);
  for (const lp of loops) if (!issues.some((i) => i.text.includes(lp))) issues.push({ level: 'error', text: `Loop: ${lp}. Following these leads goes round in a circle.` });
  const unreached = [...C.keys()].filter((n) => !reached.has(n)).sort((a, b) => a - b);
  if (unreached.length) issues.push({ level: 'warning', text: `Couplet${unreached.length > 1 ? 's' : ''} ${unreached.join(', ')} cannot be reached from couplet ${key.start}, so ${unreached.length > 1 ? 'they are' : 'it is'} never used.` });
  const taxa = [...paths.keys()];
  // Taxa written in unreached couplets are unreachable too.
  const allTaxa = new Set<string>();
  for (const c of C.values()) for (const l of c.leads) if ('taxon' in l.to) allTaxa.add(l.to.taxon);
  const lost = [...allTaxa].filter((t) => !paths.has(t));
  if (lost.length) issues.push({ level: 'error', text: `Unreached taxa: ${lost.join(', ')} ${lost.length > 1 ? 'are' : 'is'} named in the key but no path from couplet ${key.start} leads there.` });
  for (const [t, ps] of paths) if (ps.length > 1) issues.push({ level: 'warning', text: `${t} keys out ${ps.length} times (${ps.map((p) => p[p.length - 1]).join(', ')}). That is fine for a variable taxon; otherwise check the leads.` });
  const norm = (s: string) => s.trim().toLowerCase();
  const exp = [...new Set(expected.map((s) => s.trim()).filter(Boolean))];
  if (exp.length) {
    const have = new Set(taxa.map(norm));
    const missing = exp.filter((t) => !have.has(norm(t)));
    if (missing.length) issues.push({ level: 'error', text: `Taxa on your list that the key never reaches: ${missing.join(', ')}.` });
    const extra = taxa.filter((t) => !exp.some((e) => norm(e) === norm(t)));
    if (extra.length) issues.push({ level: 'warning', text: `In the key but not on your list: ${extra.join(', ')}.` });
  }
  return { issues, taxa, paths, reached, depth, meanDepth: ends ? depthSum / ends : 0 };
}

/** The key as text, in the same form parseKey reads. */
export function keyToText(key: Key): string {
  const out: string[] = [];
  if (key.title) out.push(`Title: ${key.title}`);
  for (const c of [...key.couplets.values()].sort((a, b) => a.n - b.n)) for (const l of c.leads) out.push(`${l.label}. ${l.text} ... ${'couplet' in l.to ? l.to.couplet : l.to.taxon}`);
  return out.join('\n');
}

/** A printable key with dot leaders, wrapped to `width` characters. */
export function keyToPrint(key: Key, width = 78): string {
  const out: string[] = key.title ? [key.title, ''] : [];
  for (const c of [...key.couplets.values()].sort((a, b) => a.n - b.n)) {
    for (const l of c.leads) {
      const head = `${l.label}.`.padEnd(5), dest = 'couplet' in l.to ? String(l.to.couplet) : l.to.taxon;
      const words = l.text.split(/\s+/), lines: string[] = [];
      let cur = head;
      for (const w of words) { if ((cur + ' ' + w).length > width - 8 && cur.trim() !== head.trim()) { lines.push(cur); cur = ' '.repeat(5) + w; } else cur = cur === head ? head + w : cur + ' ' + w; }
      if (cur.length + dest.length + 5 > width) { lines.push(cur); cur = ' '.repeat(5); }
      const fill = Math.max(3, width - cur.length - dest.length - 2);
      lines.push(cur + ' ' + '.'.repeat(fill) + ' ' + dest);
      out.push(...lines);
    }
    out.push('');
  }
  return out.join('\n').trimEnd() + '\n';
}

export type KeyJson = { format: 'fibub-dichotomous-key'; version: 1; title: string; start: number; couplets: { n: number; leads: { label: string; text: string; to: number | string }[] }[] };
export function keyToJson(key: Key): KeyJson {
  return { format: 'fibub-dichotomous-key', version: 1, title: key.title, start: key.start,
    couplets: [...key.couplets.values()].sort((a, b) => a.n - b.n).map((c) => ({ n: c.n, leads: c.leads.map((l) => ({ label: l.label, text: l.text, to: 'couplet' in l.to ? l.to.couplet : l.to.taxon })) })) };
}
/** Read a key saved by keyToJson (checked, so a hand-edited file gives a clear message). */
export function keyFromJson(j: unknown): Key {
  const o = j as KeyJson;
  if (!o || typeof o !== 'object' || !Array.isArray(o.couplets)) throw new Error('This is not a key file: it has no list of couplets.');
  const couplets = new Map<number, Couplet>();
  for (const c of o.couplets) {
    if (!Number.isInteger(c?.n) || !Array.isArray(c.leads)) throw new Error('Each couplet needs a whole number "n" and a list of "leads".');
    couplets.set(c.n, { n: c.n, leads: c.leads.map((l, i) => {
      if (typeof l?.text !== 'string' || (typeof l.to !== 'number' && typeof l.to !== 'string')) throw new Error(`Couplet ${c.n}: each lead needs "text" and "to" (a couplet number or a taxon name).`);
      return { label: typeof l.label === 'string' ? l.label : `${c.n}${String.fromCharCode(97 + i)}`, text: l.text.replace(/\s+/g, ' ').trim(), to: typeof l.to === 'number' ? { couplet: l.to } : { taxon: l.to.trim() }, line: 0 };
    }) });
  }
  return { title: typeof o.title === 'string' ? o.title : '', start: Number.isInteger(o.start) && couplets.has(o.start) ? o.start : couplets.has(1) ? 1 : Math.min(...couplets.keys()), couplets };
}
