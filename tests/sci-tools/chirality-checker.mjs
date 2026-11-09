// #1107 Chirality checker. CIP priorities checked against the textbook orders for lactic acid (OH > COOH > CH3 > H),
// alanine (NH2 > COOH > CH3 > H), glyceraldehyde (OH > CHO > CH2OH > H), butan-2-ol (OH > C2H5 > CH3 > H),
// 3-methylhexane (propyl > ethyl > methyl > H), CH=CH2 > CH(CH3)2, CHO > CN (O beats N at the first difference),
// COOH > CHO > CH2OH and D > H. R/S checked by hand on a drawn CHFClBr (H away, Br → Cl → F clockwise = R), and
// mirror images and swapping two groups must flip it.
import { rank, descriptor, mirror, PRESETS, SITES, GROUPS, parse, cmp } from '../../src/lib/sci/chirality.ts';

export default async (check) => {
  const lab = (ids) => rank(ids).order.map((i) => ids[i]).join('>');
  check('chiral: lactic acid', lab(['H', 'OH', 'COOH', 'CH3']) === 'OH>COOH>CH3>H');
  check('chiral: alanine', lab(['H', 'NH2', 'CH3', 'COOH']) === 'NH2>COOH>CH3>H');
  check('chiral: glyceraldehyde', lab(['H', 'OH', 'CHO', 'CH2OH']) === 'OH>CHO>CH2OH>H');
  check('chiral: butan-2-ol', lab(['H', 'OH', 'CH3', 'C2H5']) === 'OH>C2H5>CH3>H');
  check('chiral: 3-methylhexane', lab(['H', 'CH3', 'C2H5', 'C3H7']) === 'C3H7>C2H5>CH3>H');
  check('chiral: vinyl beats isopropyl, CHO beats CN, D beats H', lab(['H', 'vinyl', 'iPr', 'CH3']) === 'vinyl>iPr>CH3>H' && lab(['H', 'CN', 'CHO', 'CH3']) === 'CHO>CN>CH3>H' && lab(['H', 'D', 'CH3', 'OH']) === 'OH>CH3>D>H');
  check('chiral: halogens by atomic number', lab(['F', 'I', 'Cl', 'Br']) === 'I>Br>Cl>F' && lab(['CH2Cl', 'OH', 'C2H5', 'H']) === 'OH>CH2Cl>C2H5>H');
  check('chiral: not chiral when two groups match', !rank(['H', 'OH', 'CH3', 'CH3']).chiral && !rank(['H', 'Cl', 'Cl', 'H']).chiral && rank(['H', 'OH', 'CH3', 'C2H5']).chiral);
  check('chiral: steps explain the tie', rank(['H', 'OH', 'CH3', 'C2H5']).steps.join(' ').includes('Tie on C between C₂H₅ and CH₃'));
  // Hand-drawn CHFClBr: H away from the viewer (−z), Br at 90°, Cl at −30°, F at 210° in the paper plane: clockwise → R.
  const a = (deg) => [Math.cos(deg * Math.PI / 180), Math.sin(deg * Math.PI / 180), 0.33];
  const ids = ['H', 'Br', 'Cl', 'F'], pos = [[0, 0, -1], a(90), a(-30), a(210)], o = rank(ids).order;
  check('chiral: hand-drawn R', descriptor(pos, o) === 'R');
  check('chiral: mirror and swap flip it', descriptor(mirror(pos), o) === 'S' && descriptor([pos[0], pos[2], pos[1], pos[3]], o) === 'S');
  check('chiral: rotation keeps it', (() => { const r = (p) => [p[1], -p[0], p[2]]; const r2 = (p) => [p[0], p[2], -p[1]]; return descriptor(pos.map(r), o) === 'R' && descriptor(pos.map(r2), o) === 'R'; })());
  check('chiral: tetrahedral sites', SITES.every((p) => Math.abs(Math.hypot(...p) - 1) < 1e-3) && Math.abs(SITES[1][0] * SITES[2][0] + SITES[1][1] * SITES[2][1] + SITES[1][2] * SITES[2][2] + 1 / 3) < 1e-3);
  check('chiral: presets and groups parse', PRESETS.length === 10 && GROUPS.every((g) => parse(g.tree).el) && cmp(parse('C(O,O*,H)'), parse('C(O(H),H,H)')) > 0);
};
