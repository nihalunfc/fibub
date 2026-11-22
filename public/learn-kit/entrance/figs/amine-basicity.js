// A basicity ladder for amines (pKb in water at 25 °C, lower pKb = stronger base), with the reason for each place.
// Switch to "Gas phase" to see the order of the methylamines without water, where only the inductive effect counts.
import { canvas, text, row, choice, readout, line, dot } from '../../kit.js';

const C = [
  ['et2nh', '(C₂H₅)₂NH', 3.0, 'Two ethyl groups push electron density onto N, and the ion is still well solvated: the strongest base here.'],
  ['et3n', '(C₂H₅)₃N', 3.25, 'Three ethyls push more, but crowding hinders solvation of the ion: a little weaker than diethylamine.'],
  ['me2nh', '(CH₃)₂NH', 3.27, 'Balance of inductive push and solvation: strongest of the methylamines in water.'],
  ['etnh2', 'C₂H₅NH₂', 3.29, 'One ethyl group pushes electrons onto N.'],
  ['menh2', 'CH₃NH₂', 3.38, 'One methyl group: stronger than ammonia.'],
  ['me3n', '(CH₃)₃N', 4.22, 'Most inductive push, but its ion has only one N-H to hydrogen-bond with water: weakest of the methylamines in water.'],
  ['bnz', 'C₆H₅CH₂NH₂', 4.70, 'Benzylamine: N is on a CH₂, not on the ring, so its lone pair is free. An aliphatic amine.'],
  ['nh3', 'NH₃', 4.75, 'Reference.'],
  ['ptol', 'p-toluidine', 8.92, 'A methyl at para pushes some density back: slightly stronger than aniline.'],
  ['aniline', 'C₆H₅NH₂ (aniline)', 9.38, 'The lone pair is shared with the ring by resonance, so it is much less available: about a million times weaker than methylamine.'],
  ['pcl', 'p-chloroaniline', 10.0, 'Chlorine pulls electrons inductively: weaker than aniline.'],
  ['pno2', 'p-nitroaniline', 13.0, 'The nitro group pulls the lone pair through the ring by resonance: an extremely weak base.'],
];
const GAS = [['(CH₃)₃N', 4], ['(CH₃)₂NH', 3], ['CH₃NH₂', 2], ['NH₃', 1]];
export default function (host) {
  let key = 'aniline', mode = 'water';
  const cv = canvas(host, { aspect: 0.9, max: 420, min: 330, label: 'pKb ladder of amines' });
  const ctl = row(host);
  choice(ctl, 'Medium', [['water', 'In water'], ['gas', 'Gas phase']], mode, (v) => { mode = v; upd(); });
  choice(ctl, 'Amine', C.filter((c) => !['etnh2', 'et3n', 'pcl'].includes(c[0])).map((c) => [c[0], c[1].replace(' (aniline)', '')]), key, (v) => { key = v; upd(); });
  const out = readout(host);
  const upd = () => { cv.redraw(); show(); };
  const show = () => {
    if (mode === 'gas') { out.innerHTML = 'Gas phase (no water to solvate the ions): only electron push matters, so basicity rises with every alkyl group: <b>(CH₃)₃N > (CH₃)₂NH > CH₃NH₂ > NH₃</b>. In water, solvation of the ammonium ion reshuffles the order to 2° > 1° > 3° > NH₃ for methyl, and 2° > 3° > 1° > NH₃ for ethyl.'; return; }
    const c = C.find((x) => x[0] === key), d = 4.75 - c[2], ratio = Math.pow(10, Math.abs(d));
    out.innerHTML = `${c[1]}: pKb ${c[2]}${Math.abs(d) < 0.05 ? '' : `, ${ratio >= 100 ? Math.round(ratio).toLocaleString('en-IN') : ratio.toFixed(1)} times ${d > 0 ? 'stronger' : 'weaker'} than ammonia`}. ${c[3]}`;
  };
  cv.draw = (ctx, w, h, col) => {
    if (mode === 'gas') {
      text(ctx, 'Gas phase: basicity order', 10, 14, { color: col.ink, size: 12.5, weight: 700 });
      const bw = (w - 40) / 4;
      GAS.forEach(([nm, v], i) => {
        const x = 20 + i * bw, bh = (h - 90) * (v / 4);
        ctx.fillStyle = col.s[i]; ctx.fillRect(x + 8, h - 40 - bh, bw - 16, bh);
        text(ctx, nm, x + bw / 2, h - 24, { color: col.ink, size: 11, weight: 600, align: 'center' });
      });
      text(ctx, 'more alkyl groups → more electron push → stronger base', w / 2, 40, { color: col.muted, size: 11, align: 'center' });
      return;
    }
    const T = 34, B = h - 18, ax = 58, lo = 2.5, hi = 13.5, Y = (p) => T + ((p - lo) / (hi - lo)) * (B - T);
    line(ctx, [[ax, T], [ax, B]], col.ink, 2);
    for (let p = 3; p <= 13; p += 2) { line(ctx, [[ax - 5, Y(p)], [ax, Y(p)]], col.ink, 1.5); text(ctx, String(p), ax - 9, Y(p), { color: col.muted, size: 10, align: 'right' }); }
    text(ctx, 'pKb', 10, 14, { color: col.ink, size: 12, weight: 700 });
    text(ctx, 'stronger base ↑', ax + 6, T - 14, { color: col.muted, size: 10 });
    const rows = C.slice().sort((a, b) => a[2] - b[2]).map((c) => ({ c, y: Y(c[2]) }));
    const gap = Math.min(16, (B - T) / rows.length);
    for (let i = 1; i < rows.length; i++) if (rows[i].y - rows[i - 1].y < gap) rows[i].y = rows[i - 1].y + gap;
    const lx = ax + 54;
    for (const { c, y } of rows) {
      const on = c[0] === key, ref = c[0] === 'nh3';
      dot(ctx, ax, Y(c[2]), on ? 5 : 3, on ? col.s[0] : ref ? col.muted : col.s[1]);
      line(ctx, [[ax + 4, Y(c[2])], [lx - 6, y]], on ? col.s[0] : col.line, on ? 1.8 : 1);
      text(ctx, `${c[2]}  ${c[1]}`, lx, y, { color: on ? col.s[0] : ref ? col.muted : col.ink, size: on ? 12 : 11, weight: on ? 700 : 400 });
    }
  };
  upd();
}
