// Class 9 Sound: SONAR (sound navigation and ranging). A ship sends an ultrasonic pulse down; it reflects off the sea
// bed (or a fish shoal or submarine) and comes back. The echo time t and the speed in sea water v (about 1500 m/s)
// give the depth d = v t / 2. The pulse is shown slowed down so you can follow it; the clock shows real time.
import { canvas, text, title, dot, line, arrow, row, slider, choice, readout, loop } from '../../kit.js';

const V = 1500;
export default function (host) {
  let d = 2000, tgt = 'bed', t = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'A ship sending a SONAR pulse to the sea bed and receiving the echo' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const ctl = row(host);
  slider(ctl, { label: 'Sea depth', min: 500, max: 4000, step: 100, value: d, fmt: (v) => `${v} m`, oninput: (v) => { d = v; t = 0; upd(); } });
  choice(ctl, 'Looking for', [['bed', 'Sea bed'], ['sub', 'Submarine']], tgt, (v) => { tgt = v; t = 0; upd(); });
  const out = readout(host);
  const dist = () => (tgt === 'sub' ? d * 0.55 : d);
  function upd() { const x = dist(), tt = 2 * x / V; out.innerHTML = `Echo time t = 2 × ${Math.round(x)} ÷ ${V} = <b>${tt.toFixed(2)} s</b>. The ship uses it the other way round: d = v × t ÷ 2 = ${V} × ${tt.toFixed(2)} ÷ 2 = <b>${Math.round(x)} m</b>.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'SONAR measures depth', col);
    const sy = 84, by = h - 52, bedY = sy + 30 + (by - sy - 30) * d / 4000, subY = sy + (bedY - sy) * 0.55;
    ctx.fillStyle = col.soft; ctx.fillRect(0, sy, w, bedY - sy);
    ctx.fillStyle = col.line; ctx.beginPath(); ctx.moveTo(0, bedY + 6); for (let x = 0; x <= w; x += 12) ctx.lineTo(x, bedY + 3 * Math.sin(x * 0.09)); ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath(); ctx.fill();
    line(ctx, [[0, sy], [w, sy]], col.s[2], 2);
    // ship
    const sx = w * 0.3; ctx.fillStyle = col.ink; ctx.beginPath(); ctx.moveTo(sx - 28, sy - 14); ctx.lineTo(sx + 28, sy - 14); ctx.lineTo(sx + 20, sy + 2); ctx.lineTo(sx - 20, sy + 2); ctx.closePath(); ctx.fill();
    line(ctx, [[sx - 4, sy - 14], [sx - 4, sy - 26]], col.ink, 3);
    if (tgt === 'sub') { const ux = sx + 4; ctx.fillStyle = col.s[1]; ctx.beginPath(); ctx.ellipse(ux, subY, 26, 8, 0, 0, 7); ctx.fill(); ctx.fillRect(ux - 4, subY - 13, 8, 8); text(ctx, 'submarine', ux + 32, subY, { color: col.s[1], size: 10.5, weight: 700 }); }
    else text(ctx, 'sea bed', w - 12, bedY + 14, { color: col.muted, size: 10.5, align: 'right' });
    // pulse
    const x = dist(), yT = tgt === 'sub' ? subY : bedY, total = 2 * x / V, vis = 1.4 + 2.2 * x / 4000, cyc = vis + 1.2, ph = t % cyc, p = Math.min(1, ph / vis);
    const px = sx + 4;
    if (p < 1) {
      const y = p < 0.5 ? sy + (yT - sy) * p * 2 : yT - (yT - sy) * (p - 0.5) * 2, down = p < 0.5;
      ctx.save(); ctx.lineWidth = 2.4; ctx.lineCap = 'round';
      for (let k = 0; k < 3; k++) { ctx.globalAlpha = 1 - k * 0.3; ctx.strokeStyle = down ? col.s[2] : col.s[0]; const yy = y - (down ? 1 : -1) * k * 8; ctx.beginPath(); ctx.arc(px, yy + (down ? 0 : 0), 18 - k * 2, down ? 0.4 : Math.PI + 0.4, down ? Math.PI - 0.4 : 2 * Math.PI - 0.4); ctx.stroke(); }
      ctx.restore();
    }
    const real = Math.min(1, ph / vis) * total;
    text(ctx, `clock ${real.toFixed(2)} s`, w - 12, 40, { color: col.ink, size: 12, weight: 700, align: 'right' });
    text(ctx, p >= 1 ? 'echo received!' : p < 0.5 ? 'pulse going down' : 'echo coming up', w - 12, 58, { color: p >= 1 ? col.good : col.muted, size: 10.5, align: 'right' });
    // depth ruler
    const rx = 18; arrow(ctx, rx, sy + 4, rx, yT - 2, col.s[3], 1.5, 6); arrow(ctx, rx, yT - 2, rx, sy + 4, col.s[3], 1.5, 6);
    text(ctx, `${Math.round(x)} m`, rx + 6, (sy + yT) / 2, { color: col.s[3], size: 11, weight: 700 });
  };
  upd();
}
