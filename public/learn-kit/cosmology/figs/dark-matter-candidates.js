// 8.5 Dark matter candidates on one mass scale, from 10⁻²² eV to 1,000 suns (a log scale: each tick is a factor
// of 10¹⁰). Masses as energy, E = mc²: 1 eV/c² = 1.783e-36 kg; a proton is 0.938 GeV; the Sun is 1.116e66 eV.
// Ranges are the usual ones in reviews (rounded), with a colour for status: still open, squeezed, or ruled out as
// most of the dark matter. Tap a candidate to read about it.
import { canvas, text, title, line, row, choice, readout } from '../../kit.js';

const SUN = 1.116e66; // eV
const L = Math.log10;
const C = [
  { id: 'fuzzy', name: 'Ultralight "fuzzy" dark matter', lo: 1e-22, hi: 1e-19, st: 'warn', about: 'Particles so light that their quantum waves are thousands of light-years long, smoothing out the middles of small galaxies. The lightest masses (below about 10⁻²¹ to 10⁻²⁰ eV) are now disfavoured by the Lyman-alpha forest and dwarf galaxies.' },
  { id: 'axion', name: 'Axions', lo: 1e-6, hi: 1e-3, st: 'good', about: 'A particle proposed in 1977-78 to fix a puzzle about the strong force. Around a millionth to a thousandth of an eV, they would turn into microwave photons in a strong magnet. ADMX and other "haloscopes" have checked only narrow slices so far.' },
  { id: 'nu', name: 'Ordinary neutrinos (hot)', lo: 0.009, hi: 0.45, st: 'bad', about: 'Real, measured particles, and a little bit of dark matter. But they are far too light and were moving close to light speed early on (hot dark matter), which would have smeared out galaxy-sized lumps. They make up at most about 1% of the dark matter.' },
  { id: 'sterile', name: 'Sterile neutrinos', lo: 1e3, hi: 1e5, st: 'warn', about: 'A heavier, shyer kind of neutrino, at a few thousand eV (keV): warm dark matter. They would slowly decay and give off X-rays at one energy; searches have ruled out much of the range.' },
  { id: 'wimp', name: 'WIMPs', lo: 1e10, hi: 1e13, st: 'warn', about: 'Weakly interacting massive particles, about 10 to 10,000 times a proton. If they interact about as weakly as neutrinos, the hot early universe leaves just the right amount (the "WIMP miracle"). Xenon detectors, the LHC and gamma-ray telescopes have squeezed the simplest versions hard.' },
  { id: 'pbh', name: 'Primordial black holes', lo: 2.8e47, hi: 1e3 * SUN, st: 'warn', hiWin: [1.1e50, 1.1e55], about: 'Black holes made in the first second, not by dying stars. Any lighter than about 500 million tonnes would have evaporated by now (Hawking radiation). Most masses are ruled out as the bulk of dark matter; a window around asteroid mass (darker band) is still open.' },
  { id: 'macho', name: 'MACHOs: dim stars, brown dwarfs', lo: 1e-7 * SUN, hi: 15 * SUN, st: 'bad', about: 'Massive compact halo objects made of ordinary matter. The MACHO and EROS surveys watched millions of stars for microlensing flashes in the 1990s and 2000s and found far too few: they are at most a small fraction of the halo. (Big Bang nucleosynthesis also says there are not enough atoms.)' },
];
const MARKS = [[5.11e5, 'electron'], [9.38e8, 'proton'], [3.9e37, 'a person'], [SUN, 'the Sun']];

export default function (host) {
  const cv = canvas(host, { aspect: 0.82, max: 470, min: 380, label: 'Dark matter candidates on a mass scale from 10 to the minus 22 electronvolts to a thousand solar masses' });
  let sel = 'wimp';
  const ctl = row(host);
  choice(ctl, 'Read about', C.map((c) => [c.id, c.name.replace(/ \(.*|:.*| ".*"/g, '')]), sel, (v) => { sel = v; cv.redraw(); show(); });
  const out = readout(host);
  const show = () => { const c = C.find((x) => x.id === sel); out.innerHTML = `<b>${c.name}.</b> ${c.about}`; };
  cv.draw = (ctx, w, h, col) => {
    const x0 = -23, x1 = 70, Lp = 12, Rp = w - 12, X = (v) => Lp + ((L(v) - x0) / (x1 - x0)) * (Rp - Lp);
    const top = 60, rowH = (h - top - 64) / C.length, axisY = top + rowH * C.length + 6;
    const stc = { good: col.s[2], warn: col.s[3], bad: col.s[7] };
    C.forEach((c, i) => {
      const y = top + i * rowH, on = c.id === sel;
      text(ctx, c.name, X(c.lo) < w * 0.55 ? Math.max(Lp, X(c.lo)) : Math.min(X(c.hi), Rp), y + 8, { color: on ? col.ink : col.muted, size: 10.5, weight: on ? 700 : 500, align: X(c.lo) < w * 0.55 ? 'left' : 'right', halo: col.panel });
      const bx = X(c.lo), bw = Math.max(4, X(c.hi) - X(c.lo));
      ctx.save(); ctx.globalAlpha = on ? 1 : 0.55; ctx.fillStyle = stc[c.st];
      ctx.fillRect(bx, y + 15, bw, rowH * 0.32);
      if (c.hiWin) { ctx.fillStyle = col.s[2]; ctx.fillRect(X(c.hiWin[0]), y + 15, X(c.hiWin[1]) - X(c.hiWin[0]), rowH * 0.32); }
      if (on) { ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(bx - 1, y + 14, bw + 2, rowH * 0.32 + 2); }
      ctx.restore();
    });
    line(ctx, [[Lp, axisY], [Rp, axisY]], col.muted, 1);
    for (const e of [-20, -10, 0, 10, 20, 30, 40, 50, 60]) {
      const x = X(10 ** e);
      line(ctx, [[x, axisY - 3], [x, axisY + 3]], col.muted, 1);
      text(ctx, e === 0 ? '1 eV' : `10${String(e).replace(/[-0-9]/g, (d) => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'['-0123456789'.indexOf(d)])}`, x, axisY + 12, { color: col.muted, size: 10, align: 'center' });
    }
    MARKS.forEach(([m, s], i) => {
      const x = X(m);
      line(ctx, [[x, top - 4], [x, axisY]], col.line, 1, [2, 3]);
      text(ctx, s, x, axisY + 26 + (i % 2) * 12, { color: col.ink, size: 10, align: 'center', halo: col.panel });
    });
    text(ctx, 'Mass (as energy, eV) →', Rp, h - 6, { color: col.ink, size: 11, weight: 600, align: 'right', base: 'bottom' });
    const ky = top - 22;
    text(ctx, '■ open', 10, ky, { color: col.s[2], size: 10.5, weight: 700 });
    text(ctx, '■ squeezed', 60, ky, { color: col.s[3], size: 10.5, weight: 700 });
    text(ctx, '■ not most of it', 132, ky, { color: col.s[7], size: 10.5, weight: 700 });
    title(ctx, 'Candidates by mass', col);
  };
  cv.redraw(); show();
}
