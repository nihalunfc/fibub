// The cyclotron. A proton circles inside two hollow D-shaped boxes in a magnetic field B. Every half turn it crosses
// the gap, where an alternating voltage is timed to push it forward (the arrow in the gap flips each time). Faster
// means a bigger circle but the same time per turn, f = qB/2πm, so the pushes stay in step. Change B and the dee
// radius to see the final energy KE = (qBR)²/2m, which does not depend on the voltage.
import { canvas, text, row, slider, readout, loop, arrow, line, dot } from '../kit.js';

const N = 12;
export default function (host) {
  let B = 1, Rm = 0.5, V = 50, th = 0, hold = 0;
  const cv = canvas(host, { aspect: 0.8, max: 360, min: 260, label: 'A proton spiralling outward between two D-shaped electrodes' });
  const ctl = row(host);
  slider(ctl, { label: 'B', min: 0.5, max: 2, value: B, step: 0.05, fmt: (x) => x.toFixed(2) + ' T', oninput: (x) => { B = x; upd(); } });
  slider(ctl, { label: 'Dee radius', min: 0.2, max: 1, value: Rm, step: 0.05, fmt: (x) => x.toFixed(2) + ' m', oninput: (x) => { Rm = x; upd(); } });
  slider(ctl, { label: 'Gap voltage', min: 10, max: 200, value: V, step: 5, fmt: (x) => x + ' kV', oninput: (x) => { V = x; upd(); } });
  const out = readout(host);
  const anim = loop(host, (dt) => { if (hold > 0) { hold -= dt; if (hold <= 0) th = 0; } else { th += dt * 1.9; if (th >= N * Math.PI) { hold = 1.2; } } cv.redraw(); });
  anim.button(ctl);
  const e = 1.602e-19, m = 1.673e-27;
  function upd() { const f = e * B / (2 * Math.PI * m), KE = (e * B * Rm) ** 2 / (2 * m) / e / 1e6, cross = KE * 1e3 / V; out.innerHTML = `Proton: frequency f = qB/2πm = <b>${(f / 1e6).toFixed(1)} MHz</b> (the voltage must reverse at this rate). Final KE = (qBR)²/2m = <b>${KE.toFixed(1)} MeV</b>, speed ${(Math.sqrt(2 * KE * 1e6 * e / m) / 3e8).toFixed(3)} c. Each gap crossing adds ${V} keV, so about <b>${Math.round(cross)}</b> crossings (the picture shows 12). At high speed mass grows, so the timing slips: a limit of this machine.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const cx = w / 2, cy = h / 2 + 4, S = Math.min(w / 2 - 14, h / 2 - 22), r = (k) => S * 0.94 * Math.sqrt(k / N);
    const ys = [0]; for (let k = 1; k <= N; k++) ys.push(ys[k - 1] + (k % 2 ? 2 : -2) * r(k));
    const mid = (Math.max(...ys) + Math.min(...ys)) / 2 - 0;
    const Y = (y) => cy - (y - mid) * 1;
    // dees
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.fillStyle = col.soft;
    ctx.beginPath(); ctx.arc(cx + 5, cy, S, -Math.PI / 2, Math.PI / 2); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx - 5, cy, S, Math.PI / 2, -Math.PI / 2); ctx.closePath(); ctx.fill(); ctx.stroke();
    for (let x = cx - S + 12; x < cx + S; x += 26) for (let y = cy - S + 12; y < cy + S; y += 26) if (Math.hypot(x - cx, y - cy) < S - 8) text(ctx, '×', x, y, { color: col.line, size: 11, align: 'center' });
    // path so far
    const k = Math.min(N, Math.floor(th / Math.PI) + 1), ph = th - (k - 1) * Math.PI;
    ctx.strokeStyle = col.s[5]; ctx.lineWidth = 2; ctx.beginPath();
    for (let j = 1; j <= k; j++) { const rr = r(j), y0 = ys[j - 1], f = j === k ? Math.min(ph, Math.PI) : Math.PI, odd = j % 2 === 1;
      for (let a = 0; a <= f + 1e-6; a += 0.05) { const px = odd ? rr * Math.sin(a) : -rr * Math.sin(a), py = odd ? y0 + rr - rr * Math.cos(a) : y0 - rr + rr * Math.cos(a); const sx = cx + px, sy = Y(py); (a === 0 && j === 1) ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy); } }
    ctx.stroke();
    const rr = r(k), y0 = ys[k - 1], odd = k % 2 === 1, pa = Math.min(ph, Math.PI), px = odd ? rr * Math.sin(pa) : -rr * Math.sin(pa), py = odd ? y0 + rr - rr * Math.cos(pa) : y0 - rr + rr * Math.cos(pa);
    dot(ctx, cx + px, Y(py), 6, col.s[5], col.panel);
    // gap field arrow (right while the particle crosses toward the right dee)
    const dir = odd ? 1 : -1; arrow(ctx, cx - 16 * dir, 16, cx + 16 * dir, 16, col.s[0], 2.5, 8); text(ctx, 'gap field', cx, 32, { color: col.s[0], size: 10.5, align: 'center' });
    text(ctx, `crossings so far: ${Math.min(N, Math.floor(th / Math.PI))}   KE = ${Math.min(N, Math.floor(th / Math.PI))} × ΔKE`, 10, h - 10, { color: col.ink, size: 11 });
  };
  upd();
}
