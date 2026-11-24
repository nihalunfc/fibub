// Hückel MO calculator (#T...): π orbital energies in units of β, occupations, π and delocalisation energies,
// bond orders and charges. Reference numbers are the standard published Hückel results for these π systems
// (eigenvalues of the adjacency matrix, as in Streitwieser's and Coulson's tables), worked out here in closed form
// where one exists, plus NumPy-style eigenvalues for the fused rings. No table is copied: every expected value is
// either an exact root (2cos, golden ratio, 1 ± √2) or printed to 4 decimals from the same standard theory.
import { build, solve, parseBonds, maxMatching, PRESETS } from '../../src/lib/sci/huckel.ts';

const S3 = Math.sqrt(3);
/** A benzenoid from hexagon centres (see scripts/blog-figures/pah-homo-lumo-gap-size-trend-huckel.mjs). */
function benzenoid(centres) {
  const pts = [];
  for (const [cx, cy] of centres) for (let k = 0; k < 6; k++) {
    const p = [cx + Math.cos((k * Math.PI) / 3), cy + Math.sin((k * Math.PI) / 3)];
    if (!pts.some((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) < 0.05)) pts.push(p);
  }
  const bonds = [];
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) if (Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]) < 1.05) bonds.push([i, j]);
  return { n: pts.length, bonds };
}
const acene = (rings) => benzenoid(Array.from({ length: rings }, (_, k) => [0, k * S3]));
const go = (n, bonds, charge = 0, types = {}) => {
  const h = solve(build(n, bonds, types), charge);
  return { h, gap: h.orbitals[h.homo].x - h.orbitals[h.lumo].x, homo: h.orbitals[h.homo].x, lumo: h.orbitals[h.lumo].x };
};
const preset = (id) => { const p = PRESETS.find((x) => x.id === id); return go(p.n, p.bonds, p.charge, Object.fromEntries(Object.entries(p.types ?? {}))); };

export default async (check) => {
  const near = (a, b, t = 1e-4) => Math.abs(a - b) <= t;

  // Chains: x = 2 cos(k pi / (n + 1)).
  { const e = preset('ethylene'); check('hückel: ethylene levels ±1 β, π energy 2β, delocalisation 0', near(e.homo, 1) && near(e.lumo, -1) && near(e.h.xTotal, 2) && near(e.h.delocalisation, 0)); }
  { const b = preset('butadiene'), g = (1 + Math.sqrt(5)) / 2;
    check('hückel: butadiene levels ±0.618, ±1.618 β (golden ratio), π energy 4.472β, delocalisation 0.472β', near(b.homo, g - 1) && near(b.lumo, 1 - g) && near(b.h.xTotal, 2 * (g + g - 1)) && near(b.h.delocalisation, 0.4721)); }
  { const a = preset('allyl'), r = Math.SQRT2;
    check('hückel: allyl radical levels √2, 0, −√2; the middle orbital is half filled; charges 0 everywhere', near(a.homo, 0) && near(a.h.orbitals[0].x, r) && a.h.orbitals[1].occ === 1 && a.h.charges.every((q) => near(q, 0, 1e-9))); }

  // Rings: x = 2 cos(2 pi k / n); 4n + 2 electrons closes a shell, 4n does not.
  { const bz = preset('benzene');
    check('hückel: benzene levels 2, 1, 1, −1, −1, −2; gap 2β; delocalisation 2β; every bond order 2/3', near(bz.h.orbitals[0].x, 2) && near(bz.gap, 2) && near(bz.h.delocalisation, 2) && bz.h.bondOrders.every((b) => near(b.p, 2 / 3))); }
  { const cb = preset('cyclobutadiene');
    check('hückel: square cyclobutadiene has two electrons in a degenerate non-bonding pair (gap 0, delocalisation 0)', near(cb.gap, 0) && near(cb.h.delocalisation, 0) && cb.h.orbitals[1].occ === 1 && cb.h.orbitals[2].occ === 1); }
  { const cp = preset('cp-'), tr = preset('tropylium');
    check('hückel: cyclopentadienyl anion and tropylium cation are closed shells, 6 π electrons each', cp.h.electrons === 6 && tr.h.electrons === 6 && near(cp.h.orbitals[0].x, 2) && near(tr.h.orbitals[0].x, 2) && cp.h.orbitals[1].occ === 2 && tr.h.orbitals[1].occ === 2); }

  // Fused benzenoids: the published Hückel HOMO energies.
  { const n = go(acene(2).n, acene(2).bonds), g = (1 + Math.sqrt(5)) / 2;
    check('hückel: naphthalene from its bond list: C10, 11 bonds, HOMO 0.618β (= φ − 1), gap 1.2361β', n.h.orbitals.length === 10 && acene(2).bonds.length === 11 && near(n.homo, g - 1) && near(n.gap, 1.2361)); }
  { const a = go(acene(3).n, acene(3).bonds);
    check('hückel: anthracene HOMO 0.4142β (= √2 − 1), gap 0.8284β, delocalisation 5.314β', near(a.homo, Math.SQRT2 - 1) && near(a.gap, 0.8284) && near(a.h.delocalisation, 5.3137, 2e-3)); }
  { const t = go(acene(4).n, acene(4).bonds), p = go(acene(5).n, acene(5).bonds), h6 = go(acene(6).n, acene(6).bonds);
    check('hückel: the acene gap keeps shrinking: tetracene 0.5899β, pentacene 0.4394β, hexacene 0.3387β', near(t.gap, 0.5899) && near(p.gap, 0.4394) && near(h6.gap, 0.3387)); }
  { const ph = go(benzenoid([[0, 0], [0, S3], [1.5, S3 * 1.5]]).n, benzenoid([[0, 0], [0, S3], [1.5, S3 * 1.5]]).bonds);
    const py = go(benzenoid([[0, 0], [0, S3], [1.5, S3 / 2], [1.5, S3 * 1.5]]).n, benzenoid([[0, 0], [0, S3], [1.5, S3 / 2], [1.5, S3 * 1.5]]).bonds);
    const tp = go(benzenoid([[0, 0], [1.5, S3 / 2], [-1.5, S3 / 2], [0, -S3]]).n, benzenoid([[0, 0], [1.5, S3 / 2], [-1.5, S3 / 2], [0, -S3]]).bonds);
    check('hückel: phenanthrene HOMO 0.6052β, pyrene (C16) 0.4450β, triphenylene (C18) 0.6840β', near(ph.homo, 0.6052) && py.h.orbitals.length === 16 && near(py.homo, 0.445) && tp.h.orbitals.length === 18 && near(tp.homo, 0.684)); }
  // Blog: pah-homo-lumo-gap-size-trend-huckel. Isomers of one size split by 0.38-0.45 β, and a five-membered ring
  // breaks the alternant symmetry so that the HOMO and LUMO no longer mirror each other.
  { const anth = go(acene(3).n, acene(3).bonds), chry = benzenoid([[0, 0], [0, S3], [1.5, S3 * 1.5], [1.5, S3 * 2.5]]);
    const ph = go(benzenoid([[0, 0], [0, S3], [1.5, S3 * 1.5]]).n, benzenoid([[0, 0], [0, S3], [1.5, S3 * 1.5]]).bonds);
    const ch = go(chry.n, chry.bonds), tet = go(acene(4).n, acene(4).bonds);
    check('hückel: same-size isomer splits: phenanthrene − anthracene 0.3820β (C14), chrysene − tetracene 0.4504β (C18)', near(ph.gap - anth.gap, 0.382) && near(ch.gap - tet.gap, 0.4504));
    const nap = PRESETS.find((p) => p.id === 'naphthalene').bonds;
    const ace = go(12, [...nap, [0, 10], [10, 11], [11, 7]]);
    check('hückel: acenaphthylene (five-membered ring) HOMO 0.6375β, LUMO −0.2846β, gap 0.9221β, not symmetric', near(ace.homo, 0.6375) && near(ace.lumo, -0.2846) && near(ace.gap, 0.9221) && !near(ace.homo + ace.lumo, 0, 1e-3)); }

  // Heteroatoms (Streitwieser h and k) and the small helpers.
  { const py = preset('pyridine'), pyr = preset('pyrrole');
    check('hückel: pyridine (N h = 0.5) keeps 6 π electrons and puts negative charge on nitrogen; pyrrole N: gives 2 π electrons', py.h.electrons === 6 && py.h.charges[0] < -0.1 && pyr.h.electrons === 6); }
  { const f = preset('formaldehyde');
    check('hückel: C=O with h = 1: levels 1.618 and −0.618 β, π charge pulled onto oxygen', near(f.h.orbitals[0].x, (1 + Math.sqrt(5)) / 2) && near(f.h.orbitals[1].x, (1 - Math.sqrt(5)) / 2) && f.h.charges[1] < -0.2); }
  check('hückel: bond lists are read 1-based, and the largest matching of naphthalene is 5 bonds', parseBonds('1-2, 2-3 3-4').join('|') === '0,1|1,2|2,3' && maxMatching(10, PRESETS.find((p) => p.id === 'naphthalene').bonds) === 5);
  { let e = ''; try { solve(build(3, [[0, 5]])); } catch (x) { e = x.message; } check('hückel: a bond to an atom that is not there is refused with a message', e.includes('names an atom that is not there')); }
};
