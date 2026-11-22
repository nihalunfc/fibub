// Class 10 Electricity: what a current is. Electrons drift slowly through a wire from the − end of the cell to the
// + end; the ammeter counts how much charge passes a cross-section each second (I = Q/t). Conventional current is
// drawn the other way. Sliders change how many electrons cross per second and how long you count.
import { canvas, text, title, line, dot, arrow, row, slider, readout, loop, choice } from '../../kit.js';

const E = 1.6e-19;
export default function (host) {
  let rate = 3, secs = 2, show = 'both', t = 0, counted = 0;
  const N = 34, xs = Array.from({ length: N }, (_, i) => i / N);
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 300, label: 'Electrons drifting through a wire past a counting gate, with the current worked out from charge and time' });
  const ctl = row(host);
  slider(ctl, { label: 'Charge flow (speed)', min: 1, max: 6, step: 1, value: rate, fmt: (v) => ['', 'very low', 'low', 'medium', 'high', 'higher', 'highest'][v], oninput: (v) => { rate = v; counted = 0; t = 0; } });
  slider(ctl, { label: 'Count for', min: 1, max: 5, step: 1, value: secs, fmt: (v) => `${v} s`, oninput: (v) => { secs = v; counted = 0; t = 0; } });
  choice(ctl, 'Arrows', [['both', 'Both'], ['e', 'Electrons'], ['conv', 'Current']], show, (v) => { show = v; cv.redraw(); });
  const out = readout(host);
  // each moving dot stands for 1 coulomb worth of electrons (6.25 × 10^18 of them)
  const anim = loop(host, (dt) => {
    const v = rate * 0.018;
    for (let i = 0; i < N; i++) {
      xs[i] = (xs[i] + v * dt * 3) % 1;
    }
    t += dt;
    counted = Math.floor(Math.min(t, secs) * N * v * 3 + 1e-9);
    if (t > secs + 2.5) { t = 0; counted = 0; }
    cv.redraw(); say();
  });
  anim.button(ctl);
  const say = () => {
    const Q = counted, I = t >= secs ? Q / secs : null;
    out.innerHTML = `Each dot is <b>1 coulomb</b> of electrons (6.25 × 10<sup>18</sup> of them). Counted ${Q} C in ${Math.min(t, secs).toFixed(1)} s` + (I !== null ? ` → current I = Q/t = ${Q}/${secs} = <b>${(Q / secs).toFixed(2)} A</b>.` : '…');
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Current = charge passing a point each second', col) + 8;
    const L = 24, R = w - 24, T = top + 30, B = h - 40;
    // circuit loop
    ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.strokeRect(L, T, R - L, B - T);
    // cell on the left side
    const cy = (T + B) / 2;
    ctx.fillStyle = col.panel; ctx.fillRect(L - 6, cy - 18, 12, 36);
    line(ctx, [[L - 14, cy - 8], [L + 14, cy - 8]], col.ink, 3); line(ctx, [[L - 7, cy + 6], [L + 7, cy + 6]], col.ink, 6);
    text(ctx, '+', L + 18, cy - 12, { color: col.s[7], size: 15, weight: 700 }); text(ctx, '−', L + 18, cy + 10, { color: col.s[0], size: 15, weight: 700 });
    // gate (ammeter) in the middle of the top wire
    const gx = (L + R) / 2;
    line(ctx, [[gx, T - 18], [gx, T + 18]], col.s[3], 2, [4, 3]);
    text(ctx, 'counting gate', gx, T - 24, { color: col.s[3], size: 11, align: 'center', weight: 600 });
    // perimeter path: electrons go from − (bottom of cell) round the loop: down-left, along bottom, up right, back along top (right to left)
    const P = 2 * (R - L) + 2 * (B - T);
    const at = (s) => {
      // s in [0,1) going clockwise from the top-left corner: top (L→R), right (T→B), bottom (R→L), left (B→T)
      let d = s * P;
      if (d < R - L) return [L + d, T]; d -= R - L;
      if (d < B - T) return [R, T + d]; d -= B - T;
      if (d < R - L) return [R - d, B]; d -= R - L;
      return [L, B - d];
    };
    // electrons move anticlockwise (from − at bottom-left, along bottom to the right, up, then right-to-left on top)
    for (let i = 0; i < N; i++) { const [x, y] = at((1.25 - xs[i] * 1) % 1); if (Math.abs(x - L) < 2 && y > cy - 20 && y < cy + 20) continue; dot(ctx, x, y, 4.2, col.s[0]); }
    if (show !== 'conv') { arrow(ctx, gx + 40, T + 22, gx - 10, T + 22, col.s[0], 2); text(ctx, 'electrons drift', gx + 46, T + 22, { color: col.s[0], size: 11, weight: 600 }); }
    if (show !== 'e') { arrow(ctx, gx + 50, B - 22, gx + 100, B - 22, col.s[7], 2); text(ctx, 'conventional current (+ to −)', gx + 44, B - 22, { color: col.s[7], size: 11, weight: 600, align: 'right' }); }
    // clock
    const done = Math.min(t, secs) / secs;
    ctx.beginPath(); ctx.arc(R - 30, top + 12, 12, -Math.PI / 2, -Math.PI / 2 + done * 2 * Math.PI); ctx.lineTo(R - 30, top + 12); ctx.closePath(); ctx.fillStyle = col.s[3]; ctx.fill();
    ctx.beginPath(); ctx.arc(R - 30, top + 12, 12, 0, 2 * Math.PI); ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.stroke();
    text(ctx, `${counted} C`, gx, (T + B) / 2, { color: col.ink, size: 22, weight: 700, align: 'center' });
    text(ctx, 'counted so far', gx, (T + B) / 2 + 20, { color: col.muted, size: 11, align: 'center' });
  };
  cv.redraw(); say();
}
