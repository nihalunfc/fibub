// Drug-likeness from a SMILES string: molecular formula, average and monoisotopic mass, heavy atoms, rings, H-bond
// donors and acceptors as Lipinski counted them, rotatable bonds as Veber defined them, formal charge, and the
// Lipinski rule of five and Veber rules with the number of rules broken. Pure functions, no DOM. The SMILES reader is
// the one in dbe.ts (organic subset, brackets, charges, isotopes, aromatic atoms, rings incl. %nn, branches, dots).
import { parseSmiles, SmilesError, type SmilesMol } from './dbe.ts';
import { molarMass, monoMass, hill, type Formula } from './chem.ts';

export { SmilesError };

export type Props = {
  formula: Formula; formulaText: string; mw: number; mono: number; heavy: number; atoms: number; rings: number;
  hbd: number; hba: number; rotatable: number; charge: number; parts: number; aromaticAtoms: number;
};

/** Indices of the atoms in each connected part, largest (by heavy atoms) first. */
export function parts(m: SmilesMol): number[][] {
  const par = m.atoms.map((_, k) => k);
  const find = (x: number): number => (par[x] === x ? x : (par[x] = find(par[x])));
  for (const b of m.bonds) par[find(b.a)] = find(b.b);
  const groups = new Map<number, number[]>();
  m.atoms.forEach((_, k) => { const r = find(k); groups.set(r, [...(groups.get(r) ?? []), k]); });
  const heavy = (g: number[]) => g.filter((k) => m.atoms[k].el !== 'H').length;
  return [...groups.values()].sort((a, b) => heavy(b) - heavy(a) || b.length - a.length || a[0] - b[0]);
}

/** Keep only some atoms (and the bonds between them), renumbered. */
export function subMol(m: SmilesMol, keep: number[]): SmilesMol {
  const map = new Map(keep.map((k, i) => [k, i]));
  const atoms = keep.map((k) => ({ ...m.atoms[k], bonds: [] as number[] }));
  const bonds = m.bonds.filter((b) => map.has(b.a) && map.has(b.b)).map((b) => ({ ...b, a: map.get(b.a)!, b: map.get(b.b)! }));
  bonds.forEach((b, i) => { atoms[b.a].bonds.push(i); atoms[b.b].bonds.push(i); });
  return { atoms, bonds, components: 1 };
}

/** Which bonds lie in a ring (bonds that are not bridges of the graph), by Tarjan's low-link method. */
export function ringBonds(m: SmilesMol): boolean[] {
  const n = m.atoms.length, disc = new Array(n).fill(-1), low = new Array(n).fill(0), inRing = m.bonds.map(() => true);
  let t = 0;
  for (let s = 0; s < n; s++) {
    if (disc[s] >= 0) continue;
    // Iterative DFS: stack of [atom, bond used to reach it, next neighbour position].
    const st: [number, number, number][] = [[s, -1, 0]]; disc[s] = low[s] = t++;
    while (st.length) {
      const top = st[st.length - 1], [v, via] = top;
      if (top[2] < m.atoms[v].bonds.length) {
        const bi = m.atoms[v].bonds[top[2]++]; if (bi === via) continue;
        const b = m.bonds[bi], w = b.a === v ? b.b : b.a;
        if (disc[w] < 0) { disc[w] = low[w] = t++; st.push([w, bi, 0]); } else low[v] = Math.min(low[v], disc[w]);
      } else {
        st.pop();
        if (st.length) { const u = st[st.length - 1][0]; low[u] = Math.min(low[u], low[v]); if (low[v] > disc[u]) inRing[via] = false; }
      }
    }
  }
  return inRing;
}

/** Hydrogens on an atom: implicit or bracket H plus explicit [H] atoms bonded to it. */
const hOn = (m: SmilesMol, k: number) => m.atoms[k].implicitH + m.atoms[k].bonds.filter((bi) => { const b = m.bonds[bi]; return m.atoms[b.a === k ? b.b : b.a].el === 'H'; }).length;
const other = (m: SmilesMol, bi: number, k: number) => (m.bonds[bi].a === k ? m.bonds[bi].b : m.bonds[bi].a);

/** Amide C–N: a single bond from N to a carbon that has a C=O double bond (outside rings, as Veber left them out). */
function isAmide(m: SmilesMol, bi: number): boolean {
  const b = m.bonds[bi];
  for (const [c, n] of [[b.a, b.b], [b.b, b.a]]) {
    if (m.atoms[c].el !== 'C' || m.atoms[n].el !== 'N') continue;
    if (m.atoms[c].bonds.some((x) => x !== bi && m.bonds[x].order === 2 && m.atoms[other(m, x, c)].el === 'O')) return true;
  }
  return false;
}

/**
 * Rotatable bonds (Veber 2002): single bonds outside rings between two heavy atoms that each have another heavy
 * neighbour; amide C–N bonds are left out (unless countAmides). An aromatic bond outside any ring counts as single.
 */
export function rotatableBonds(m: SmilesMol, opts: { countAmides?: boolean } = {}): number {
  const ring = ringBonds(m), heavyDeg = m.atoms.map((a, k) => a.bonds.filter((bi) => m.atoms[other(m, bi, k)].el !== 'H').length);
  let n = 0;
  m.bonds.forEach((b, i) => {
    if (ring[i] || !(b.order === 1 || b.order === 1.5)) return;
    if (m.atoms[b.a].el === 'H' || m.atoms[b.b].el === 'H') return;
    if (heavyDeg[b.a] < 2 || heavyDeg[b.b] < 2) return;
    if (!opts.countAmides && isAmide(m, i)) return;
    n++;
  });
  return n;
}

/** All the properties for one molecule (the whole string, every part included). */
export function properties(m: SmilesMol, opts: { countAmides?: boolean } = {}): Props {
  const counts = new Map<string, number>();
  const add = (k: string, n: number) => { if (n) counts.set(k, (counts.get(k) ?? 0) + n); };
  for (const a of m.atoms) { add(a.iso ? `${a.iso}${a.el}` : a.el, 1); add('H', a.implicitH); }
  const charge = m.atoms.reduce((t, a) => t + a.charge, 0);
  const formula: Formula = { counts, charge };
  const heavyIdx = m.atoms.flatMap((a, k) => (a.el === 'H' ? [] : [k]));
  const heavyBonds = m.bonds.filter((b) => m.atoms[b.a].el !== 'H' && m.atoms[b.b].el !== 'H').length;
  const np = parts(m).length;
  // Ring count: bonds − atoms + parts (the cyclomatic number; the same as the smallest set of rings).
  const hydrogensAlone = m.atoms.filter((a, k) => a.el === 'H' && a.bonds.every((bi) => m.atoms[other(m, bi, k)].el === 'H')).length;
  const heavyParts = np - (hydrogensAlone ? parts(m).filter((g) => g.every((k) => m.atoms[k].el === 'H')).length : 0);
  return {
    formula, formulaText: hill(formula), mw: molarMass(formula), mono: monoMass(formula),
    heavy: heavyIdx.length, atoms: m.atoms.length + m.atoms.reduce((t, a) => t + a.implicitH, 0),
    rings: heavyBonds - heavyIdx.length + heavyParts,
    hbd: heavyIdx.filter((k) => m.atoms[k].el === 'N' || m.atoms[k].el === 'O').reduce((t, k) => t + hOn(m, k), 0),
    hba: heavyIdx.filter((k) => m.atoms[k].el === 'N' || m.atoms[k].el === 'O').length,
    rotatable: rotatableBonds(m, opts), charge, parts: np, aromaticAtoms: m.atoms.filter((a) => a.aromatic).length,
  };
}

export type Rule = { id: string; label: string; value: number | null; limit: number; ok: boolean | null; unit?: string };
export type Verdict = { rules: Rule[]; broken: number; checked: number; pass: boolean };

/** Lipinski's rule of five: MW ≤ 500, logP ≤ 5 (only if the user gives one), donors ≤ 5, acceptors ≤ 10. Passes with at most one broken. */
export function lipinski(p: Props, logP?: number | null): Verdict {
  const lp = logP ?? null;
  const rules: Rule[] = [
    { id: 'mw', label: 'Molecular weight ≤ 500', value: p.mw, limit: 500, ok: p.mw <= 500, unit: 'g/mol' },
    { id: 'logp', label: 'logP ≤ 5 (your value)', value: lp, limit: 5, ok: lp === null ? null : lp <= 5 },
    { id: 'hbd', label: 'H-bond donors (NH + OH) ≤ 5', value: p.hbd, limit: 5, ok: p.hbd <= 5 },
    { id: 'hba', label: 'H-bond acceptors (N + O) ≤ 10', value: p.hba, limit: 10, ok: p.hba <= 10 },
  ];
  const broken = rules.filter((r) => r.ok === false).length;
  return { rules, broken, checked: rules.filter((r) => r.ok !== null).length, pass: broken <= 1 };
}

/** Veber's rules: rotatable bonds ≤ 10, and polar surface area ≤ 140 Å² (if the user gives one) or donors + acceptors ≤ 12. All must hold. */
export function veber(p: Props, tpsa?: number | null): Verdict {
  const t = tpsa ?? null;
  const rules: Rule[] = [
    { id: 'rot', label: 'Rotatable bonds ≤ 10', value: p.rotatable, limit: 10, ok: p.rotatable <= 10 },
    t === null
      ? { id: 'hb', label: 'Donors + acceptors ≤ 12', value: p.hbd + p.hba, limit: 12, ok: p.hbd + p.hba <= 12 }
      : { id: 'tpsa', label: 'Polar surface area ≤ 140 Å² (your value)', value: t, limit: 140, ok: t <= 140, unit: 'Å²' },
  ];
  const broken = rules.filter((r) => r.ok === false).length;
  return { rules, broken, checked: rules.length, pass: broken === 0 };
}

export type Row = { name: string; smiles: string; props?: Props; lip?: Verdict; veb?: Verdict; error?: string; salt?: string };

/** Read one SMILES and work out everything; with largestPart, salts and solvents (smaller dot-separated parts) are dropped. */
export function check(smiles: string, opts: { largestPart?: boolean; countAmides?: boolean; logP?: number | null; tpsa?: number | null; name?: string } = {}): Row {
  const row: Row = { name: opts.name ?? '', smiles };
  try {
    let m = parseSmiles(smiles);
    if (!m.atoms.length) throw new SmilesError('No atoms found.');
    if (opts.largestPart && m.components > 1) {
      const ps = parts(m), drop = ps.slice(1).map((g) => properties(subMol(m, g)).formulaText);
      m = subMol(m, ps[0]); row.salt = drop.join(', ');
    }
    row.props = properties(m, opts); row.lip = lipinski(row.props, opts.logP); row.veb = veber(row.props, opts.tpsa);
  } catch (e) {
    if (e instanceof SmilesError) row.error = e.message; else throw e;
  }
  return row;
}

/** Batch lines: "SMILES name", "SMILES<tab>name" or "SMILES,name" (a .smi file); # starts a comment; a header row is skipped. */
export function readBatch(text: string): { smiles: string; name: string; line: number }[] {
  const out: { smiles: string; name: string; line: number }[] = [];
  text.split(/\r?\n/).forEach((raw, i) => {
    const l = raw.trim(); if (!l || l.startsWith('#')) return;
    const m = /^(\S+?)(?:[\s,;]+(.*))?$/.exec(l)!;
    let smiles = m[1], name = (m[2] ?? '').trim().replace(/^"(.*)"$/, '$1');
    if (smiles.endsWith(',') || smiles.endsWith(';')) smiles = smiles.slice(0, -1);
    if (out.length === 0 && /^smiles$/i.test(smiles)) return;
    out.push({ smiles, name: name || `Molecule ${out.length + 1}`, line: i + 1 });
  });
  return out;
}

const csvCell = (s: string | number) => { const t = String(s); return /[",\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t; };
/** CSV of a batch: one row per molecule, every property, and the rule results. */
export function toCsv(rows: Row[]): string {
  const head = ['name', 'smiles', 'formula', 'mw', 'monoisotopic_mass', 'heavy_atoms', 'rings', 'hbd_nh_oh', 'hba_n_o', 'rotatable_bonds', 'formal_charge', 'lipinski_violations', 'lipinski_pass', 'veber_violations', 'veber_pass', 'removed_parts', 'error'];
  const lines = [head.join(',')];
  for (const r of rows) {
    const p = r.props;
    lines.push([r.name, r.smiles, p ? p.formulaText : '', p ? p.mw.toFixed(3) : '', p ? p.mono.toFixed(4) : '', p?.heavy ?? '', p?.rings ?? '', p?.hbd ?? '', p?.hba ?? '', p?.rotatable ?? '', p?.charge ?? '',
      r.lip?.broken ?? '', r.lip ? (r.lip.pass ? 'yes' : 'no') : '', r.veb?.broken ?? '', r.veb ? (r.veb.pass ? 'yes' : 'no') : '', r.salt ?? '', r.error ?? ''].map(csvCell).join(','));
  }
  return lines.join('\n') + '\n';
}

/** Example list: well-known medicines (structures are general chemistry facts) and one made-up peptide that breaks the rules. */
export const EXAMPLE_BATCH = [
  'CC(=O)Oc1ccccc1C(=O)O Aspirin',
  'Cn1cnc2c1c(=O)n(C)c(=O)n2C Caffeine',
  'CC(=O)Nc1ccc(O)cc1 Paracetamol',
  'CC(C)Cc1ccc(cc1)C(C)C(=O)O Ibuprofen',
  'CN(C)C(=N)NC(=N)N Metformin',
  '[Na+].[O-]C(=O)c1ccccc1O Sodium salicylate',
  'NCC(=O)NC(CO)C(=O)NC(CC(=O)O)C(=O)NC(CCCCN)C(=O)NC(Cc1ccc(O)cc1)C(=O)O Made-up peptide GSDKY',
].join('\n');
