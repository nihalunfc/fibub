// Class 12 Biology, Human Reproduction: the female reproductive system (flat diagram) with the journey of the egg and, in the second mode, of sperm and a
// fertilised egg. Ovulation releases a secondary oocyte; the fimbriae sweep it into the fallopian tube; fertilisation happens in the ampulla;
// the embryo reaches the uterus after about 3 to 4 days and implants about day 7.
import { canvas, text, title, line, dot, row, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let mode = 'egg', t = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'The female reproductive system with the journey of an egg along the fallopian tube' });
  const ctl = row(host), ro = readout(host);
  const T = { egg: ['Ovary: the follicle ruptures and releases the secondary oocyte (ovulation)', 'Fimbriae sweep the egg into the fallopian tube', 'Ampulla: where fertilisation would take place (the egg lives about a day)', 'Isthmus: a narrow part leading to the uterus', 'Uterus: an unfertilised egg breaks down; the lining is shed'], fert: ['Ovulation: the egg enters the tube; sperm swim up from the vagina through the cervix and uterus', 'Ampulla: a sperm fuses with the egg (fertilisation); the zygote forms', 'Cleavage: the zygote divides while moving along the tube (about 3 to 4 days)', 'Morula then blastocyst reaches the uterus', 'Implantation in the uterine wall (endometrium), about day 7'] };
  choice(ctl, 'Show', [['egg', 'Egg only'], ['fert', 'Fertilised']], 'egg', (v) => { mode = v; t = 0; go(); });
  const go = () => { ro.textContent = T[mode][st()]; cv.redraw(); };
  const D = 11, prog = () => Math.min(1, (t % (D + 2)) / D), st = () => { const p = prog(); return Math.min(4, Math.floor(p * 5)); };
  let last = -1; loop(host, (dt) => { t += dt; if (st() !== last) { last = st(); ro.textContent = T[mode][last]; } cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, mode === "egg" ? "Where the egg goes" : "Fertilisation and implantation", col) + 6, cx = w / 2, u = Math.min(w / 290, (h - top) / 225), y0 = top + 20 * u;
    const E = (x, y, rx, ry, f) => { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7); ctx.fillStyle = f; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = col.ink; ctx.stroke(); };
    // uterus
    ctx.beginPath(); ctx.moveTo(cx - 40 * u, y0 + 20 * u); ctx.quadraticCurveTo(cx, y0 + 6 * u, cx + 40 * u, y0 + 20 * u); ctx.lineTo(cx + 12 * u, y0 + 130 * u); ctx.lineTo(cx - 12 * u, y0 + 130 * u); ctx.closePath(); ctx.fillStyle = col.s[5]; ctx.globalAlpha = 0.45; ctx.fill(); ctx.globalAlpha = 1; ctx.lineWidth = 2; ctx.strokeStyle = col.ink; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - 30 * u, y0 + 26 * u); ctx.quadraticCurveTo(cx, y0 + 16 * u, cx + 30 * u, y0 + 26 * u); ctx.lineTo(cx + 6 * u, y0 + 112 * u); ctx.lineTo(cx - 6 * u, y0 + 112 * u); ctx.closePath(); ctx.fillStyle = col.panel; ctx.fill(); ctx.lineWidth = 1; ctx.stroke();
    line(ctx, [[cx, y0 + 130 * u], [cx, y0 + 190 * u]], col.ink, 18 * u); line(ctx, [[cx, y0 + 130 * u], [cx, y0 + 190 * u]], col.panel, 12 * u);
    const OV = [[cx - 112 * u, y0 + 92 * u], [cx + 112 * u, y0 + 92 * u]];
    for (const [i, sg] of [-1, 1].entries()) {
      E(OV[i][0], OV[i][1], 24 * u, 17 * u, col.s[2]); dot(ctx, OV[i][0] - sg * 10 * u, OV[i][1] - 2 * u, 5 * u, col.panel, col.ink);
      const P = [[cx + sg * 32 * u, y0 + 28 * u], [cx + sg * 60 * u, y0 + 16 * u], [cx + sg * 90 * u, y0 + 24 * u], [cx + sg * 108 * u, y0 + 50 * u], [cx + sg * 108 * u, y0 + 74 * u]];
      line(ctx, P.slice(0, 3), col.s[0], 4 * u); line(ctx, P.slice(2), col.s[0], 9 * u);
      for (let k = -2; k <= 2; k++) line(ctx, [[cx + sg * 108 * u, y0 + 74 * u], [cx + sg * (108 + k * 6) * u, y0 + 76 * u + 10 * u]], col.s[0], 1.5);
    }
    const sg = -1, P = [[cx - 108 * u, y0 + 82 * u], [cx - 108 * u, y0 + 66 * u], [cx - 106 * u, y0 + 44 * u], [cx - 86 * u, y0 + 24 * u], [cx - 52 * u, y0 + 14 * u], [cx - 28 * u, y0 + 28 * u], [cx - 12 * u, y0 + 60 * u], [cx - 6 * u, y0 + 98 * u]];
    const pos = (p) => { const f = p * (P.length - 1), i = Math.min(P.length - 2, Math.floor(f)), g = f - i; return [P[i][0] + (P[i + 1][0] - P[i][0]) * g, P[i][1] + (P[i + 1][1] - P[i][1]) * g]; };
    const p = prog(), [ex, ey] = pos(p);
    if (mode === 'fert') { const sp = Math.min(1, p * 2.2); const S = [[cx, y0 + 190 * u], [cx, y0 + 130 * u], [cx - 20 * u, y0 + 50 * u], [cx - 52 * u, y0 + 14 * u], [cx - 80 * u, y0 + 20 * u]]; for (let k = 0; k < 4; k++) { const q = Math.max(0, Math.min(1, sp - k * 0.04)) * (S.length - 1), i = Math.min(S.length - 2, Math.floor(q)), g = q - i; if (p < 0.4) dot(ctx, S[i][0] + (S[i + 1][0] - S[i][0]) * g, S[i][1] + (S[i + 1][1] - S[i][1]) * g, 2.5, col.s[1]); } }
    const r = mode === 'fert' && p > 0.4 ? (p < 0.55 ? 6 : p < 0.7 ? 8 : 9) : 6; ctx.beginPath(); ctx.arc(ex, ey, r, 0, 7); ctx.fillStyle = mode === 'fert' && p > 0.4 ? col.s[3] : col.panel; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = col.ink; ctx.stroke();
    if (mode === 'fert' && p > 0.55) { ctx.beginPath(); ctx.moveTo(ex - r, ey); ctx.lineTo(ex + r, ey); ctx.lineWidth = 1; ctx.stroke(); if (p > 0.7) { ctx.beginPath(); ctx.moveTo(ex, ey - r); ctx.lineTo(ex, ey + r); ctx.stroke(); } }
    if (mode === 'fert' && p > 0.96) { ctx.beginPath(); ctx.arc(cx - 6 * u, y0 + 98 * u, 11, 0, 7); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2; ctx.stroke(); }
    const L = (s, x, y, al = 'left', c = col.ink) => text(ctx, s, x, y, { color: c, size: 10.5, weight: 600, align: al, halo: col.panel });
    L('ovary', cx - 112 * u, y0 + 120 * u, 'center'); L('fimbriae', cx - 112 * u, y0 + 138 * u, 'center', col.muted); L('ampulla', cx - 90 * u, y0 + 4 * u, 'center', col.s[0]); L('isthmus', cx - 22 * u, y0 + 4 * u, 'left', col.s[0]);
    L('uterus', cx + 46 * u, y0 + 70 * u); L('cervix', cx + 14 * u, y0 + 132 * u); L('vagina', cx + 16 * u, y0 + 164 * u); L('fallopian tube', cx + 112 * u, y0 + 20 * u, 'center', col.s[0]);
  };
  go();
}
