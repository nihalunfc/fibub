// Metal, semiconductor or insulator? Set the band gap and the temperature. Electrons (orange) are thermally lifted from
// the valence band into the conduction band, leaving holes (rings). The count follows n_i ≈ 3×10¹⁹ (T/300)^1.5 e^(−Eg/2kT)
// cm⁻³ (drawn on a log scale). Shine a photon: if hν ≥ Eg it is absorbed and makes an extra electron-hole pair.
import { canvas, text, row, slider, choice, button, readout, loop, title, rng, line, fmt } from '../kit.js';

const KB = 8.617e-5;
const PRE = { metal: ['Metal', 0], ge: ['Ge', 0.67], si: ['Si', 1.12], gaas: ['GaAs', 1.42], dia: ['Diamond', 5.5] };
export default function (host) {
  let phot = null, extra = 0, extraT = 0;
  const R = rng(5), P = Array.from({ length: 60 }, () => [R(), R(), R() * 6.28]);
  const cv = canvas(host, { aspect: 0.85, max: 380, min: 290, label: 'Valence and conduction bands with thermally excited electrons' });
  const ctl = row(host);
  const sg = slider(ctl, { label: 'Band gap Eg (eV)', min: 0, max: 6, step: 0.01, value: 1.12, fmt: (v) => v.toFixed(2) + ' eV', oninput: () => show() });
  choice(ctl, 'Material', Object.entries(PRE).map(([k, v]) => [k, v[0]]), 'si', (k) => { sg.set(PRE[k][1]); show(); });
  const sT = slider(ctl, { label: 'Temperature T (K)', min: 10, max: 1200, step: 5, value: 300, fmt: (v) => v + ' K', oninput: () => show() });
  const sp = slider(ctl, { label: 'Photon energy hν (eV)', min: 0.3, max: 6, step: 0.05, value: 2, fmt: (v) => v.toFixed(2), oninput: () => {} });
  const ctl2 = row(host);
  button(ctl2, 'Shine a photon', () => { phot = 0; });
  loop(host, (dt) => {
    if (phot !== null) { phot += dt * 0.8; if (phot >= 1) { if (sp.value >= sg.value && sg.value > 0) { extra = 4; extraT = 2.5; } phot = null; } }
    if (extraT > 0) { extraT -= dt; if (extraT <= 0) extra = 0; }
    cv.redraw();
  }).button(ctl2);
  const out = readout(host);
  const ni = () => 3e19 * Math.pow(sT.value / 300, 1.5) * Math.exp(-sg.value / (2 * KB * sT.value));
  function show() { queueMicrotask(() => cv.redraw());
    const Eg = sg.value, n = ni();
    out.innerHTML = Eg < 0.05 ? `<b>Gap ≈ 0: a metal.</b> The bands overlap or the top band is half full, so there are about 10²² free electrons per cm³ at every temperature, and resistivity rises with T because of scattering.` : `<b>Eg = ${Eg.toFixed(2)} eV, T = ${sT.value} K.</b> kT = ${(KB * sT.value * 1000).toFixed(1)} meV; thermal carriers n = p ≈ ${fmt(n, 2)} cm⁻³ (Si at 300 K is about 10¹⁰). ${Eg > 4 ? 'This is an insulator: kT is tiny compared with the gap.' : 'Raise T or lower Eg and the carrier density climbs exponentially.'} ${sp.value >= Eg ? 'A photon of this energy can lift an electron across the gap.' : 'A photon of this energy is too weak to cross the gap, so the crystal is transparent to it.'}`;
  }
  cv.draw = (ctx, w, h, col) => {
    const Eg = sg.value, L = 54, Rr = w - 16, top = 52, bot = h - 20, ET = 7, sc = (bot - top) / ET;
    const mid = (top + bot) / 2, vTop = mid + Math.max(Eg, 0.35) * sc / 2, cBot = mid - Math.max(Eg, 0.35) * sc / 2, gap = Eg < 0.05;
    const vt = gap ? mid + 10 : vTop, cb = gap ? mid - 10 : cBot;
    ctx.fillStyle = col.soft; ctx.fillRect(L, top, Rr - L, Math.min(cb, mid) - top);
    ctx.fillRect(L, Math.max(vt, mid), Rr - L, bot - Math.max(vt, mid));
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.strokeRect(L, top, Rr - L, bot - top);
    text(ctx, 'conduction band', L + 6, top + 12, { color: col.muted, size: 11 });
    text(ctx, 'valence band', L + 6, bot - 10, { color: col.muted, size: 11 });
    if (!gap) {
      line(ctx, [[L - 6, cb], [L, cb]], col.ink, 1.5); line(ctx, [[L - 6, vt], [L, vt]], col.ink, 1.5);
      text(ctx, 'Eg = ' + Eg.toFixed(2) + ' eV', (L + Rr) / 2, mid, { color: col.ink, size: 12, weight: 700, align: 'center' });
      text(ctx, 'E_c', L - 8, cb, { color: col.muted, size: 10.5, align: 'right' }); text(ctx, 'E_v', L - 8, vt, { color: col.muted, size: 10.5, align: 'right' });
    } else text(ctx, 'bands overlap: no gap', (L + Rr) / 2, mid, { color: col.ink, size: 12, weight: 700, align: 'center' });
    const n = ni(), N = gap ? 50 : Math.min(55, Math.max(0, Math.round(2.2 * (Math.log10(n) - 5)))) + extra, t = performance.now() / 1000;
    for (let i = 0; i < N; i++) {
      const p = P[i % P.length], x = L + 14 + p[0] * (Rr - L - 28) + Math.sin(t * 1.5 + p[2]) * 6, ye = cb - 8 - p[1] * Math.min(cb - top - 14, 70) + Math.cos(t * 1.3 + p[2]) * 4, yh = vt + 8 + p[1] * Math.min(bot - vt - 14, 60) + Math.sin(t * 1.1 + p[2]) * 3;
      ctx.beginPath(); ctx.arc(x, ye, 4, 0, 7); ctx.fillStyle = col.s[1]; ctx.fill();
      if (!gap) { ctx.beginPath(); ctx.arc(x, yh, 4, 0, 7); ctx.lineWidth = 1.6; ctx.strokeStyle = col.s[5]; ctx.stroke(); }
    }
    if (phot !== null) { const x = L + 20 + phot * (Rr - L - 60), y = top + 18 + phot * (bot - top - 40); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i < 20; i++) ctx.lineTo(x - i * 2, y - i * 1.2 + Math.sin(i) * 3); ctx.stroke(); text(ctx, 'hν', x + 6, y - 6, { color: col.s[2], size: 11, weight: 700 }); }
    title(ctx, 'Bands: dots = electrons, rings = holes', col);
    text(ctx, 'dots on a log scale', 10, bot + 6, { color: col.muted, size: 10 });
  };
  show();
}
