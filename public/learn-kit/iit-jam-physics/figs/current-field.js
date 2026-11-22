// 4.5 The magnetic field of a straight wire, a circular loop and a short solenoid, worked out by adding up
// Biot-Savart contributions from small pieces of wire (no formula is assumed). The picture is a slice through the
// axis: dots are current coming out of the screen, crosses current going in. Tap anywhere to read B there.
import { canvas, text, arrow, row, choice, slider, readout, fmt, dot } from '../../kit.js';

const MU0 = 4e-7 * Math.PI, R = 3, SEG = 72; // loop radius in cm
const UB = 9, VB = 6.5; // view half-width and half-height in cm

// Wire pieces [x, y, z, dlx, dly, dlz] in metres; screen u = x, v = y, the screen plane is z = 0.
function pieces(kind) {
  const P = [];
  const loopAt = (u0) => {
    for (let k = 0; k < SEG; k++) {
      const f = (2 * Math.PI * (k + 0.5)) / SEG, dl = (2 * Math.PI * R) / SEG / 100;
      P.push([u0 / 100, (R * Math.cos(f)) / 100, (R * Math.sin(f)) / 100, 0, -Math.sin(f) * dl, Math.cos(f) * dl]);
    }
  };
  if (kind === 'loop') loopAt(0);
  if (kind === 'solenoid') for (let i = 0; i < 8; i++) loopAt(-7 + 2 * i);
  return P;
}

export default function (host) {
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 250, label: 'Magnetic field lines of a wire, a loop and a solenoid' });
  let kind = 'loop', I = 5, pu = 0, pv = 0, P = pieces(kind), lines = [];
  // B in tesla at screen point (u, v) in cm, per ampere
  const B1 = (u, v) => {
    if (kind === 'wire') { const r2 = (u * u + v * v) / 1e4 || 1e-12; return [(-v / 100) * MU0 / (2 * Math.PI * r2), (u / 100) * MU0 / (2 * Math.PI * r2)]; }
    let bx = 0, by = 0; const x = u / 100, y = v / 100;
    for (const [px, py, pz, lx, ly, lz] of P) {
      const rx = x - px, ry = y - py, rz = -pz, r2 = rx * rx + ry * ry + rz * rz, r3 = r2 * Math.sqrt(r2);
      bx += (ly * rz - lz * ry) / r3; by += (lz * rx - lx * rz) / r3;
    }
    return [bx * 1e-7, by * 1e-7];
  };
  const wires = () => (kind === 'wire' ? [[0, 0, 1]] : kind === 'loop' ? [[0, R, 1], [0, -R, -1]] : Array.from({ length: 16 }, (_, i) => [-7 + 2 * (i >> 1), i % 2 ? -R : R, i % 2 ? -1 : 1]));
  const trace = () => {
    lines = [];
    if (kind === 'wire') return;
    const W = wires(), seeds = kind === 'loop' ? [-2.5, -1.7, -0.9, 0, 0.9, 1.7, 2.5] : [-2.4, -1.6, -0.8, 0, 0.8, 1.6, 2.4];
    for (const s0 of seeds) for (const dir of [1, -1]) {
      let u = kind === 'loop' ? 0 : 0.0, v = s0; const pts = [[u, v]];
      for (let s = 0; s < 1400; s++) {
        const [a, b] = B1(u, v), m = Math.hypot(a, b) || 1;
        const hu = u + dir * 0.05 * a / m, hv = v + dir * 0.05 * b / m;
        const [c, d] = B1(hu, hv), n = Math.hypot(c, d) || 1;
        u += dir * 0.1 * c / n; v += dir * 0.1 * d / n; pts.push([u, v]);
        if (Math.abs(u) > UB * 1.2 || Math.abs(v) > VB * 1.3) break;
        if (W.some(([wu, wv]) => Math.hypot(u - wu, v - wv) < 0.12)) break;
        if (s > 40 && Math.hypot(u, v - s0) < 0.08) break; // closed on itself
      }
      lines.push([dir, pts]);
    }
  };
  const ctl = row(host);
  choice(ctl, 'Wire', [['wire', 'Straight wire (end-on)'], ['loop', 'Circular loop'], ['solenoid', 'Short solenoid']], kind, (v) => { kind = v; P = pieces(kind); if (kind === 'wire' && Math.hypot(pu, pv) < 0.5) { pu = 2; pv = 0; } trace(); cv.redraw(); say(); });
  const ctl2 = row(host);
  slider(ctl2, { label: 'Current I', min: 0.5, max: 10, step: 0.5, value: I, fmt: (v) => fmt(v, 2) + ' A', oninput: (v) => { I = v; cv.redraw(); say(); } });
  const out = readout(host);
  const say = () => {
    const [a, b] = B1(pu, pv), B = Math.hypot(a, b) * I * 1e6;
    const ref = kind === 'wire' ? `For the wire, B = μ<sub>0</sub>I/2πs = <b>${fmt(MU0 * I / (2 * Math.PI * Math.max(Math.hypot(pu, pv), 1e-3) / 100) * 1e6, 3)} μT</b> at this distance.`
      : kind === 'loop' ? `At the centre the formula μ<sub>0</sub>I/2R gives ${fmt(MU0 * I / (2 * R / 100) * 1e6, 3)} μT.`
      : `An ideal long solenoid with the same turns per metre (50 /m) would give μ<sub>0</sub>nI = ${fmt(MU0 * 50 * I * 1e6, 3)} μT inside.`;
    out.innerHTML = `Probe at (${fmt(pu, 2)} cm, ${fmt(pv, 2)} cm): |B| = <b>${fmt(B, 3)} μT</b>, added up piece by piece from Biot-Savart. ${ref} Tap to move the probe.`;
  };
  let S = 1, Wd = 1, Hd = 1;
  cv.c.addEventListener('pointerdown', (e) => {
    const r = cv.c.getBoundingClientRect();
    pu = ((e.clientX - r.left) * (Wd / r.width) - Wd / 2) / S; pv = -((e.clientY - r.top) * (Hd / r.height) - Hd / 2) / S;
    cv.redraw(); say();
  });
  cv.draw = (ctx, w, h, col) => {
    Wd = w; Hd = h; S = Math.min(w / (2 * UB), h / (2 * VB));
    const X = (u) => w / 2 + u * S, Y = (v) => h / 2 - v * S;
    ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.3; ctx.globalAlpha = 0.75;
    if (kind === 'wire') {
      for (const rr of [0.8, 1.6, 2.6, 3.8, 5.3]) {
        ctx.beginPath(); ctx.arc(X(0), Y(0), rr * S, 0, 2 * Math.PI); ctx.stroke();
        arrow(ctx, X(rr) , Y(-0.3), X(rr), Y(0.3), col.ink, 1.3, 7); // anticlockwise for current out of the screen
      }
    } else {
      for (const [dir, pts] of lines) {
        ctx.beginPath(); pts.forEach(([u, v], i) => (i ? ctx.lineTo(X(u), Y(v)) : ctx.moveTo(X(u), Y(v)))); ctx.stroke();
        const m = Math.min(pts.length - 1, 30);
        if (m > 3) { const [a0, b0] = dir > 0 ? pts[m - 3] : pts[m], [a1, b1] = dir > 0 ? pts[m] : pts[m - 3]; arrow(ctx, X(a0), Y(b0), X(a1), Y(b1), col.ink, 1.3, 7); }
      }
    }
    ctx.restore();
    if (kind !== 'wire') { ctx.save(); ctx.strokeStyle = col.muted; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(0, Y(0)); ctx.lineTo(w, Y(0)); ctx.stroke(); ctx.restore(); }
    for (const [u, v, s] of wires()) {
      dot(ctx, X(u), Y(v), 8, col.panel, s > 0 ? col.s[3] : col.s[0]);
      if (s > 0) dot(ctx, X(u), Y(v), 2.5, col.s[3]);
      else { ctx.save(); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(u) - 4, Y(v) - 4); ctx.lineTo(X(u) + 4, Y(v) + 4); ctx.moveTo(X(u) + 4, Y(v) - 4); ctx.lineTo(X(u) - 4, Y(v) + 4); ctx.stroke(); ctx.restore(); }
    }
    ctx.save(); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(X(pu), Y(pv), 6, 0, 2 * Math.PI); ctx.stroke(); ctx.restore();
    text(ctx, '• current out of screen   × current into screen', 8, h - 10, { color: col.muted, size: 11, base: 'bottom' });
  };
  trace(); cv.redraw(); say();
}
