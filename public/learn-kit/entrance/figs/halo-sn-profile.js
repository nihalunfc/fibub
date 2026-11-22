// SN1 and SN2 energy profiles for methyl, primary, secondary and tertiary bromides. SN2 is one step through a
// crowded five-coordinate transition state, so bulky groups raise its barrier. SN1 goes through a carbocation, so
// alkyl groups that stabilise the cation lower its barrier. Relative rates are typical textbook orders of magnitude.
import { canvas, axes, line, dot, text, row, choice, readout } from '../../kit.js';

const SUB = {
  me: { name: 'CH₃Br', sn2: 30, sn1: 1, b2: 70, b1: 150, c: 128 },
  p: { name: '1° (CH₃CH₂Br)', sn2: 1, sn1: 1, b2: 80, b1: 140, c: 118 },
  s: { name: '2° ((CH₃)₂CHBr)', sn2: 0.02, sn1: 12, b2: 92, b1: 104, c: 90 },
  t: { name: '3° ((CH₃)₃CBr)', sn2: 0, sn1: 1.2e6, b2: 125, b1: 78, c: 58 },
};
export default function (host) {
  let mech = 'sn2', sub = 'p';
  const cv = canvas(host, { aspect: 0.62, max: 380, min: 260, label: 'Energy profile of SN1 and SN2 reactions' });
  const ctl = row(host);
  choice(ctl, 'Mechanism', [['sn2', 'SN2'], ['sn1', 'SN1']], mech, (v) => { mech = v; upd(); });
  choice(ctl, 'Substrate', Object.entries(SUB).map(([k, s]) => [k, s.name.split(' ')[0]]), sub, (v) => { sub = v; upd(); });
  const out = readout(host);
  const upd = () => { cv.redraw(); show(); };
  const show = () => {
    const s = SUB[sub];
    out.innerHTML = mech === 'sn2'
      ? `SN2 on ${s.name}: one step, rate = k[RBr][Nu⁻]. Backside attack inverts the carbon (Walden inversion). Relative rate about <b>${s.sn2 ? s.sn2 : '≈ 0 (too crowded)'}</b> (1° = 1). Best: methyl > 1° > 2° ≫ 3°; polar aprotic solvents (acetone, DMSO) help.`
      : `SN1 on ${s.name}: slow ionisation to a carbocation, then fast attack. rate = k[RBr], independent of the nucleophile. Relative rate about <b>${s.sn1.toLocaleString('en-IN')}</b> (1° = 1). Best: 3° > 2° ≫ 1° > methyl; polar protic solvents (water, alcohols) help; a chiral carbon gives mostly racemic product.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const s = SUB[sub], E0 = 40, Ep = 20;
    // smooth curve through key points (cosine easing between them: flat at each peak and valley)
    const keys = mech === 'sn2' ? [[0, E0], [0.08, E0], [0.5, s.b2], [0.92, Ep], [1, Ep]] : [[0, E0], [0.06, E0], [0.3, s.b1], [0.55, s.c], [0.72, s.c + 12], [0.94, Ep], [1, Ep]];
    const f = (x) => {
      let i = 0; while (i < keys.length - 2 && x > keys[i + 1][0]) i++;
      const [x0, y0] = keys[i], [x1, y1] = keys[i + 1], t = Math.min(1, Math.max(0, (x - x0) / (x1 - x0)));
      return y0 + (y1 - y0) * (1 - Math.cos(Math.PI * t)) / 2;
    };
    const N = 200, pts = Array.from({ length: N + 1 }, (_, i) => [i / N, f(i / N)]);
    const { X, Y } = axes(ctx, w, h, col, { x: [0, 1], y: [0, 175], xt: [], yt: [], xlabel: 'reaction progress', ylabel: 'energy', t: 28, b: 30, l: 30 });
    line(ctx, pts.map(([x, y]) => [X(x), Y(y)]), col.s[0], 2.5);
    text(ctx, 'R-Br + Nu⁻', X(0.02), Y(E0) + 14, { color: col.muted, size: 11 });
    text(ctx, 'R-Nu + Br⁻', X(0.98), Y(Ep) - 12, { color: col.muted, size: 11, align: 'right' });
    if (mech === 'sn2') {
      const top = f(0.5); dot(ctx, X(0.5), Y(top), 4, col.s[1]);
      text(ctx, '[Nu···C···Br]‡', X(0.5), Y(top) - 14, { color: col.s[1], size: 11, weight: 600, align: 'center' });
      line(ctx, [[X(0.1), Y(E0)], [X(0.1), Y(top)]], col.s[2], 1.5, [3, 3]);
      text(ctx, 'Eₐ', X(0.1) + 6, Y((E0 + top) / 2), { color: col.s[2], size: 12, weight: 700 });
    } else {
      const top = s.b1; dot(ctx, X(0.3), Y(top), 4, col.s[1]);
      text(ctx, 'TS 1 (slow)', X(0.3), Y(top) - 12, { color: col.s[1], size: 11, weight: 600, align: 'center' });
      const cy = f(0.55); dot(ctx, X(0.55), Y(cy), 4, col.s[3]);
      text(ctx, 'R⁺ + Br⁻', X(0.55), Y(cy) + 14, { color: col.s[3], size: 11, weight: 600, align: 'center' });
      line(ctx, [[X(0.1), Y(E0)], [X(0.1), Y(top)]], col.s[2], 1.5, [3, 3]);
      text(ctx, 'Eₐ', X(0.1) + 6, Y((E0 + top) / 2), { color: col.s[2], size: 12, weight: 700 });
    }
    text(ctx, `${mech === 'sn2' ? 'SN2' : 'SN1'}: ${s.name}`, 10, 14, { color: col.ink, size: 12.5, weight: 700 });
  };
  upd();
}
