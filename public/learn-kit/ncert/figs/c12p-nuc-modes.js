// Class 12 Nuclei: the three kinds of radioactive decay. Alpha: the nucleus loses 2 protons and 2 neutrons (A falls by 4, Z by 2). Beta minus: a neutron turns into a proton, an electron
// and an antineutrino (A same, Z up by 1). Beta plus: a proton turns into a neutron, a positron and a neutrino (A same, Z down by 1). Gamma: an excited nucleus drops to a lower level (A, Z unchanged).
// Pick a parent nuclide and a mode; the particle flies out and the daughter is written for you.
import { canvas, text, title, row, choice, button, readout, loop } from '../../kit.js';

const PAR = { u238: [92, 238, 'U'], bi210: [83, 210, 'Bi'], c14: [6, 14, 'C'], na22: [11, 22, 'Na'], co60: [27, 60, 'Co'] };
const SYM = { 6: 'C', 7: 'N', 10: 'Ne', 11: 'Na', 27: 'Co', 28: 'Ni', 82: 'Pb', 83: 'Bi', 84: 'Po', 90: 'Th', 91: 'Pa', 92: 'U' };
const MODE = { a: ['alpha (α)', -2, -4], b: ['beta minus (β⁻)', 1, 0], p: ['beta plus (β⁺)', -1, 0], g: ['gamma (γ)', 0, 0] };

export default function (host) {
  let par = 'u238', mode = 'a', t = 0, fired = false;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 280, label: 'A parent nucleus emitting an alpha, beta or gamma particle and becoming a daughter nucleus' });
  const ctl = row(host), ro = readout(host);
  const EX = { au: ['u238', 'a'], bi: ['bi210', 'b'], bc: ['c14', 'b'], pn: ['na22', 'p'], gc: ['co60', 'g'] };
  choice(ctl, 'Decay', [['au', 'U-238 α'], ['bi', 'Bi-210 β⁻'], ['bc', 'C-14 β⁻'], ['pn', 'Na-22 β⁺'], ['gc', 'Co-60* γ']], 'au', (v) => { [par, mode] = EX[v]; fire(); });
  button(ctl, 'Decay again', () => fire());
  const fire = () => { t = 0; fired = true; go(); };
  const dau = () => { const [z, a, s] = PAR[par], [, dz, da] = MODE[mode]; return [z + dz, a + da]; };
  const go = () => { const [z, a, s] = PAR[par], [nm, dz, da] = MODE[mode], [z2, a2] = dau(); const S = (zz) => SYM[zz] ?? '?'; ro.textContent = `${nm}: ${a}${s} (Z = ${z}) → ${a2}${S(z2)} (Z = ${z2}).  A changes by ${da}, Z changes by ${dz >= 0 ? '+' + dz : dz}. ${mode === 'a' ? 'The α is a helium nucleus, ⁴₂He.' : mode === 'b' ? 'Inside: n → p + e⁻ + antineutrino.' : mode === 'p' ? 'Inside: p → n + e⁺ + neutrino (only inside nuclei).' : 'Gamma follows another decay when the daughter is left excited. Co-60* is the excited Ni-60 nucleus.'}`; cv.redraw(); };
  loop(host, (dt) => { if (fired && t < 2.5) { t += dt; cv.redraw(); } });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Radioactive decay', col), [z, a, s] = PAR[par], [z2, a2] = dau(), cy = top + 78, cx = w * 0.3;
    const nuc = (x, r, c, lab, sub) => { ctx.beginPath(); ctx.arc(x, cy, r, 0, 7); ctx.fillStyle = c; ctx.globalAlpha = 0.35; ctx.fill(); ctx.globalAlpha = 1; ctx.lineWidth = 2; ctx.strokeStyle = c; ctx.stroke(); text(ctx, lab, x, cy - 2, { color: col.ink, size: 13, weight: 700, align: 'center' }); text(ctx, sub, x, cy + r + 14, { color: col.muted, size: 10.5, align: 'center' }); };
    const f = Math.min(1, t / 2);
    const S = (zz) => SYM[zz] ?? '?';
    if (!fired || f < 0.1) nuc(cx, 40, col.s[0], `${a}${s}${mode === 'g' ? '*' : ''}`, `Z = ${z}`); else nuc(cx + (w * 0.18) * Math.min(1, (f - 0.1) / 0.5) * 0 , 40, col.s[2], `${a2}${S(z2)}`, `daughter, Z = ${z2}`);
    if (fired && f >= 0.1) {
      const k = (f - 0.1) / 0.9, x = cx + 40 + k * (w - cx - 70), y = cy - 6 - k * 22;
      const kind = mode;
      if (kind === 'a') { ctx.beginPath(); ctx.arc(x, y, 8, 0, 7); ctx.fillStyle = col.s[3]; ctx.fill(); text(ctx, 'α', x, y - 15, { color: col.ink, size: 11, weight: 700, align: 'center' }); }
      else if (kind === 'b' || kind === 'p') { ctx.beginPath(); ctx.arc(x, y, 4.5, 0, 7); ctx.fillStyle = kind === 'b' ? col.s[1] : col.s[3]; ctx.fill(); text(ctx, kind === 'b' ? 'e⁻' : 'e⁺', x, y - 12, { color: col.ink, size: 11, weight: 700, align: 'center' }); ctx.setLineDash([3, 3]); ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(cx + 44, cy + 20); ctx.lineTo(x, cy + 20 + k * 20); ctx.stroke(); ctx.setLineDash([]); text(ctx, kind === 'b' ? 'ν̄' : 'ν', x, cy + 34 + k * 20, { color: col.muted, size: 11, align: 'center' }); }
      else { ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2.5; ctx.beginPath(); for (let i = 0; i <= 40; i++) { const xx = cx + 46 + i * ((x - cx - 46) / 40), yy = cy - 2 + 7 * Math.sin(i * 0.9 - t * 8); i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); text(ctx, 'γ photon', x, cy - 22, { color: col.ink, size: 11, weight: 700, align: 'center' }); }
    }
    text(ctx, fired ? `${a}${s}  →  ${a2}${S(z2)}  +  ${mode === 'a' ? '⁴₂He' : mode === 'b' ? 'e⁻ + ν̄' : mode === 'p' ? 'e⁺ + ν' : 'γ'}` : 'Press a mode or “Decay again”', w / 2, h - 36, { color: col.s[7], size: 13, weight: 700, align: 'center' });
    text(ctx, `Check: A ${a} → ${a2},  Z ${z} → ${z2}`, w / 2, h - 16, { color: col.muted, size: 11, align: 'center' });
  };
  go();
}
