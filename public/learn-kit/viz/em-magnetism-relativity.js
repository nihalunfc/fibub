// Magnetism as relativistic electricity. A wire has fixed positive ions and moving electrons, equally spaced in the lab, so it
// is neutral. A positive test charge moves along with the electrons (top strip = lab frame). In the test charge's own frame
// (bottom strip) the electrons are at rest and spread out, while the ions are moving and bunched up by length contraction:
// the wire is positively charged, and the test charge is repelled electrically. In the lab the same push is the magnetic force.
// The drift is exaggerated: real drift is ~10⁻⁴ m/s, β ~ 10⁻¹³, but that tiny effect times 10²³ charges is the whole of magnetism.
import { canvas, text, row, slider, readout, loop, dot, arrow } from '../kit.js';

export default function (host) {
  let b = 0.5, t = 0;
  const cv = canvas(host, { aspect: 0.85, max: 380, min: 310, label: 'A wire seen in the lab frame and in the frame of a moving test charge' });
  const ctl = row(host);
  slider(ctl, { label: 'Electron speed β', min: 0.05, max: 0.9, value: b, step: 0.01, fmt: (x) => x.toFixed(2) + ' c', oninput: (x) => { b = x; upd(); } });
  const out = readout(host);
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); }); anim.button(ctl);
  const g = () => 1 / Math.sqrt(1 - b * b);
  function upd() { const G = g(); out.innerHTML = `γ = ${G.toFixed(3)}. Lab: ion spacing = electron spacing = d, so the wire is neutral. Electron frame: electrons are ${G.toFixed(2)}× farther apart (spacing γd), ions are ${G.toFixed(2)}× closer (d/γ). Net charge per length = (e/d)(γ − 1/γ) = <b>(e/d)·γβ² = ${(G * b * b).toFixed(3)} e/d</b>, positive: the test charge is repelled. For small β this is (e/d)β², i.e. magnetic force ∝ v·B, with no new law needed.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const G = g(), d = 26, y1 = 112, y2 = 262, cxq = w * 0.66;
    const strip = (y, ions, els, label) => { ctx.fillStyle = col.soft; ctx.fillRect(0, y - 14, w, 28); text(ctx, label, 8, y - 80, { color: col.ink, size: 11.5, weight: 700 });
      ions.forEach((x) => { dot(ctx, x, y, 6, col.s[5], col.panel); text(ctx, '+', x, y, { color: '#fff', size: 9, weight: 700, align: 'center' }); }); els.forEach((x) => { dot(ctx, x, y, 3.5, col.s[0]); }); };
    const row1 = (dx, sp0, n) => Array.from({ length: n }, (_, i) => dx + i * sp0).filter((x) => x > 2 && x < w - 2);
    const sh = (t * 40 * b) % d;
    strip(y1, row1(d / 2, d, 40), row1(d / 2 + d / 2 - sh + 0, d, 40).concat(row1(d / 2 + d / 2 - sh - d, d, 1)), 'Lab frame: neutral wire, electrons move left');
    dot(ctx, cxq, y1 - 40, 7, col.s[1], col.panel); arrow(ctx, cxq, y1 - 47, cxq, y1 - 72, col.s[2], 2.4, 7); arrow(ctx, cxq - 10, y1 - 40, cxq - 34, y1 - 40, col.s[1], 2, 6);
    text(ctx, 'v', cxq - 38, y1 - 40, { color: col.s[1], size: 11, weight: 700, align: 'right' }); text(ctx, 'magnetic force', cxq + 8, y1 - 62, { color: col.s[2], size: 10.5, weight: 700 }); text(ctx, 'test charge +', cxq + 12, y1 - 38, { color: col.s[1], size: 10.5, weight: 700 });
    const sh2 = (t * 40 * b) % (d / G);
    strip(y2, row1(sh2, d / G, 100), row1(d / 2, d * G, 40), 'Test-charge frame: electrons at rest, ions rush past');
    dot(ctx, cxq, y2 - 40, 7, col.s[1], col.panel); arrow(ctx, cxq, y2 - 47, cxq, y2 - 72, col.s[2], 2.4, 7); text(ctx, 'electric force', cxq + 8, y2 - 62, { color: col.s[2], size: 10.5, weight: 700 }); text(ctx, 'test charge + (at rest)', cxq + 12, y2 - 38, { color: col.s[1], size: 10.5, weight: 700 });
    text(ctx, `net charge density in this frame = ${(G * b * b).toFixed(2)} e/d (positive)`, 10, h - 12, { color: col.ink, size: 11.5, weight: 700 });
  };
  upd();
}
