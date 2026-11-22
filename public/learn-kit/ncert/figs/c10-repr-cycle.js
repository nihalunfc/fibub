// Class 10 How do Organisms Reproduce?: the monthly cycle in the human female (about 28 days, it varies from person to
// person). Days 1-5: the thick uterus lining breaks down and leaves as the period (menstruation). Days 6-14: an egg ripens
// in the ovary and the lining rebuilds. About day 14: ovulation (egg released). Days 15-28: lining stays thick, ready for an
// embryo. If the egg is not fertilised the lining is shed again; if it is fertilised, the embryo implants and the cycle pauses.
import { canvas, text, title, line, dot, row, slider, choice, readout, clamp } from '../../kit.js';

export default function (host) {
  let day = 1, preg = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'The monthly cycle: ovary, egg release, uterus lining thickness by day' });
  const ctl = row(host);
  slider(ctl, { label: 'Day', min: 1, max: 40, step: 1, value: 1, fmt: (v) => String(v), oninput: (v) => { day = Math.round(v); say(); } });
  choice(ctl, 'If the egg meets a sperm', [[0, 'No fertilisation'], [1, 'Fertilisation']], 0, (v) => { preg = v; say(); });
  const out = readout(host);
  const L = (d) => { if (preg && d > 14) return Math.min(1, 0.68 + (d - 14) * 0.08); const x = ((d - 1) % 28) + 1; return x <= 5 ? 0.98 - (x - 1) / 4 * 0.83 : x <= 14 ? 0.15 + (x - 5) / 9 * 0.53 : 0.68 + (x - 14) / 14 * 0.3; };
  function phase() { if (preg && day > 14) return day < 21 ? 'The fertilised egg divides as it travels down the oviduct and implants in the thick lining, about 6 to 8 days after ovulation. The lining now stays and there is no period.' : 'Pregnancy has begun. The lining stays thick and becomes part of the placenta, so the monthly period stops.'; const x = ((day - 1) % 28) + 1; return x <= 5 ? 'Menstruation: the unused lining and blood leave through the vagina (the period). This is normal and healthy.' : x < 13 ? 'An egg ripens in a follicle of the ovary while the lining of the uterus builds up again.' : x <= 15 ? 'Ovulation, around day 14: the ripe egg is released into the oviduct. It can be fertilised for about a day.' : 'The lining stays thick and rich in blood vessels, ready to nourish an embryo. If no fertilisation happens, it will be shed again.'; }
  function say() { out.textContent = `Day ${day}. ${phase()}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'The monthly cycle', col) + 8, gx = 30, gy = top + 8, gw = w - gx - 14, gh = (h - top) * 0.38, x = (d) => gx + (d - 1) / 39 * gw, y = (v) => gy + gh - v * gh;
    line(ctx, [[gx, gy], [gx, gy + gh], [gx + gw, gy + gh]], col.line, 1.5);
    text(ctx, 'lining', gx - 4, gy - 6, { color: col.muted, size: 9.5 }); text(ctx, 'day of the cycle', gx + gw / 2, gy + gh + 24, { color: col.muted, size: 9.5, align: 'center' });
    [1, 14, 28, 40].forEach((d) => text(ctx, String(d), x(d), gy + gh + 12, { color: col.muted, size: 9.5, align: 'center' }));
    const pts = []; for (let d = 1; d <= 40; d += 0.5) pts.push([x(d), y(clamp(L(d), 0, 1.05))]);
    line(ctx, pts, col.s[4], 2.5); line(ctx, [[x(14), gy], [x(14), gy + gh]], col.muted, 1, [3, 3]); text(ctx, 'egg released', x(14), gy + 8, { color: col.muted, size: 9.5, align: 'center', halo: col.panel });
    dot(ctx, x(day), y(clamp(L(day), 0, 1.05)), 5, col.s[7], col.ink);
    // picture: ovary + uterus
    const py = gy + gh + 40, ph = h - py - 22, ox = w * 0.22, ux = w * 0.62, cy = py + ph / 2;
    ctx.beginPath(); ctx.ellipse(ox, cy, 34, 24, 0, 0, 7); ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.35; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.8; ctx.stroke(); text(ctx, 'ovary', ox, cy + 38, { color: col.muted, size: 10, align: 'center' });
    const x1 = ((day - 1) % 28) + 1, fol = preg && day > 14 ? 0 : x1 <= 13 ? x1 / 13 : 0, egg = !(preg && day > 14) && x1 >= 14 && x1 <= 15;
    if (fol > 0) { dot(ctx, ox - 6, cy - 4, 4 + 9 * fol, col.panel, col.ink); dot(ctx, ox - 6, cy - 4, 2 + 2 * fol, col.s[3]); }
    if (egg) { dot(ctx, ox + 44 + (x1 - 14) * 20, cy - 10, 5, col.s[3], col.ink); }
    const th = 6 + 30 * clamp(L(day), 0, 1.05); ctx.beginPath(); ctx.roundRect(ux - 48, cy - 34, 96, 68, 20); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = col.s[4]; ctx.globalAlpha = 0.6; ctx.beginPath(); ctx.roundRect(ux - 44, cy + 30 - th, 88, th, 6); ctx.fill(); ctx.globalAlpha = 1;
    if (!(preg && day > 14) && x1 <= 5) for (let i = 0; i < 5; i++) dot(ctx, ux - 30 + i * 15, cy + 36 + ((i * 7 + day * 3) % 10), 2.4, col.s[7]);
    if (preg && day >= 20) dot(ctx, ux, cy + 30 - th + 3, 6, col.panel, col.ink);
    text(ctx, preg && day >= 20 ? 'uterus with embryo' : 'uterus (lining)', ux, cy + 52, { color: col.muted, size: 10, align: 'center' });
  };
  say();
}
