// 3d transition metal atoms and ions: pick a metal and a charge and see the 3d and 4s boxes filled by Hund's rule.
// Ions lose 4s electrons first. Spin-only magnetic moment μ = √(n(n + 2)) BM from the unpaired electrons n.
import { canvas, text, row, slider, choice, readout } from '../../kit.js';

const M = [['Sc', 3], ['Ti', 4], ['V', 5], ['Cr', 6], ['Mn', 7], ['Fe', 8], ['Co', 9], ['Ni', 10], ['Cu', 11], ['Zn', 12]];
const NEUTRAL = { Sc: [1, 2], Ti: [2, 2], V: [3, 2], Cr: [5, 1], Mn: [5, 2], Fe: [6, 2], Co: [7, 2], Ni: [8, 2], Cu: [10, 1], Zn: [10, 2] };
const COLOUR = { 'Sc3': 'colourless', 'Ti3': 'purple', 'Ti4': 'colourless', 'V3': 'green', 'V2': 'violet', 'Cr3': 'violet (green with Cl⁻)', 'Cr2': 'blue', 'Mn2': 'very pale pink', 'Mn3': 'violet', 'Fe2': 'pale green', 'Fe3': 'yellow', 'Co2': 'pink', 'Ni2': 'green', 'Cu2': 'blue', 'Cu1': 'colourless', 'Zn2': 'colourless' };
const SUP = (s) => String(s).replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);
export default function (host) {
  let el = 'Fe', q = 2;
  const cv = canvas(host, { aspect: 0.45, max: 260, min: 190, label: '3d and 4s orbital boxes for a transition metal atom or ion' });
  const ctl = row(host);
  choice(ctl, 'Metal', M.map(([s]) => [s, s]), el, (v) => { el = v; upd(); });
  const qs = slider(ctl, { label: 'Charge', min: 0, max: 7, step: 1, value: q, fmt: (v) => (v ? `+${v}` : '0'), oninput: (v) => { q = v; upd(); } });
  const out = readout(host);
  const conf = () => {
    const grp = M.find((m) => m[0] === el)[1];
    const qq = Math.min(q, grp);
    if (qq === 0) return { d: NEUTRAL[el][0], s: NEUTRAL[el][1], qq, grp };
    return { d: grp - qq, s: 0, qq, grp };
  };
  const unp = (d) => (d <= 5 ? d : 10 - d);
  const upd = () => { cv.redraw(); show(); };
  const show = () => {
    const { d, s, qq, grp } = conf(), n = unp(d), mu = Math.sqrt(n * (n + 2));
    const name = qq ? `${el}${SUP(qq)}⁺` : `${el} atom`;
    const c = COLOUR[el + qq];
    out.innerHTML = `${name}: [Ar] 3d${SUP(d)}${s ? ' 4s' + SUP(s) : ''}. Unpaired electrons n = ${n}; spin-only μ = √(${n} × ${n + 2}) = <b>${mu.toFixed(2)} BM</b> (${n ? 'paramagnetic' : 'diamagnetic'}).${qq && c ? ` In water: ${c}${d === 0 || d === 10 ? ' (no d-d transition possible)' : ''}.` : ''}${q > grp ? ` (${el} cannot lose more than ${grp} electrons; shown at +${grp}.)` : ''}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const { d, s, qq } = conf();
    const bw = Math.min(44, (w - 60) / 7), bh = bw * 0.9, y = h * 0.5, x0 = (w - bw * 6.6) / 2;
    const fill = []; for (let i = 0; i < 5; i++) fill.push(0);
    for (let e = 0; e < d; e++) fill[e % 5]++;
    const box = (x, label, k) => {
      ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x, y - bh / 2, bw, bh);
      const arrowUp = (ax, up) => {
        const t = y - bh * 0.32, b = y + bh * 0.32;
        ctx.strokeStyle = up ? col.s[0] : col.s[1]; ctx.lineWidth = 2.2; ctx.beginPath();
        if (up) { ctx.moveTo(ax, b); ctx.lineTo(ax, t); ctx.moveTo(ax - 4, t + 5); ctx.lineTo(ax, t); ctx.lineTo(ax + 4, t + 5); }
        else { ctx.moveTo(ax, t); ctx.lineTo(ax, b); ctx.moveTo(ax - 4, b - 5); ctx.lineTo(ax, b); ctx.lineTo(ax + 4, b - 5); }
        ctx.stroke();
      };
      if (k >= 1) arrowUp(x + bw * (k === 2 ? 0.33 : 0.5), true);
      if (k === 2) arrowUp(x + bw * 0.67, false);
      if (label) text(ctx, label, x + bw / 2, y + bh / 2 + 14, { color: col.muted, size: 11, align: 'center' });
    };
    for (let i = 0; i < 5; i++) box(x0 + i * bw, i === 2 ? '3d' : '', fill[i]);
    box(x0 + 5.6 * bw, '4s', s);
    const name = qq ? `${el}${SUP(qq)}⁺` : `${el}`;
    text(ctx, `${name}: 3d${SUP(d)}${s ? ' 4s' + SUP(s) : ''}`, 10, 16, { color: col.ink, size: 13, weight: 700 });
    text(ctx, 'Hund: fill singly first, then pair', w / 2, h - 12, { color: col.muted, size: 11, align: 'center' });
  };
  upd();
}
