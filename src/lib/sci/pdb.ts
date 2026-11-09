// Reading a protein (or nucleic acid) structure file, PDB or mmCIF: atoms, residues, chains, ligands and
// waters; secondary structure from the HELIX/SHEET records (or struct_conf/struct_sheet_range in mmCIF), or a
// simple guess from C-alpha geometry when the file has none; distances; residue contacts within a cutoff; and
// bonds by distance for drawing. Only the first model is read. No DOM.

export type Atom = {
  serial: number; name: string; alt: string; resName: string; chain: string; resSeq: number; iCode: string;
  x: number; y: number; z: number; occ: number; b: number; el: string; het: boolean; res: number;
};
export type ResKind = 'polymer' | 'ligand' | 'water';
export type SS = 'H' | 'E' | 'C';
export type Residue = {
  chain: string; resSeq: number; iCode: string; resName: string; kind: ResKind; atoms: number[];
  /** The trace atom: CA for amino acids, P (or C4') for nucleotides; -1 if missing. */
  rep: number; ss: SS;
};
export type Chain = { id: string; polymer: number[]; ligands: number[]; waters: number[]; seq: string };
export type SSRange = { kind: 'H' | 'E'; chain: string; start: number; startIc: string; end: number; endIc: string };
export type Structure = {
  format: 'pdb' | 'cif'; title: string; atoms: Atom[]; residues: Residue[]; chains: Chain[];
  ranges: SSRange[]; models: number; ssSource: 'records' | 'guess' | 'none'; skippedAlt: number; notes: string[];
};

const WATER = new Set(['HOH', 'WAT', 'DOD', 'H2O', 'SOL', 'TIP', 'TIP3']);
const AA: Record<string, string> = {
  ALA: 'A', ARG: 'R', ASN: 'N', ASP: 'D', CYS: 'C', GLN: 'Q', GLU: 'E', GLY: 'G', HIS: 'H', ILE: 'I', LEU: 'L', LYS: 'K',
  MET: 'M', PHE: 'F', PRO: 'P', SER: 'S', THR: 'T', TRP: 'W', TYR: 'Y', VAL: 'V', MSE: 'M', SEC: 'U', PYL: 'O', UNK: 'X',
  HID: 'H', HIE: 'H', HIP: 'H', HSD: 'H', HSE: 'H', HSP: 'H', CYX: 'C', ASX: 'B', GLX: 'Z',
};
const NUC: Record<string, string> = { A: 'A', C: 'C', G: 'G', U: 'U', T: 'T', I: 'I', DA: 'A', DC: 'C', DG: 'G', DT: 'T', DU: 'U', DI: 'I' };
/** One-letter code of a residue name ('X' if unknown). */
export const oneLetter = (resName: string) => AA[resName] ?? NUC[resName] ?? 'X';
export const isWater = (resName: string) => WATER.has(resName);

const TWO = new Set(['HE', 'LI', 'BE', 'NE', 'NA', 'MG', 'AL', 'SI', 'CL', 'AR', 'CA', 'SC', 'TI', 'CR', 'MN', 'FE', 'CO', 'NI', 'CU', 'ZN', 'GA', 'GE', 'AS', 'SE', 'BR', 'KR', 'RB', 'SR', 'ZR', 'MO', 'RU', 'RH', 'PD', 'AG', 'CD', 'IN', 'SN', 'SB', 'TE', 'XE', 'CS', 'BA', 'LA', 'CE', 'GD', 'YB', 'LU', 'HF', 'TA', 'RE', 'OS', 'IR', 'PT', 'AU', 'HG', 'TL', 'PB', 'BI', 'U']);
/** Element from the PDB element column, or from the atom-name field (columns 13-16) when that column is empty. */
export function elementOf(col: string, nameField: string): string {
  const e = col.trim().replace(/[^A-Za-z]/g, '').toUpperCase();
  if (e) return e;
  const raw = nameField.padEnd(4);
  if (raw[0] === ' ' || /\d/.test(raw[0])) return raw[1].toUpperCase();
  if (raw[0].toUpperCase() === 'H' && raw[3] !== ' ') return 'H'; // four-letter hydrogen names such as HG21
  const two = raw.slice(0, 2).toUpperCase();
  return TWO.has(two) ? two : raw[0].toUpperCase();
}

// ---------- PDB ----------
export function parsePdb(text: string): Structure {
  const atoms: Atom[] = [], ranges: SSRange[] = [];
  let title = '', models = 0, done = false, skippedAlt = 0;
  const seen = new Set<string>();
  const num = (s: string) => { const v = Number(s.trim()); return Number.isFinite(v) ? v : NaN; };
  for (const raw of text.split(/\r?\n/)) {
    const rec = raw.slice(0, 6);
    if (rec === 'MODEL ') { models++; continue; }
    if (rec === 'ENDMDL') { done = true; continue; }
    if (rec === 'TITLE ') { title += (title ? ' ' : '') + raw.slice(10, 80).trim(); continue; }
    if (rec === 'HELIX ') {
      const a = raw.padEnd(40);
      ranges.push({ kind: 'H', chain: a[19].trim(), start: num(a.slice(21, 25)), startIc: a[25].trim(), end: num(a.slice(33, 37)), endIc: a[37].trim() });
      continue;
    }
    if (rec === 'SHEET ') {
      const a = raw.padEnd(40);
      ranges.push({ kind: 'E', chain: a[21].trim(), start: num(a.slice(22, 26)), startIc: a[26].trim(), end: num(a.slice(33, 37)), endIc: a[37].trim() });
      continue;
    }
    if (done || (rec !== 'ATOM  ' && rec !== 'HETATM')) continue;
    const a = raw.padEnd(80);
    const x = num(a.slice(30, 38)), y = num(a.slice(38, 46)), z = num(a.slice(46, 54));
    if (![x, y, z].every(Number.isFinite)) continue;
    const name = a.slice(12, 16).trim(), alt = a[16].trim(), resName = a.slice(17, 20).trim(), chain = a[21].trim();
    const resSeq = num(a.slice(22, 26)), iCode = a[26].trim();
    const key = `${chain}|${resSeq}|${iCode}|${resName}|${name}`;
    if (seen.has(key)) { skippedAlt++; continue; }
    seen.add(key);
    const occ = num(a.slice(54, 60)), b = num(a.slice(60, 66));
    atoms.push({
      serial: num(a.slice(6, 11)), name, alt, resName, chain, resSeq: Number.isFinite(resSeq) ? resSeq : 0, iCode, x, y, z,
      occ: Number.isFinite(occ) ? occ : 1, b: Number.isFinite(b) ? b : 0, el: elementOf(a.slice(76, 78), a.slice(12, 16)), het: rec === 'HETATM', res: -1,
    });
  }
  return finish('pdb', title, atoms, ranges, Math.max(1, models), skippedAlt);
}

// ---------- mmCIF ----------
/** Splits a CIF file into categories: each has its tags (item names) and rows of values ('.' and '?' kept). */
export function parseCifTables(text: string): Map<string, { tags: string[]; rows: string[][] }> {
  const toks: string[] = [];
  const lines = text.split(/\r?\n/);
  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    if (line.startsWith(';')) {
      const buf = [line.slice(1)];
      while (++li < lines.length && !lines[li].startsWith(';')) buf.push(lines[li]);
      toks.push('\u0000' + buf.join('\n').trim());
      continue;
    }
    let i = 0;
    const n = line.length;
    while (i < n) {
      const c = line[i];
      if (c === ' ' || c === '\t') { i++; continue; }
      if (c === '#') break;
      if (c === "'" || c === '"') {
        let j = i + 1;
        while (j < n && !(line[j] === c && (j + 1 === n || line[j + 1] === ' ' || line[j + 1] === '\t'))) j++;
        toks.push('\u0000' + line.slice(i + 1, j));
        i = j + 1;
        continue;
      }
      let j = i;
      while (j < n && line[j] !== ' ' && line[j] !== '\t') j++;
      toks.push(line.slice(i, j));
      i = j;
    }
  }
  const out = new Map<string, { tags: string[]; rows: string[][] }>();
  const isTag = (t: string) => t[0] === '_';
  const strip = (t: string) => (t[0] === '\u0000' ? t.slice(1) : t);
  const split = (tag: string) => { const k = tag.indexOf('.'); return k < 0 ? [tag, ''] : [tag.slice(0, k), tag.slice(k + 1)]; };
  for (let i = 0; i < toks.length;) {
    const t = toks[i];
    if (t.toLowerCase() === 'loop_') {
      i++;
      const tags: string[] = [];
      while (i < toks.length && isTag(toks[i])) tags.push(toks[i++]);
      if (!tags.length) continue;
      const cat = split(tags[0])[0];
      const vals: string[] = [];
      while (i < toks.length && !isTag(toks[i]) && toks[i].toLowerCase() !== 'loop_' && !/^data_/i.test(toks[i])) vals.push(strip(toks[i++]));
      const rows: string[][] = [];
      for (let k = 0; k + tags.length <= vals.length; k += tags.length) rows.push(vals.slice(k, k + tags.length));
      out.set(cat, { tags: tags.map((g) => split(g)[1]), rows });
      continue;
    }
    if (isTag(t)) {
      const [cat, item] = split(t);
      const nx = toks[i + 1];
      const has = nx !== undefined && !isTag(nx) && nx.toLowerCase() !== 'loop_' && !/^data_/i.test(nx);
      const c = out.get(cat) ?? { tags: [], rows: [[]] };
      c.tags.push(item); c.rows[0].push(has ? strip(nx) : '?');
      out.set(cat, c);
      i += has ? 2 : 1;
      continue;
    }
    i++;
  }
  return out;
}

export function parseCif(text: string): Structure {
  const T = parseCifTables(text);
  const site = T.get('_atom_site');
  if (!site) throw new Error('This mmCIF file has no _atom_site table, so it has no atoms to show.');
  const col = (t: { tags: string[] }, ...names: string[]) => { for (const n of names) { const k = t.tags.indexOf(n); if (k >= 0) return k; } return -1; };
  const nul = (v: string | undefined) => (v === undefined || v === '.' || v === '?' ? '' : v);
  const c = {
    g: col(site, 'group_PDB'), id: col(site, 'id'), el: col(site, 'type_symbol'), name: col(site, 'auth_atom_id', 'label_atom_id'),
    alt: col(site, 'label_alt_id'), res: col(site, 'auth_comp_id', 'label_comp_id'), ch: col(site, 'auth_asym_id', 'label_asym_id'),
    seq: col(site, 'auth_seq_id', 'label_seq_id'), ic: col(site, 'pdbx_PDB_ins_code'), x: col(site, 'Cartn_x'), y: col(site, 'Cartn_y'), z: col(site, 'Cartn_z'),
    occ: col(site, 'occupancy'), b: col(site, 'B_iso_or_equiv'), mod: col(site, 'pdbx_PDB_model_num'),
  };
  if (c.x < 0 || c.y < 0 || c.z < 0) throw new Error('This mmCIF file has no Cartn_x, Cartn_y and Cartn_z columns.');
  const atoms: Atom[] = [];
  const seen = new Set<string>(), modelIds = new Set<string>();
  let first = '', skippedAlt = 0;
  for (const r of site.rows) {
    const m = c.mod >= 0 ? r[c.mod] : '1';
    modelIds.add(m);
    if (!first) first = m;
    if (m !== first) continue;
    const x = Number(r[c.x]), y = Number(r[c.y]), z = Number(r[c.z]);
    if (![x, y, z].every(Number.isFinite)) continue;
    const name = nul(r[c.name]), resName = nul(r[c.res]), chain = nul(r[c.ch]), seq = Number(nul(r[c.seq])), iCode = c.ic >= 0 ? nul(r[c.ic]) : '';
    const key = `${chain}|${seq}|${iCode}|${resName}|${name}`;
    if (seen.has(key)) { skippedAlt++; continue; }
    seen.add(key);
    const occ = Number(nul(r[c.occ])), b = Number(nul(r[c.b]));
    atoms.push({
      serial: Number(r[c.id]), name, alt: c.alt >= 0 ? nul(r[c.alt]) : '', resName, chain, resSeq: Number.isFinite(seq) ? seq : 0, iCode, x, y, z,
      occ: c.occ >= 0 && Number.isFinite(occ) ? occ : 1, b: c.b >= 0 && Number.isFinite(b) ? b : 0,
      el: c.el >= 0 && nul(r[c.el]) ? nul(r[c.el]).toUpperCase() : elementOf('', ' ' + name.padEnd(3)), het: c.g >= 0 && r[c.g] === 'HETATM', res: -1,
    });
  }
  const ranges: SSRange[] = [];
  const add = (t: { tags: string[]; rows: string[][] } | undefined, kind: 'H' | 'E' | null) => {
    if (!t) return;
    const k = {
      type: col(t, 'conf_type_id'), bc: col(t, 'beg_auth_asym_id', 'beg_label_asym_id'), bs: col(t, 'beg_auth_seq_id', 'beg_label_seq_id'), bi: col(t, 'pdbx_beg_PDB_ins_code'),
      ec: col(t, 'end_auth_asym_id', 'end_label_asym_id'), es: col(t, 'end_auth_seq_id', 'end_label_seq_id'), ei: col(t, 'pdbx_end_PDB_ins_code'),
    };
    if (k.bc < 0 || k.bs < 0 || k.es < 0) return;
    for (const r of t.rows) {
      const kd = kind ?? (/^HELX/i.test(r[k.type] ?? '') ? 'H' : /^STRN/i.test(r[k.type] ?? '') ? 'E' : null);
      if (!kd) continue;
      ranges.push({ kind: kd, chain: nul(r[k.bc]), start: Number(r[k.bs]), startIc: k.bi >= 0 ? nul(r[k.bi]) : '', end: Number(r[k.es]), endIc: k.ei >= 0 ? nul(r[k.ei]) : '' });
    }
  };
  add(T.get('_struct_conf'), null);
  add(T.get('_struct_sheet_range'), 'E');
  const title = nul(T.get('_struct')?.rows[0]?.[T.get('_struct')!.tags.indexOf('title')]).replace(/\s+/g, ' ').trim();
  return finish('cif', title, atoms, ranges, modelIds.size || 1, skippedAlt);
}

/** Reads a PDB or mmCIF file (worked out from its content). */
export function parseStructure(text: string, opts: { ss?: 'auto' | 'records' | 'guess' } = {}): Structure {
  const cif = /^data_/m.test(text) && /_atom_site\./.test(text);
  const s = cif ? parseCif(text) : parsePdb(text);
  if (!s.atoms.length) throw new Error(cif ? 'No atoms found in this mmCIF file.' : 'No ATOM or HETATM lines found. Is this a PDB or mmCIF file?');
  assignSS(s, opts.ss ?? 'auto');
  return s;
}

function finish(format: 'pdb' | 'cif', title: string, atoms: Atom[], ranges: SSRange[], models: number, skippedAlt: number): Structure {
  const residues: Residue[] = [];
  const byKey = new Map<string, number>();
  atoms.forEach((a, i) => {
    const key = `${a.chain}|${a.resSeq}|${a.iCode}|${a.resName}`;
    let r = byKey.get(key);
    if (r === undefined) {
      r = residues.length; byKey.set(key, r);
      residues.push({ chain: a.chain, resSeq: a.resSeq, iCode: a.iCode, resName: a.resName, kind: 'ligand', atoms: [], rep: -1, ss: 'C' });
    }
    residues[r].atoms.push(i); a.res = r;
  });
  for (const r of residues) {
    const names = new Map(r.atoms.map((i) => [atoms[i].name, i] as [string, number]));
    const het = atoms[r.atoms[0]].het, ca = names.get('CA');
    const aminoAcid = ca !== undefined && atoms[ca].el === 'C' && names.has('N') && names.has('C');
    if (isWater(r.resName)) r.kind = 'water';
    else if (aminoAcid || !het) r.kind = 'polymer';
    else r.kind = 'ligand';
    if (r.kind === 'polymer') r.rep = aminoAcid ? ca! : names.get('P') ?? names.get("C4'") ?? names.get('C4*') ?? (ca !== undefined && atoms[ca].el === 'C' ? ca : -1);
  }
  const chains: Chain[] = [];
  const chainIx = new Map<string, Chain>();
  residues.forEach((r, i) => {
    let c = chainIx.get(r.chain);
    if (!c) { c = { id: r.chain, polymer: [], ligands: [], waters: [], seq: '' }; chainIx.set(r.chain, c); chains.push(c); }
    (r.kind === 'polymer' ? c.polymer : r.kind === 'water' ? c.waters : c.ligands).push(i);
  });
  for (const c of chains) c.seq = c.polymer.map((i) => oneLetter(residues[i].resName)).join('');
  const notes: string[] = [];
  if (models > 1) notes.push(`The file has ${models} models; only the first is shown.`);
  if (skippedAlt) notes.push(`${skippedAlt} alternate atom position${skippedAlt > 1 ? 's were' : ' was'} left out (the first one is kept).`);
  return { format, title, atoms, residues, chains, ranges, models, ssSource: 'none', skippedAlt, notes };
}

// ---------- Secondary structure ----------
type V = [number, number, number];
const d3 = (a: V, b: V) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const pos = (a: Atom): V => [a.x, a.y, a.z];

/** Pieces of a chain's trace with no gap: consecutive trace atoms closer than 4.2 Å (C-alpha) or 8 Å (P). */
export function segments(s: Structure, c: Chain): number[][] {
  const out: number[][] = [];
  let cur: number[] = [];
  for (const ri of c.polymer) {
    const r = s.residues[ri];
    if (r.rep < 0) { if (cur.length) out.push(cur); cur = []; continue; }
    if (cur.length) {
      const p = s.residues[cur[cur.length - 1]], lim = s.atoms[r.rep].name === 'CA' ? 4.2 : 8;
      if (d3(pos(s.atoms[p.rep]), pos(s.atoms[r.rep])) > lim) { out.push(cur); cur = []; }
    }
    cur.push(ri);
  }
  if (cur.length) out.push(cur);
  return out;
}

/** The C-alpha distance windows used for the guess (P-SEA style: residues i to i+2, i+3 and i+4). */
export const GUESS = {
  helix: { d2: [5.0, 6.0], d3: [4.7, 5.9], d4: [5.7, 7.1] },
  strand: { d2: [6.1, 7.4], d3: [8.9, 10.9], d4: [11.2, 13.8] },
  partner: 5.6,
} as const;

/** Guesses H, E or C per residue from C-alpha positions only. `cas` are the positions along one gap-free piece.
 *  Helix: every window of five residues whose i to i+2, i+3 and i+4 distances fit a helix marks all five.
 *  Strand: the same for extended windows, kept only where the C-alpha has another extended C-alpha (at least
 *  three residues away, or in another piece) within 5.6 Å, and in runs of at least three. */
export function guessSS(pieces: V[][]): SS[][] {
  const inR = (v: number, r: readonly number[]) => v >= r[0] && v <= r[1];
  const ext: boolean[][] = [];
  const out: SS[][] = pieces.map((p) => p.map(() => 'C' as SS));
  pieces.forEach((p, k) => {
    const e = p.map(() => false);
    for (let i = 0; i + 4 < p.length; i++) {
      const a = d3(p[i], p[i + 2]), b = d3(p[i], p[i + 3]), c = d3(p[i], p[i + 4]);
      const H = GUESS.helix, E = GUESS.strand;
      if (inR(a, H.d2) && inR(b, H.d3) && inR(c, H.d4)) for (let j = i; j <= i + 4; j++) out[k][j] = 'H';
      else if (inR(a, E.d2) && inR(b, E.d3) && inR(c, E.d4)) for (let j = i; j <= i + 4; j++) e[j] = true;
    }
    ext.push(e);
  });
  // Pairing: an extended residue needs an extended neighbour across.
  const ends: { k: number; i: number; p: V }[] = [];
  pieces.forEach((p, k) => p.forEach((v, i) => { if (ext[k][i] && out[k][i] !== 'H') ends.push({ k, i, p: v }); }));
  const paired = new Set<string>();
  for (const a of ends) for (const b of ends) {
    if (a.k === b.k && Math.abs(a.i - b.i) < 3) continue;
    if (d3(a.p, b.p) <= GUESS.partner) { paired.add(`${a.k}|${a.i}`); break; }
  }
  pieces.forEach((p, k) => {
    let i = 0;
    while (i < p.length) {
      if (!paired.has(`${k}|${i}`)) { i++; continue; }
      let j = i;
      while (j < p.length && paired.has(`${k}|${j}`)) j++;
      if (j - i >= 3) for (let m = i; m < j; m++) out[k][m] = 'E';
      i = j;
    }
  });
  return out;
}

/** Sets residue.ss from the file's records ('records'), from the C-alpha guess ('guess'), or records when the
 *  file has any and the guess otherwise ('auto'). */
export function assignSS(s: Structure, mode: 'auto' | 'records' | 'guess' = 'auto') {
  for (const r of s.residues) r.ss = 'C';
  const useRecords = mode === 'records' || (mode === 'auto' && s.ranges.length > 0);
  if (useRecords) {
    s.ssSource = s.ranges.length ? 'records' : 'none';
    for (const c of s.chains) {
      const idx = new Map(c.polymer.map((ri, k) => [`${s.residues[ri].resSeq}|${s.residues[ri].iCode}`, k] as [string, number]));
      for (const g of s.ranges) {
        if (g.chain !== c.id) continue;
        // Exact residues when present; otherwise the residues numbered inside the range.
        const nums = c.polymer.map((ri) => s.residues[ri].resSeq);
        let a = idx.get(`${g.start}|${g.startIc}`), b = idx.get(`${g.end}|${g.endIc}`);
        if (a === undefined) { const k = nums.findIndex((v) => v >= g.start); a = k < 0 ? undefined : k; }
        if (b === undefined) { let k = -1; nums.forEach((v, j) => { if (v <= g.end) k = j; }); b = k < 0 ? undefined : k; }
        if (a === undefined || b === undefined || a > b) continue;
        for (let k = a; k <= b; k++) {
          const r = s.residues[c.polymer[k]];
          if (r.ss === 'C' || g.kind === 'H') r.ss = g.kind;
        }
      }
    }
    return;
  }
  const segs = s.chains.flatMap((c) => segments(s, c)).filter((g) => s.atoms[s.residues[g[0]].rep].name === 'CA');
  const res = guessSS(segs.map((g) => g.map((ri) => pos(s.atoms[s.residues[ri].rep]))));
  segs.forEach((g, k) => g.forEach((ri, i) => { s.residues[ri].ss = res[k][i]; }));
  s.ssSource = 'guess';
}

// ---------- Distances, contacts, bonds ----------
export const dist = (a: Atom, b: Atom) => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
export const resLabel = (r: Residue) => `${r.chain ? r.chain + ' ' : ''}${r.resName} ${r.resSeq}${r.iCode}`;
export const atomLabel = (s: Structure, i: number) => `${resLabel(s.residues[s.atoms[i].res])} ${s.atoms[i].name}`;

/** Closest pair of atoms between two residues (hydrogens left out unless asked). */
export function closest(s: Structure, r1: number, r2: number, withH = false) {
  let best = { d: Infinity, a: -1, b: -1 };
  for (const i of s.residues[r1].atoms) {
    if (!withH && s.atoms[i].el === 'H') continue;
    for (const j of s.residues[r2].atoms) {
      if (!withH && s.atoms[j].el === 'H') continue;
      const d = dist(s.atoms[i], s.atoms[j]);
      if (d < best.d) best = { d, a: i, b: j };
    }
  }
  return best;
}

export type Contact = { r1: number; r2: number; d: number; a1: number; a2: number; n: number; kind: 'same chain' | 'between chains' | 'ligand' | 'water' };
export type ContactOpts = { cutoff: number; minSep: number; scope: 'all' | 'chains' | 'ligands'; water: boolean; hydrogens: boolean };

/** Every pair of residues with at least one pair of atoms within `cutoff` Å. In the same chain, polymer residues
 *  closer than `minSep` in sequence (by position in the chain) are left out. `n` counts the atom pairs within. */
export function contacts(s: Structure, o: ContactOpts): Contact[] {
  const keep = (i: number) => {
    const a = s.atoms[i], r = s.residues[a.res];
    if (!o.hydrogens && a.el === 'H') return false;
    return o.water || r.kind !== 'water';
  };
  const cell = Math.max(o.cutoff, 0.5), grid = new Map<string, number[]>();
  const key = (x: number, y: number, z: number) => `${Math.floor(x / cell)},${Math.floor(y / cell)},${Math.floor(z / cell)}`;
  s.atoms.forEach((a, i) => { if (!keep(i)) return; const k = key(a.x, a.y, a.z); const g = grid.get(k); if (g) g.push(i); else grid.set(k, [i]); });
  const order = new Map<number, number>();
  for (const c of s.chains) c.polymer.forEach((ri, k) => order.set(ri, k));
  const found = new Map<string, Contact>();
  const c2 = o.cutoff * o.cutoff;
  s.atoms.forEach((a, i) => {
    if (!keep(i)) return;
    const gx = Math.floor(a.x / cell), gy = Math.floor(a.y / cell), gz = Math.floor(a.z / cell);
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) for (let dz = -1; dz <= 1; dz++) {
      const g = grid.get(`${gx + dx},${gy + dy},${gz + dz}`);
      if (!g) continue;
      for (const j of g) {
        if (j <= i) continue;
        const b = s.atoms[j];
        if (a.res === b.res) continue;
        const ex = a.x - b.x, ey = a.y - b.y, ez = a.z - b.z, dd = ex * ex + ey * ey + ez * ez;
        if (dd > c2) continue;
        const r1 = Math.min(a.res, b.res), r2 = Math.max(a.res, b.res), R1 = s.residues[r1], R2 = s.residues[r2];
        const kind: Contact['kind'] = R1.kind === 'water' || R2.kind === 'water' ? 'water' : R1.kind === 'ligand' || R2.kind === 'ligand' ? 'ligand' : R1.chain === R2.chain ? 'same chain' : 'between chains';
        if (kind === 'same chain' && Math.abs(order.get(r1)! - order.get(r2)!) < o.minSep) continue;
        if (o.scope === 'chains' && kind !== 'between chains') continue;
        if (o.scope === 'ligands' && kind !== 'ligand' && kind !== 'water') continue;
        const d = Math.sqrt(dd), k = `${r1}|${r2}`, f = found.get(k);
        const ai = a.res === r1 ? i : j, bi = a.res === r1 ? j : i;
        if (!f) found.set(k, { r1, r2, d, a1: ai, a2: bi, n: 1, kind });
        else { f.n++; if (d < f.d) { f.d = d; f.a1 = ai; f.a2 = bi; } }
      }
    }
  });
  return [...found.values()].sort((x, y) => x.r1 - y.r1 || x.r2 - y.r2);
}

/** Rounded covalent radii (Å) for guessing bonds; other elements (metals) get no bonds. */
export const RADII: Record<string, number> = { H: 0.3, C: 0.75, N: 0.7, O: 0.65, S: 1.05, P: 1.05, SE: 1.2, F: 0.6, CL: 1.0, BR: 1.15, I: 1.35, B: 0.85, SI: 1.1 };
/** Bonds among the given atoms: two atoms are bonded when closer than their radii added up plus 0.45 Å. */
export function bonds(s: Structure, idx: number[]): [number, number][] {
  const cell = 2.4, grid = new Map<string, number[]>(), out: [number, number][] = [];
  const key = (x: number, y: number, z: number) => `${Math.floor(x / cell)},${Math.floor(y / cell)},${Math.floor(z / cell)}`;
  for (const i of idx) { const a = s.atoms[i]; if (!RADII[a.el]) continue; const k = key(a.x, a.y, a.z); const g = grid.get(k); if (g) g.push(i); else grid.set(k, [i]); }
  for (const i of idx) {
    const a = s.atoms[i], ra = RADII[a.el];
    if (!ra) continue;
    const gx = Math.floor(a.x / cell), gy = Math.floor(a.y / cell), gz = Math.floor(a.z / cell);
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) for (let dz = -1; dz <= 1; dz++) {
      for (const j of grid.get(`${gx + dx},${gy + dy},${gz + dz}`) ?? []) {
        if (j <= i) continue;
        const b = s.atoms[j];
        if (a.el === 'H' && b.el === 'H') continue;
        if (a.alt && b.alt && a.alt !== b.alt) continue;
        const lim = ra + RADII[b.el] + 0.45, d = dist(a, b);
        if (d > 0.4 && d <= lim) out.push([i, j]);
      }
    }
  }
  return out;
}

/** Share of polymer residues (with a trace atom) in each state. */
export function ssShare(s: Structure) {
  let h = 0, e = 0, n = 0;
  for (const r of s.residues) if (r.kind === 'polymer' && r.rep >= 0) { n++; if (r.ss === 'H') h++; else if (r.ss === 'E') e++; }
  return { n, h, e, c: n - h - e };
}

/** Runs of one state in a chain, as [state, first residue index, last residue index]. */
export function ssRuns(s: Structure, c: Chain): [SS, number, number][] {
  const out: [SS, number, number][] = [];
  for (const ri of c.polymer) {
    const r = s.residues[ri], last = out[out.length - 1];
    if (last && last[0] === r.ss) last[2] = ri; else out.push([r.ss, ri, ri]);
  }
  return out;
}

/** Centre (mean position) and radius (largest distance from it) of the given atoms. */
export function extent(s: Structure, idx: number[]) {
  let x = 0, y = 0, z = 0;
  for (const i of idx) { x += s.atoms[i].x; y += s.atoms[i].y; z += s.atoms[i].z; }
  const n = Math.max(1, idx.length), c: V = [x / n, y / n, z / n];
  let r = 0;
  for (const i of idx) r = Math.max(r, d3(c, pos(s.atoms[i])));
  return { c, r };
}

/** Rows for the contacts CSV. */
export function contactRows(s: Structure, cs: Contact[]): string[][] {
  const R = (i: number) => s.residues[i];
  return [
    ['chain_1', 'residue_1', 'number_1', 'chain_2', 'residue_2', 'number_2', 'closest_distance_A', 'atom_1', 'atom_2', 'atom_pairs_within_cutoff', 'type'],
    ...cs.map((c) => [R(c.r1).chain, R(c.r1).resName, `${R(c.r1).resSeq}${R(c.r1).iCode}`, R(c.r2).chain, R(c.r2).resName, `${R(c.r2).resSeq}${R(c.r2).iCode}`, c.d.toFixed(3), s.atoms[c.a1].name, s.atoms[c.a2].name, String(c.n), c.kind]),
  ];
}

/** Principal axes of a cloud of points (Jacobi rotations on the 3×3 covariance): rows of the returned matrix are
 *  unit axes, largest spread first, with variances. Used to turn the structure so its longest side lies across. */
export function principalAxes(pts: V[]): { axes: V[]; variances: number[] } {
  const n = Math.max(1, pts.length), c = [0, 0, 0];
  for (const p of pts) for (let k = 0; k < 3; k++) c[k] += p[k] / n;
  const A = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (const p of pts) for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) A[i][j] += ((p[i] - c[i]) * (p[j] - c[j])) / n;
  const Vm = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  for (let sweep = 0; sweep < 50; sweep++) {
    const off = Math.abs(A[0][1]) + Math.abs(A[0][2]) + Math.abs(A[1][2]);
    if (off < 1e-14 * (Math.abs(A[0][0]) + Math.abs(A[1][1]) + Math.abs(A[2][2]) + 1e-300)) break;
    for (const [p, q] of [[0, 1], [0, 2], [1, 2]]) {
      if (Math.abs(A[p][q]) < 1e-300) continue;
      const th = (A[q][q] - A[p][p]) / (2 * A[p][q]);
      const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)), cs = 1 / Math.sqrt(t * t + 1), sn = t * cs;
      for (let k = 0; k < 3; k++) { const akp = A[k][p], akq = A[k][q]; A[k][p] = cs * akp - sn * akq; A[k][q] = sn * akp + cs * akq; }
      for (let k = 0; k < 3; k++) { const apk = A[p][k], aqk = A[q][k]; A[p][k] = cs * apk - sn * aqk; A[q][k] = sn * apk + cs * aqk; }
      for (let k = 0; k < 3; k++) { const vkp = Vm[k][p], vkq = Vm[k][q]; Vm[k][p] = cs * vkp - sn * vkq; Vm[k][q] = sn * vkp + cs * vkq; }
    }
  }
  const order = [0, 1, 2].sort((a, b) => A[b][b] - A[a][a]);
  const axes = order.map((k) => [Vm[0][k], Vm[1][k], Vm[2][k]] as V);
  // Keep a right-handed frame so the picture is not mirrored.
  const [a, b] = axes, cr: V = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  axes[2] = cr;
  return { axes, variances: order.map((k) => A[k][k]) };
}
