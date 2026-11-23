// Class 11 Chemistry, Some Basic Concepts: classification of matter. Pick a sample and the tree lights up its path:
// matter -> pure substance or mixture -> element or compound / homogeneous or heterogeneous.
import { canvas, text, title, row, choice, readout, line } from '../../kit.js';

const SAMPLES = { iron: ['iron', ['pure', 'element'], 'one kind of atom only'], water: ['water', ['pure', 'compound'], 'H and O joined in a fixed 2:1 ratio'], brine: ['salt water', ['mix', 'homo'], 'looks the same everywhere, parts can change in amount'], air: ['air', ['mix', 'homo'], 'a gas solution of N₂, O₂, Ar and others'], soil: ['muddy water', ['mix', 'hetero'], 'you can see the parts and they are not uniform'], sugar: ['sugar', ['pure', 'compound'], 'C, H and O in a fixed ratio'] };
export default function (host) {
  let k = 'iron';
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'A classification tree of matter with the path of the chosen sample highlighted' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'sample', Object.entries(SAMPLES).map(([a, b]) => [a, b[0]]), k, (v) => { k = v; go(); });
  const go = () => { const s = SAMPLES[k]; ro.textContent = `${s[0]}: ${s[2]}.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const p = SAMPLES[k][1], t0 = title(ctx, 'where does it sit?', col) + 14, X = (f) => f * w;
    const N = { m: [0.5, t0], pure: [0.25, t0 + 70, 'pure substance', 'pure'], mix: [0.75, t0 + 70, 'mixture', 'mix'], element: [0.12, t0 + 150, 'element'], compound: [0.38, t0 + 150, 'compound'], homo: [0.62, t0 + 150, 'homogeneous'], hetero: [0.88, t0 + 150, 'heterogeneous'] };
    const on = new Set(['m', ...p]), edges = [['m', 'pure'], ['m', 'mix'], ['pure', 'element'], ['pure', 'compound'], ['mix', 'homo'], ['mix', 'hetero']];
    edges.forEach(([a, b]) => { const hot = on.has(a) && on.has(b); line(ctx, [[X(N[a][0]), N[a][1] + 14], [X(N[b][0]), N[b][1] - 14]], hot ? col.s[2] : col.line, hot ? 3 : 1.5); });
    Object.entries(N).forEach(([id, n]) => { const lab = id === 'm' ? 'matter' : n[2], hot = on.has(id), bw = Math.min(96, w * 0.23); ctx.fillStyle = hot ? col.s[2] : col.panel; ctx.globalAlpha = hot ? 0.9 : 1; ctx.fillRect(X(n[0]) - bw / 2, n[1] - 14, bw, 28); ctx.globalAlpha = 1; ctx.strokeStyle = hot ? col.s[2] : col.line; ctx.strokeRect(X(n[0]) - bw / 2, n[1] - 14, bw, 28); text(ctx, lab, X(n[0]), n[1], { color: hot ? '#fff' : col.ink, size: w < 340 ? 9.5 : 10.5, weight: 700, align: 'center' }); });
    const hint = { element: 'cannot be split by chemical methods', compound: 'splits chemically into elements', homo: 'one phase, uniform', hetero: 'visible parts' };
    text(ctx, hint[p[1]], w / 2, h - 36, { color: col.s[2], size: 12, weight: 700, align: 'center' });
    text(ctx, p[0] === 'pure' ? 'separation needs a chemical change' : 'separation needs only physical methods', w / 2, h - 16, { color: col.muted, size: 11, align: 'center' });
  };
  go();
}
