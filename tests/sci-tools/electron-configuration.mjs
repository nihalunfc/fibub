// #1082 Electron configuration filler. Configurations for Z 1 to 36 checked against a hand-written textbook list
// (with Cr and Cu exceptions); unpaired electrons against the usual values; quantum numbers against worked examples.
import * as E from '../../src/lib/sci/econfig.ts';

const LIST = { 1: '1s1', 2: '1s2', 6: '1s2 2s2 2p2', 7: '1s2 2s2 2p3', 10: '1s2 2s2 2p6', 11: '1s2 2s2 2p6 3s1', 17: '1s2 2s2 2p6 3s2 3p5', 19: '1s2 2s2 2p6 3s2 3p6 4s1',
  21: '1s2 2s2 2p6 3s2 3p6 3d1 4s2', 24: '1s2 2s2 2p6 3s2 3p6 3d5 4s1', 26: '1s2 2s2 2p6 3s2 3p6 3d6 4s2', 29: '1s2 2s2 2p6 3s2 3p6 3d10 4s1', 30: '1s2 2s2 2p6 3s2 3p6 3d10 4s2', 35: '1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p5', 36: '1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6' };
const UNPAIRED = { 1: 1, 2: 0, 6: 2, 7: 3, 8: 2, 9: 1, 10: 0, 15: 3, 21: 1, 24: 6, 25: 5, 26: 4, 27: 3, 28: 2, 29: 1, 30: 0, 33: 3 };
export default async (check) => {
  check('econfig: configurations match the textbook list (Cr, Cu exceptions)', Object.entries(LIST).every(([z, t]) => E.configText(E.forAtom(+z).real) === t));
  check('econfig: only Cr and Cu are exceptions up to Kr', [...Array(37).keys()].filter((z) => E.forAtom(z).exception).join() === '24,29');
  check('econfig: unpaired electrons', Object.entries(UNPAIRED).every(([z, u]) => E.unpaired(E.forAtom(+z).real) === u));
  check('econfig: noble-gas short forms', E.nobleGas(E.forAtom(24).real) === '[Ar] 3d5 4s1' && E.nobleGas(E.forAtom(11).real) === '[Ne] 3s1');
  { const b = E.boxesFor(E.forAtom(7).real); check('econfig: nitrogen 2p has three single up arrows (Hund)', b['2p'].every((x) => x.up && !x.down) && b['2s'].every((x) => x.up && x.down)); }
  { const b = E.boxesFor(E.forAtom(8).real); check('econfig: oxygen 2p has one pair and two singles', b['2p'].filter((x) => x.down).length === 1 && b['2p'].every((x) => x.up)); }
  { const el = E.electrons(E.forAtom(7).real), last = el[6]; check('econfig: last electron of N is 2p, n=2 l=1 ml=+1 ms=+1/2', last.sub === '2p' && last.n === 2 && last.l === 1 && last.ml === 1 && last.ms === 0.5); }
  { const el = E.electrons(E.forAtom(11).real), last = el[10]; check('econfig: last electron of Na is 3s: 3, 0, 0, +1/2', last.n === 3 && last.l === 0 && last.ml === 0 && last.ms === 0.5); }
  { const el = E.electrons(E.forAtom(36).real); const keys = new Set(el.map((x) => `${x.n},${x.l},${x.ml},${x.ms}`));
    check('econfig: Pauli: all 36 electrons of Kr have different quantum number sets', el.length === 36 && keys.size === 36 && el.every((x) => Math.abs(x.ml) <= x.l && x.l < x.n)); }
  check('econfig: quantum() for 3d box 0 down is 3, 2, −2, −1/2', JSON.stringify(E.quantum('3d', 0, false)) === JSON.stringify({ n: 3, l: 2, ml: -2, ms: -0.5 }));
  // Rules when filling by hand
  { const b = E.emptyBoxes();
    const r1 = E.place(b, '2s', 0); b['1s'][0].up = true; const r2 = E.place(b, '1s', 0); b['1s'][0].down = true; const r3 = E.place(b, '1s', 0);
    check('econfig: Aufbau refuses 2s before 1s; second 1s electron is spin down; Pauli refuses a third', !r1.ok && r1.rule === 'Aufbau' && r2.ok && r2.up === false && !r3.ok && r3.rule === 'Pauli'); }
  { const b = E.boxesFor(E.forAtom(5).real); const r = E.place(b, '2p', 0), r2 = E.place(b, '2p', 1);
    check('econfig: Hund refuses pairing in 2p while a box is empty; an empty box is fine', !r.ok && r.rule === 'Hund' && r2.ok && r2.up); }
  { const b = E.boxesFor(E.forAtom(18).real); check('econfig: after Ar, 3d is refused until 4s is full', E.place(b, '3d', 0).rule === 'Aufbau' && E.place(b, '4s', 0).ok); }
  check('econfig: total and toConfig round trip', E.total(E.boxesFor(E.forAtom(29).real)) === 29 && E.configText(E.toConfig(E.boxesFor(E.forAtom(29).real))) === LIST[29]);
  check('econfig: parseConfig reads plain, superscript and noble-gas forms', E.configText(E.parseConfig('1s² 2s² 2p⁶ 3s¹')) === LIST[11] && E.configText(E.parseConfig('[Ar] 4s1 3d5')) === LIST[24] && E.configText(E.parseConfig('1s2,2s2,2p3')) === LIST[7]);
  check('econfig: parseConfig refuses nonsense', E.parseConfig('1p2') === null && E.parseConfig('2s3') === null && E.parseConfig('hello') === null && E.parseConfig('') === null);
  let bad = 0; for (const z of [-1, 37, 2.5]) { try { E.forAtom(z); } catch { bad++; } } check('econfig: out of range refused', bad === 3);
};
