// Load combinations: the user's load cases (each with values for several effects) and the user's
// combinations ("1.2D + 1.6L"), evaluated for every sign of the reversible loads, with the governing
// (largest and smallest) value of each effect. No code factors are built in.
import { num } from './num.ts';

export type Load = { name: string; values: number[]; rev: boolean[] };
export type Loads = { effects: string[]; loads: Load[] };
export type Combo = { name: string; terms: { load: string; f: number }[] };
export type Row = { combo: string; variant: string; values: number[] };
export type Extreme = { value: number; row: number };

/** Parse a pasted load table: a header row (first cell any label, then effect names), then one row per load case. "±" marks a value that can act either way. */
export function parseLoads(rows: string[][]): Loads {
  const clean = rows.filter((r) => r.some((c) => c.trim() !== ''));
  if (clean.length < 2) throw new Error('Give a header row (effects) and at least one load case.');
  const effects = clean[0].slice(1).map((s) => s.trim()).filter((s, i, a) => s !== '' || i < a.length - 1);
  if (!effects.length) throw new Error('The header row needs at least one effect after the first cell, for example "Load, M (kN·m)".');
  const loads: Load[] = [], seen = new Set<string>();
  for (const r of clean.slice(1)) {
    const name = (r[0] ?? '').trim();
    if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(name)) throw new Error(`"${name}" is not a usable load name: use letters and digits, starting with a letter (D, L, W1, Snow).`);
    if (seen.has(name)) throw new Error(`The load "${name}" is listed twice.`);
    seen.add(name);
    const values: number[] = [], rev: boolean[] = [];
    effects.forEach((_, i) => {
      let t = (r[i + 1] ?? '').trim();
      const pm = /^(±|\+\/-|\+-)/.test(t);
      if (pm) t = t.replace(/^(±|\+\/-|\+-)/, '');
      const v = t === '' ? 0 : num(t);
      if (!Number.isFinite(v)) throw new Error(`"${r[i + 1]}" (load ${name}, ${effects[i]}) is not a number.`);
      values.push(v); rev.push(pm);
    });
    loads.push({ name, values, rev });
  }
  return { effects, loads };
}

/** Parse combinations, one per line: "1.2D + 1.6L + 0.5S", optionally named "ULS 2: 1.2D + 1.6L". */
export function parseCombos(text: string, names: string[]): Combo[] {
  const out: Combo[] = [];
  const byLower = new Map(names.map((n) => [n.toLowerCase(), n]));
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const m = line.match(/^([^:]+):\s*(.+)$/);
    const name = m ? m[1].trim() : line, expr = (m ? m[2] : line).replace(/[−–]/g, '-').replace(/\s+/g, '');
    const terms: { load: string; f: number }[] = [];
    const re = /([+-]?)(\d*\.?\d*)(?:\*|×)?([A-Za-z][A-Za-z0-9_]*)/gy;
    let pos = 0, t: RegExpExecArray | null;
    while (pos < expr.length) {
      re.lastIndex = pos; t = re.exec(expr);
      if (!t || t[0] === '') throw new Error(`Could not read "${line}". Write it like 1.2D + 1.6L.`);
      const load = byLower.get(t[3].toLowerCase());
      if (!load) throw new Error(`"${t[3]}" in "${line}" is not one of your loads (${names.join(', ')}).`);
      const f = (t[1] === '-' ? -1 : 1) * (t[2] === '' ? 1 : Number(t[2]));
      if (!Number.isFinite(f)) throw new Error(`Could not read the factor in "${line}".`);
      const prev = terms.find((x) => x.load === load);
      if (prev) prev.f += f; else terms.push({ load, f });
      pos = re.lastIndex;
    }
    if (!terms.length) throw new Error(`"${line}" has no loads.`);
    out.push({ name, terms });
  }
  return out;
}

/** Every combination for every sign of its reversible loads, and the extremes of each effect. */
export function evaluate(L: Loads, combos: Combo[]): { rows: Row[]; max: Extreme[]; min: Extreme[]; abs: Extreme[] } {
  const byName = new Map(L.loads.map((l) => [l.name, l]));
  const rows: Row[] = [];
  for (const c of combos) {
    const revLoads = c.terms.filter((t) => t.f !== 0 && byName.get(t.load)!.rev.some(Boolean)).map((t) => t.load);
    const n = 1 << revLoads.length;
    for (let k = 0; k < n; k++) {
      const sign = new Map(revLoads.map((ld, j) => [ld, (k >> j) & 1 ? -1 : 1]));
      const values = L.effects.map((_, e) => c.terms.reduce((s, t) => {
        const ld = byName.get(t.load)!; const sg = ld.rev[e] ? sign.get(t.load) ?? 1 : 1;
        return s + t.f * sg * ld.values[e];
      }, 0));
      const variant = revLoads.map((ld) => `${ld}${sign.get(ld)! > 0 ? '+' : '−'}`).join(' ');
      rows.push({ combo: c.name, variant, values });
    }
  }
  const pick = (cmp: (a: number, b: number) => boolean, f = (x: number) => x) => L.effects.map((_, e) => rows.reduce<Extreme>((best, r, i) => (best.row < 0 || cmp(f(r.values[e]), f(best.value)) ? { value: r.values[e], row: i } : best), { value: NaN, row: -1 }));
  return { rows, max: pick((a, b) => a > b + 1e-12), min: pick((a, b) => a < b - 1e-12), abs: pick((a, b) => a > b + 1e-12, Math.abs) };
}

/** Made-up example sets, for showing how the tool works. Not from any code edition. */
export const PRESETS: Record<string, string> = {
  factored: ['1.4D', '1.25D + 1.5L + 0.5S', '1.25D + 1.5S + 0.5L', '1.25D + 1.4W + 0.5L', '1.0D + 1.0E + 0.5L', '0.9D + 1.4W', '0.9D + 1.0E'].join('\n'),
  service: ['D + L', 'D + L + S', 'D + W', 'D + 0.7L + 0.7W', 'D + 0.7E'].join('\n'),
};
