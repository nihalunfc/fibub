// Class 11 Units and Measurement: reading a vernier caliper and a screw gauge. Vernier: 10 divisions of the sliding scale equal 9 mm of the main scale,
// so the least count is 1 mm - 0.9 mm = 0.1 mm; reading = main scale + (coinciding vernier division) x least count. Screw gauge: pitch 0.5 mm, 50 circular
// divisions, least count 0.5/50 = 0.01 mm; reading = linear scale + (circular division) x 0.01 mm. Slide the jaws, read it yourself, then press Check.
import { canvas, text, title, line, row, slider, choice, button, readout } from '../../kit.js';

export default function (host) {
  let mode = 'v', val = 13.4, shown = false;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 290, label: 'A vernier caliper or screw gauge scale whose reading you can set and check' });
  const ctl = row(host);
  choice(ctl, 'Instrument', [['v', 'Vernier caliper'], ['s', 'Screw gauge']], mode, (v) => { mode = v; shown = false; set(v === 'v' ? 13.4 : 4.37); });
  const sl = slider(ctl, { label: 'Jaw opening (mm)', min: 0, max: 30, step: 0.01, value: val, fmt: (v) => v.toFixed(mode === 'v' ? 1 : 2), oninput: (v) => { val = mode === 'v' ? Math.round(v * 10) / 10 : v; shown = false; say(); } });
  button(ctl, 'Check my reading', () => { shown = true; say(); });
  const out = readout(host);
  const set = (v) => { val = v; if (mode === 's') { sl.set(v); } else sl.set(v); say(); };
  const parts = () => {
    if (mode === 'v') { const v = Math.round(val * 10) / 10, ms = Math.floor(v + 1e-9), n = Math.round((v - ms) * 10); return { ms, n, tot: ms + n * 0.1 }; }
    const v = Math.round(val * 100) / 100, ls = Math.floor(v / 0.5 + 1e-9) * 0.5, n = Math.round((v - ls) * 100); return { ms: ls, n, tot: ls + n * 0.01 };
  };
  function say() {
    const p = parts();
    out.innerHTML = !shown ? (mode === 'v' ? 'Find the main-scale mark just left of the vernier 0, then the vernier line that lines up exactly with a main-scale line. Least count = 1 mm − 0.9 mm = <b>0.1 mm</b>.' : 'Read the sleeve (each mark is 0.5 mm), then the thimble line that sits on the long reference line. Least count = 0.5 mm ÷ 50 = <b>0.01 mm</b>.')
      : mode === 'v' ? `Main scale = <b>${p.ms} mm</b>; vernier line ${p.n} coincides, so ${p.n} × 0.1 = ${(p.n * 0.1).toFixed(1)} mm. Reading = <b>${p.tot.toFixed(1)} mm</b>.`
      : `Linear scale = <b>${p.ms.toFixed(1)} mm</b>; circular division ${p.n} on the line, so ${p.n} × 0.01 = ${(p.n * 0.01).toFixed(2)} mm. Reading = <b>${p.tot.toFixed(2)} mm</b>.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const p = parts();
    title(ctx, mode === 'v' ? 'Vernier caliper (zoomed in)' : 'Screw gauge (zoomed in)', col);
    const L = 18, W = w - 36, y0 = h * 0.42;
    if (mode === 'v') {
      const lo = Math.max(0, Math.floor(p.tot) - 1), span = 9, X = (mm) => L + ((mm - lo) / span) * W;
      ctx.fillStyle = col.soft; ctx.fillRect(L, y0 - 56, W, 56); line(ctx, [[L, y0], [L + W, y0]], col.ink, 2);
      for (let m = lo; m <= lo + span; m++) { line(ctx, [[X(m), y0], [X(m), y0 - (m % 5 === 0 ? 26 : 16)]], col.ink, 1.5); text(ctx, String(m), X(m), y0 - 36, { size: 10.5, color: col.muted, align: 'center' }); }
      const vx = X(p.tot - p.n * 0.1);  // vernier zero sits at the reading minus nothing: its zero is at the object size
      const z = X(Math.round(val * 10) / 10);
      ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.25; ctx.fillRect(z, y0, 10 * 0.9 / span * W, 46); ctx.globalAlpha = 1;
      for (let k = 0; k <= 10; k++) { const x = z + k * 0.9 / span * W, hit = shown && k === p.n; line(ctx, [[x, y0], [x, y0 + (k % 5 === 0 ? 30 : 20)]], hit ? col.s[3] : col.s[0], hit ? 3 : 1.5); text(ctx, String(k), x, y0 + 40, { size: 10.5, color: col.s[0], align: 'center' }); }
      line(ctx, [[z, y0 - 6], [z, y0 + 30]], col.s[2], 2.5);
      text(ctx, 'vernier 0', z, y0 + 62, { size: 11, color: col.s[2], weight: 700, align: 'center' });
      text(ctx, 'main scale (mm)', L + 4, y0 - 66, { size: 11, color: col.muted });
      text(ctx, 'vernier scale: 10 divisions = 9 mm', L + 4, y0 + 80, { size: 11, color: col.s[0] });
      if (shown) text(ctx, `${p.ms} mm + ${p.n} × 0.1 = ${p.tot.toFixed(1)} mm`, w / 2, y0 + 108, { size: 14, weight: 700, color: col.s[3], align: 'center' });
    } else {
      const lo = Math.max(0, Math.floor(p.ms) - 1), span = 5, X = (mm) => L + ((mm - lo) / span) * W, ry = y0 - 6;
      ctx.fillStyle = col.soft; ctx.fillRect(L, ry - 46, W, 46); line(ctx, [[L, ry], [L + W, ry]], col.ink, 2);
      for (let k = lo * 2; k <= (lo + span) * 2; k++) { const m = k / 2; line(ctx, [[X(m), ry], [X(m), ry - (k % 2 === 0 ? 28 : 14)]], col.ink, 1.5); if (k % 2 === 0) text(ctx, String(m), X(m), ry - 38, { size: 10.5, color: col.muted, align: 'center' }); }
      const edge = X(val);
      ctx.fillStyle = col.panel; ctx.fillRect(edge, ry + 2, w - edge, 96); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.strokeRect(edge, ry + 2, w - edge + 4, 96);
      const cyl = ry + 50, step = 9, ctr = Math.round((val - p.ms) * 100);
      for (let k = -4; k <= 4; k++) { const n = ctr + k; if (n < 0 || n > 99) continue; const y = cyl + k * step; line(ctx, [[edge, y], [edge + (n % 5 === 0 ? 22 : 14), y]], col.s[0], 1.5); if (n % 5 === 0) text(ctx, String(n % 50), edge + 28, y, { size: 10, color: col.s[0] }); }
      line(ctx, [[L, cyl], [w - 4, cyl]], col.s[2], 2);
      text(ctx, 'reference line', L + 2, cyl + 14, { size: 10.5, color: col.s[2], weight: 700 });
      text(ctx, 'circular scale', Math.min(w - 90, edge + 52), ry + 18, { size: 10.5, color: col.s[0] });
      text(ctx, 'linear scale (mm)', L + 4, ry - 56, { size: 11, color: col.muted });
      if (shown) text(ctx, `${p.ms.toFixed(1)} mm + ${p.n} × 0.01 = ${p.tot.toFixed(2)} mm`, w / 2, h - 28, { size: 14, weight: 700, color: col.s[3], align: 'center' });
    }
  };
  say();
}
