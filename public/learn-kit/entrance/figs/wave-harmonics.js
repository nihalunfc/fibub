// Waves: standing waves and harmonics. A string fixed at both ends, a pipe open at both ends and a pipe closed at
// one end each allow only certain wavelengths, the ones that fit nodes (N) and antinodes (A) at the ends.
// The string and open pipe allow every harmonic n v/2L; the closed pipe only odd ones, n v/4L.
import { canvas, line, dot, text, row, slider, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let sys = 'string', n = 1, L = 0.8, t = 0;
  const cv = canvas(host, { aspect: 0.5, max: 300, min: 210, label: 'A standing wave on a string or in a pipe with its nodes and antinodes marked' });
  const ctl = row(host);
  choice(ctl, 'System', [['string', 'String'], ['open', 'Open pipe'], ['closed', 'Closed pipe']], sys, (v) => { sys = v; cv.redraw(); show(); });
  slider(ctl, { label: 'Mode', min: 1, max: 5, step: 1, value: n, fmt: (v) => `${v}`, oninput: (v) => { n = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'Length', min: 0.3, max: 1.5, step: 0.05, value: L, fmt: (v) => `${v.toFixed(2)} m`, oninput: (v) => { L = v; show(); } });
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); });
  anim.button(ctl);
  const out = readout(host);
  const v = () => (sys === 'string' ? 200 : 340);
  const harm = () => (sys === 'closed' ? 2 * n - 1 : n); // which harmonic this mode is
  const lam = () => (sys === 'closed' ? (4 * L) / harm() : (2 * L) / n);
  const show = () => {
    const f = v() / lam(), base = sys === 'closed' ? v() / (4 * L) : v() / (2 * L);
    const rule = sys === 'closed' ? `Closed pipe: node at the closed end, antinode at the open end. Only odd harmonics: f = (2n − 1)v/4L.` : sys === 'open' ? 'Open pipe: antinodes at both ends. All harmonics: f = nv/2L.' : 'String fixed at both ends: nodes at both ends. All harmonics: f = nv/2L.';
    out.innerHTML = `${rule} Here v = ${v()} m/s, λ = ${lam().toFixed(3)} m, f = <b>${f.toFixed(0)} Hz</b>, the ${ord(harm())} harmonic (fundamental ${base.toFixed(0)} Hz).`;
  };
  const ord = (k) => k + (k === 1 ? 'st' : k === 2 ? 'nd' : k === 3 ? 'rd' : 'th');
  cv.draw = (ctx, w, h, col) => {
    const x0 = 24, x1 = w - 24, yc = h * 0.52, amp = h * 0.26, K = (2 * Math.PI) / lam();
    // shape: string has sin(kx), open pipe (displacement) cos(kx), closed pipe (closed at left) sin(kx)
    const shape = (x) => (sys === 'open' ? Math.cos(K * x) : Math.sin(K * x));
    if (sys !== 'string') { ctx.strokeStyle = col.muted; ctx.lineWidth = 2; line(ctx, [[x0, yc - amp - 10], [x1, yc - amp - 10]], col.muted, 2); line(ctx, [[x0, yc + amp + 10], [x1, yc + amp + 10]], col.muted, 2); if (sys === 'closed') line(ctx, [[x0, yc - amp - 10], [x0, yc + amp + 10]], col.ink, 4); }
    const X = (x) => x0 + (x / L) * (x1 - x0), c = Math.cos(2 * Math.PI * 0.6 * t);
    const env = (s) => Array.from({ length: 161 }, (_, i) => { const x = (L * i) / 160; return [X(x), yc - s * amp * shape(x)]; });
    line(ctx, env(1), col.line, 1, [4, 4]); line(ctx, env(-1), col.line, 1, [4, 4]);
    line(ctx, env(c), col.s[0], 3);
    if (sys === 'string') { dot(ctx, x0, yc, 4, col.ink); dot(ctx, x1, yc, 4, col.ink); }
    // nodes and antinodes
    for (let i = 0; i <= 400; i++) {
      const x = (L * i) / 400, s = shape(x), sp = shape(x + L / 400);
      if (Math.abs(s) < 1e-9 || (i < 400 && s * sp < 0 && Math.abs(sp) > 1e-9)) { dot(ctx, X(x), yc, 4, col.s[1]); text(ctx, 'N', X(x), yc + amp + 24, { color: col.s[1], size: 11, weight: 700, align: 'center' }); }
    }
    const nA = Math.round((2 * L) / (lam() / 2)) + 2;
    for (let j = 0; j <= nA; j++) { const x = (j * lam()) / 2 + (sys === 'open' ? 0 : lam() / 4); if (x <= L + 1e-9) text(ctx, 'A', X(x), yc - amp - 22, { color: col.s[2], size: 11, weight: 700, align: 'center' }); }
    text(ctx, sys === 'string' ? 'String' : 'Air displacement in the pipe', x0, 12, { color: col.muted, size: 11 });
  };
  cv.redraw(); show();
}
