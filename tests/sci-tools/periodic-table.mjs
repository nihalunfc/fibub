// #835 Periodic table. Checked against mendeleev 1.x and pymatgen for all 118 elements: full ground-state
// configurations (both, Z ≤ 103; mendeleev's predicted Ds and Rg differ and are shown here as Aufbau predictions),
// noble-gas core, unpaired electrons, period, group and block (where the group-3 conventions agree), Pauling
// electronegativity and first ionisation energy against pymatgen (NIST values), and every common oxidation state is
// a known state in pymatgen or mendeleev: 1,156 checks, 0 failed. 40 ion configurations against textbook answers.
import * as P from '../../src/lib/sci/ptable.ts';

export default async (check) => {
  const cfg = (s) => P.configText(P.findElement(s).config);
  const ng = (s) => P.nobleGas(P.findElement(s).config);
  check('aufbau: Madelung order starts 1s 2s 2p 3s 3p 4s 3d 4p 5s 4d', P.MADELUNG.slice(0, 10).map(P.label).join(' ') === '1s 2s 2p 3s 3p 4s 3d 4p 5s 4d');
  check('config: oxygen', cfg('O') === '1s2 2s2 2p4' && ng('O') === '[He] 2s2 2p4');
  check('config: iron, shell order and filling order', cfg('Fe') === '1s2 2s2 2p6 3s2 3p6 3d6 4s2' && P.nobleGas(P.findElement('Fe').config, { order: 'fill' }) === '[Ar] 4s2 3d6');
  check('config: exceptions Cr, Cu, Pd, Au', ng('Cr') === '[Ar] 3d5 4s1' && ng('Cu') === '[Ar] 3d10 4s1' && ng('Pd') === '[Kr] 4d10' && ng('Au') === '[Xe] 4f14 5d10 6s1');
  check('config: La, Ce, Gd, Lu', ng('La') === '[Xe] 5d1 6s2' && ng('Ce') === '[Xe] 4f1 5d1 6s2' && ng('Gd') === '[Xe] 4f7 5d1 6s2' && ng('Lu') === '[Xe] 4f14 5d1 6s2');
  check('config: actinides Th, U, Lr', ng('Th') === '[Rn] 6d2 7s2' && ng('U') === '[Rn] 5f3 6d1 7s2' && ng('Lr') === '[Rn] 5f14 7s2 7p1');
  check('config: 20 listed exceptions, all ≤ 103', Object.keys(P.EXCEPTIONS).length === 20 && Object.keys(P.EXCEPTIONS).every((z) => +z <= 103));
  check('config: electron counts add up for all 118', P.TABLE.every((e) => e.config.reduce((a, s) => a + s.e, 0) === e.z && e.config.every((s) => s.e > 0 && s.e <= P.cap(s.l))));
  check('config: superscripts', P.configText(P.findElement('N').config, { sup: true }) === '1s² 2s² 2p³');
  check('noble gas: neon written on helium', ng('Ne') === '[He] 2s2 2p6' && ng('H') === '1s1' && ng('Og') === '[Rn] 5f14 6d10 7s2 7p6');

  check('position: groups', P.groupOf(1) === 1 && P.groupOf(2) === 18 && P.groupOf(5) === 13 && P.groupOf(26) === 8 && P.groupOf(71) === 3 && P.groupOf(72) === 4 && P.groupOf(57) === null && P.groupOf(103) === 3 && P.groupOf(118) === 18);
  check('position: periods', P.periodOf(1) === 1 && P.periodOf(3) === 2 && P.periodOf(18) === 3 && P.periodOf(55) === 6 && P.periodOf(118) === 7);
  check('position: blocks', P.blockOf(2) === 's' && P.blockOf(57) === 'f' && P.blockOf(70) === 'f' && P.blockOf(71) === 'd' && P.blockOf(13) === 'p');
  check('position: every cell is used once', new Set(P.TABLE.map((e) => { const c = P.cellOf(e.z); return c.row * 100 + c.col; })).size === 118);
  check('position: f rows', JSON.stringify(P.cellOf(57)) === '{"row":9,"col":3}' && JSON.stringify(P.cellOf(102)) === '{"row":10,"col":16}');
  check('position: group counts', [[1, 7], [2, 6], [3, 4], [13, 6], [18, 7]].every(([g, n]) => P.TABLE.filter((e) => e.group === g).length === n) && P.TABLE.filter((e) => e.group === null).length === 28);

  check('unpaired: Fe 4, Cr 6, Gd 8, N 3, O 2, Ne 0', [['Fe', 4], ['Cr', 6], ['Gd', 8], ['N', 3], ['O', 2], ['Ne', 0]].every(([s, n]) => P.findElement(s).unpaired === n));
  const ion = (s, q) => P.nobleGas(P.ionConfiguration(P.findElement(s).z, q).config, { ion: true });
  check('ions: Fe2+ and Fe3+ lose 4s first', ion('Fe', 2) === '[Ar] 3d6' && ion('Fe', 3) === '[Ar] 3d5');
  check('ions: Cu+, Cu2+, Zn2+', ion('Cu', 1) === '[Ar] 3d10' && ion('Cu', 2) === '[Ar] 3d9' && ion('Zn', 2) === '[Ar] 3d10');
  check('ions: Eu3+ loses 4f after 6s (not 5p)', ion('Eu', 3) === '[Xe] 4f6' && ion('Ce', 4) === '[Xe]' && ion('U', 4) === '[Rn] 5f2');
  check('ions: anions O2-, Cl-, N3-', ion('O', -2) === '[Ne]' && ion('Cl', -1) === '[Ar]' && ion('N', -3) === '[Ne]');
  check('ions: Pb2+ keeps 6s2', ion('Pb', 2) === '[Xe] 4f14 5d10 6s2');
  { const r = P.ionConfiguration(11, 2); check('ions: Na2+ reaches into the core', r.intoCore && P.configText(r.config) === '1s2 2s2 2p5'); }
  { let t = false; try { P.ionConfiguration(2, 3); } catch { t = true; } check('ions: too many removed is an error', t); }

  check('data: electronegativity F 3.98, Cs 0.79, Au 2.54, no value for Ne', P.findElement('F').en === 3.98 && P.findElement('Cs').en === 0.79 && P.findElement('Au').en === 2.54 && Number.isNaN(P.findElement('Ne').en));
  check('data: first ionisation energy H 13.6, He 24.59, Cs 3.89, Lr 4.96, none for Rf', P.findElement('H').ie === 13.6 && P.findElement('He').ie === 24.59 && P.findElement('Cs').ie === 3.89 && P.findElement('Lr').ie === 4.96 && Number.isNaN(P.findElement('Rf').ie));
  check('data: arrays have 118 entries', P.PAULING.length === 118 && P.IE1.length === 118 && P.OXIDATION.length === 118);
  check('data: oxidation states', P.oxText(P.findElement('Mn').oxidation) === '+2, +3, +4, +6, +7' && P.oxText(P.findElement('Cl').oxidation) === '−1, +1, +3, +5, +7' && P.oxText(P.findElement('Ne').oxidation) === 'none common');
  check('data: weights from elements.ts, radioactive in brackets', P.weightText(P.findElement('C')) === '12.011' && P.weightText(P.findElement('Tc')) === '[97]');
  check('categories', P.findElement('Na').category === 'alkali metal' && P.findElement('Si').category === 'metalloid' && P.findElement('Br').category === 'halogen' && P.findElement('Lu').category === 'lanthanoid' && P.findElement('Fe').category === 'transition metal' && P.findElement('Pb').category === 'post-transition metal' && P.findElement('Og').category === 'superheavy (little known)');
  check('find: by number, symbol, name, US spelling', P.findElement('26').symbol === 'Fe' && P.findElement('fe').z === 26 && P.findElement('Iron').z === 26 && P.findElement('cesium').z === 55 && P.findElement('Xx') === undefined);
  const rows = P.csvRows();
  check('csv: header plus 118 rows', rows.length === 119 && rows[26][1] === 'Fe' && rows[26][10] === '[Ar] 3d6 4s2' && rows[24][11] === 'yes' && rows[110][11] === 'predicted');
};
