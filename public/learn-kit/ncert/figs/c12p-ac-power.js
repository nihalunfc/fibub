// Class 12 Alternating Current: power in an AC circuit. The instantaneous power p = v i is drawn for a phase angle phi
// between voltage and current. Green: energy flows into the load; orange: it flows back to the source. The average
// power is V_rms I_rms cos(phi): full at phi = 0 (resistor), zero at phi = 90 degrees (pure L or C, "wattless" current).
import { canvas, axes, line, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let phi = 60;
  const cv = canvas(host, { aspect: 0.64, max: 440, min: 280, label: 'Voltage, current and instantaneous power against time for a chosen phase angle' });
  const ctl = row(host);
  slider(ctl, { label: 'Phase angle φ (current lags)', min: -90, max: 90, step: 5, value: phi, fmt: (v) => `${v}°`, oninput: (v) => { phi = v; upd(); } });
  const out = readout(host);
  function upd() {
    const c = Math.cos((phi * Math.PI) / 180);
    out.innerHTML = `Power factor cos φ = <b>${c.toFixed(2)}</b>. Average power = V<sub>rms</sub>I<sub>rms</sub> cos φ = <b>${(c * 100).toFixed(0)}%</b> of V<sub>rms</sub>I<sub>rms</sub>. ${Math.abs(phi) === 90 ? 'The area above and below the axis cancel: energy only goes to and fro, nothing is used up.' : Math.abs(phi) < 5 ? 'Current and voltage rise and fall together: all the energy taken is used.' : 'Part of each cycle the load gives energy back.'}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'p = v·i: when power flows in and back', col);
    const ax = axes(ctx, w, h, col, { x: [0, 2], y: [-1.2, 1.2], t: top + 6, xlabel: 'time (in periods)', yt: [-1, -0.5, 0, 0.5, 1], xt: [0, 0.5, 1, 1.5, 2] });
    const f = (phi * Math.PI) / 180, v = (x) => Math.sin(2 * Math.PI * x), i = (x) => Math.sin(2 * Math.PI * x - f), p = (x) => v(x) * i(x);
    ctx.save(); ax.clip();
    for (const sgn of [1, -1]) {
      ctx.globalAlpha = 0.3; ctx.fillStyle = sgn > 0 ? col.s[2] : col.s[3]; ctx.beginPath(); ctx.moveTo(ax.X(0), ax.Y(0));
      for (let k = 0; k <= 400; k++) { const x = k / 200; ctx.lineTo(ax.X(x), ax.Y(sgn * Math.max(0, sgn * p(x)))); }
      ctx.lineTo(ax.X(2), ax.Y(0)); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    }
    const mk = (g) => { const a = []; for (let k = 0; k <= 200; k++) { const x = k / 100; a.push([ax.X(x), ax.Y(g(x))]); } return a; };
    line(ctx, mk(v), col.s[0], 1.8); line(ctx, mk(i), col.s[1], 1.8); line(ctx, mk(p), col.ink, 2.8);
    const avg = Math.cos(f) / 2; line(ctx, [[ax.L, ax.Y(avg)], [ax.R, ax.Y(avg)]], col.s[4], 2, [6, 4]);
    ctx.restore();
    text(ctx, 'v', ax.X(0.27), ax.Y(1.1), { color: col.s[0], size: 12, weight: 700, halo: col.panel });
    text(ctx, 'i', ax.X(0.27 + phi / 360) + 12, ax.Y(1.1), { color: col.s[1], size: 12, weight: 700, halo: col.panel });
    text(ctx, 'p = vi', ax.X(1.02), ax.Y(-1.0), { color: col.ink, size: 12, weight: 700, halo: col.panel });
    text(ctx, `average ½cos φ = ${avg.toFixed(2)}`, ax.R - 4, ax.Y(avg) - 9, { color: col.s[4], size: 11, weight: 700, align: 'right', halo: col.panel });
  };
  upd();
}
