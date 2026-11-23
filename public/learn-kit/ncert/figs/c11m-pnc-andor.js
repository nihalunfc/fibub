// Class 11 Maths, Permutations and Combinations: when to ADD and when to MULTIPLY.
// "Either this or that" (separate options for one job) add: 3 trains + 2 buses = 5 ways from Delhi to Agra.
// "This and then that" (two jobs one after the other) multiply: Delhi→Agra (5 ways) then Agra→Jaipur (4 ways) = 20.
import { canvas, row, slider, choice, readout, line, dot, text, title } from '../../kit.js';

export default function (host) {
  let mode = 'or', a = 3, b = 2, c = 4;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 270, label: 'Routes between cities showing when ways add and when they multiply' });
  const c1 = row(host), c2 = row(host), out = readout(host);
  choice(c1, 'the story', [['or', 'OR: one job, choose a type'], ['and', 'AND: two jobs in a row']], mode, (v) => { mode = v; re(); });
  slider(c2, { label: 'trains', min: 1, max: 5, step: 1, value: a, fmt: String, oninput: (v) => { a = v; re(); } });
  slider(c2, { label: 'buses', min: 1, max: 5, step: 1, value: b, fmt: String, oninput: (v) => { b = v; re(); } });
  slider(c2, { label: 'Agra to Jaipur', min: 1, max: 5, step: 1, value: c, fmt: String, oninput: (v) => { c = v; re(); } });
  const re = () => { cv.redraw(); out.innerHTML = mode === 'or' ? `Delhi to Agra by one of ${a} trains <b>or</b> ${b} buses: ${a} + ${b} = <b>${a + b}</b> ways. Different types never combine, so add.` : `Delhi to Agra (${a + b} ways) <b>and then</b> Agra to Jaipur (${c} ways): ${a + b} × ${c} = <b>${(a + b) * c}</b> trips. Each first leg can be followed by every second leg, so multiply.`; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, mode === 'or' ? 'OR: add the ways' : 'AND THEN: multiply the ways', col), y = top + (h - top) / 2, xd = 40, xa = mode === 'or' ? w - 40 : w / 2, xj = w - 40;
    const arcs = (x0, x1, k, color, off) => { for (let i = 0; i < k; i++) { const bend = (i - (k - 1) / 2) * 22 + off; ctx.beginPath(); ctx.moveTo(x0, y); ctx.quadraticCurveTo((x0 + x1) / 2, y + bend * 1.6, x1, y); ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke(); } };
    if (mode === 'or') { arcs(xd, xa, a, col.s[0], -24); arcs(xd, xa, b, col.s[1], 30); text(ctx, `${a} trains`, w / 2, y - 48, { color: col.s[0], size: 11.5, weight: 700, align: 'center' }); text(ctx, `${b} buses`, w / 2, y + 56, { color: col.s[1], size: 11.5, weight: 700, align: 'center' }); }
    else { arcs(xd, xa, a + b, col.s[0], 0); arcs(xa, xj, c, col.s[2], 0); text(ctx, `${a + b} way${a + b > 1 ? "s" : ""}`, (xd + xa) / 2, y - 52, { color: col.s[0], size: 11.5, weight: 700, align: 'center' }); text(ctx, `${c} way${c > 1 ? "s" : ""}`, (xa + xj) / 2, y - 52, { color: col.s[2], size: 11.5, weight: 700, align: 'center' }); dot(ctx, xj, y, 7, col.ink); text(ctx, 'Jaipur', xj, y + 22, { color: col.ink, size: 11, weight: 700, align: 'center' }); }
    dot(ctx, xd, y, 7, col.ink); dot(ctx, xa, y, 7, col.ink); text(ctx, 'Delhi', xd, y + 22, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, 'Agra', xa - (mode === 'or' ? 4 : 0), y + 22, { color: col.ink, size: 11, weight: 700, align: 'center' });
  };
  re();
}
