// "Solve my numbers" for the bridge page: metre bridge X = R l / (L − l) and the Wheatstone balance P/Q = R/S.
// Plain maths on typed values with units, no DOM. Engine: src/lib/learn/solvecore-b.ts.
import { sf, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';

const U = (base: string, ...more: [string, number][]): [string, number][] => [[base, 1], ...more];
const OHM = U('Ω', ['kΩ', 1e3], ['mΩ', 1e-3]);
const conv = (i: SIn | undefined, base: string, what: string) => (i && !i.blank && i.u !== base && i.typed !== i.v ? [`Convert ${what}: ${sf(i.typed)} ${i.u} = ${sf(i.v, 4)} ${base}`] : []);
const ohm = (x: number) => `${sf(x)} Ω`;

export function bridgeSolve(i: Record<string, SIn>, c: { find: string; ch: Record<string, string> }): SOut {
  const lines: string[] = [];
  if (c.find === 'wb') {
    const arm = c.ch.arm ?? 'S';
    const names = ['P', 'Q', 'R', 'S'];
    const v: Record<string, number> = {};
    for (const n of names) if (n !== arm) {
      const x = i['w' + n]; if (!x || x.blank) continue;
      if (!(x.v > 0)) return { error: `${n} must be above zero.` };
      v[n] = x.v; lines.push(...conv(x, 'Ω', n));
    }
    lines.push('Balanced bridge: P / Q = R / S, so P × S = Q × R (the products across the bridge are equal)');
    if (arm === 'chk') {
      const a = v.P / v.Q, b = v.R / v.S, same = Math.abs(a - b) <= 1e-9 * Math.max(a, b);
      lines.push(`P / Q = ${sf(v.P)} ÷ ${sf(v.Q)} = ${sf(a)}`, `R / S = ${sf(v.R)} ÷ ${sf(v.S)} = ${sf(b)}`);
      return { answer: same ? 'Balanced: the two ratios are equal, so the galvanometer reads zero.' : `Not balanced: ${sf(a)} and ${sf(b)} differ, so a current flows through the galvanometer.`, lines, tip: 'Check across the bridge: P × S should equal Q × R.' };
    }
    let x = 0;
    if (arm === 'S') { x = (v.Q * v.R) / v.P; lines.push(`S = Q × R ÷ P = ${sf(v.Q)} × ${sf(v.R)} ÷ ${sf(v.P)} = ${ohm(x)}`); }
    else if (arm === 'R') { x = (v.P * v.S) / v.Q; lines.push(`R = P × S ÷ Q = ${sf(v.P)} × ${sf(v.S)} ÷ ${sf(v.Q)} = ${ohm(x)}`); }
    else if (arm === 'Q') { x = (v.P * v.S) / v.R; lines.push(`Q = P × S ÷ R = ${sf(v.P)} × ${sf(v.S)} ÷ ${sf(v.R)} = ${ohm(x)}`); }
    else { x = (v.Q * v.R) / v.S; lines.push(`P = Q × R ÷ S = ${sf(v.Q)} × ${sf(v.R)} ÷ ${sf(v.S)} = ${ohm(x)}`); }
    return { answer: `For balance, ${arm} must be ${ohm(x)}.`, lines, tip: 'Common mistake: pairing the wrong arms. P and Q are side by side in the top row (the ratio arms); R and S are the bottom row, with R under P. The pairs that match are P with R, and Q with S.' };
  }
  const Lraw = i.L && !i.L.blank ? i.L.v : 100;
  const L = Lraw;
  if (!(L > 0)) return { error: 'The wire length must be above zero (a metre bridge wire is 100 cm).' };
  lines.push(...conv(i.L, 'cm', 'the wire length'), ...conv(i.l, 'cm', 'the balance length'), ...conv(i.Rk, 'Ω', 'the known resistance'), ...conv(i.X, 'Ω', 'the unknown resistance'));
  const left = c.ch.side !== 'right';
  const gapTxt = left ? 'X in the left gap, R in the right gap' : 'R in the left gap, X in the right gap';
  if (c.find === 'mb') {
    const R = i.Rk.v, l = i.l.v;
    if (!(R > 0)) return { error: 'The known resistance must be above zero.' };
    if (l <= 0) return { error: 'A balance length of 0 cm would mean X = 0 (or a faulty circuit). Check the reading: the jockey should be somewhere along the wire.' };
    if (l >= L) return { error: `The balance length must be less than the whole wire (${sf(L)} cm). At the very end X would be infinite, so recheck the reading.` };
    const X = left ? (R * l) / (L - l) : (R * (L - l)) / l;
    lines.push(`Setup: ${gapTxt}; l is measured from the left end.`, `Balance: X / R = ${left ? 'l ÷ (L − l)' : '(L − l) ÷ l'}`, `X = ${left ? 'R l ÷ (L − l)' : 'R (L − l) ÷ l'} = ${sf(R)} × ${left ? `${sf(l)} ÷ (${sf(L)} − ${sf(l)})` : `(${sf(L)} − ${sf(l)}) ÷ ${sf(l)}`} = ${ohm(X)}`);
    const tip = Math.abs(l - L / 2) > L * 0.25 ? 'The balance point is far from the middle, so a small slip in l changes X a lot. Choose R close to X to balance near 50 cm.' : 'Common mistake: using the wrong length. l is the length on the side of X; the other side is 100 − l, not l.';
    return { answer: `The unknown resistance is X = ${ohm(X)}.`, lines, tip };
  }
  // find l from X and R
  const R = i.Rk.v, X = i.X.v;
  if (!(R > 0) || !(X > 0)) return { error: 'Both resistances must be above zero.' };
  const l = left ? (L * X) / (X + R) : (L * R) / (X + R);
  lines.push(`Setup: ${gapTxt}.`, `X / R = ${left ? 'l ÷ (L − l)' : '(L − l) ÷ l'}, so l = ${left ? 'L X ÷ (X + R)' : 'L R ÷ (X + R)'}`, `l = ${sf(L)} × ${sf(left ? X : R)} ÷ (${sf(X)} + ${sf(R)}) = ${sf(l)} cm`);
  return { answer: `The jockey balances at l = ${sf(l)} cm from the left end.`, lines, tip: 'If l comes out near 0 or 100 cm, the two resistances are too different: pick a known R closer to X for a sharper result.' };
}

const mbShow = (c: { find: string }) => c.find === 'mb' || c.find === 'mbl';
const wbShow = (n: string) => (c: { find: string; ch: Record<string, string> }) => c.find === 'wb' && c.ch.arm !== n;
export const BRIDGE_SPEC: SSpec = {
  id: 'bridge',
  finds: [['mb', 'Metre bridge: unknown X'], ['mbl', 'Metre bridge: balance length l'], ['wb', 'Wheatstone bridge: one arm']],
  fields: [
    { k: 'side', kind: 'choice', label: 'Where is the unknown X?', def: 'left', show: mbShow, options: [['left', 'Left gap (R on the right)'], ['right', 'Right gap (R on the left)']] },
    { k: 'arm', kind: 'choice', label: 'Find', def: 'S', show: (c) => c.find === 'wb', options: [['S', 'S (bottom right)'], ['R', 'R (bottom left)'], ['Q', 'Q (top right)'], ['P', 'P (top left)'], ['chk', 'Is it balanced? (all four given)']] },
    { k: 'Rk', label: 'Known resistance R', units: OHM, show: mbShow, ph: 'e.g. 10' },
    { k: 'X', label: 'Unknown resistance X', units: OHM, show: (c) => c.find === 'mbl', ph: 'e.g. 6' },
    { k: 'l', label: 'Balance length l (from the left end)', units: [['cm', 1], ['m', 100], ['mm', 0.1]], show: (c) => c.find === 'mb', ph: 'e.g. 40' },
    { k: 'L', label: 'Wire length (blank = 100 cm)', units: [['cm', 1], ['m', 100]], optional: true, show: mbShow, ph: '100' },
    { k: 'wP', label: 'P (top left)', units: OHM, show: wbShow('P'), ph: 'e.g. 100' },
    { k: 'wQ', label: 'Q (top right)', units: OHM, show: wbShow('Q'), ph: 'e.g. 10' },
    { k: 'wR', label: 'R (bottom left)', units: OHM, show: wbShow('R'), ph: 'e.g. 250' },
    { k: 'wS', label: 'S (bottom right)', units: OHM, show: wbShow('S'), ph: 'e.g. 25' },
  ],
  presets: [
    { name: 'Metre bridge: R = 10 Ω, balance at 40 cm', find: 'mb', vals: { Rk: '10', l: '40' }, ch: { side: 'left' } },
    { name: 'Metre bridge: R = 5 Ω on the left gap, l = 60 cm', find: 'mb', vals: { Rk: '5', l: '60' }, ch: { side: 'right' } },
    { name: 'Where does X = 6 Ω balance against R = 4 Ω?', find: 'mbl', vals: { Rk: '4', X: '6' }, ch: { side: 'left' } },
    { name: 'Wheatstone: P = 100, Q = 10, R = 250: find S', find: 'wb', vals: { wP: '100', wQ: '10', wR: '250' }, ch: { arm: 'S' } },
    { name: 'Is 10 Ω, 20 Ω, 15 Ω, 30 Ω balanced?', find: 'wb', vals: { wP: '10', wQ: '20', wR: '15', wS: '30' }, ch: { arm: 'chk' } },
  ],
  solve: (i, c) => bridgeSolve(i, c),
};
