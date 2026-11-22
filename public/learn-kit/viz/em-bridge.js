// Wheatstone bridge and meter bridge. Change the four resistances (or slide the jockey along the metre wire) and
// watch the galvanometer. The bridge balances, with no current in G, when P/Q = R/S; then the two middle points B and
// D are at the same potential. The bars show the potential at B and D measured from the negative terminal.
import { canvas, text, row, slider, choice, readout, line } from '../kit.js';

export default function (host) {
  let mode = 'wb', P = 10, Q = 10, R = 20, S = 20, X = 15, Rk = 10, l = 50, V = 6;
  const cv = canvas(host, { aspect: 0.85, max: 380, min: 290, label: 'A Wheatstone bridge with a galvanometer' });
  const ctl = row(host), c2 = row(host);
  choice(ctl, 'Circuit', [['wb', 'Wheatstone bridge'], ['mb', 'Meter bridge']], mode, (v) => { mode = v; mk(); upd(); });
  let sl = [];
  function mk() { c2.innerHTML = ''; sl = [];
    if (mode === 'wb') [['P', P], ['Q', Q], ['R', R], ['S', S]].forEach(([n, v]) => sl.push(slider(c2, { label: n, min: 1, max: 50, value: v, step: 1, fmt: (x) => x + ' Ω', oninput: (x) => { ({ P: () => (P = x), Q: () => (Q = x), R: () => (R = x), S: () => (S = x) })[n](); upd(); } })));
    else { slider(c2, { label: 'Known R', min: 1, max: 50, value: Rk, step: 1, fmt: (x) => x + ' Ω', oninput: (x) => { Rk = x; upd(); } }); slider(c2, { label: 'Unknown X', min: 1, max: 50, value: X, step: 1, fmt: (x) => x + ' Ω', oninput: (x) => { X = x; upd(); } }); slider(c2, { label: 'Jockey l', min: 5, max: 95, value: l, step: 0.5, fmt: (x) => x.toFixed(1) + ' cm', oninput: (x) => { l = x; upd(); } }); } }
  const out = readout(host);
  const vB = () => (mode === 'wb' ? V * Q / (P + Q) : V * X / (Rk + X)), vD = () => (mode === 'wb' ? V * S / (R + S) : V * (100 - l) / 100);
  function upd() { const dv = vB() - vD(), bal = Math.abs(dv) < 0.02;
    out.innerHTML = (mode === 'wb' ? `V<sub>B</sub> = ${vB().toFixed(2)} V, V<sub>D</sub> = ${vD().toFixed(2)} V. P/Q = ${(P / Q).toFixed(2)}, R/S = ${(R / S).toFixed(2)}.` : `Left gap: R and X share the battery; V<sub>B</sub> = ${vB().toFixed(2)} V. The wire gives V<sub>D</sub> = ${vD().toFixed(2)} V at the jockey. Balance when R/X = l/(100−l): here ${(Rk / X).toFixed(2)} vs ${(l / (100 - l)).toFixed(2)}; X = R(100−l)/l = ${(Rk * (100 - l) / l).toFixed(1)} Ω.`) + ` Galvanometer: <b>${bal ? 'zero, balanced' : (dv > 0 ? 'deflects one way' : 'deflects the other way')}</b> (V<sub>B</sub> − V<sub>D</sub> = ${dv.toFixed(2)} V).`; cv.redraw(); }
  const zig = (ctx, col, x0, y0, x1, y1, lab) => { const n = 6, dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux, pts = [[x0, y0], [x0 + ux * L * 0.2, y0 + uy * L * 0.2]]; for (let i = 0; i < n; i++) { const f = 0.2 + (i + 0.5) / n * 0.6, s = i % 2 ? 6 : -6; pts.push([x0 + dx * f + nx * s, y0 + dy * f + ny * s]); } pts.push([x0 + ux * L * 0.8, y0 + uy * L * 0.8], [x1, y1]); line(ctx, pts, col.ink, 1.8); text(ctx, lab, (x0 + x1) / 2 + nx * 18, (y0 + y1) / 2 + ny * 18, { color: col.ink, size: 11, weight: 700, align: 'center' }); };
  cv.draw = (ctx, w, h, col) => {
    const cx = w / 2, A = [30, 110], B = [cx, 40], C = [w - 30, 110], D = [cx, 180];
    if (mode === 'wb') { zig(ctx, col, ...A, ...B, `P ${P}`); zig(ctx, col, ...B, ...C, `Q ${Q}`); zig(ctx, col, ...A, ...D, `R ${R}`); zig(ctx, col, ...D, ...C, `S ${S}`); }
    else {
      zig(ctx, col, ...A, ...B, `R ${Rk}`); zig(ctx, col, ...B, ...C, `X ${X}`);
      line(ctx, [A, [30, 180], [w - 30, 180], C], col.ink, 1.8); // the 100 cm wire (bottom)
      const jx = 30 + (w - 60) * l / 100; line(ctx, [[30, 180], [w - 30, 180]], col.s[5], 3); ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.moveTo(jx, 180); ctx.lineTo(jx - 6, 196); ctx.lineTo(jx + 6, 196); ctx.fill(); line(ctx, [B, [B[0], 150], [jx, 150], [jx, 180]], col.muted, 1.4, [4, 3]);
      text(ctx, `${l.toFixed(1)} cm`, 30 + (w - 60) * l / 200, 172, { color: col.ink, size: 10, align: 'center' }); text(ctx, `${(100 - l).toFixed(1)} cm`, jx + (w - 30 - jx) / 2, 172, { color: col.ink, size: 10, align: 'center' });
    }
    [['A', A], ['B', B], ['C', C], ['D', D]].forEach(([n, p]) => { if (mode === 'mb' && n === 'D') return; ctx.fillStyle = col.ink; ctx.beginPath(); ctx.arc(p[0], p[1], 3.5, 0, 7); ctx.fill(); text(ctx, n, p[0] + (n === 'A' ? -12 : n === 'C' ? 12 : 0), p[1] + (n === 'B' ? -12 : n === 'D' ? 13 : 0), { color: col.ink, size: 11, weight: 700, align: 'center' }); });
    // galvanometer between B and D
    const gx = cx, gy = 110; if (mode === 'wb') line(ctx, [B, D], col.ink, 1.4, [3, 3]); ctx.fillStyle = col.panel; ctx.beginPath(); ctx.arc(gx, gy, 20, 0, 7); ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.stroke();
    const dv = vB() - vD(), ang = Math.max(-1.2, Math.min(1.2, dv * 0.6)); line(ctx, [[gx, gy + 10], [gx + Math.sin(ang) * 17, gy + 10 - Math.cos(ang) * 17]], col.s[5], 2.5); text(ctx, 'G', gx, gy - 28 + 14, { color: col.ink, size: 10, weight: 700, align: 'center' });
    // battery
    const by = 232; ctx.strokeStyle = col.ink; line(ctx, [A, [A[0], by], [cx - 6, by]], col.ink, 1.6); line(ctx, [C, [C[0], by], [cx + 6, by]], col.ink, 1.6); ctx.fillStyle = col.ink; ctx.fillRect(cx - 6, by - 9, 2.5, 18); ctx.fillRect(cx + 4, by - 5, 2.5, 10); text(ctx, V + ' V', cx, by + 18, { color: col.ink, size: 11, align: 'center' });
    // potentials
    ctx.fillStyle = col.s[0]; ctx.fillRect(10, 262, (w - 20) * vB() / V, 9); ctx.fillStyle = col.s[2]; ctx.fillRect(10, 275, (w - 20) * vD() / V, 9);
    text(ctx, `V_B ${vB().toFixed(2)} V`, 12, 266, { color: col.panel === '#fff' ? '#fff' : col.ink, size: 8.5, fit: false }); text(ctx, `V_D ${vD().toFixed(2)} V`, 12, 279, { color: col.ink, size: 8.5, fit: false });
    text(ctx, mode === 'wb' ? 'Balanced when P/Q = R/S' : 'Meter bridge: balanced when R/X = l/(100 − l)', 10, 16, { color: col.ink, size: 12, weight: 700 });
  };
  mk(); upd();
}
