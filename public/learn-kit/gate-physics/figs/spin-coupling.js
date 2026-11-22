// 4.7 Spin and the addition of angular momenta. Coupling l and s = 1/2 to j = l ± 1/2: the vector model
// (L and S of lengths √(l(l+1)) and √(3)/2 add to J of length √(j(j+1)) on its cone at height m) and bars of the
// Clebsch-Gordan probabilities for m_s = +1/2 (with m_l = m − 1/2) and m_s = −1/2 (with m_l = m + 1/2).
import { canvas, line, text, row, choice, readout, fmt } from '../../kit.js';

const half = (x) => (Number.isInteger(x) ? String(x) : `${Math.round(2 * x)}/2`);

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 420, min: 290, label: 'Vector model of l plus s coupling with Clebsch-Gordan probabilities' });
  let l = 1, up = true, m = 0.5;
  const ctl = row(host), jrow = document.createElement('div'), mrow = document.createElement('div');
  const out = readout(host);
  const J = () => (up ? l + 0.5 : l - 0.5);
  const pUp = () => (up ? (l + m + 0.5) : (l - m + 0.5)) / (2 * l + 1);
  const build = () => {
    jrow.innerHTML = ''; mrow.innerHTML = '';
    const jo = [[true, half(l + 0.5)]]; if (l > 0) jo.push([false, half(l - 0.5)]);
    if (l === 0) up = true;
    choice(jrow, 'j', jo, up, (v) => { up = v; if (Math.abs(m) > J()) m = Math.sign(m) * J(); build(); show(); });
    const mo = []; for (let k = J(); k >= -J() - 1e-9; k--) mo.push([k, half(k)]);
    choice(mrow, 'm', mo, m, (v) => { m = v; show(); });
  };
  choice(ctl, 'l', [[0, '0 (s)'], [1, '1 (p)'], [2, '2 (d)'], [3, '3 (f)']], l, (v) => { l = v; if (Math.abs(m) > l + 0.5) m = Math.sign(m) * (l + 0.5); build(); show(); });
  ctl.append(jrow, mrow);
  const show = () => {
    const j = J(), p = pUp(), ls = (j * (j + 1) - l * (l + 1) - 0.75) / 2;
    out.innerHTML = `|j = ${half(j)}, m = ${half(m)}⟩ = ${p > 0 ? `√${fmt(p, 3)} |m<sub>l</sub> = ${half(m - 0.5)}, ↑⟩` : ''}${p > 0 && p < 1 ? ' ' + (up ? '+' : '−') + ' ' : ''}${p < 1 ? `√${fmt(1 - p, 3)} |m<sub>l</sub> = ${half(m + 0.5)}, ↓⟩` : ''}. ` +
      `⟨S<sub>z</sub>⟩ = ${fmt(p - 0.5, 3)}ħ, ⟨L<sub>z</sub>⟩ = ${fmt(m - p + 0.5, 3)}ħ, L·S = ${fmt(ls, 3)}ħ².`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const j = J(), Lm = Math.sqrt(l * (l + 1)), Sm = Math.sqrt(0.75), Jm = Math.sqrt(j * (j + 1));
    const split = w > 520 ? w * 0.6 : w * 0.58;
    const cx = split * 0.5, cy = h * 0.58, s = Math.min(split * 0.42, h * 0.45) / 4;
    line(ctx, [[cx, cy + 4.2 * s], [cx, cy - 4.2 * s]], col.muted, 1.2);
    text(ctx, 'z', cx + 6, cy - 4.1 * s, { color: col.muted, size: 12, weight: 700 });
    // J on its cone at height m
    const jx = Math.sqrt(Math.max(0, Jm * Jm - m * m)), Jt = [cx + jx * s, cy - m * s];
    ctx.save(); ctx.strokeStyle = col.line; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.ellipse(cx, cy - m * s, jx * s, Math.max(2, jx * s * 0.2), 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
    // L from origin, S from the tip of L to the tip of J (triangle with sides Lm, Sm, Jm)
    const ang = Math.atan2(-(Jt[1] - cy), Jt[0] - cx);
    const cosA = (Lm * Lm + Jm * Jm - Sm * Sm) / (2 * Lm * Jm || 1), A = Math.acos(Math.max(-1, Math.min(1, cosA)));
    const la = ang + (up ? A : -A);
    const Lt = l ? [cx + Lm * s * Math.cos(la), cy - Lm * s * Math.sin(la)] : [cx, cy];
    if (l) { line(ctx, [[cx, cy], Lt], col.s[0], 3); text(ctx, 'L', (cx + Lt[0]) / 2 - 14, (cy + Lt[1]) / 2, { color: col.s[0], size: 13, weight: 700 }); }
    line(ctx, [Lt, Jt], col.s[1], 3);
    text(ctx, 'S', (Lt[0] + Jt[0]) / 2 + 6, (Lt[1] + Jt[1]) / 2 - 6, { color: col.s[1], size: 13, weight: 700 });
    line(ctx, [[cx, cy], Jt], col.ink, 2.2, [6, 4]);
    text(ctx, 'J', Jt[0] + 6, Jt[1], { color: col.ink, size: 13, weight: 700 });
    text(ctx, `|L| = ${fmt(Lm, 3)}, |S| = ${fmt(Sm, 3)}, |J| = ${fmt(Jm, 3)} (ħ)`, 10, h - 14, { color: col.muted, size: 11 });
    // CG bars
    const bx = split + 20, bw = Math.max(30, (w - bx - 24) / 2 - 10), top = 40, bot = h - 46, p = pUp();
    [[p, `m_s = +½`, col.s[1]], [1 - p, `m_s = −½`, col.s[2]]].forEach(([v, lab, c], i) => {
      const x = bx + i * (bw + 14), y = bot - v * (bot - top);
      ctx.fillStyle = c; ctx.globalAlpha = 0.75; ctx.fillRect(x, y, bw, bot - y); ctx.globalAlpha = 1;
      ctx.strokeStyle = col.line; ctx.strokeRect(x, top, bw, bot - top);
      text(ctx, fmt(v, 3), x + bw / 2, y - 10, { color: col.ink, size: 12, weight: 700, align: 'center' });
      text(ctx, lab, x + bw / 2, bot + 14, { color: col.muted, size: 11, align: 'center' });
    });
    text(ctx, 'Clebsch-Gordan probabilities', bx, 24, { color: col.ink, size: 12, weight: 600 });
  };
  build(); show();
}
