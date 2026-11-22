// Class 12 Chemistry, d- and f-block: oxidation states of the 3d series Sc to Zn. Filled dots are the common (stable) states, open dots the less common ones.
// The 3d and 4s electrons have similar energy, so a transition metal can use different numbers of them; the states differ by 1 (unlike p-block elements, which differ by 2).
// The highest state rises to +7 at Mn (all 3d and 4s electrons used) and then falls, since the d electrons are held more tightly.
import { canvas, text, title, axes, dot, row, slider, choice, readout } from '../../kit.js';

const D = [['Sc', [3], []], ['Ti', [4, 3], [2]], ['V', [5, 4, 3, 2], []], ['Cr', [6, 3], [2, 4, 5]], ['Mn', [7, 4, 2], [3, 5, 6]], ['Fe', [3, 2], [4, 5, 6]], ['Co', [3, 2], [4]], ['Ni', [2], [3, 4]], ['Cu', [2, 1], [3]], ['Zn', [2], []]];

export default function (host) {
  let k = 4, only = false;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'Oxidation states of the elements scandium to zinc' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'element', min: 0, max: 9, step: 1, value: k, fmt: (v) => D[v][0], oninput: (v) => { k = v; go(); } });
  choice(ctl, 'show', [[false, 'all states'], [true, 'common only']], false, (v) => { only = v; go(); });
  const go = () => {
    const [n, c, r] = D[k], all = [...c, ...r].sort((a, b) => a - b);
    ro.textContent = `${n}: common ${c.slice().sort((a, b) => a - b).map((x) => '+' + x).join(', ')}` + (r.length ? `; less common ${r.sort((a, b) => a - b).map((x) => '+' + x).join(', ')}` : '') + `. ${all.length} state${all.length > 1 ? 's' : ''}, from +${all[0]} to +${all[all.length - 1]}.`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Oxidation states, 3d series', col);
    const A = axes(ctx, w, h, col, { x: [-0.5, 9.5], y: [0.5, 7.5], xt: [], yt: [1, 2, 3, 4, 5, 6, 7], fy: (v) => '+' + v, ylabel: 'oxidation state', l: 44, t: 34, b: 30 });
    ctx.fillStyle = col.soft; ctx.globalAlpha = 0.7; ctx.fillRect(A.X(k - 0.5), A.T, A.X(k + 0.5) - A.X(k - 0.5), A.B - A.T); ctx.globalAlpha = 1;
    D.forEach(([n, c, r], i) => {
      text(ctx, n, A.X(i), A.B + 14, { color: i === k ? col.ink : col.muted, size: 11.5, weight: i === k ? 700 : 400, align: 'center' });
      c.forEach((s) => dot(ctx, A.X(i), A.Y(s), 6, i === k ? col.s[0] : col.s[2], col.panel));
      if (!only) r.forEach((s) => { ctx.strokeStyle = col.s[2]; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.arc(A.X(i), A.Y(s), 5.5, 0, 7); ctx.stroke(); });
    });
  };
  go();
}
