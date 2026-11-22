// A 4-bit R-2R ladder DAC. Tap the bits b3 (MSB) to b0: each switch connects its 2R leg to V_ref (1) or ground (0). By
// superposition each bit adds V_ref/2, /4, /8, /16 to the output, so V_out = V_ref·N/16 for the code N. The staircase shows
// all 16 outputs with yours marked; "Count up" runs the code through 0 to 15 and draws the ramp a counter would make.
import { canvas, line, dot, text, row, slider, button, readout, loop, title } from '../kit.js';

export default function (host) {
  let code = 5, cnt = false, tc = 0;
  const cv = canvas(host, { aspect: 0.95, max: 400, min: 320, label: 'An R-2R ladder converting a 4-bit code to a voltage' });
  const ctl = row(host), bits = [];
  for (let b = 3; b >= 0; b--) bits.push(button(ctl, `b${b}`, () => { code ^= 1 << b; cnt = false; paint(); }));
  const sv = slider(ctl, { label: 'V_ref', min: 1, max: 5, step: 0.1, value: 5, fmt: (v) => v.toFixed(1) + ' V', oninput: () => paint() });
  const ctl2 = row(host);
  const lp = loop(host, (dt) => { tc += dt; if (tc > 0.45) { tc = 0; code = (code + 1) % 16; paint(); } }, { autoplay: false });
  lp.button(ctl2);
  const out = readout(host);
  function paint() { bits.forEach((b, i) => b.setAttribute('aria-pressed', String(!!(code & (1 << (3 - i)))))); cv.redraw(); const V = sv.value; out.innerHTML = `<b>Code ${[3, 2, 1, 0].map((b) => (code >> b) & 1).join('')} = ${code}.</b> V_out = V_ref × ${code}/16 = <b>${((V * code) / 16).toFixed(3)} V</b>. Contributions: ${[3, 2, 1, 0].map((b) => (code >> b) & 1 ? `b${b}: ${(V / 2 ** (4 - b)).toFixed(3)} V` : '').filter(Boolean).join(' + ') || 'none'}. One step (the LSB) is ${(V / 16).toFixed(3)} V; the largest output is V_ref × 15/16, never quite V_ref.`; }
  cv.draw = (ctx, w, h, col) => {
    const V = sv.value, top = 56, L = 22, rowY = top + 22, dx = (w - 112) / 3, x0 = 40, ys = [0, 1, 2, 3].map((i) => x0 + i * dx);
    title(ctx, 'R-2R ladder DAC', col);
    // ladder: rail from MSB node (left, b3) to the LSB end; out at left end
    const res = (x, y, wd, lab, c) => { ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.strokeRect(x, y - 6, wd, 12); text(ctx, lab, x + wd / 2, y - 14, { color: col.muted, size: 10, align: 'center' }); };
    const on = (b) => (code >> b) & 1, wireC = (v) => (v ? col.s[1] : col.muted);
    line(ctx, [[ys[0] - 14, rowY], [ys[0], rowY]], col.ink, 2.5); text(ctx, 'V_out', ys[0] - 14, rowY - 12, { color: col.ink, size: 11, weight: 700 });
    for (let i = 0; i < 3; i++) { line(ctx, [[ys[i], rowY], [ys[i] + dx / 2 - 18, rowY]], col.ink, 2); res(ys[i] + dx / 2 - 18, rowY, 36, 'R', col.ink); line(ctx, [[ys[i] + dx / 2 + 18, rowY], [ys[i + 1], rowY]], col.ink, 2); }
    for (let i = 0; i < 4; i++) {
      const b = 3 - i, x = ys[i], y1 = rowY + 14, y2 = rowY + 62;
      line(ctx, [[x, rowY], [x, y1]], col.ink, 2); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(x - 6, y1, 12, 28); text(ctx, '2R', x + 10, y1 + 14, { color: col.muted, size: 10 });
      line(ctx, [[x, y1 + 28], [x, y2]], col.ink, 2);
      // switch to V_ref (up, 1) or ground (down, 0)
      const sy = y2 + 20; line(ctx, [[x, y2], [x + (on(b) ? -18 : 0), y2 + 10], [on(b) ? x - 18 : x, on(b) ? y2 + 10 : sy]], col.ink, 2);
      dot(ctx, x, y2, 3, col.ink);
      text(ctx, 'V_ref', x - 18, y2 + 22, { color: wireC(on(b)), size: 10, align: 'center', weight: on(b) ? 700 : 400 });
      line(ctx, [[x - 18, y2 + 10], [x - 18, y2 + 14]], wireC(on(b)), 2);
      text(ctx, '⏚', x + 2, y2 + 22, { color: wireC(!on(b)), size: 12, align: 'left', weight: !on(b) ? 700 : 400 });
      text(ctx, `b${b} = ${on(b)}`, x, y2 + 42, { color: on(b) ? col.s[1] : col.muted, size: 11, weight: 700, align: 'center' });
    }
    line(ctx, [[ys[3], rowY], [ys[3] + 22, rowY]], col.ink, 2); res(ys[3] + 22, rowY, 28, '2R', col.ink); line(ctx, [[ys[3] + 50, rowY], [ys[3] + 50, rowY + 40]], col.ink, 2); text(ctx, '⏚', ys[3] + 50, rowY + 48, { color: col.muted, size: 12, align: 'center' });
    // staircase
    const gy0 = rowY + 150, gh = h - gy0 - 26, gx0 = L + 24, gw = w - gx0 - 12;
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(gx0, gy0); ctx.lineTo(gx0, gy0 + gh); ctx.lineTo(gx0 + gw, gy0 + gh); ctx.stroke();
    const st = []; for (let n = 0; n < 16; n++) { const y = gy0 + gh - ((n / 16) / (15 / 16 + 0.02)) * gh * 0.95; st.push([gx0 + (n / 16) * gw, y], [gx0 + ((n + 1) / 16) * gw, y]); }
    line(ctx, st, col.s[0], 2);
    const yc = gy0 + gh - ((code / 16) / (15 / 16 + 0.02)) * gh * 0.95; dot(ctx, gx0 + ((code + 0.5) / 16) * gw, yc, 5.5, col.s[1], col.ink);
    text(ctx, 'V_out against code (0 to 15)', gx0 + 4, gy0 - 8, { color: col.ink, size: 11, weight: 600 }); text(ctx, '0', gx0, gy0 + gh + 10, { color: col.muted, size: 10, align: 'center' }); text(ctx, '15', gx0 + gw, gy0 + gh + 10, { color: col.muted, size: 10, align: 'right' });
  };
  paint();
}
