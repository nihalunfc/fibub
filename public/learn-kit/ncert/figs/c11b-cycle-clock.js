// Class 11 Cell Cycle: the cell cycle as a clock. Interphase (G1, S, G2) is most of the cycle; M phase (mitosis + cytokinesis) is short. In a human cell cycle of about 24 hours, M lasts
// about 1 hour. DNA is copied only in S phase, so the DNA content doubles from 2C to 4C there and halves again at cell division. Press Play or drag the time slider.
import { canvas, text, title, row, slider, readout, loop, axes, line, dot } from '../../kit.js';

const PH = [['G1', 11, 0], ['S', 8, 1], ['G2', 4, 2], ['M', 1, 3]], TOT = 24;
const NOTE = { G1: 'G1: the cell grows and makes proteins and organelles; DNA is 2C. Cells that stop here enter G0 (nerve cells, liver cells).', S: 'S: DNA is replicated, so the amount rises from 2C to 4C. The number of chromosomes stays 2n (each now has 2 chromatids).', G2: 'G2: the cell checks its copied DNA and makes the proteins for division (such as tubulin for the spindle).', M: 'M: mitosis and cytokinesis. One cell with 4C DNA gives two cells with 2C each.' };
export default function (host) {
  let t = 3;
  const cv = canvas(host, { aspect: 1.05, max: 440, min: 300, label: 'A cell cycle clock with G1, S, G2 and M phases and a graph of DNA content over 24 hours' });
  const ctl = row(host), ro = readout(host);
  const sl = slider(ctl, { label: 'Time in the cycle', min: 0, max: TOT, step: 0.1, value: t, fmt: (v) => v.toFixed(1) + ' h', oninput: (v) => { t = v; go(); } });
  const anim = loop(host, (dt) => { t = (t + dt * 1.2) % TOT; sl.set(t); go(); }, { autoplay: false }); anim.button(ctl);
  const phase = (x) => { let a = 0; for (const [n, d] of PH) { if (x < a + d) return n; a += d; } return 'M'; };
  const dna = (x) => (x < 11 ? 2 : x < 19 ? 2 + 2 * (x - 11) / 8 : x < 23 ? 4 : 4);
  const go = () => { ro.textContent = `${t.toFixed(1)} h: ${NOTE[phase(t)]} DNA content now ${dna(t).toFixed(1)}C.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Cell cycle of 24 hours: 23 h interphase + 1 h M', col), cs = [col.s[0], col.s[2], col.s[3], col.s[4]];
    const R = Math.min(w * 0.22, 80), cx = w * 0.27, cy = t0 + 14 + R;
    let a = -Math.PI / 2; PH.forEach(([n, d], i) => { const b = a + d / TOT * Math.PI * 2; ctx.beginPath(); ctx.arc(cx, cy, R, a, b); ctx.arc(cx, cy, R * 0.55, b, a, true); ctx.closePath(); ctx.fillStyle = cs[i]; ctx.fill(); ctx.strokeStyle = col.panel; ctx.lineWidth = 2; ctx.stroke(); const m = (a + b) / 2; text(ctx, n, cx + Math.cos(m) * R * 0.78, cy + Math.sin(m) * R * 0.78, { color: col.panel, size: n === 'M' ? 9 : 12, weight: 700, align: 'center', fit: false }); a = b; });
    const an = -Math.PI / 2 + t / TOT * Math.PI * 2; ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(an) * R * 1.05, cy + Math.sin(an) * R * 1.05); ctx.stroke(); dot(ctx, cx, cy, 4, col.ink);
    text(ctx, phase(t), cx, cy + R + 14, { color: cs[PH.findIndex((p) => p[0] === phase(t))], size: 12, weight: 700, align: 'center', fit: false });
    const lx = w * 0.55; [['G1 (11 h)', 0], ['S (8 h)', 1], ['G2 (4 h)', 2], ['M (1 h)', 3]].forEach(([s, i]) => { ctx.fillStyle = cs[i]; ctx.fillRect(lx, cy - R + 8 + i * 22, 11, 11); text(ctx, s, lx + 17, cy - R + 14 + i * 22, { color: col.ink, size: 11, fit: false }); });
    text(ctx, 'interphase = G1 + S + G2', lx, cy - R + 14 + 4 * 22 + 6, { color: col.muted, size: 10.5, fit: false });
    const A = axes(ctx, w, h, col, { x: [0, TOT], y: [0, 5], xlabel: 'time (hours)', ylabel: 'DNA per cell (C)', l: 52, t: cy + R + 34, b: 40, xt: [0, 6, 12, 18, 24], yt: [0, 2, 4] });
    const p = []; for (let i = 0; i <= 96; i++) { const x = i / 4; p.push([A.X(x), A.Y(x >= 23.99 ? 2 : dna(x))]); } line(ctx, p, col.s[0], 2.6); dot(ctx, A.X(t), A.Y(dna(t)), 6, col.s[1], col.panel);
    text(ctx, 'S: DNA doubles', A.X(15), A.Y(3) + 16, { color: col.s[2], size: 10.5, weight: 700, align: 'center', fit: false });
  };
  go();
}
