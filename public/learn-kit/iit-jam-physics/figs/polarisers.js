// 3.9 Polarisers and wave plates. "Polarisers": unpolarised light through a first polariser (vertical), an optional
// middle one at angle a and a last one at angle b; bars show the intensity after each (Malus's law). "Wave plate":
// linear light at angle theta to the fast axis of a quarter- or half-wave plate; the curve is the path traced by the
// tip of the electric field after the plate (line, ellipse or circle).
import { canvas, line, text, title, row, slider, choice, readout, loop, fmt } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.55, max: 360, min: 240, label: 'Intensity through a chain of polarisers, or the field after a wave plate' });
  let mode = 'pol', mid = true, a = 45, b = 90, th = 45, plate = 'q', t = 0;
  const ctl = row(host);
  choice(ctl, 'Show', [['pol', 'Polarisers'], ['plate', 'Wave plate']], mode, (v) => { mode = v; cv.redraw(); show(); });
  choice(ctl, 'Middle polariser', [[true, 'In'], [false, 'Out']], true, (v) => { mid = v; cv.redraw(); show(); });
  slider(ctl, { label: 'Middle polariser angle (°)', min: 0, max: 180, step: 1, value: a, fmt: (v) => fmt(v, 3) + '°', oninput: (v) => { a = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'Last polariser angle (°)', min: 0, max: 180, step: 1, value: b, fmt: (v) => fmt(v, 3) + '°', oninput: (v) => { b = v; cv.redraw(); show(); } });
  choice(ctl, 'Plate', [['q', 'Quarter-wave'], ['h', 'Half-wave']], plate, (v) => { plate = v; cv.redraw(); show(); });
  slider(ctl, { label: 'Light at θ to fast axis (°)', min: 0, max: 90, step: 1, value: th, fmt: (v) => fmt(v, 3) + '°', oninput: (v) => { th = v; cv.redraw(); show(); } });
  const out = readout(host);
  const r = Math.PI / 180;
  const levels = () => { const I1 = 0.5; const I2 = mid ? I1 * Math.cos(a * r) ** 2 : I1; const I3 = I2 * Math.cos(((mid ? b - a : b)) * r) ** 2; return mid ? [1, I1, I2, I3] : [1, I1, I3]; };
  const show = () => {
    if (mode === 'pol') { const L = levels(); out.innerHTML = `Unpolarised light 1 → after the first polariser ${fmt(L[1], 3)}` + (mid ? ` → after the middle one (×cos²${a}°) ${fmt(L[2], 3)}` : '') + ` → after the last one <b>${fmt(L[L.length - 1], 3)}</b>. ` + (mid && Math.abs(b - 90) < 1 ? `With the last one crossed, (1/8) sin² 2a = ${fmt(Math.sin(2 * a * r) ** 2 / 8, 3)}: largest at a = 45°.` : ''); return; }
    const ex = Math.cos(th * r), ey = Math.sin(th * r);
    out.innerHTML = plate === 'h' ? `Half-wave plate: the slow component flips sign, so the light stays linear at −${th}°: turned through <b>${2 * th}°</b>.`
      : th === 0 || th === 90 ? 'Light along an axis has one component only: it passes unchanged.'
      : Math.abs(th - 45) < 0.5 ? 'Equal components a quarter cycle apart: <b>circularly polarised</b>.'
      : `Components ${fmt(ex, 3)} and ${fmt(ey, 3)} a quarter cycle apart: an <b>ellipse</b> with axis ratio ${fmt(Math.min(ex, ey) / Math.max(ex, ey), 3)}.`;
  };
  cv.draw = (ctx, w, h, col) => {
    if (mode === 'pol') {
      title(ctx, 'Malus\'s law: I = I₀ cos²θ at each polariser', col);
      const L = levels(), angs = mid ? [null, 0, a, b] : [null, 0, b], n = L.length, cw = (w - 40) / n, base = h - 30, top = 60;
      L.forEach((v, i) => {
        const x = 20 + i * cw + cw * 0.2, bw = cw * 0.6;
        ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.85; ctx.fillRect(x, base - (base - top) * v, bw, (base - top) * v); ctx.globalAlpha = 1;
        text(ctx, fmt(v, 3), x + bw / 2, base - (base - top) * v - 9, { color: col.ink, size: 11, align: 'center' });
        text(ctx, i === 0 ? 'incident' : `after P${i}`, x + bw / 2, base + 12, { color: col.muted, size: 11, align: 'center' });
        if (angs[i] !== null) { const cx = x + bw / 2, cyy = 44, R = 12, an = (90 - angs[i]) * r; line(ctx, [[cx - R * Math.cos(an), cyy + R * Math.sin(an)], [cx + R * Math.cos(an), cyy - R * Math.sin(an)]], col.s[3], 2.5); }
      });
      return;
    }
    title(ctx, plate === 'q' ? 'Field after a quarter-wave plate' : 'Field after a half-wave plate', col);
    const cx = w / 2, cy = h / 2 + 12, R = Math.min(w, h) * 0.34, ex = Math.cos(th * r), ey = Math.sin(th * r);
    line(ctx, [[cx - R * 1.2, cy], [cx + R * 1.2, cy]], col.line, 1); line(ctx, [[cx, cy - R * 1.2], [cx, cy + R * 1.2]], col.line, 1);
    text(ctx, 'fast axis', cx + R * 1.2 - 50, cy + 12, { color: col.muted, size: 11 });
    line(ctx, [[cx - R * ex, cy + R * ey], [cx + R * ex, cy - R * ey]], col.muted, 1.2, [4, 4]);
    const pts = [];
    for (let k = 0; k <= 200; k++) { const p = (k / 200) * 2 * Math.PI; const X = ex * Math.cos(p), Y = plate === 'q' ? ey * Math.sin(p) : -ey * Math.cos(p); pts.push([cx + R * X, cy - R * Y]); }
    line(ctx, pts, col.s[0], 2.5);
    const X = ex * Math.cos(t), Y = plate === 'q' ? ey * Math.sin(t) : -ey * Math.cos(t);
    line(ctx, [[cx, cy], [cx + R * X, cy - R * Y]], col.s[3], 2.5);
    text(ctx, 'dashed: incoming polarisation', 10, h - 10, { color: col.muted, size: 11 });
  };
  const anim = loop(host, (dt) => { if (mode === 'plate') { t += dt * 2; cv.redraw(); } });
  anim.button(ctl);
  cv.redraw(); show();
}
