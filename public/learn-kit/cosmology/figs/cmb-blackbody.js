// 7.2 The CMB spectrum and redshift. Today the CMB is a blackbody at 2.7255 K peaking at 160.2 GHz (COBE FIRAS
// measured it to better than 50 parts per million). Slide back in time: at redshift z the same light was a
// blackbody at T = 2.7255 (1 + z) K, with (1 + z)³ more photons in each cm³. Stretching every photon's
// frequency by 1/(1+z) and thinning them by (1+z)³ turns one Planck curve exactly into the cooler one, which is
// why the expanding universe keeps the CMB a perfect blackbody. Axes: frequency (log) against brightness
// per unit frequency B_ν (log).
import { canvas, axes, line, dot, text, title, row, slider, readout, fmt } from '../../kit.js';
import { H_PLANCK, K_B, C, T_CMB, ageGyr, PLANCK18 } from '../phys.js';

const Bnu = (nu, T) => (2 * H_PLANCK * nu ** 3) / (C * C) / Math.expm1((H_PLANCK * nu) / (K_B * T));
const nuPeak = (T) => 2.8214 * K_B * T / H_PLANCK;

export default function (host) {
  const cv = canvas(host, { aspect: 0.68, max: 440, min: 320, label: 'The blackbody spectrum of the cosmic microwave background today and at an earlier redshift' });
  let lz = Math.log10(1 + 1089);
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Look back to redshift z', min: 0, max: Math.log10(1101), step: 0.01, value: lz, fmt: (v) => fmt(Math.round(10 ** v - 1), 4), oninput: (v) => { lz = v; show(); cv.redraw(); } });
  const out = readout(host);
  // FIRAS sampled 2 to 21 per cm, about 60 to 630 GHz
  const firas = Array.from({ length: 22 }, (_, i) => 6e10 * (10.5) ** (i / 21));
  const show = () => {
    const z = 10 ** lz - 1, T = T_CMB * (1 + z), nu = nuPeak(T), lam = 2.897771955e-3 / T;
    const age = ageGyr(z, PLANCK18) * 1e9;
    const ageTxt = age > 1e9 ? `${(age / 1e9).toFixed(1)} billion years` : age > 1e6 ? `${(age / 1e6).toFixed(age > 1e8 ? 0 : 1)} million years` : `${Math.round(age / 1e3).toLocaleString('en-CA')},000 years`;
    const lamTxt = lam > 1e-3 ? `${(lam * 1e3).toFixed(2)} mm` : lam > 1e-6 ? `${(lam * 1e6).toFixed(lam > 1e-5 ? 0 : 1)} µm` : `${Math.round(lam * 1e9)} nm`;
    const nuTxt = nu < 1e12 ? `${(nu / 1e9).toFixed(1)} GHz` : `${(nu / 1e12).toFixed(nu < 1e13 ? 2 : 0)} THz`;
    out.innerHTML = z < 0.5
      ? `Today: <b>T = 2.7255 K</b>, brightest at <b>160.2 GHz</b> (Wien's wavelength peak 1.06 mm), about <b>411 photons in every cm³</b>. The dots are COBE FIRAS measurements; their errors are far smaller than the dots.`
      : `At z = ${fmt(Math.round(z), 4)} (universe about ${ageTxt} old): <b>T = ${fmt(T, 4)} K</b>, brightest at <b>${nuTxt}</b> (Wien peak ${lamTxt}), about <b>${fmt(411 * (1 + z) ** 3, 3)} photons per cm³</b>. Stretch every photon by ${fmt(1 + z, 4)} and spread them over ${fmt((1 + z) ** 3, 3)} times the volume, and you get today's curve exactly.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const z = 10 ** lz - 1, T = T_CMB * (1 + z);
    const A = axes(ctx, w, h, col, { x: [1e9, 1e15], y: [1e-22, 1e-7], xlog: true, ylog: true, t: 42, l: 50,
      xt: [1e9, 1e10, 1e11, 1e12, 1e13, 1e14, 1e15], fx: (v) => ({ 1e9: '1 GHz', 1e10: '', 1e11: '100 GHz', 1e12: '', 1e13: '10 THz', 1e14: '', 1e15: '' })[v] ?? '',
      yt: [1e-21, 1e-18, 1e-15, 1e-12, 1e-9], xlabel: 'Frequency (log scale)', ylabel: 'Brightness B_ν (log)' });
    ctx.save(); A.clip();
    // visible light band
    ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.18; ctx.fillRect(A.X(4e14), A.T, A.X(7.9e14) - A.X(4e14), A.B - A.T); ctx.globalAlpha = 1;
    const curve = (TT) => { const pts = []; for (let i = 0; i <= 240; i++) { const nu = 10 ** (9 + (6 * i) / 240), b = Bnu(nu, TT); if (b > 1e-23) pts.push([A.X(nu), A.Y(b)]); } return pts; };
    if (z >= 0.5) line(ctx, curve(T), col.s[1], 2.5);
    line(ctx, curve(T_CMB), col.s[0], 2.5);
    firas.forEach((nu) => dot(ctx, A.X(nu), A.Y(Bnu(nu, T_CMB)), 3, col.ink));
    dot(ctx, A.X(4.08e9), A.Y(Bnu(4.08e9, T_CMB)), 4.5, col.s[2], col.panel);
    ctx.restore();
    text(ctx, 'visible', A.X(5.6e14), A.T + 10, { color: col.muted, size: 10.5, align: 'center' });
    const p0 = nuPeak(T_CMB);
    text(ctx, 'today, 2.7 K', A.X(p0), A.Y(Bnu(p0, T_CMB)) - 12, { color: col.s[0], size: 11.5, weight: 700, align: 'center', halo: col.panel });
    text(ctx, 'Penzias & Wilson', A.X(4.08e9) + 6, A.Y(Bnu(4.08e9, T_CMB)) + 14, { color: col.s[2], size: 10.5, weight: 700, halo: col.panel });
    if (z >= 0.5) {
      const p = nuPeak(T);
      text(ctx, `then, ${fmt(T, 3)} K`, A.X(p), A.Y(Bnu(p, T)) - 12, { color: col.s[1], size: 11.5, weight: 700, align: 'center', halo: col.panel });
    }
    title(ctx, 'The CMB stays a perfect blackbody as it cools', col);
  };
  show(); cv.redraw();
}
