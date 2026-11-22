// Class 9 Sound: v = f x lambda. When a sound goes from one medium to another its speed changes but its frequency
// (set by the source) does not, so the wavelength must change: lambda = v / f. Speeds used (about 25 C and 20 C):
// air 343 m/s, water 1480 m/s, steel 5000 m/s. The wave on top always shows exactly 4 wavelengths; the bars show how
// long one wavelength really is in each medium for the same note.
import { canvas, text, title, line, arrow, row, slider, choice, loop, readout } from '../../kit.js';

const MED = { air: ['Air', 343], water: ['Water', 1480], steel: ['Steel', 5000] };
export default function (host) {
  let f = 500, med = 'air', t = 0;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 320, label: 'A wave whose wavelength equals speed divided by frequency in air, water and steel' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const ctl = row(host);
  choice(ctl, 'Medium', [['air', 'Air'], ['water', 'Water'], ['steel', 'Steel']], med, (v) => { med = v; upd(); });
  slider(ctl, { label: 'Frequency', min: 100, max: 2000, step: 50, value: f, fmt: (v) => `${v} Hz`, oninput: (v) => { f = v; upd(); } });
  const out = readout(host);
  function upd() {
    const v = MED[med][1];
    out.innerHTML = `In ${MED[med][0].toLowerCase()}: λ = v ÷ f = ${v} ÷ ${f} = <b>${(v / f).toFixed(2)} m</b>. Switch the medium and watch the frequency stay put while the wavelength changes: v = f × λ.`; cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Speed = frequency × wavelength', col);
    const v = MED[med][1], lam = v / f, x0 = 14, L = w - 28, cy = h * 0.27, amp = h * 0.1;
    line(ctx, [[x0, cy], [x0 + L, cy]], col.line, 1);
    const pts = []; for (let i = 0; i <= L; i += 2) pts.push([x0 + i, cy - amp * Math.sin(2 * Math.PI * 4 * i / L - t * 5)]);
    line(ctx, pts, col.s[2], 2.6);
    const ya = cy + amp + 16, lw = L / 4;
    arrow(ctx, x0, ya, x0 + lw, ya, col.s[3], 1.5, 6); arrow(ctx, x0 + lw, ya, x0, ya, col.s[3], 1.5, 6);
    text(ctx, `λ = ${lam.toFixed(2)} m`, x0 + lw + 8, ya, { color: col.s[3], size: 11, weight: 700 });
    text(ctx, `f = ${f} Hz (same in every medium)`, x0 + L, cy - amp - 10, { color: col.ink, size: 10.5, align: 'right' });
    // bars
    const by = h * 0.55, bh = 18, gap = 34, maxL = 5000 / f;
    text(ctx, `Wavelength of a ${f} Hz note`, x0, by - 12, { color: col.ink, size: 11, weight: 700 });
    Object.entries(MED).forEach(([k, [nm, sp]], i) => {
      const y = by + i * gap, ln = sp / f, on = k === med;
      text(ctx, nm, x0, y + bh / 2 + 1, { color: on ? col.ink : col.muted, size: 10.5, weight: on ? 700 : 400 });
      const bx = x0 + 44, bw = (L - 44) * ln / maxL;
      ctx.fillStyle = on ? col.s[3] : col.soft; ctx.fillRect(bx, y, Math.max(2, bw), bh);
      text(ctx, `${ln.toFixed(2)} m`, bx + Math.max(2, bw) + 5 > x0 + L - 46 ? bx + bw - 5 : bx + Math.max(2, bw) + 5, y + bh / 2 + 1, { color: bx + Math.max(2, bw) + 5 > x0 + L - 46 ? '#fff' : col.ink, size: 10.5, align: bx + Math.max(2, bw) + 5 > x0 + L - 46 ? 'right' : 'left' });
    });
    text(ctx, `Speed: air ${MED.air[1]}, water ${MED.water[1]}, steel ${MED.steel[1]} m/s`, x0, h - 12, { color: col.muted, size: 10 });
  };
  upd();
}
