// Class 11 Biology chapters 11-15: a small step-player for process diagrams (boxes joined by arrows).
// cfg: { label, title, aspect, nodes:[{id,x,y,w,h?,t,c?}], arrows:[{a,b,t?}], steps:[{title?, on:[ids], hot?:[ids], arr:[arrow indices], note, tally?}] }
// x, y are fractions of the drawing area (box centres), w a fraction of the width. Lit boxes are coloured, earlier ones soft, later ones faint.
import { canvas, text, title, arrow } from '../kit.js';
import { note, rr } from './c11b-lib.js';

export function flowPlayer(host, cfg) {
  let s = 0;
  const cv = canvas(host, { aspect: cfg.aspect ?? 1, max: 440, min: 290, label: cfg.label });
  cv.draw = (ctx, w, h, col) => {
    const st = cfg.steps[s], t0 = title(ctx, st.title ?? cfg.title, col);
    const noteH = 62, tallyH = st.tally ? 18 : 0, top = t0 + 8, ah = h - noteH - tallyH - 6 - top;
    const seenN = new Set(), seenA = new Set();
    cfg.steps.slice(0, s).forEach((x) => { (x.on || []).forEach((i) => seenN.add(i)); (x.arr || []).forEach((i) => seenA.add(i)); });
    const hotN = new Set(st.hot ?? st.on ?? []), hotA = new Set(st.arr ?? []), B = {};
    cfg.nodes.forEach((n) => { B[n.id] = { n, cx: n.x * w, cy: top + n.y * ah, hw: (n.w * w) / 2, hh: (n.h ?? 30) / 2 }; });
    const edge = (a, b) => { const dx = b.cx - a.cx, dy = b.cy - a.cy, t = Math.min(a.hw / (Math.abs(dx) || 1e-6), a.hh / (Math.abs(dy) || 1e-6)); return [a.cx + dx * t + Math.sign(dx) * 0, a.cy + dy * t]; };
    cfg.arrows.forEach((a, i) => {
      const A = B[a.a], Z = B[a.b], p = edge(A, Z), q = edge(Z, A), lit = hotA.has(i), seen = seenA.has(i);
      arrow(ctx, p[0], p[1], q[0], q[1], lit ? col.ink : seen ? col.muted : col.line, lit ? 2.4 : 1.6, 7);
      if (a.t) text(ctx, a.t, (p[0] + q[0]) / 2, (p[1] + q[1]) / 2 - 8, { color: lit ? col.ink : col.muted, size: 10, weight: lit ? 700 : 400, align: 'center', halo: col.bg });
    });
    cfg.nodes.forEach((n) => {
      const b = B[n.id], hot = hotN.has(n.id), seen = seenN.has(n.id), c = col.s[n.c ?? 0];
      rr(ctx, b.cx - b.hw, b.cy - b.hh, b.hw * 2, b.hh * 2, 6, hot ? c : seen ? col.soft : null, hot || seen ? c : col.line, hot ? 2 : 1.4);
      const lines = n.t.split('\n'), size = 11;
      ctx.save(); ctx.font = `600 ${size}px system-ui,sans-serif`;
      const mw = Math.max(...lines.map((l) => ctx.measureText(l).width)), k = Math.min(1, (b.hw * 2 - 8) / mw); ctx.restore();
      lines.forEach((l, i) => text(ctx, l, b.cx, b.cy + (i - (lines.length - 1) / 2) * 13, { color: hot ? col.bg : seen ? col.ink : col.muted, size: size * k, weight: 600, align: 'center' }));
    });
    if (st.tally) text(ctx, st.tally, 10, h - noteH - 8, { color: col.s[3], size: 11, weight: 700 });
    note(ctx, st.note, 10, h - noteH + 8, w - 20, col, { size: 11 });
  };
  cv.redraw();
  return { step(i) { s = Math.min(Math.max(0, i), cfg.steps.length - 1); cv.redraw(); } };
}
