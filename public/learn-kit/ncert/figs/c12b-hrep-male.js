// Class 12 Biology, Human Reproduction: the male reproductive system as a flat diagram, with the sperm's route animated.
// Seminiferous tubules (sperm made) -> epididymis (matured and stored) -> vas deferens -> ejaculatory duct (joined by the seminal vesicle's duct)
// -> urethra, with secretions from the seminal vesicles, prostate and bulbourethral glands. Choose the route or the glands.
import { canvas, text, title, line, dot, row, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let mode = 'route', t = 0;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 340, label: 'The male reproductive system with a moving sperm marked along its route, and the glands highlighted' });
  const ctl = row(host), ro = readout(host);
  const STAGES = ['Seminiferous tubules of the testis: sperm are made here', 'Epididymis: sperm mature and are stored', 'Vas deferens: carries sperm up towards the bladder', 'Ejaculatory duct: seminal vesicle fluid joins the sperm', 'Urethra: prostate and bulbourethral secretions join; semen leaves through the penis'];
  const GL = { gl: 'Glands add the fluid part of semen (the seminal plasma): seminal vesicles (fructose, as energy for sperm), prostate (alkaline milky fluid) and bulbourethral glands (mucus that lubricates). Sperm are only a small part of semen.' };
  choice(ctl, 'Show', [['route', 'Sperm route'], ['gl', 'Glands']], 'route', (v) => { mode = v; go(); });
  const go = () => { ro.textContent = mode === 'gl' ? GL.gl : STAGES[stage()]; cv.redraw(); };
  const prog = () => (t * 0.12) % 1, stage = () => { const p = prog(); return p < 0.15 ? 0 : p < 0.3 ? 1 : p < 0.62 ? 2 : p < 0.72 ? 3 : 4; };
  let last = -1; loop(host, (dt) => { t += dt; if (mode === 'route' && stage() !== last) { last = stage(); ro.textContent = STAGES[last]; } cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, mode === 'route' ? 'Route of sperm' : 'Accessory glands', col) + 10, cx = w / 2, u = Math.min(w / 380, (h - top) / 330), y1 = top + 34 * u, y2 = top + 96 * u, y3 = h - 14 * u, ty = h - 80 * u;
    const E = (x, y, rx, ry, f, a = 1) => { ctx.globalAlpha = a; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7); ctx.fillStyle = f; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = col.ink; ctx.stroke(); ctx.globalAlpha = 1; };
    const gl = mode === 'gl', A = (k) => (gl && !k ? 0.25 : 1);
    // bladder, urethra
    ctx.globalAlpha = A(0); E(cx, y1, 30 * u, 26 * u, col.soft); line(ctx, [[cx, y1 + 26 * u], [cx, y3]], col.s[0], 7 * u); ctx.globalAlpha = 1;
    text(ctx, 'urinary bladder', cx + 34 * u, y1 - 18 * u, { color: col.muted, size: 10, halo: col.panel }); text(ctx, 'urethra → penis', cx + 8 * u, y3 - 10 * u, { color: col.muted, size: 10, halo: col.panel });
    // glands
    E(cx, y2 + 8 * u, 24 * u, 17 * u, col.s[3], A(1)); for (const sg of [-1, 1]) { E(cx + sg * 40 * u, y1 + 34 * u, 15 * u, 25 * u, col.s[4], A(1)); E(cx + sg * 12 * u, y2 + 70 * u, 6 * u, 6 * u, col.s[5], A(1)); }
    // testes, epididymis, vas deferens
    for (const sg of [-1, 1]) {
      const tx = cx + sg * 72 * u; E(tx, ty, 26 * u, 40 * u, col.s[2], A(0)); ctx.globalAlpha = A(0);
      ctx.beginPath(); ctx.ellipse(tx + sg * 8 * u, ty - 6 * u, 12 * u, 36 * u, 0, -1.6, 1.6, sg < 0); ctx.lineWidth = 4 * u; ctx.strokeStyle = col.s[7]; ctx.stroke();
      line(ctx, [[tx + sg * 4 * u, ty - 40 * u], [cx + sg * 66 * u, y1 + 2 * u], [cx + sg * 46 * u, y1 - 26 * u], [cx + sg * 26 * u, y1 - 6 * u], [cx + sg * 14 * u, y2 - 2 * u], [cx, y2 + 6 * u]], col.s[1], 3 * u);
      ctx.globalAlpha = 1;
    }
    const L = (s, x, y, al = 'left', c = col.ink) => text(ctx, s, x, y, { color: c, size: 10.5, weight: 600, align: al, halo: col.panel });
    L('testis', cx - 110 * u, ty + 36 * u, 'center'); L('epididymis', cx - 72 * u + 36 * u, ty + 54 * u, 'center', col.s[7]); L('vas deferens', cx - 66 * u, y1 + 2 * u, 'right', col.s[1]); L('scrotum holds the testes outside the body (cooler)', cx, h - 6, 'center', col.muted);
    L('seminal vesicle', cx + 56 * u, y1 + 44 * u, 'left', col.s[4]); L('prostate', cx + 28 * u, y2 + 18 * u, 'left', col.s[3]); L('bulbourethral gland', cx + 20 * u, y2 + 70 * u, 'left', col.s[5]);
    if (mode === 'route') {
      const P = [[cx - 72 * u, ty], [cx - 80 * u, ty - 40 * u], [cx - 66 * u, y1 + 2 * u], [cx - 46 * u, y1 - 26 * u], [cx - 26 * u, y1 - 6 * u], [cx - 14 * u, y2 - 2 * u], [cx, y2 + 6 * u], [cx, y3]];
      const lens = []; let tot = 0; for (let i = 1; i < P.length; i++) { tot += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); lens.push(tot); }
      for (let k = 0; k < 4; k++) { const d = ((prog() + k * 0.012) % 1) * tot; let i = lens.findIndex((l) => l >= d); if (i < 0) i = lens.length - 1; const a = i ? lens[i - 1] : 0, f = (d - a) / (lens[i] - a || 1); dot(ctx, P[i][0] + (P[i + 1 > P.length - 1 ? P.length - 1 : i + 1][0] - P[i][0]) * 0, P[i][1], 0, col.ink); const q0 = P[i], q1 = P[i + 1] ?? P[i]; dot(ctx, q0[0] + (q1[0] - q0[0]) * f, q0[1] + (q1[1] - q0[1]) * f, 3.5, col.s[3], col.ink); }
    }
  };
  go();
}
