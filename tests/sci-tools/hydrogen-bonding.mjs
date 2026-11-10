// #1368 Hydrogen bonding in water and ice. Geometry checked by hand: in the flat square-ice model every molecule
// donates exactly 2 and accepts exactly 2 hydrogen bonds (H···O = 1 − 0.33 = 0.67 spacings), 2N bonds in all
// with wrap-around; a lone molecule has none; molecules that donate and accept (H₂O, NH₃, HF) are the standard
// textbook list, while CH₄, H₂S and HCl do not hydrogen bond and methoxymethane only accepts.
import * as H from '../../src/lib/sci/hydrogen-bonding.ts';
const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
export default async (check) => {
  const w = { x: 0, y: 0, a: 0 }, hs = H.hydrogens(w);
  check('hbond: O–H length 0.33 and H–O–H 104.5°', hs.every(([x, y]) => near(Math.hypot(x, y), 0.33)) && near(Math.acos((hs[0][0] * hs[1][0] + hs[0][1] * hs[1][1]) / 0.33 ** 2) * 180 / Math.PI, 104.5, 1e-9));
  const ice = H.squareIce(6), b = H.bonds(ice, 90, 6);
  check('hbond: square ice 6×6 has 72 = 2N hydrogen bonds', b.length === 72);
  const give = new Array(36).fill(0), take = new Array(36).fill(0); b.forEach(([i, , j]) => { give[i]++; take[j]++; });
  check('hbond: every molecule gives 2 and takes 2 (ice rules)', give.every((g) => g === 2) && take.every((t) => t === 2));
  check('hbond: without wrap-around the edge molecules lose bonds (60)', H.bonds(ice, 90, 0).length === 60);
  check('hbond: a lone molecule has none', H.bonds([w], 104.5).length === 0);
  check('hbond: one H aimed at a neighbour O 1 spacing away makes one bond; far apart, none', H.bonds([{ x: 0, y: 0, a: (52.25 * Math.PI) / 180 }, { x: 1, y: 0, a: 0 }], 104.5).length === 1 && H.bonds([{ x: 0, y: 0, a: 0 }, { x: 1.4, y: 0, a: Math.PI }], 104.5).length === 0);
  const M = (id) => H.MOLS.find((m) => m.id === id);
  check('hbond: water, ammonia, HF hydrogen bond', ['h2o', 'nh3', 'hf', 'ch3oh'].every((id) => H.hbond(M(id)) === 'both'));
  check('hbond: CH₄, H₂S, HCl do not; ether only accepts', ['ch4', 'h2s', 'hcl'].every((id) => H.hbond(M(id)) === 'none') && H.hbond(M('ch3och3')) === 'acceptor');
};
