// The Fermi sea in k-space (2D slice). Every dot is an allowed state; the filled disc of radius k_F is the electrons.
// Switch an electric field on: the whole disc slides by δk = −eEτ/ħ, but only a thin crescent changes: states vacated
// on one side (rings) and filled on the other (orange). Only electrons at the Fermi surface carry current.
// The shift is hugely exaggerated so you can see it; real metals shift by about one part in 10⁹.
import { canvas, text, row, slider, button, readout, loop, title, arrow, ease } from '../kit.js';

export default function (host) {
  let sh = 0, on = false, t = 0;
  const cv = canvas(host, { aspect: 0.82, max: 360, min: 270, label: 'Fermi disc shifting under an electric field' });
  const ctl = row(host);
  const sE = slider(ctl, { label: 'Field strength E (arb.)', min: 0, max: 1, step: 0.05, value: 0.6, fmt: (v) => v.toFixed(2), oninput: () => cv.redraw() });
  const sT = slider(ctl, { label: 'Time between collisions τ', min: 0.2, max: 2, step: 0.1, value: 1, fmt: (v) => v.toFixed(1) + ' (arb.)', oninput: () => cv.redraw() });
  const ctl2 = row(host);
  const btn = button(ctl2, 'Switch field on', () => { on = !on; queueMicrotask(() => cv.redraw()); btn.textContent = on ? 'Switch field off' : 'Switch field on'; });
  loop(host, (dt) => { const target = on ? sE.value * sT.value * 0.55 : 0; sh += (target - sh) * Math.min(1, dt / (0.25 * sT.value)); cv.redraw(); show(); }).button(ctl2);
  const out = readout(host);
  function show() {
    const kF = 1, vd = sh / kF;
    out.innerHTML = `<b>${on ? 'Field on' : 'Field off'}.</b> Shift of the disc δk = eEτ/ħ = ${sh.toFixed(2)} k_F (drawn big). Drift velocity v_d = ħδk/m = ${(vd).toFixed(2)} v_F in the picture; for copper at 1 V/m it is only about 10⁻⁴ of a millimetre per second against v_F ≈ 1.6×10⁶ m/s. Current density j = nev_d grows with E and with τ (Ohm's law).`;
  }
  cv.draw = (ctx, w, h, col) => {
    const R = Math.min(w, h) * 0.32, cx = w / 2, cy = h / 2 - 4, d = R / 6.5, kx = sh * R;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx - R * 1.3, cy); ctx.lineTo(cx + R * 1.3, cy); ctx.moveTo(cx, cy - R * 1.2); ctx.lineTo(cx, cy + R * 1.2); ctx.stroke();
    for (let i = -9; i <= 9; i++) for (let j = -9; j <= 9; j++) {
      const x = i * d, y = j * d, o0 = Math.hypot(x, y) <= R, o1 = Math.hypot(x - kx, y) <= R;
      if (!o0 && !o1) continue;
      ctx.beginPath(); ctx.arc(cx + x, cy + y, d * 0.28, 0, Math.PI * 2);
      if (o1 && !o0) { ctx.fillStyle = col.s[1]; ctx.fill(); }
      else if (o1) { ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.55; ctx.fill(); ctx.globalAlpha = 1; }
      else { ctx.lineWidth = 1.6; ctx.strokeStyle = col.s[5]; ctx.stroke(); }
    }
    ctx.strokeStyle = col.muted; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx + kx, cy, R, 0, 7); ctx.stroke();
    if (sh > 0.02) arrow(ctx, cx, cy, cx + kx, cy, col.s[2], 3, 9);
    text(ctx, 'k_x', cx + R * 1.3 - 4, cy - 10, { color: col.muted, size: 11, align: 'right' });
    text(ctx, 'k_y', cx + 6, cy - R * 1.2 + 4, { color: col.muted, size: 11 });
    title(ctx, 'Fermi disc in k-space', col);
    text(ctx, 'blue: filled before and after', 10, h - 36, { color: col.s[0], size: 10.5 });
    text(ctx, 'orange: newly filled   ring: emptied', 10, h - 20, { color: col.s[1], size: 10.5 });
  };
  show();
}
