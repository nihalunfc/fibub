// Hydrogen bonding for school chemistry (Class 11 chemical bonding, states of matter; Class 9/10 water): which
// molecules can hydrogen bond, and a flat model of water and ice that counts H···O hydrogen bonds from geometry.
// Lengths in "O–O spacings" (1 = the O···O distance in the ice model). Plain maths, no DOM.

export type Mol = { id: string; formula: string; name: string; donor: boolean; acceptor: boolean; why: string };
/** donor: has H on N, O or F. acceptor: has N, O or F with a lone pair. */
export const MOLS: Mol[] = [
  { id: 'h2o', formula: 'H₂O', name: 'water', donor: true, acceptor: true, why: 'Two O–H bonds and two lone pairs on O: each molecule can make up to four hydrogen bonds.' },
  { id: 'nh3', formula: 'NH₃', name: 'ammonia', donor: true, acceptor: true, why: 'N–H bonds and a lone pair on N.' },
  { id: 'hf', formula: 'HF', name: 'hydrogen fluoride', donor: true, acceptor: true, why: 'F is the most electronegative element: the strongest single hydrogen bonds, making zig-zag chains.' },
  { id: 'ch3oh', formula: 'CH₃OH', name: 'methanol', donor: true, acceptor: true, why: 'Its O–H group behaves like water’s.' },
  { id: 'ch3cooh', formula: 'CH₃COOH', name: 'ethanoic acid', donor: true, acceptor: true, why: 'O–H and C=O let two molecules pair up as a dimer.' },
  { id: 'ch3och3', formula: 'CH₃OCH₃', name: 'methoxymethane', donor: false, acceptor: true, why: 'O has lone pairs, but no H is on O, so the molecules cannot hydrogen bond to each other. They can accept one from water.' },
  { id: 'ch4', formula: 'CH₄', name: 'methane', donor: false, acceptor: false, why: 'C is not electronegative enough to make C–H strongly polar, and there is no lone pair.' },
  { id: 'h2s', formula: 'H₂S', name: 'hydrogen sulfide', donor: false, acceptor: false, why: 'S is larger and much less electronegative than O, so S–H is only weakly polar: no real hydrogen bonds.' },
  { id: 'hcl', formula: 'HCl', name: 'hydrogen chloride', donor: false, acceptor: false, why: 'Cl is electronegative but large, so its charge is spread out: at most very weak hydrogen bonds, usually counted as none.' },
];
/** 'both': the molecules hydrogen bond to each other. 'acceptor': only with a donor such as water. 'none'. */
export const hbond = (m: Mol) => (m.donor && m.acceptor ? 'both' : m.acceptor ? 'acceptor' : 'none');

export type Water = { x: number; y: number; a: number }; // O position and the direction (rad) bisecting H–O–H
export const OH = 0.33;
/** H positions of a water molecule with H–O–H angle `ang` (degrees), bisector along a. */
export function hydrogens(w: Water, ang = 104.5): [number, number][] {
  const h = (ang * Math.PI) / 360;
  return [w.a - h, w.a + h].map((t) => [w.x + OH * Math.cos(t), w.y + OH * Math.sin(t)] as [number, number]);
}

/** Hydrogen bonds: an H of one molecule within [lo, hi] of the O of another (box of size L with wrap-around,
 *  or no wrap when L is 0). Returns pairs [donor, H index, acceptor]. */
export function bonds(ws: Water[], ang = 104.5, L = 0, lo = 0.45, hi = 0.72) {
  const out: [number, number, number][] = [];
  const d = (ax: number, bx: number) => { let v = ax - bx; if (L) v -= L * Math.round(v / L); return v; };
  ws.forEach((w, i) => hydrogens(w, ang).forEach(([hx, hy], k) => {
    let best = -1, bd = Infinity;
    ws.forEach((o, j) => { if (j === i) return; const r = Math.hypot(d(hx, o.x), d(hy, o.y)); if (r >= lo && r <= hi && r < bd) { bd = r; best = j; } });
    if (best >= 0) out.push([i, k, best]);
  }));
  return out;
}

/** Flat "square ice": n × n molecules one spacing apart; each points its two H at its right and upper neighbours
 *  (H–O–H drawn at 90° in this flat model), so every molecule gives two and takes two hydrogen bonds. */
export function squareIce(n: number): Water[] {
  const ws: Water[] = [];
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) ws.push({ x: c + 0.5, y: r + 0.5, a: Math.PI / 4 });
  return ws;
}
