// A race along two axons: an action potential travels on an unmyelinated axon (every bit of membrane must fire, so
// the wave creeps) and on a myelinated one (the insulating sheath makes the signal jump from one node of Ranvier
// to the next, saltatory conduction). The speeds on the screen are scaled down; real myelinated fibres can be
// 50 to 100 times faster, and they use far fewer ion pumps.
import { canvas, loop, row, button, slider, readout, text, title } from '../kit.js';

export default function (host) {
  let t = 0, spd = 1;
  const cv = canvas(host, { aspect: 0.62, max: 330, min: 260, label: 'A race of nerve impulses along an unmyelinated and a myelinated axon' });
  const ctl = row(host);
  loop(host, (dt) => { t += dt * spd; if (t > 7) t = 0; cv.redraw(); show(); }).button(ctl);
  button(ctl, 'Restart', () => { t = 0; cv.redraw(); });
  slider(ctl, { label: 'Replay speed', min: 0.3, max: 2, step: 0.1, value: spd, fmt: (v) => `${v.toFixed(1)}×`, oninput: (v) => { spd = v; } });
  const out = readout(host);
  const v1 = 0.12, v2 = 0.7; // fractions of the axon per second (scaled)
  const show = () => { const a = Math.min(1, t * v1), b = Math.min(1, t * v2); out.innerHTML = `After <b>${t.toFixed(1)} s</b> the impulse has covered <b>${(a * 100).toFixed(0)} %</b> of the unmyelinated axon (about 0.5 to 2 m/s in real life) and <b>${(b * 100).toFixed(0)} %</b> of the myelinated one (up to about 100 m/s). Myelin stops current leaking out between nodes, so the signal jumps node to node.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Nerve impulse: two axons', col);
    const L = 20, R = w - 20, W = R - L, y1 = h * 0.3, y2 = h * 0.68;
    const x1 = L + Math.min(1, t * v1) * W, x2 = L + Math.min(1, t * v2) * W;
    // unmyelinated axon
    ctx.strokeStyle = col.muted; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(L, y1); ctx.lineTo(R, y1); ctx.stroke();
    ctx.strokeStyle = col.bad; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(Math.max(L, x1 - 26), y1); ctx.lineTo(x1, y1); ctx.stroke();
    for (let i = 0; i < 14; i++) { const x = L + (i + 0.5) * W / 14; if (x < x1 && x > x1 - 26) { ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, y1 - 7); ctx.lineTo(x, y1 - 18); ctx.stroke(); } }
    text(ctx, 'Unmyelinated: depolarisation spreads bit by bit (every patch has channels)', L, y1 - 30, { color: col.ink, size: 10.5, weight: 600 });
    // myelinated axon with 6 internodes
    const n = 6, seg = W / n;
    ctx.strokeStyle = col.muted; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(L, y2); ctx.lineTo(R, y2); ctx.stroke();
    for (let i = 0; i < n; i++) { ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.75; ctx.beginPath(); ctx.roundRect(L + i * seg + 6, y2 - 11, seg - 12, 22, 8); ctx.fill(); ctx.globalAlpha = 1; }
    for (let i = 0; i <= n; i++) {
      const nx = L + i * seg, lit = x2 >= nx - 1 && x2 < nx + 2 * seg * 0.1 + seg * 0.5; const on = Math.abs(x2 - nx) < seg * 0.28 && t > 0;
      ctx.beginPath(); ctx.arc(nx, y2, on ? 8 : 5, 0, 7); ctx.fillStyle = on ? col.bad : col.s[0]; ctx.fill();
      if (on) { text(ctx, 'AP', nx, y2 - 20, { color: col.bad, size: 11, weight: 700, align: 'center' }); }
    }
    ctx.strokeStyle = col.bad; ctx.setLineDash([5, 4]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(L, y2 + 20); ctx.lineTo(x2, y2 + 20); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'Myelinated: current jumps between nodes of Ranvier', L, y2 + 38, { color: col.ink, size: 10.5, weight: 600 });
    text(ctx, 'orange = myelin (Schwann cell or oligodendrocyte), blue dots = nodes', L, h - 8, { color: col.muted, size: 9.5 });
  };
  show();
}
