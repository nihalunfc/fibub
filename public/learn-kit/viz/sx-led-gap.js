// Why LEDs have colours. An electron falls from the conduction band into a hole in the valence band and gives out a photon
// of energy about Eg, so λ = 1240 / Eg(eV) nm. Pick an LED material (or drag the gap) and watch recombination make photons;
// the colour bar shows where λ falls, and the forward voltage is about Eg/q. Gaps below 1.65 eV are infrared, above 3.1 eV ultraviolet.
import { canvas, text, row, slider, choice, readout, loop, title, line, rng } from '../kit.js';

const PRE = { ir: ['IR (GaAs)', 1.42], red: ['Red (AlGaInP)', 1.95], grn: ['Green (InGaN)', 2.3], blu: ['Blue (InGaN)', 2.75], uv: ['UV (AlGaN)', 3.5] };
// approximate visible colour of a wavelength (nm): a display aid, not a measurement
const rgb = (nm) => {
  let r = 0, g = 0, b = 0;
  if (nm >= 380 && nm < 440) { r = (440 - nm) / 60; b = 1; } else if (nm < 490) { g = (nm - 440) / 50; b = 1; } else if (nm < 510) { g = 1; b = (510 - nm) / 20; } else if (nm < 580) { r = (nm - 510) / 70; g = 1; } else if (nm < 645) { r = 1; g = (645 - nm) / 65; } else if (nm <= 750) r = 1;
  const f = nm < 420 ? 0.4 + 0.6 * (nm - 380) / 40 : nm > 700 ? 0.4 + 0.6 * (750 - nm) / 50 : 1;
  return `rgb(${Math.round(255 * r * f)},${Math.round(255 * g * f)},${Math.round(255 * b * f)})`;
};
export default function (host) {
  const R = rng(3), ev = [];
  const cv = canvas(host, { aspect: 0.78, max: 360, min: 270, label: 'Electrons falling across the band gap and emitting photons of one colour' });
  const ctl = row(host);
  const sg = slider(ctl, { label: 'Band gap Eg (eV)', min: 0.8, max: 3.8, step: 0.01, value: 1.95, fmt: (v) => v.toFixed(2) + ' eV', oninput: () => show() });
  choice(ctl, 'LED', Object.entries(PRE).map(([k, v]) => [k, v[0]]), 'red', (k) => { sg.set(PRE[k][1]); show(); });
  loop(host, (dt) => {
    if (R() < dt * 4) ev.push({ t: 0, x: 0.12 + R() * 0.6 });
    ev.forEach((e) => (e.t += dt * 0.9)); while (ev.length && ev[0].t > 1.4) ev.shift();
    cv.redraw();
  }).button(row(host));
  const out = readout(host);
  const lam = () => 1239.84 / sg.value;
  function show() {
    const l = lam(), Eg = sg.value, kind = l < 380 ? 'ultraviolet, invisible' : l > 750 ? 'infrared, invisible' : 'visible';
    out.innerHTML = `<b>Eg = ${Eg.toFixed(2)} eV gives λ = 1240 / ${Eg.toFixed(2)} = ${l.toFixed(0)} nm</b> (${kind}). Forward voltage to turn on is about Eg/q ≈ ${Eg.toFixed(1)} V. A bigger gap means a bluer, higher-energy photon; that is why blue LEDs needed gallium nitride and were hard to make.`;
  }
  cv.draw = (ctx, w, h, col) => {
    const Eg = sg.value, l = lam(), c = l >= 380 && l <= 750 ? rgb(l) : col.muted;
    const L = 20, Rr = w - 20, top = 56, bot = h - 80, mid = (top + bot) / 2, g = Math.min(mid - top - 14, 20 + Eg * 22), cb = mid - g, vb = mid + g;
    ctx.fillStyle = col.soft; ctx.fillRect(L, top, Rr - L, cb - top); ctx.fillRect(L, vb, Rr - L, bot - vb);
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1.4; ctx.strokeRect(L, top, Rr - L, bot - top);
    text(ctx, 'conduction band (electrons)', L + 6, top + 12, { color: col.muted, size: 11 }); text(ctx, 'valence band (holes)', L + 6, bot - 10, { color: col.muted, size: 11 });
    text(ctx, 'Eg', (L + Rr) / 2 - 40, mid, { color: col.ink, size: 12, weight: 700 });
    line(ctx, [[(L + Rr) / 2 - 22, cb + 4], [(L + Rr) / 2 - 22, vb - 4]], col.ink, 1.5);
    ev.forEach((e) => {
      const x = L + 10 + e.x * (Rr - L - 20);
      if (e.t < 0.6) { const y = cb - 9 + (vb + 9 - cb + 9) * (e.t / 0.6) ** 2; ctx.beginPath(); ctx.arc(x, y, 4.5, 0, 7); ctx.fillStyle = col.s[1]; ctx.fill(); ctx.beginPath(); ctx.arc(x, vb + 9, 4.5, 0, 7); ctx.lineWidth = 1.6; ctx.strokeStyle = col.s[5]; ctx.stroke(); }
      else { const u = (e.t - 0.6) / 0.8, px = x + u * 90 * 0.9, py = vb - u * 110; ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.beginPath(); for (let i = 0; i < 16; i++) ctx.lineTo(px - i * 1.6, py + i * 2 + Math.sin(i * 1.2) * 3); ctx.stroke(); }
    });
    // spectrum bar with the marker
    const by = h - 52, X = (nm) => L + ((nm - 350) / 650) * (Rr - L);
    for (let nm = 380; nm <= 750; nm += 5) { ctx.fillStyle = rgb(nm); ctx.fillRect(X(nm), by, X(nm + 5) - X(nm) + 1, 14); }
    ctx.fillStyle = col.line; ctx.fillRect(L, by, X(380) - L, 14); ctx.fillRect(X(750), by, Rr - X(750), 14);
    const mx = Math.max(L + 3, Math.min(Rr - 3, X(l)));
    ctx.fillStyle = col.ink; ctx.beginPath(); ctx.moveTo(mx, by - 2); ctx.lineTo(mx - 6, by - 11); ctx.lineTo(mx + 6, by - 11); ctx.closePath(); ctx.fill();
    text(ctx, `${l.toFixed(0)} nm`, Math.max(40, Math.min(w - 40, mx)), by - 18, { color: col.ink, size: 11, weight: 700, align: 'center' });
    text(ctx, 'UV', L, h - 22, { color: col.muted, size: 10.5 }); text(ctx, 'visible 380–750 nm', w / 2, h - 22, { color: col.muted, size: 10.5, align: 'center' }); text(ctx, 'IR', Rr, h - 22, { color: col.muted, size: 10.5, align: 'right' });
    title(ctx, 'Recombination makes a photon of energy Eg', col);
  };
  show();
}
