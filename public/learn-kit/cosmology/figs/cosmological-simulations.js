// 10.9 A real (if tiny) cosmological N-body simulation, running in your browser: 16,384 particles in a 2-D
// periodic box that expands with the universe (comoving coordinates), using the particle-mesh method:
//   1. spread each particle's mass onto a 64 × 64 grid (cloud-in-cell),
//   2. solve for gravity on the grid with a fast Fourier transform (∇²φ = δ), smoothed over about one cell
//      (the softening, which stops close pairs flinging each other about),
//   3. read the pull back at each particle, 4. kick the velocities and drift the positions, then repeat.
// Time variable s = ln a in a matter-only (Einstein-de Sitter) universe: dx/ds = w, dw/ds = −w/2 − (3/2)∇φ,
// whose linear solution is δ ∝ a. Starts from Zel'dovich displacements at a = 0.02, runs to a = 1.6 (in units
// where the starting ripples would have rms δ = 2.5 at a = 1). 2-D gravity is not 3-D gravity, but the web it
// makes looks the same: the method is the one the big simulations use, at a millionth of the size.
import { canvas, text, title, row, readout, loop, button, calm, rng } from '../../kit.js';
import { randomField, displacement, fft2, kOf, rgbOf } from './cosmic-web-field.js';

const G = 64, NP = 128, N = NP * NP, A0 = 0.02, A1 = 1.6, DS = 0.03;

export default function (host) {
  const cv = canvas(host, { aspect: 1.02, max: 520, min: 330, label: 'A small particle simulation in which matter clumps into filaments and clusters as the universe expands' });
  let x, y, wx, wy, s, seed = 3, steps = 0;
  const rho = new Float64Array(G * G), im = new Float64Array(G * G);
  const fx = new Float64Array(G * G), fy = new Float64Array(G * G);
  const soft = new Float64Array(G * G);
  for (let j = 0; j < G; j++) for (let i = 0; i < G; i++) { const kx = kOf(i, G), ky = kOf(j, G), k2 = kx * kx + ky * ky; soft[j * G + i] = k2 ? Math.exp(-k2 * 0.6) / k2 : 0; }
  const reset = () => {
    const F = displacement(randomField(NP, seed, { slope: -1.1, kc: 0.9 }), NP);
    x = new Float64Array(N); y = new Float64Array(N); wx = new Float64Array(N); wy = new Float64Array(N);
    const c = G / NP; // grid cells per particle spacing
    const jr = rng(seed + 1); // nudge particles off a perfect grid so it does not show in the picture
    for (let j = 0; j < NP; j++) for (let i = 0; i < NP; i++) {
      const p = j * NP + i;
      wx[p] = 2.5 * A0 * F.px[p] * c; wy[p] = 2.5 * A0 * F.py[p] * c;
      x[p] = ((i + jr()) * c + wx[p] + G) % G; y[p] = ((j + jr()) * c + wy[p] + G) % G;
    }
    s = Math.log(A0); steps = 0;
  };
  const forces = () => {
    rho.fill(0); im.fill(0);
    const m = (G * G) / N;
    for (let p = 0; p < N; p++) { // cloud-in-cell
      const gx = x[p] - 0.5, gy = y[p] - 0.5, i0 = Math.floor(gx), j0 = Math.floor(gy), dx = gx - i0, dy = gy - j0;
      const i1 = (i0 + 1 + G) % G, j1 = (j0 + 1 + G) % G, ia = (i0 + G) % G, ja = (j0 + G) % G;
      rho[ja * G + ia] += m * (1 - dx) * (1 - dy); rho[ja * G + i1] += m * dx * (1 - dy);
      rho[j1 * G + ia] += m * (1 - dx) * dy; rho[j1 * G + i1] += m * dx * dy;
    }
    for (let i = 0; i < G * G; i++) rho[i] -= 1; // δ
    fft2(rho, im, G);
    // −∇φ = ifft( i k δ_k / k² ); pack x and y: ifft(i kx S − ky S) with S = δ_k/k² (softened)
    for (let j = 0; j < G; j++) for (let i = 0; i < G; i++) {
      const q = j * G + i, kx = kOf(i, G), ky = kOf(j, G), sr = rho[q] * soft[q], si = im[q] * soft[q];
      fx[q] = -kx * si - ky * sr; fy[q] = kx * sr - ky * si;
    }
    fft2(fx, fy, G, true);
  };
  const accel = (p) => {
    const gx = x[p] - 0.5, gy = y[p] - 0.5, i0 = Math.floor(gx), j0 = Math.floor(gy), dx = gx - i0, dy = gy - j0;
    const i1 = (i0 + 1 + G) % G, j1 = (j0 + 1 + G) % G, ia = (i0 + G) % G, ja = (j0 + G) % G;
    const a = ja * G + ia, b = ja * G + i1, c = j1 * G + ia, d = j1 * G + i1;
    const w1 = (1 - dx) * (1 - dy), w2 = dx * (1 - dy), w3 = (1 - dx) * dy, w4 = dx * dy;
    return [fx[a] * w1 + fx[b] * w2 + fx[c] * w3 + fx[d] * w4, fy[a] * w1 + fy[b] * w2 + fy[c] * w3 + fy[d] * w4];
  };
  const kick = (h) => {
    forces();
    const damp = Math.exp(-h / 2);
    for (let p = 0; p < N; p++) { const [ax, ay] = accel(p); wx[p] = wx[p] * damp + 1.5 * ax * h; wy[p] = wy[p] * damp + 1.5 * ay * h; }
  };
  const drift = (h) => { for (let p = 0; p < N; p++) { x[p] = (x[p] + wx[p] * h + G) % G; y[p] = (y[p] + wy[p] * h + G) % G; } };
  const advance = () => {
    if (s >= Math.log(A1)) return false;
    kick(DS / 2); drift(DS); kick(DS / 2); s += DS; steps++;
    return true;
  };
  reset();
  const ctl = row(host);
  const anim = loop(host, () => { const more = advance(); cv.redraw(); show(); if (!more) anim.pause(); }, { autoplay: true });
  anim.button(ctl);
  button(ctl, 'New universe', () => { seed = 1 + Math.floor(Math.random() * 1e6); reset(); if (calm()) while (advance()); cv.redraw(); show(); anim.play(); });
  const out = readout(host);
  const show = () => { out.innerHTML = `Step <b>${steps}</b>. The universe is <b>${(Math.exp(s) / A0).toFixed(0)} times</b> bigger than at the start. Each step: mass onto the grid → gravity from a Fourier transform → kick → drift.`; };
  if (calm()) while (advance());
  const off = document.createElement('canvas');
  cv.draw = (ctx, w, h, col) => {
    const a = Math.exp(s);
    const Y0 = title(ctx, a < 0.15 ? 'Almost smooth' : a < 0.5 ? 'Lumps and threads appear' : 'A web, made by gravity', col) + 2;
    const size = Math.min(w - 20, h - Y0 - 20), X0 = (w - size) / 2, S = Math.max(1, Math.round(size));
    off.width = S; off.height = S;
    const oc = off.getContext('2d'), img = oc.createImageData(S, S), acc = new Float32Array(S * S);
    const sc = S / G;
    for (let p = 0; p < N; p++) acc[((y[p] * sc) | 0) * S + ((x[p] * sc) | 0)] += 1;
    const bg = rgbOf(col.panel), ink = rgbOf(col.ink), per = N / (S * S);
    for (let q = 0; q < S * S; q++) {
      const al = acc[q] ? 1 - Math.exp(-acc[q] / (per * 3)) : 0;
      img.data[q * 4] = bg[0] + (ink[0] - bg[0]) * al; img.data[q * 4 + 1] = bg[1] + (ink[1] - bg[1]) * al;
      img.data[q * 4 + 2] = bg[2] + (ink[2] - bg[2]) * al; img.data[q * 4 + 3] = 255;
    }
    oc.putImageData(img, 0, 0);
    ctx.drawImage(off, X0, Y0, size, size);
    ctx.strokeStyle = col.line; ctx.strokeRect(X0 + 0.5, Y0 + 0.5, size - 1, size - 1);
    text(ctx, `scale factor a = ${a.toFixed(2)}`, X0, Y0 + size + 10, { color: col.muted, size: 11 });
  };
  cv.redraw(); show();
}
