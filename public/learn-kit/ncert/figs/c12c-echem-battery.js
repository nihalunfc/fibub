// Class 12 Chemistry, Electrochemistry: the lead storage battery (secondary cell). Discharge: anode Pb + SO4(2-) -> PbSO4 + 2e-; cathode PbO2 + 4H+ + SO4(2-) + 2e- -> PbSO4 + 2H2O.
// Overall: Pb + PbO2 + 2H2SO4 -> 2PbSO4 + 2H2O. Both plates become coated with PbSO4 and the acid is used up, so its density falls (1.28 -> 1.10 g/mL, about 2 V per cell).
// Charging forces the reaction backwards with an outside source: plates restored, acid made again. Slide the charge level and switch between discharging and charging to watch both.
import { canvas, text, title, row, slider, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let mode = 'dis', soc = 1, t = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'A lead storage battery cell showing plates, acid density and direction of electrons for discharge and charge' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'mode', [['dis', 'discharging (in use)'], ['chg', 'charging']], mode, (v) => { mode = v; go(); });
  slider(ctl, { label: 'charge level', min: 0, max: 1, step: 0.05, value: soc, fmt: (v) => Math.round(v * 100) + ' %', oninput: (v) => { soc = v; go(); } });
  const dens = () => 1.10 + 0.18 * soc;
  const go = () => { ro.textContent = `Charge level ${Math.round(soc * 100)} %: acid density ${dens().toFixed(2)} g/mL (hydrometer reading), PbSO₄ on plates ${Math.round((1 - soc) * 100)} %. ${mode === 'dis' ? 'Discharge: electrons go from the Pb plate to the PbO₂ plate through the lamp; the cell gives ≈ 2 V.' : 'Charging: an outside source pushes electrons the other way, turning PbSO₄ back into Pb and PbO₂ and making H₂SO₄ again.'}`; };
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, mode === 'dis' ? 'Lead storage battery: discharging' : 'Lead storage battery: charging', col) + 8, L = 20, W = w - 40, top = t0 + 56, B = h - 64;
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.12 + 0.16 * soc; ctx.fillRect(L, top + 16, W, B - top - 16); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(L, top, W, B - top);
    const px = [L + W * 0.25, L + W * 0.75], ph = B - top - 20;
    px.forEach((x, i) => { ctx.fillStyle = i === 0 ? col.muted : col.s[3]; ctx.fillRect(x - 12, top - 16, 24, ph + 14); ctx.fillStyle = col.panel; ctx.globalAlpha = 0.9 * (1 - soc); ctx.fillRect(x - 12, top - 16, 24, ph + 14); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x - 12, top - 16, 24, ph + 14); });
    text(ctx, 'Pb  (−)', px[0], B + 12, { color: col.ink, size: 11.5, weight: 700, align: 'center' }); text(ctx, 'PbO₂  (+)', px[1], B + 12, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
    text(ctx, `PbSO₄ coat ${Math.round((1 - soc) * 100)} %`, w / 2, top + 30, { color: col.muted, size: 10.5, align: 'center' });
    text(ctx, `H₂SO₄ ${dens().toFixed(2)} g/mL`, w / 2, top + 54, { color: col.s[0], size: 12, weight: 700, align: 'center' });
    const wy = top - 30; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px[0], top - 16); ctx.lineTo(px[0], wy); ctx.lineTo(px[1], wy); ctx.lineTo(px[1], top - 16); ctx.stroke();
    text(ctx, mode === 'dis' ? '💡' : '⚡', w / 2, wy, { color: col.ink, size: 16, align: 'center', halo: col.panel });
    const dir = mode === 'dis' ? 1 : -1;
    for (let i = 0; i < 5; i++) { const u = ((t * 0.3 + i / 5) % 1), x = dir > 0 ? px[0] + u * (px[1] - px[0]) : px[1] - u * (px[1] - px[0]); ctx.beginPath(); ctx.arc(x, wy, 3.5, 0, 7); ctx.fillStyle = col.s[2]; ctx.fill(); }
    text(ctx, 'e⁻', w / 2, wy - 18, { color: col.s[2], size: 11, weight: 700, align: 'center' });
    const eq = mode === 'dis' ? 'Pb + PbO₂ + 2H₂SO₄ → 2PbSO₄ + 2H₂O' : '2PbSO₄ + 2H₂O → Pb + PbO₂ + 2H₂SO₄';
    text(ctx, eq, w / 2, h - 30, { color: col.s[3], size: 11.5, weight: 700, align: 'center' });
    text(ctx, mode === 'dis' ? 'density falls as acid is used up' : 'density rises as acid is made again', w / 2, h - 12, { color: col.muted, size: 10.5, align: 'center' });
  };
  go();
}
