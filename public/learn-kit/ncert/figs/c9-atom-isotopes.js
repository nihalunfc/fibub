// Class 9 Journey Inside the Atom: isotopes side by side. Isotopes of an element have the same number of protons (so
// the same Z and the same chemistry) but different numbers of neutrons (so different mass numbers A). Choose hydrogen,
// carbon or chlorine. For chlorine a slider sets the share of Cl-35 and Cl-37 and the average atomic mass is worked
// out as a weighted mean (natural chlorine is about 75% Cl-35 and 25% Cl-37, average about 35.5).
import { canvas, text, title, dot, row, choice, slider, readout } from '../../kit.js';

const EL = {
  H: { name: 'Hydrogen', Z: 1, iso: [[0, 'protium'], [1, 'deuterium'], [2, 'tritium']], use: 'Deuterium is in “heavy water”, used in some nuclear reactors.' },
  C: { name: 'Carbon', Z: 6, iso: [[6, 'carbon-12'], [7, 'carbon-13'], [8, 'carbon-14']], use: 'Carbon-14 is radioactive; its slow decay is used for dating old wood and bones.' },
  Cl: { name: 'Chlorine', Z: 17, iso: [[18, 'chlorine-35'], [20, 'chlorine-37']], use: 'Both behave identically in chemistry: the weighted average mass is 35.5.' },
};
export default function (host) {
  let el = 'C', share = 75;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 300, label: 'Isotopes of an element drawn side by side with equal protons and different neutrons' });
  const ctl = row(host);
  choice(ctl, 'Element', [['H', 'Hydrogen'], ['C', 'Carbon'], ['Cl', 'Chlorine']], el, (v) => { el = v; upd(); });
  const sl = slider(ctl, { label: 'Cl-35 share', min: 0, max: 100, step: 5, value: share, fmt: (v) => `${v}%`, oninput: (v) => { share = v; upd(); } });
  const out = readout(host);
  function upd() {
    const d = EL[el]; let extra = '';
    if (el === 'Cl') extra = ` Average mass = (${share} × 35 + ${100 - share} × 37) ÷ 100 = <b>${((share * 35 + (100 - share) * 37) / 100).toFixed(2)}</b>.`;
    out.innerHTML = `Every ${d.name.toLowerCase()} atom has Z = ${d.Z} protons. The isotopes differ in neutrons, so in A. ${d.use}${extra}`; cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const d = EL[el], n = d.iso.length; title(ctx, `Isotopes of ${d.name.toLowerCase()}: same Z, different A`, col);
    const cw = w / n, cy = h * 0.48;
    d.iso.forEach(([neu, nm], i) => {
      const cx = cw * (i + 0.5), A = d.Z + neu, r = Math.min(cw * 0.42, 62);
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.line; ctx.lineWidth = 1.2; ctx.stroke();
      const tot = A, cell = Math.min(7, r * 0.55 / Math.sqrt(tot) * 1.7);
      let a = d.Z, b = neu; for (let k = 0; k < tot; k++) { const kind = ((k % 2 === 0 && a > 0) || b === 0) ? 'p' : 'n'; if (kind === 'p') a--; else b--; const rr = cell * 1.5 * Math.sqrt(k) * 0.95, th = k * 2.4; dot(ctx, cx + Math.cos(th) * rr, cy + Math.sin(th) * rr, cell * 0.8, kind === 'p' ? col.s[1] : col.muted); }
      
      text(ctx, nm, cx, cy + r + 14, { color: col.ink, size: 11, weight: 700, align: 'center' });
      text(ctx, `${d.Z} p, ${neu} n`, cx, cy + r + 29, { color: col.muted, size: 10.5, align: 'center' });
      text(ctx, `A = ${A}`, cx, cy - r - 8, { color: col.s[3], size: 10.5, align: 'center' });
      if (el === 'Cl') text(ctx, i === 0 ? `${share}%` : `${100 - share}%`, cx, cy + r + 44, { color: col.s[2], size: 11, weight: 700, align: 'center' });
    });
    dot(ctx, 14, h - 14, 4, col.s[1]); text(ctx, 'proton', 22, h - 14, { color: col.ink, size: 10.5 }); dot(ctx, 80, h - 14, 4, col.muted); text(ctx, 'neutron', 88, h - 14, { color: col.ink, size: 10.5 });
  };
  upd();
}
