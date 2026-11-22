// Shared helpers for the Class 12 Physics chapters Wave Optics, Dual Nature and Atoms (c12p-wave-*, c12p-dual-*, c12p-atom-*).
// Not a figure itself (it lives next to figs/, not inside it).
export const PLANCK = 6.626e-34, LIGHT = 3e8, ECH = 1.602e-19, HC_EV_NM = 1239.84;
export const rad = (d) => (d * Math.PI) / 180;
/** Visible wavelength (nm) to an rgb() string; outside 380-750 nm it fades to a grey so ultraviolet and infrared still show. */
export function wl2rgb(nm, k = 1) {
  let r = 0, g = 0, b = 0;
  if (nm >= 380 && nm < 440) { r = (440 - nm) / 60; b = 1; }
  else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
  else if (nm < 510) { g = 1; b = (510 - nm) / 20; }
  else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
  else if (nm < 645) { r = 1; g = (645 - nm) / 65; }
  else if (nm <= 750) { r = 1; }
  else if (nm > 750) { return `rgb(${Math.round(110 * k)},${Math.round(60 * k)},${Math.round(60 * k)})`; }
  else { return `rgb(${Math.round(90 * k)},${Math.round(70 * k)},${Math.round(120 * k)})`; }
  let f = 1; if (nm < 420) f = 0.3 + 0.7 * (nm - 380) / 40; else if (nm > 700) f = 0.3 + 0.7 * (750 - nm) / 50;
  const c = (v) => Math.round(255 * Math.pow(Math.max(0, v) * f, 0.8) * k);
  return `rgb(${c(r)},${c(g)},${c(b)})`;
}
/** A wavy line (sine) from x0 to x1 around y, used for photons and waves. */
export function wavy(ctx, x0, x1, y, amp, wl, phase, color, width = 2) {
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath();
  for (let x = x0; x <= x1; x += 2) { const yy = y + amp * Math.sin(((x - x0) / wl) * 2 * Math.PI - phase); x === x0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); }
  ctx.stroke(); ctx.restore();
}
/** Write a number with a power of ten in plain text: 3.2 x 10^-19. */
export const sci = (v, d = 2) => { if (v === 0) return '0'; const e = Math.floor(Math.log10(Math.abs(v))), m = v / 10 ** e; return `${(+m.toPrecision(d)).toString()}×10${String(e).replace(/-/g, '⁻').replace(/\d/g, (c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[c])}`; };
