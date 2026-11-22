// 10.4 The cosmic web in the Zel'dovich approximation (1970): every bit of matter moves in a straight line from
// where it started, x = q + D ψ(q), where D is the growth of lumps (δ ∝ D) and ψ is fixed by the starting
// ripples. Matter streams out of underdense regions (voids) and piles up where streams cross: first along one
// direction (a pancake, which in this 2-D slice is a filament), then along both (a node, where clusters sit).
// Colouring by "web type" counts along how many directions a bit of matter has already collapsed, from the
// eigenvalues of the deformation tensor (Doroshkevich 1970). A 2-D slice with a made-up smooth spectrum: the
// look is right, the scale is not to any real survey. About 140 Mpc across if you want a number.
import { canvas, text, title, row, slider, choice, readout, rng } from '../../kit.js';
import { randomField, displacement, fft2, kOf, rgbOf } from './cosmic-web-field.js';

const n = 128;

export default function (host) {
  const cv = canvas(host, { aspect: 1.02, max: 520, min: 330, label: 'Matter moving from smooth ripples into a web of filaments, nodes and voids' });
  let D = 1.3, mode = 'type', seed = 7;
  let F, pos, cls;
  const build = () => {
    const field = randomField(n, seed, { slope: -1.4, kc: 0.7 });
    F = displacement(field, n);
    // deformation tensor T_ij = k_i k_j δ_k / k² (same normalisation as ψ)
    let s = 0; { const dr = new Float64Array(field.re), di = new Float64Array(field.im); fft2(dr, di, n, true); for (let i = 0; i < n * n; i++) s += dr[i] * dr[i]; }
    const norm = 1 / Math.sqrt(s / (n * n));
    const ar = new Float64Array(n * n), ai = new Float64Array(n * n), br = new Float64Array(n * n), bi = new Float64Array(n * n);
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const kx = kOf(x, n), ky = kOf(y, n), k2 = kx * kx + ky * ky, j = y * n + x;
      if (!k2) continue;
      const sr = field.re[j] / k2, si = field.im[j] / k2;
      // Txx + i Tyy = ifft(kx² S + i ky² S)
      ar[j] = kx * kx * sr - ky * ky * si; ai[j] = kx * kx * si + ky * ky * sr;
      br[j] = kx * ky * sr; bi[j] = kx * ky * si;
    }
    fft2(ar, ai, n, true); fft2(br, bi, n, true);
    cls = new Float64Array(n * n * 2);
    for (let i = 0; i < n * n; i++) {
      const a = ar[i] * norm, d = ai[i] * norm, b = br[i] * norm, m = (a + d) / 2, q = Math.sqrt(((a - d) / 2) ** 2 + b * b);
      cls[2 * i] = m + q; cls[2 * i + 1] = m - q; // λ1 ≥ λ2
    }
  };
  const jr = rng(3), jit = new Float32Array(n * n * 2).map(() => jr() - 0.5); // break up the starting grid
  build();
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Time (growth of lumps)', min: 0, max: 2, step: 0.01, value: D, fmt: (v) => (v === 0 ? 'start' : 'δ ≈ ' + v.toFixed(2)), oninput: (v) => { D = v; cv.redraw(); show(); } });
  choice(ctl, 'Colour', [['type', 'By web type'], ['plain', 'Plain']], mode, (v) => { mode = v; cv.redraw(); });
  const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'lk-btn'; btn.textContent = 'New ripples';
  btn.onclick = () => { seed = 1 + Math.floor(Math.random() * 1e6); build(); cv.redraw(); show(); };
  ctl.appendChild(btn);
  const out = readout(host);
  let counts = [0, 0, 0];
  const show = () => {
    const t = counts[0] + counts[1] + counts[2] || 1;
    out.innerHTML = `Share of matter, at this time: <b>${Math.round(100 * counts[0] / t)}%</b> still in voids and thin regions, <b>${Math.round(100 * counts[1] / t)}%</b> in filaments, <b>${Math.round(100 * counts[2] / t)}%</b> in nodes. Drag the slider back to the start: the web was already written in the faint ripples.`;
  };
  const off = document.createElement('canvas');
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, D === 0 ? 'Almost smooth: tiny ripples only' : D < 0.35 ? 'Matter starts to drift together' : 'A web: filaments, nodes and voids', col) + 4;
    const size = Math.min(w - 20, h - top - 30), X0 = (w - size) / 2, Y0 = top + 4;
    const S = Math.max(1, Math.round(size));
    off.width = S; off.height = S;
    const oc = off.getContext('2d'), img = oc.createImageData(S, S);
    const acc = new Float32Array(S * S * 3);
    counts = [0, 0, 0];
    const sc = S / n;
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const i = y * n + x;
      let px = (x + jit[2 * i] + D * F.px[i]) * sc, py = (y + jit[2 * i + 1] + D * F.py[i]) * sc;
      px = ((px % S) + S) % S; py = ((py % S) + S) % S;
      const c = (D * cls[2 * i + 1] >= 1 ? 2 : D * cls[2 * i] >= 1 ? 1 : 0);
      counts[c]++;
      const k = ((py | 0) * S + (px | 0)) * 3;
      acc[k + (mode === 'type' ? c : 0)] += 1;
    }
    const bg = rgbOf(col.panel), ink = rgbOf(col.ink), cs = [rgbOf(col.muted), rgbOf(col.s[0]), rgbOf(col.s[3])];
    const per = (n * n) / (S * S); // particles per pixel on average
    for (let p = 0; p < S * S; p++) {
      let r = bg[0], g = bg[1], b = bg[2];
      for (let c = 0; c < 3; c++) {
        const v = acc[p * 3 + c]; if (!v) continue;
        const al = 1 - Math.exp(-v / (per * 3.5));
        const cc = mode === 'type' ? cs[c] : ink;
        r += (cc[0] - r) * al; g += (cc[1] - g) * al; b += (cc[2] - b) * al;
      }
      img.data[p * 4] = r; img.data[p * 4 + 1] = g; img.data[p * 4 + 2] = b; img.data[p * 4 + 3] = 255;
    }
    oc.putImageData(img, 0, 0);
    ctx.drawImage(off, X0, Y0, size, size);
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.strokeRect(X0 + 0.5, Y0 + 0.5, size - 1, size - 1);
    const ly = Y0 + size + 14;
    if (mode === 'type') {
      const items = [['void / thin', col.muted], ['filament', col.s[0]], ['node', col.s[3]]];
      let x = X0;
      items.forEach(([t, c]) => { ctx.fillStyle = c; ctx.fillRect(x, ly - 5, 10, 10); text(ctx, t, x + 14, ly, { color: col.ink, size: 11.5 }); ctx.font = '11.5px system-ui'; x += 26 + ctx.measureText(t).width; });
    } else text(ctx, 'each dot is a bit of matter', X0, ly, { color: col.muted, size: 11.5 });
  };
  cv.redraw(); show();
}
