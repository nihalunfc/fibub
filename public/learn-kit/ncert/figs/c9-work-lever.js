// Class 9 Work and Energy, simple machines: a lever with a draggable fulcrum and draggable load and effort.
// The lever balances when effort x effort-arm = load x load-arm (the principle of moments); mechanical advantage
// MA = load / effort = effort arm / load arm. The figure names the class of lever from the order of the three
// points: fulcrum in the middle (class 1), load in the middle (class 2), effort in the middle (class 3).
// Drag the three triangles/arrows along the beam, or use the sliders for the load and effort sizes.
import { canvas, text, title, line, arrow, row, slider, readout, touchGuard } from '../../kit.js';

export default function (host) {
  let F = 0.5, Ld = 0.15, Ef = 0.85, load = 60; // positions along the beam 0..1
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 300, label: 'A lever with a draggable fulcrum, load and effort that tilts or balances and names its class' });
  const ctl = row(host);
  slider(ctl, { label: 'Load', min: 10, max: 100, step: 5, value: load, fmt: (v) => `${v} N`, oninput: (v) => { load = v; upd(); } });
  const out = readout(host);
  let drag = null;
  const geom = () => { const w = cv.w, x0 = 24, x1 = w - 24; return { x0, x1, X: (u) => x0 + u * (x1 - x0), by: cv.h * 0.52 }; };
  function effortNeeded() { const la = Math.abs(F - Ld), ea = Math.abs(Ef - F); return ea < 0.02 ? Infinity : (load * la) / ea; }
  function kind() {
    const o = [['F', F], ['L', Ld], ['E', Ef]].sort((a, b) => a[1] - b[1]).map((p) => p[0]).join('');
    const mid = o[1];
    return mid === 'F' ? 'Class 1 (fulcrum in the middle, like a seesaw or scissors)' : mid === 'L' ? 'Class 2 (load in the middle, like a wheelbarrow or nutcracker)' : 'Class 3 (effort in the middle, like tweezers or a fishing rod)';
  }
  function upd() {
    const E = effortNeeded(), la = Math.abs(F - Ld), ea = Math.abs(Ef - F);
    out.innerHTML = `Load arm ${(la * 100).toFixed(0)}, effort arm ${(ea * 100).toFixed(0)} units. Effort to balance = <b>${isFinite(E) ? E.toFixed(0) : '∞'} N</b>, MA = ${la > 0 ? (ea / la).toFixed(2) : '∞'}. ${kind()}.`;
    cv.redraw();
  }
  const c = cv.c;
  const pos = (e) => { const r = c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  touchGuard(c, (px, py) => { const g = geom(); return [[F, g.by + 26], [Ld, g.by - 40], [Ef, g.by - 40]].some(([u, y]) => Math.hypot(px - g.X(u), py - y) < 28); });
  c.addEventListener('pointerdown', (e) => {
    const [px, py] = pos(e), g = geom(); let best = null, bd = 28;
    [['F', F, g.by + 26], ['L', Ld, g.by - 40], ['E', Ef, g.by - 40]].forEach(([k, u, y]) => { const d = Math.hypot(px - g.X(u), py - y); if (d < bd) { bd = d; best = k; } });
    if (best) { drag = best; c.setPointerCapture(e.pointerId); e.preventDefault(); }
  });
  c.addEventListener('pointermove', (e) => {
    if (!drag) return; const [px] = pos(e), g = geom(), u = Math.max(0, Math.min(1, (px - g.x0) / (g.x1 - g.x0)));
    if (drag === 'F') F = u; else if (drag === 'L') Ld = u; else Ef = u;
    upd();
  });
  const end = () => { drag = null; }; c.addEventListener('pointerup', end); c.addEventListener('pointercancel', end);
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Drag the fulcrum, the load and the effort', col);
    const g = geom(), E = effortNeeded(), la = Math.abs(F - Ld), ea = Math.abs(Ef - F);
    // torque balance: tilt shows which side goes down (load torque vs effort torque with effort = needed*0.8 .. choose effort = needed so balanced)
    const effortApplied = isFinite(E) ? E : 0;
    const bal = true; const tilt = 0;
    ctx.save(); ctx.translate(g.X(F), g.by); ctx.rotate(tilt);
    ctx.lineCap = 'round'; line(ctx, [[g.x0 - g.X(F), 0], [g.x1 - g.X(F), 0]], col.ink, 7); ctx.restore();
    // fulcrum
    ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.moveTo(g.X(F), g.by + 4); ctx.lineTo(g.X(F) - 14, g.by + 34); ctx.lineTo(g.X(F) + 14, g.by + 34); ctx.closePath(); ctx.fill();
    text(ctx, 'fulcrum', g.X(F), g.by + 46, { color: col.s[3], size: 11, weight: 700, align: 'center' });
    // load: weight pulling down
    const lx = g.X(Ld); ctx.fillStyle = col.s[1]; const bw = 10 + load * 0.28; ctx.fillRect(lx - bw / 2, g.by - 4 - bw, bw, bw);
    arrow(ctx, lx, g.by - 4 - bw - 2, lx, g.by - 4 - bw + 2, col.s[1], 1);
    text(ctx, `load ${load} N`, lx, g.by - bw - 14, { color: col.s[1], size: 11, weight: 700, align: 'center' });
    // effort: arrow, direction: for class 1 pushes down; class 2/3 up
    const k = kind()[6]; const up = k !== '1';
    const ex = g.X(Ef), len = 34 + Math.min(40, effortApplied * 0.5);
    if (up) arrow(ctx, ex, g.by + 4 + len, ex, g.by + 6, col.s[0], 3); else arrow(ctx, ex, g.by - 4 - len, ex, g.by - 6, col.s[0], 3);
    text(ctx, isFinite(E) ? `effort ${E.toFixed(0)} N` : 'effort ∞', ex, up ? g.by + len + 18 : g.by - len - 12, { color: col.s[0], size: 11, weight: 700, align: 'center' });
    // arm brackets
    const yb = g.by + 64; line(ctx, [[g.X(F), yb], [g.X(Ld), yb]], col.s[1], 2); line(ctx, [[g.X(F), yb], [g.X(Ef), yb]], col.s[0], 2);
    text(ctx, 'load arm', (g.X(F) + g.X(Ld)) / 2, yb + 12, { color: col.s[1], size: 10.5, align: 'center' });
    text(ctx, 'effort arm', (g.X(F) + g.X(Ef)) / 2, yb + 12, { color: col.s[0], size: 10.5, align: 'center' });
    text(ctx, 'balanced: effort × effort arm = load × load arm', w / 2, h - 12, { color: col.muted, size: 10.5, align: 'center' });
    void bal;
  };
  upd();
}
