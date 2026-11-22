// Class 12 Chemistry, d- and f-block: a Gouy-balance picture of paramagnetism. A sample hangs between magnet poles. Each unpaired electron is a tiny magnet.
// Magnet off: the little magnets point every way (net zero). Magnet on: they line up and the sample is pulled in, so the balance reads heavier.
// Paired electrons (diamagnetic) make no magnet of their own and are pushed out very slightly. mu = sqrt(n(n+2)) BM (spin only).
import { canvas, text, title, line, arrow, row, choice, button, readout, loop, lerp, rng } from '../../kit.js';

const ION = { Zn: ['Zn²⁺ (3d¹⁰)', 0], Cu: ['Cu²⁺ (3d⁹)', 1], Ni: ['Ni²⁺ (3d⁸)', 2], Cr: ['Cr³⁺ (3d³)', 3], Fe: ['Fe²⁺ (3d⁶, high spin)', 4], Mn: ['Mn²⁺ (3d⁵)', 5] };

export default function (host) {
  let key = 'Ni', on = true, align = 0.0;
  const rnd = rng(7), N = 25, base = Array.from({ length: N }, () => rnd() * 6.28), ph = Array.from({ length: N }, () => rnd() * 6.28);
  const cv = canvas(host, { aspect: 0.68, max: 440, min: 300, label: 'A sample hanging between the poles of a magnet; its apparent mass changes if it has unpaired electrons' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'ion', Object.keys(ION).map((k) => [k, k]), key, (v) => { key = v; go(); });
  button(ctl, 'Magnet on / off', () => { on = !on; go(); });
  const anim = loop(host, (dt) => { align = lerp(align, on ? 1 : 0, Math.min(1, dt * 3)); cv.redraw(); });
  const go = () => {
    const [nm, n] = ION[key], mu = Math.sqrt(n * (n + 2));
    ro.textContent = `${nm}: n = ${n} unpaired, μ = ${mu.toFixed(2)} BM. Magnet ${on ? 'on' : 'off'}: ` + (n ? (on ? `the sample is pulled in, the balance gains about ${(n * 12).toFixed(0)} mg. Paramagnetic.` : 'no change in mass.') : (on ? 'the balance loses a trace of mass: diamagnetic.' : 'no change in mass.'));
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Gouy balance: weighing in a magnetic field', col), [, n] = ION[key], t = performance.now() / 1000;
    const cx = w * 0.4, ty = top + 30, ch = h * 0.34;
    // poles
    ctx.fillStyle = col.s[3]; ctx.fillRect(cx - 74, ty + 30, 38, ch - 20); ctx.fillStyle = col.s[0]; ctx.fillRect(cx + 36, ty + 30, 38, ch - 20);
    text(ctx, 'N', cx - 55, ty + 30 + (ch - 20) / 2, { color: col.panel, size: 15, weight: 700, align: 'center' }); text(ctx, 'S', cx + 55, ty + 30 + (ch - 20) / 2, { color: col.panel, size: 15, weight: 700, align: 'center' });
    // thread and tube
    const pull = on ? (n ? 8 * Math.min(1, align) * n / 5 : -2 * align) : 0;
    line(ctx, [[cx, top + 4], [cx, ty + pull]], col.muted, 1.5);
    ctx.fillStyle = col.panel; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.8; const tw = 56, ty0 = ty + pull + 8, th = ch + 10; ctx.fillRect(cx - tw / 2, ty0, tw, th); ctx.strokeRect(cx - tw / 2, ty0, tw, th);
    for (let i = 0; i < N; i++) {
      const gx = cx - tw / 2 + 8 + (i % 5) * 10, gy = ty0 + 12 + Math.floor(i / 5) * ((th - 24) / 4);
      if (n === 0) { text(ctx, '↑↓', gx, gy, { color: col.muted, size: 9, align: 'center' }); continue; }
      const free = base[i] + Math.sin(t * 2 + ph[i]) * 1.5, ang = lerp(free, -Math.PI / 2, align * 0.92 * (n / 5 * 0.6 + 0.4));
      arrow(ctx, gx - Math.cos(ang) * 4, gy - Math.sin(ang) * 4, gx + Math.cos(ang) * 4, gy + Math.sin(ang) * 4, col.s[2], 1.6, 4);
    }
    // balance reading
    const rx = w * 0.82, m = 100 + (n ? n * 12 * align : -2 * align);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(rx - 40, ty + 6, 80, 50); text(ctx, 'balance', rx, ty + 18, { color: col.muted, size: 10.5, align: 'center' }); text(ctx, m.toFixed(0) + ' mg', rx, ty + 40, { color: col.ink, size: 15, weight: 700, align: 'center' });
    text(ctx, on ? 'magnet ON' : 'magnet off', rx, ty + 76, { color: on ? col.s[0] : col.muted, size: 12, weight: 700, align: 'center' });
    text(ctx, n ? `${n} tiny magnet${n > 1 ? 's' : ''} per ion` : 'all electrons paired: no tiny magnets', w / 2, h - 26, { color: col.muted, size: 11.5, align: 'center' });
    text(ctx, 'sample at 100 mg before the magnet is switched on', w / 2, h - 10, { color: col.muted, size: 10.5, align: 'center' });
  };
  go();
}
