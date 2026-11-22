// Primary and secondary immune responses. The first meeting with an antigen (infection or vaccine) is slow and gives a modest
// antibody level (mostly IgM, then IgG); memory B and T cells are left behind. A second dose or exposure is faster, bigger and
// lasts longer. Slide the day of the booster and notice how memory fades if you wait very long. (Schematic, log scale.)
import { canvas, loop, row, slider, choice, readout, axes, line, text, title } from '../kit.js';

export default function (host) {
  let gap = 28, kind = 'vaccine', t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 360, min: 290, label: 'Antibody level after a first and a second exposure to an antigen' });
  const ctl = row(host);
  slider(ctl, { label: 'Second dose on day', min: 14, max: 180, step: 1, value: gap, fmt: (v) => `${v}`, oninput: (v) => { gap = v; show(); } });
  choice(ctl, 'Exposure', [['vaccine', 'Vaccine (safe antigen)'], ['inf', 'Infection']], kind, (v) => { kind = v; show(); });
  loop(host, (dt) => { t = (t + dt * 22) % 220; cv.redraw(); }).button(ctl);
  const out = readout(host);
  const mem = () => Math.exp(-gap / 500) , amp1 = () => (kind === 'vaccine' ? 1 : 3);
  const level = (d) => { const r = (x, lag, peak, dec) => (x < lag ? 0 : (1 - Math.exp(-(x - lag) / 3.5)) * Math.exp(-Math.max(0, x - lag - peak) / dec)); let v = 0.3 + amp1() * 40 * r(d, 6, 10, 60); if (d > gap) v += 40 * 60 * mem() * r(d - gap, 1.5, 7, 150) * amp1() ** 0.5; return v; };
  const show = () => { out.innerHTML = `First exposure peaks at about day 14 to 20 with a level of <b>${Math.max(...Array.from({ length: gap + 1 }, (_, d) => level(d))).toFixed(0)}</b> (arbitrary units). Second dose on day <b>${gap}</b> gives a peak near <b>${Math.max(...Array.from({ length: 220 }, (_, d) => level(d))).toFixed(0)}</b>, about ${(Math.max(...Array.from({ length: 220 }, (_, d) => level(d))) / Math.max(...Array.from({ length: gap + 1 }, (_, d) => level(d)))).toFixed(0)} times higher, and it appears in 2 to 3 days instead of about a week. Memory cells make boosters work.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Antibody level in blood', col);
    const A = axes(ctx, w, h, col, { x: [0, 220], y: [0.1, 5000], ylog: true, yt: [1, 10, 100, 1000], xt: [0, 50, 100, 150, 200], l: 44, t: 34, b: 38, xlabel: 'Day', ylabel: 'Antibody (log)' });
    const pts = Array.from({ length: 221 }, (_, d) => [A.X(d), A.Y(Math.max(0.1, level(d)))]);
    line(ctx, pts.slice(0, gap + 1), col.s[0], 2.5); line(ctx, pts.slice(gap), col.s[5], 2.5);
    [0, gap].forEach((d, i) => { ctx.strokeStyle = col.muted; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(A.X(d), A.T); ctx.lineTo(A.X(d), A.B); ctx.stroke(); ctx.setLineDash([]); text(ctx, i ? '2nd dose' : '1st dose', A.X(d) + 3, A.T + 8, { color: col.ink, size: 10, weight: 700, fit: false }); });
    ctx.fillStyle = col.ink; ctx.beginPath(); ctx.arc(A.X(t), A.Y(Math.max(0.1, level(t))), 4.5, 0, 7); ctx.fill();
    text(ctx, 'primary: slow, lower', A.X(gap * 0.4), A.Y(level(14)) - 12, { color: col.s[0], size: 10.5, weight: 700, align: 'center', fit: false });
    text(ctx, 'secondary: fast, much higher', A.X(Math.min(190, gap + 60)), A.T + 30, { color: col.s[5], size: 10.5, weight: 700, align: 'center', fit: true });
  };
  show();
}
