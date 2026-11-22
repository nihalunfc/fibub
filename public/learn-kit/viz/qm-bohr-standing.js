// de Broglie waves round a Bohr orbit: an electron wave must join up with itself, so the circumference holds a whole
// number of wavelengths, 2πr = nλ. Pick n (or switch to "any size" and drag the wavelength count to a fraction, where the
// wave fails to close and cancels itself). Readout gives r, v, λ, L = nħ and E for hydrogen.
import { canvas, text, title, row, slider, choice, readout, loop, dot, line } from '../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 320, label: 'An electron wave wrapped round a circular orbit' });
  let n = 3, mode = 'allowed', free = 3.5, ph = 0;
  const ctl = row(host), ctl2 = row(host), out = readout(host);
  choice(ctl, 'Orbit', [[1, 'n = 1'], [2, 'n = 2'], [3, 'n = 3'], [4, 'n = 4'], [5, 'n = 5'], [6, 'n = 6']], n, (v) => { n = v; mode = 'allowed'; g.set(); show(); });
  const g = choice(ctl2, 'Waves', [['allowed', 'Allowed (whole number)'], ['free', 'Any wavelength']], mode, (v) => { mode = v; show(); });
  g.set = () => {};
  slider(ctl2, { label: 'Wavelengths round', min: 1.5, max: 6.5, step: 0.05, value: free, fmt: (v) => v.toFixed(2), oninput: (v) => { free = v; mode = 'free'; show(); } });
  const anim = loop(host, (dt) => { ph += dt * 1.4; cv.redraw(); });
  anim.button(ctl2);
  const m = () => (mode === 'allowed' ? n : free);
  function show() {
    const k = m(), whole = Math.abs(k - Math.round(k)) < 0.02;
    const r = 0.0529 * n * n, v = 2.19e6 / n, lam = 2 * Math.PI * r / n;
    out.innerHTML = mode === 'allowed'
      ? `n = <b>${n}</b>: r = n²a₀ = <b>${r.toFixed(3)} nm</b>, v = c/137n = ${(v / 1e6).toFixed(2)}×10⁶ m/s, λ = h/mv = <b>${lam.toFixed(3)} nm</b> and 2πr/λ = ${n}. Angular momentum L = nħ. Energy E = −13.6/n² = <b>${(-13.6 / n / n).toFixed(2)} eV</b>.`
      : `${k.toFixed(2)} wavelengths round the circle: ${whole ? 'that is a whole number, so the wave closes: an allowed orbit.' : 'the wave does not meet its own start. Each lap it lands out of step with the last, the waves cancel and no stable orbit exists. Only whole numbers survive.'}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Standing wave on the orbit', col);
    const k = m(), cx = w / 2, cy = h * 0.47, R = Math.min(w * 0.33, h * 0.32), amp = R * 0.13;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]);
    dot(ctx, cx, cy, 7, col.s[2]); text(ctx, '+', cx, cy, { color: col.bg, size: 10, weight: 700, align: 'center' });
    // wave: radius offset = amp*cos(k*theta - ph) with wrap mismatch visible at theta=0
    const N = 360; ctx.beginPath();
    for (let i = 0; i <= N; i++) { const a = (i / N) * 2 * Math.PI; const r = R + amp * Math.cos(k * a - ph * 0) * Math.cos(ph); const x = cx + r * Math.cos(a), y = cy - r * Math.sin(a); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.4; ctx.stroke();
    // electron blob riding round
    const a = ph * (1.4 / Math.max(1, mode === 'allowed' ? n : 2)); dot(ctx, cx + R * Math.cos(a), cy - R * Math.sin(a), 5, col.s[1]);
    // join point
    dot(ctx, cx + R + amp * Math.cos(0), cy, 3.5, col.ink);
    if (Math.abs(k - Math.round(k)) >= 0.02) { const mis = Math.cos(k * 2 * Math.PI); text(ctx, 'start and end do not match', cx, cy + R + amp + 18, { color: col.bad, size: 11, weight: 600, align: 'center' }); }
    else text(ctx, `${Math.round(k)} full wavelengths: closes up`, cx, cy + R + amp + 18, { color: col.good, size: 11, weight: 600, align: 'center' });
  };
  show();
}
