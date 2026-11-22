// Class 10 Life Processes: double circulation. Blood passes through the heart twice in each full round: right side
// pumps oxygen-poor (blue) blood to the lungs, left side pumps oxygen-rich (red) blood to the body. Cardiac output =
// heart rate x stroke volume (about 70 mL per beat at rest, so 72 x 70 = about 5 L/min). Dots move at a speed that
// follows the heart rate. Choose which circuit to show.
import { canvas, text, title, line, dot, row, slider, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let hr = 72, show = 'both', t = 0, phase = 0;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 290, label: 'Double circulation of blood through the heart, lungs and body with heart rate' });
  const ctl = row(host);
  slider(ctl, { label: 'Heart rate', min: 40, max: 180, step: 1, value: hr, fmt: (v) => v + ' beats/min', oninput: (v) => { hr = v; say(); } });
  choice(ctl, 'Show', [['both', 'Both circuits'], ['pul', 'Lungs only'], ['sys', 'Body only']], show, (v) => { show = v; say(); });
  loop(host, (dt) => { phase += dt * hr / 60; t += dt; cv.redraw(); });
  const out = readout(host);
  function say() { const co = hr * 70 / 1000; out.innerHTML = `At ${hr} beats a minute and 70 mL pumped each beat, cardiac output = ${hr} × 70 mL = <b>${co.toFixed(1)} L/min</b>. ${hr < 60 ? 'A slow, athletic or sleeping heart.' : hr <= 100 ? 'A normal resting range.' : 'Faster: exercise, fear or fever. Muscles get more oxygen, but the heart works harder.'} Blood passes through the heart <b>twice</b> per round trip: that is double circulation.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Double circulation', col) + 6, cx = w / 2, cy = top + (h - top) * 0.5, hw = w * 0.17, hh = (h - top) * 0.2;
    const red = col.s[7], blue = col.s[0], beat = 0.5 + 0.5 * Math.cos(phase * 6.283 * 1);
    // heart: four chambers
    const ch = [['RA', cx - hw * 0.55, cy - hh * 0.5, blue], ['RV', cx - hw * 0.55, cy + hh * 0.5, blue], ['LA', cx + hw * 0.55, cy - hh * 0.5, red], ['LV', cx + hw * 0.55, cy + hh * 0.5, red]];
    ch.forEach(([n, x, y, c], i) => { const sc = 1 + (i % 2 ? 0.1 * (1 - beat) : 0.1 * beat); ctx.fillStyle = c; ctx.globalAlpha = 0.4; ctx.beginPath(); ctx.roundRect(x - hw * 0.5 * sc, y - hh * 0.45 * sc, hw * sc, hh * 0.9 * sc, 8); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.8; ctx.stroke(); text(ctx, n, x, y, { color: col.ink, size: 12, weight: 700, align: 'center', fit: false }); });
    text(ctx, 'right', cx - hw * 0.55, cy + hh * 1.3, { color: col.muted, size: 10, align: 'center' }); text(ctx, 'left', cx + hw * 0.55, cy + hh * 1.3, { color: col.muted, size: 10, align: 'center' });
    const lungX = cx + w * 0.34, bodyY = cy - (h - top) * 0.32;
    // lungs are drawn on the left of the page (the body's right side is on the viewer's left in a front view): put lungs top
    const lung = [cx, top + 26], body = [cx, h - 50];
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.2; ctx.beginPath(); ctx.ellipse(lung[0], lung[1] + 4, w * 0.2, 17, 0, 0, 7); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.stroke();
    text(ctx, 'lungs: O₂ in, CO₂ out', lung[0], lung[1] + 4, { color: col.ink, size: 10.5, weight: 700, align: 'center' });
    ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.2; ctx.beginPath(); ctx.ellipse(body[0], body[1], w * 0.3, 17, 0, 0, 7); ctx.fill(); ctx.globalAlpha = 1; ctx.stroke();
    text(ctx, 'body organs: O₂ used', body[0], body[1], { color: col.ink, size: 10.5, weight: 700, align: 'center' });
    // paths: pulmonary: RV -> lungs (blue) -> LA (red); systemic: LV -> body (red) -> RA (blue)
    const rv = [cx - hw * 0.55, cy + hh * 0.5], ra = [cx - hw * 0.55, cy - hh * 0.5], la = [cx + hw * 0.55, cy - hh * 0.5], lv = [cx + hw * 0.55, cy + hh * 0.5];
    const pulOut = [rv, [cx - w * 0.36, cy + hh * 0.5], [cx - w * 0.36, lung[1] + 4], [lung[0] - w * 0.2, lung[1] + 4]];
    const pulBack = [[lung[0] + w * 0.2, lung[1] + 4], [cx + w * 0.36, lung[1] + 4], [cx + w * 0.36, cy - hh * 0.5], la];
    const sysOut = [lv, [cx + w * 0.4, cy + hh * 0.5], [cx + w * 0.4, body[1]], [body[0] + w * 0.3, body[1]]];
    const sysBack = [[body[0] - w * 0.3, body[1]], [cx - w * 0.42, body[1]], [cx - w * 0.42, cy - hh * 0.5 - 4], [ra[0], ra[1] - 4], ra];
    const paths = [];
    if (show !== 'sys') paths.push([pulOut, blue], [pulBack, red]); if (show !== 'pul') paths.push([sysOut, red], [sysBack, blue]);
    if (show === 'both' || true) paths.forEach(([P, c]) => line(ctx, P, c, 2.2));
    const along = (P, f) => { const L = []; let tot = 0; for (let i = 0; i < P.length - 1; i++) { const d = Math.hypot(P[i + 1][0] - P[i][0], P[i + 1][1] - P[i][1]); L.push(d); tot += d; } let d = f * tot; for (let i = 0; i < L.length; i++) { if (d <= L[i]) return [P[i][0] + (P[i + 1][0] - P[i][0]) * d / L[i], P[i][1] + (P[i + 1][1] - P[i][1]) * d / L[i]]; d -= L[i]; } return P[P.length - 1]; };
    paths.forEach(([P, c], pi) => { for (let i = 0; i < 6; i++) { const f = ((phase * 0.35 + i / 6) % 1), [x, y] = along(P, f); dot(ctx, x, y, 3.6, c, col.panel); } });
    text(ctx, 'oxygen-poor', 10, h - 20, { color: blue, size: 10.5, weight: 700 }); text(ctx, 'oxygen-rich', 10, h - 6, { color: red, size: 10.5, weight: 700 });
    text(ctx, 'thick left wall pumps to the body', w - 10, h - 6, { color: col.muted, size: 9.5, align: 'right' });
  };
  say();
}
