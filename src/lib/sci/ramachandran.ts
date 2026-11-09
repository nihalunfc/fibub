// Ramachandran plot: read the atoms of a protein structure (PDB or mmCIF text), find each residue's backbone N, CA and
// C atoms, and work out the backbone dihedral angles phi (C of the residue before, N, CA, C), psi (N, CA, C, N of the
// residue after) and omega (CA, C, N, CA across the peptide bond to the next residue). Residues are sorted into broad
// guide regions (right-handed helix, beta / extended, left-handed helix) that fibub drew by hand as simple ellipses:
// they are rough guides, not published contour data, and can be edited. The example structure is made up: its
// coordinates are built here from chosen angles with standard bond lengths. No DOM.

export type Vec = [number, number, number];
export type Atom = { name: string; x: number; y: number; z: number; occ: number; el: string };
export type Residue = { chain: string; seq: number; icode: string; name: string; het: boolean; atoms: Map<string, Atom> };
export type Structure = { residues: Residue[]; models: number; atoms: number; format: 'pdb' | 'mmcif'; title: string };

const sub = (a: Vec, b: Vec): Vec => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: Vec, b: Vec): Vec => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: Vec) => Math.sqrt(dot(a, a));
const unit = (a: Vec): Vec => { const n = norm(a); return [a[0] / n, a[1] / n, a[2] / n]; };
const D = 180 / Math.PI;

/** Distance between two points (Å). */
export const dist = (a: Vec, b: Vec) => norm(sub(a, b));

/** Dihedral angle p0-p1-p2-p3 in degrees, -180 to 180 (IUPAC sign: positive is clockwise looking down p1 → p2). */
export function dihedral(p0: Vec, p1: Vec, p2: Vec, p3: Vec): number {
  const b0 = sub(p0, p1), b1 = unit(sub(p2, p1)), b2 = sub(p3, p2);
  const v = sub(b0, b1.map((c) => c * dot(b0, b1)) as Vec), w = sub(b2, b1.map((c) => c * dot(b2, b1)) as Vec);
  const x = dot(v, w), y = dot(cross(b1, v), w);
  return Math.atan2(y, x) * D;
}

/** Wrap an angle to -180 ≤ a < 180. */
export const wrap = (a: number) => { const r = ((((a + 180) % 360) + 360) % 360) - 180; return r; };

const residueKey = (chain: string, seq: number, icode: string) => `${chain}|${seq}|${icode}`;
const WATER = new Set(['HOH', 'WAT', 'DOD', 'H2O']);

function addAtom(map: Map<string, Residue>, order: Residue[], r: { chain: string; seq: number; icode: string; name: string; het: boolean }, a: Atom) {
  const k = residueKey(r.chain, r.seq, r.icode);
  let res = map.get(k);
  if (!res) { res = { ...r, atoms: new Map() }; map.set(k, res); order.push(res); }
  // Alternative locations: keep the first one in the file (usually A), as DSSP and Biopython's angles do.
  if (!res.atoms.has(a.name)) res.atoms.set(a.name, a);
}

/** Read the atoms of the first model of a PDB file. Waters are skipped; ligands are kept but have no backbone. */
export function parsePdb(text: string): Structure {
  const map = new Map<string, Residue>(), order: Residue[] = [];
  let models = 0, atoms = 0, inFirst = true, title = '';
  for (const line of text.split(/\r?\n/)) {
    const rec = line.slice(0, 6);
    if (rec === 'MODEL ') { models++; inFirst = models === 1; continue; }
    if (rec === 'ENDMDL') { inFirst = false; continue; }
    if (rec === 'HEADER' && !title) { title = line.slice(62, 66).trim() || line.slice(10, 50).trim(); continue; }
    if (rec !== 'ATOM  ' && rec !== 'HETATM') continue;
    if (!inFirst) continue;
    const resName = line.slice(17, 20).trim();
    if (WATER.has(resName)) continue;
    const x = Number(line.slice(30, 38)), y = Number(line.slice(38, 46)), z = Number(line.slice(46, 54));
    const seq = Number(line.slice(22, 26));
    if (![x, y, z, seq].every(Number.isFinite) || line.slice(30, 54).trim() === '') continue;
    const occS = line.slice(54, 60).trim(), occ = occS === '' ? 1 : Number(occS);
    atoms++;
    addAtom(map, order, { chain: line.slice(21, 22).trim(), seq, icode: line.slice(26, 27).trim(), name: resName, het: rec === 'HETATM' },
      { name: line.slice(12, 16).trim(), x, y, z, occ: Number.isFinite(occ) ? occ : 1, el: line.slice(76, 78).trim() });
  }
  return { residues: order, models: Math.max(1, models), atoms, format: 'pdb', title };
}

/** Split one mmCIF data line into values, keeping quoted values ('...' or "...") whole. */
function cifTokens(line: string): string[] {
  const out: string[] = [];
  let i = 0;
  while (i < line.length) {
    const c = line[i];
    if (c === ' ' || c === '\t') { i++; continue; }
    if (c === "'" || c === '"') {
      let j = i + 1;
      while (j < line.length && !(line[j] === c && (j + 1 === line.length || /\s/.test(line[j + 1])))) j++;
      out.push(line.slice(i + 1, j)); i = j + 1; continue;
    }
    let j = i; while (j < line.length && !/\s/.test(line[j])) j++;
    out.push(line.slice(i, j)); i = j;
  }
  return out;
}

/** Read the atoms of the first model of an mmCIF file (the _atom_site loop; author chain and residue numbers). */
export function parseMmcif(text: string): Structure {
  const lines = text.split(/\r?\n/);
  const map = new Map<string, Residue>(), order: Residue[] = [];
  let atoms = 0, title = '';
  const models = new Set<string>();
  for (let i = 0; i < lines.length; i++) {
    if (!title && lines[i].startsWith('data_')) title = lines[i].slice(5).trim();
    if (lines[i].trim() !== 'loop_' || !lines[i + 1]?.startsWith('_atom_site.')) continue;
    const cols: string[] = [];
    let j = i + 1;
    for (; j < lines.length && lines[j].startsWith('_atom_site.'); j++) cols.push(lines[j].trim().split(/\s+/)[0].slice(11));
    const at = (n: string) => cols.indexOf(n);
    const cGroup = at('group_PDB'), cAtom = at('auth_atom_id') >= 0 ? at('auth_atom_id') : at('label_atom_id');
    const cComp = at('auth_comp_id') >= 0 ? at('auth_comp_id') : at('label_comp_id');
    const cChain = at('auth_asym_id') >= 0 ? at('auth_asym_id') : at('label_asym_id');
    const cSeq = at('auth_seq_id') >= 0 ? at('auth_seq_id') : at('label_seq_id');
    const cIns = at('pdbx_PDB_ins_code'), cX = at('Cartn_x'), cY = at('Cartn_y'), cZ = at('Cartn_z'), cOcc = at('occupancy');
    const cModel = at('pdbx_PDB_model_num'), cEl = at('type_symbol');
    let first: string | null = null;
    let buf: string[] = [];
    for (; j < lines.length; j++) {
      const l = lines[j];
      if (l.startsWith('loop_') || l.startsWith('_') || l.startsWith('#') || l.startsWith('data_')) break;
      buf.push(...cifTokens(l));
      while (buf.length >= cols.length) {
        const v = buf.slice(0, cols.length); buf = buf.slice(cols.length);
        const model = cModel >= 0 ? v[cModel] : '1';
        models.add(model);
        if (first === null) first = model;
        if (model !== first) continue;
        const comp = v[cComp];
        if (WATER.has(comp)) continue;
        const x = Number(v[cX]), y = Number(v[cY]), z = Number(v[cZ]), seq = Number(v[cSeq]);
        if (![x, y, z, seq].every(Number.isFinite)) continue;
        const occ = cOcc >= 0 && Number.isFinite(Number(v[cOcc])) ? Number(v[cOcc]) : 1;
        const ins = cIns >= 0 && v[cIns] !== '?' && v[cIns] !== '.' ? v[cIns] : '';
        atoms++;
        addAtom(map, order, { chain: v[cChain], seq, icode: ins, name: comp, het: cGroup >= 0 && v[cGroup] === 'HETATM' },
          { name: v[cAtom], x, y, z, occ, el: cEl >= 0 ? v[cEl] : '' });
      }
    }
    break;
  }
  return { residues: order, models: Math.max(1, models.size), atoms, format: 'mmcif', title };
}

/** PDB or mmCIF, whichever the text looks like. */
export function parseStructure(text: string): Structure {
  return /^\s*data_/.test(text) || /\n_atom_site\./.test(text) ? parseMmcif(text) : parsePdb(text);
}

export type Region = { id: string; name: string; short: string; phi: number; psi: number; rphi: number; rpsi: number };

/** fibub's rough guide regions: ellipses centred on (phi, psi) with half-widths rphi and rpsi, in degrees. These are
 *  hand-drawn approximations of the textbook areas, not published contours, and the page lets you change them. */
export const GUIDE_REGIONS: Region[] = [
  { id: 'alpha', name: 'Right-handed helix (α)', short: 'α', phi: -75, psi: -35, rphi: 55, rpsi: 50 },
  { id: 'beta', name: 'β-sheet and extended', short: 'β', phi: -115, psi: 140, rphi: 65, rpsi: 55 },
  { id: 'alphaL', name: 'Left-handed helix (αL)', short: 'αL', phi: 60, psi: 40, rphi: 30, rpsi: 40 },
];

/** Write regions as editable text: one per line, "name, short label, phi, psi, phi half-width, psi half-width". */
export const regionsText = (rs: Region[]) => rs.map((r) => `${r.name}, ${r.short}, ${r.phi}, ${r.psi}, ${r.rphi}, ${r.rpsi}`).join('\n');

/** Read regions from text. Lines that start with # are skipped. */
export function parseRegions(text: string): { regions: Region[]; errors: string[] } {
  const regions: Region[] = [], errors: string[] = [];
  text.split(/\r?\n/).forEach((raw, k) => {
    const line = raw.trim();
    if (!line || line.startsWith('#')) return;
    const p = line.split(',').map((s) => s.trim());
    const nums = p.slice(-4).map(Number);
    if (p.length < 6 || !nums.every(Number.isFinite)) { errors.push(`Line ${k + 1}: give a name, a short label, then phi, psi, phi half-width and psi half-width.`); return; }
    const [phi, psi, rphi, rpsi] = nums;
    if (rphi <= 0 || rpsi <= 0 || rphi > 180 || rpsi > 180) { errors.push(`Line ${k + 1}: half-widths must be above 0 and at most 180°.`); return; }
    const name = p.slice(0, p.length - 5).join(', ') || `Region ${regions.length + 1}`;
    regions.push({ id: `r${regions.length}`, name, short: p[p.length - 5] || name.slice(0, 3), phi: wrap(phi), psi: wrap(psi), rphi, rpsi });
  });
  return { regions, errors };
}

/** How far a point is from a region's centre, in units of the ellipse (≤ 1 is inside). The angles wrap around. */
export const ellipseDist = (r: Region, phi: number, psi: number) => Math.hypot(wrap(phi - r.phi) / r.rphi, wrap(psi - r.psi) / r.rpsi);

/** The region a point falls in (the nearest centre when regions overlap), or null when outside them all. */
export function regionOf(rs: Region[], phi: number, psi: number): Region | null {
  let best: Region | null = null, bd = Infinity;
  for (const r of rs) { const d = ellipseDist(r, phi, psi); if (d <= 1 && d < bd) { best = r; bd = d; } }
  return best;
}

export type Angles = {
  chain: string; seq: number; icode: string; name: string; label: string;
  phi: number | null; psi: number | null; omega: number | null;
  kind: 'gly' | 'pro' | 'other'; region: Region | null; note: string; cis: boolean;
};

const ONE: Record<string, string> = { ALA: 'A', ARG: 'R', ASN: 'N', ASP: 'D', CYS: 'C', GLN: 'Q', GLU: 'E', GLY: 'G', HIS: 'H', ILE: 'I', LEU: 'L', LYS: 'K', MET: 'M', PHE: 'F', PRO: 'P', SER: 'S', THR: 'T', TRP: 'W', TYR: 'Y', VAL: 'V', MSE: 'M', SEC: 'U', PYL: 'O' };
export const oneLetter = (n: string) => ONE[n] ?? 'X';

const pos = (a: Atom): Vec => [a.x, a.y, a.z];

/** Backbone angles for every residue with N, CA and C atoms. Neighbours count only when they are in the same chain
 *  and the peptide bond C–N is no longer than maxBond Å, so chain breaks leave the angle blank. */
export function backbone(s: Structure, regions: Region[] = GUIDE_REGIONS, maxBond = 2.0): Angles[] {
  const bb = s.residues.filter((r) => r.atoms.has('N') && r.atoms.has('CA') && r.atoms.has('C'));
  const linked = (a: Residue | undefined, b: Residue | undefined) => !!a && !!b && a.chain === b.chain && dist(pos(a.atoms.get('C')!), pos(b.atoms.get('N')!)) <= maxBond;
  return bb.map((r, i) => {
    const prev = bb[i - 1], next = bb[i + 1];
    const N = pos(r.atoms.get('N')!), CA = pos(r.atoms.get('CA')!), C = pos(r.atoms.get('C')!);
    const phi = linked(prev, r) ? dihedral(pos(prev.atoms.get('C')!), N, CA, C) : null;
    const hasNext = linked(r, next);
    const psi = hasNext ? dihedral(N, CA, C, pos(next.atoms.get('N')!)) : null;
    const omega = hasNext ? dihedral(CA, C, pos(next.atoms.get('N')!), pos(next.atoms.get('CA')!)) : null;
    const kind = r.name === 'GLY' ? 'gly' : r.name === 'PRO' ? 'pro' : 'other';
    const region = phi !== null && psi !== null ? regionOf(regions, phi, psi) : null;
    const cis = omega !== null && Math.abs(omega) < 30;
    let note = '';
    if (phi === null && psi === null) note = 'no neighbours';
    else if (phi === null) note = prev && prev.chain === r.chain ? 'chain break before' : 'chain start';
    else if (psi === null) note = next && next.chain === r.chain ? 'chain break after' : 'chain end';
    else if (!region) note = kind === 'gly' ? 'outside the guides (glycine has more room)' : 'outside the guides';
    if (cis) note = (note ? note + '; ' : '') + `cis peptide to the next residue (ω ${omega!.toFixed(0)}°)`;
    else if (omega !== null && Math.abs(Math.abs(omega) - 180) > 30) note = (note ? note + '; ' : '') + `twisted peptide (ω ${omega.toFixed(0)}°)`;
    return { chain: r.chain, seq: r.seq, icode: r.icode, name: r.name, label: `${r.chain ? r.chain + ' ' : ''}${r.name} ${r.seq}${r.icode}`, phi, psi, omega, kind, region, note, cis };
  });
}

export type Summary = { residues: number; plotted: number; byRegion: { region: Region; n: number }[]; outside: number; gly: number; pro: number; cis: number; chains: string[] };

/** Counts for the residues that have both phi and psi. */
export function summarise(rows: Angles[], regions: Region[]): Summary {
  const plotted = rows.filter((r) => r.phi !== null && r.psi !== null);
  return {
    residues: rows.length, plotted: plotted.length,
    byRegion: regions.map((region) => ({ region, n: plotted.filter((r) => r.region === region).length })),
    outside: plotted.filter((r) => !r.region).length,
    gly: plotted.filter((r) => r.kind === 'gly').length, pro: plotted.filter((r) => r.kind === 'pro').length,
    cis: rows.filter((r) => r.cis).length,
    chains: [...new Set(rows.map((r) => r.chain))],
  };
}

const f1 = (x: number | null) => (x === null ? '' : x.toFixed(1));
const csvCell = (c: string) => (/[",\n]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c);

/** CSV of the angles: one row per residue. */
export function anglesCsv(rows: Angles[]): string {
  const head = 'chain,residue_number,insertion_code,residue,one_letter,phi_deg,psi_deg,omega_deg,type,region,note';
  return [head, ...rows.map((r) => [r.chain, String(r.seq), r.icode, r.name, oneLetter(r.name), f1(r.phi), f1(r.psi), f1(r.omega), r.kind === 'gly' ? 'glycine' : r.kind === 'pro' ? 'proline' : 'other', r.phi === null || r.psi === null ? '' : r.region?.name ?? 'outside the guides', r.note].map(csvCell).join(','))].join('\n') + '\n';
}

// ---------- The made-up example structure ----------

/** Place atom D so that |CD| = len, angle B-C-D = ang and dihedral A-B-C-D = tor (degrees). */
export function place(A: Vec, B: Vec, C: Vec, len: number, ang: number, tor: number): Vec {
  const a = ang / D, t = tor / D;
  const bc = unit(sub(C, B)), n = unit(cross(sub(B, A), bc)), m = cross(n, bc);
  const d2: Vec = [-len * Math.cos(a), len * Math.sin(a) * Math.cos(t), len * Math.sin(a) * Math.sin(t)];
  return [C[0] + d2[0] * bc[0] + d2[1] * m[0] + d2[2] * n[0], C[1] + d2[0] * bc[1] + d2[1] * m[1] + d2[2] * n[1], C[2] + d2[0] * bc[2] + d2[1] * m[2] + d2[2] * n[2]];
}

/** Build a backbone (N, CA, C, O) from residue names and phi, psi, omega (omega joins a residue to the next one).
 *  Standard textbook bond lengths and angles. */
export function buildChain(res: { name: string; phi: number; psi: number; omega: number }[], start: Vec = [0, 0, 0]): Vec[][] {
  const out: Vec[][] = [];
  let N: Vec = start, CA: Vec = [start[0] + 1.458, start[1], start[2]];
  let C: Vec = place([start[0], start[1] + 1, start[2]], N, CA, 1.525, 111.2, res[0].phi);
  for (let i = 0; i < res.length; i++) {
    const O = place(N, CA, C, 1.231, 120.5, res[i].psi + 180);
    out.push([N, CA, C, O]);
    if (i + 1 === res.length) break;
    const N2 = place(N, CA, C, 1.329, 116.2, res[i].psi), CA2 = place(CA, C, N2, 1.458, 121.7, res[i].omega), C2 = place(C, N2, CA2, 1.525, 111.2, res[i + 1].phi);
    N = N2; CA = CA2; C = C2;
  }
  return out;
}

type Ex = [string, number, number, number?];
// Chain A: a helix, a glycine turn in the left-handed region, a proline after a cis peptide, a β-strand, and one
// residue placed outside the guides on purpose. Chain B: a short strand with a glycine outside the guides.
const EX_A: Ex[] = [
  ['MET', -70, 150], ['SER', -66.4, -38.2], ['PRO', -61.8, -40.6], ['GLU', -64.3, -42.9], ['GLU', -62.1, -39.7], ['LEU', -66.8, -41.3],
  ['LYS', -63.5, -44.1], ['ALA', -60.2, -42.5], ['LEU', -67.9, -37.4], ['ALA', -65.3, -40.8], ['GLU', -62.7, -43.6], ['LYS', -70.4, -36.1],
  ['ASN', -92.6, 8.3], ['GLY', 78.4, 21.7], ['THR', -101.2, 152.6, -4.5], ['PRO', -68.9, 148.3], ['LYS', -118.7, 131.4], ['VAL', -126.3, 128.9],
  ['THR', -112.8, 137.2], ['VAL', -131.5, 142.8], ['TYR', -119.4, 126.5], ['VAL', -108.6, 134.1], ['ASP', 62.5, -118.4], ['GLY', -80.3, 168.2],
  ['LEU', -85.1, 120],
];
const EX_B: Ex[] = [
  ['ALA', -70, 145], ['ARG', -122.6, 133.8], ['ILE', -128.9, 125.2], ['GLY', 101.7, -168.4], ['SER', -134.2, 146.7], ['PHE', -116.3, 129.5],
  ['HIS', -76.4, -21.9], ['ASN', -90, 0],
];

const pdbAtom = (serial: number, name: string, res: string, chain: string, seq: number, p: Vec, el: string) =>
  `ATOM  ${String(serial).padStart(5)} ${(name.length < 4 ? ' ' + name : name).padEnd(4)} ${res} ${chain}${String(seq).padStart(4)}    ${p[0].toFixed(3).padStart(8)}${p[1].toFixed(3).padStart(8)}${p[2].toFixed(3).padStart(8)}  1.00 20.00          ${el.padStart(2)}`;

/** The made-up example as PDB text (coordinates built from the angles above; not a real protein). */
export function exampleStructure(): string {
  const lines = ['HEADER    ' + 'MADE-UP EXAMPLE'.padEnd(40) + '09-NOV-26   XMPL', 'REMARK   1 INVENTED COORDINATES BUILT FROM CHOSEN ANGLES. NOT A REAL PROTEIN.'];
  let serial = 1;
  const chains: [string, Ex[], Vec][] = [['A', EX_A, [0, 0, 0]], ['B', EX_B, [12, 18, -6]]];
  for (const [ch, ex, start] of chains) {
    const bb = buildChain(ex.map(([name, phi, psi, omega]) => ({ name, phi, psi, omega: omega ?? 180 })), start);
    bb.forEach((atoms, i) => (['N', 'CA', 'C', 'O'] as const).forEach((n, k) => lines.push(pdbAtom(serial++, n, ex[i][0], ch, i + 1, atoms[k], n[0]))));
    lines.push(`TER   ${String(serial++).padStart(5)}      ${ex[ex.length - 1][0]} ${ch}${String(ex.length).padStart(4)}`);
  }
  lines.push('END');
  return lines.join('\n') + '\n';
}
