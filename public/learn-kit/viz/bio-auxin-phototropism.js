// Phototropism: a shoot bends toward light because auxin (IAA) made in the tip moves to the shaded side, where it makes the
// cells elongate faster. Change the light and what is done to the tip, like Darwin's and Went's experiments: a covered
// tip cannot sense light, a cut-off tip makes no auxin, so there is no bending.
import { canvas, loop, row, choice, readout, text, title, clamp } from '../kit.js';

export default function (host) {
  let light = 'left', tip = 'intact', bend = 0, t = 0;
  const cv = canvas(host, { aspect: 0.9, max: 400, min: 320, label: 'A shoot bending toward light because auxin collects on the shaded side' });
  const ctl = row(host);
  loop(host, (dt) => { t += dt; const target = tgt(); bend += (target - bend) * Math.min(1, dt * 0.5); cv.redraw(); show(); }).button(ctl);
  choice(ctl, 'Light from', [['left', 'Left'], ['none', 'Above (even)'], ['right', 'Right']], light, (v) => { light = v; bend = 0; show(); });
  choice(ctl, 'Tip', [['intact', 'Intact'], ['covered', 'Covered by foil'], ['cut', 'Cut off']], tip, (v) => { tip = v; bend = 0; show(); });
  const out = readout(host);
  const tgt = () => (tip !== 'intact' || light === 'none' ? 0 : light === 'left' ? -0.9 : 0.9);
  function show() {
    const why = tip === 'cut' ? 'No tip, no auxin: the shoot stops growing.' : tip === 'covered' ? 'The tip cannot detect light, so auxin stays even: it grows straight up.' : light === 'none' ? 'Even light: auxin is spread evenly, both sides elongate equally, the shoot grows straight.' : 'The tip senses light (a flavoprotein photoreceptor, phototropin), auxin moves to the shaded side, cells there elongate more, and the shoot curves toward the light.';
    out.innerHTML = `Bend: <b>${Math.abs(bend * 57).toFixed(0)}°</b> ${bend < -0.05 ? 'toward the left' : bend > 0.05 ? 'toward the right' : '(straight)'}. ${why}`; cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Auxin and bending', col);
    const bx = w * 0.5, by = h - 40, N = 14, seg = (h - 120) / N;
    // light rays
    if (light !== 'none') { ctx.strokeStyle = col.warn; ctx.lineWidth = 2; for (let i = 0; i < 4; i++) { const y = 70 + i * 42, x0 = light === 'left' ? 10 : w - 10, dx = light === 'left' ? 34 : -34; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + dx, y + 8); ctx.stroke(); } text(ctx, 'light', light === 'left' ? 10 : w - 10, 56, { color: col.warn, size: 11, weight: 700, align: light === 'left' ? 'left' : 'right' }); }
    else { ctx.strokeStyle = col.warn; ctx.lineWidth = 2; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(w * (0.3 + 0.2 * i), 44); ctx.lineTo(w * (0.3 + 0.2 * i), 62); ctx.stroke(); } }
    // shoot: curvature grows toward the tip
    const pts = [[bx, by]]; let a = -Math.PI / 2; const top = tip === 'cut' ? N - 2 : N;
    for (let i = 1; i <= top; i++) { a += (bend / N) * (0.4 + (i / N) * 1.2); pts.push([pts[i - 1][0] + Math.cos(a) * seg, pts[i - 1][1] + Math.sin(a) * seg]); }
    const sideAuxin = (dir) => (tip !== 'intact' ? 0.5 : light === 'none' ? 0.5 : (light === 'left') === (dir < 0) ? 0.2 : 0.8);
    for (let i = 0; i < top; i++) {
      const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], ang = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(ang), ny = Math.cos(ang), wd = 11 - i * 0.2;
      ctx.beginPath(); ctx.moveTo(x0 + nx * wd, y0 + ny * wd); ctx.lineTo(x1 + nx * wd, y1 + ny * wd); ctx.lineTo(x1 - nx * wd, y1 - ny * wd); ctx.lineTo(x0 - nx * wd, y0 - ny * wd); ctx.closePath(); ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.4; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[2]; ctx.lineWidth = 1; ctx.stroke();
      // auxin dots (left/right sides)
      [-1, 1].forEach((sd) => { const n = Math.round(sideAuxin(sd) * 2 * 2); for (let j = 0; j < n; j++) { const f = (t * 0.2 + j / 4 + i * 0.13) % 1; ctx.beginPath(); ctx.arc(x0 + (x1 - x0) * f - nx * sd * (wd - 4) * -1 * 1 + 0, y0 + (y1 - y0) * f - ny * sd * (wd - 4) * -1, 1.8, 0, 7); ctx.fillStyle = col.s[5]; ctx.fill(); } });
    }
    // tip cap or foil
    const tp = pts[pts.length - 1];
    if (tip === 'covered') { ctx.fillStyle = col.muted; ctx.beginPath(); ctx.roundRect(tp[0] - 14, tp[1] - 22, 28, 30, 6); ctx.fill(); text(ctx, 'foil cap', tp[0] + 20, tp[1] - 8, { color: col.muted, size: 10.5, weight: 700, fit: false }); }
    if (tip === 'cut') text(ctx, 'tip removed', tp[0] + 16, tp[1] - 4, { color: col.bad, size: 10.5, weight: 700, fit: false });
    ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.3; ctx.fillRect(0, by + 10, w, 30); ctx.globalAlpha = 1; text(ctx, 'orange dots = auxin; more on the shaded side', 10, h - 10, { color: col.s[5], size: 10.5, weight: 700 });
  };
  show();
}
