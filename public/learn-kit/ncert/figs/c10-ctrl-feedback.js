// Class 10 Control and Coordination: a feedback loop, blood sugar and insulin. After a meal, glucose enters the blood.
// When it rises, the pancreas releases insulin, which makes cells and the liver take up glucose, so blood sugar falls back.
// When it falls, insulin release drops: a negative feedback loop. Without insulin (diabetes) the sugar stays high.
// Simple model, mg/dL: dG/dt = absorption(t) - k * insulin * (G - 70), insulin = max(0, (G - 90) / 40) when the pancreas works,
// 0 when it does not. Normal fasting blood glucose is about 70-100 mg/dL; diabetes is diagnosed at 126 mg/dL or more (fasting).
import { canvas, text, title, line, dot, row, choice, button, readout, loop, clamp } from '../../kit.js';

export default function (host) {
  let pan = 'ok', G = 85, T = [], meal = 0, t = 0;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 290, label: 'Blood glucose over time after meals with and without insulin from the pancreas' });
  const ctl = row(host);
  choice(ctl, 'Pancreas', [['ok', 'Healthy (insulin)'], ['no', 'No insulin (diabetes)']], pan, (v) => { pan = v; reset(); });
  button(ctl, 'Eat a sweet meal', () => { meal = 1; });
  button(ctl, 'Reset', () => reset());
  const out = readout(host);
  function reset() { G = pan === 'ok' ? 85 : 130; T = []; meal = 0; t = 0; say(); }
  function say() { out.innerHTML = pan === 'ok' ? 'Press <b>Eat a sweet meal</b>. Blood sugar jumps, the pancreas releases <b>insulin</b>, and cells and liver take the sugar in (the liver stores it as glycogen), so the level comes back down. High sugar causes insulin; insulin lowers sugar: <b>negative feedback</b>.' : 'With no insulin the glucose cannot get into the cells and the level stays high: the person has <b>diabetes</b>. They are treated with insulin injections and a controlled diet.'; }
  let acc = 0;
  loop(host, (dt) => {
    acc += dt; t += dt;
    const absorb = meal > 0 ? 110 * meal : 0; meal = Math.max(0, meal - dt * 0.6);
    const ins = pan === 'ok' ? clamp((G - 90) / 40, 0, 4) : 0.02;
    G += (absorb - 0.5 * ins * (G - 70) * 1 + (pan === 'ok' ? 0 : 0.1)) * dt * 2;
    G = clamp(G, 40, 400);
    if (acc > 0.1) { acc = 0; T.push([t, G, pan === 'ok' ? ins : 0]); if (T.length > 200) T.shift(); }
    cv.redraw();
  });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Blood glucose (mg per 100 mL)', col) + 8, gx = 40, gy = top + 8, gw = w - gx - 14, gh = h - gy - 70;
    const yv = (v) => gy + gh - ((v - 40) / 360) * gh;
    ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.15; ctx.fillRect(gx, yv(100), gw, yv(70) - yv(100)); ctx.globalAlpha = 1; text(ctx, 'normal 70-100', gx + gw - 4, yv(85), { color: col.s[3], size: 9.5, weight: 700, align: 'right' });
    line(ctx, [[gx, gy], [gx, gy + gh], [gx + gw, gy + gh]], col.line, 1.5);
    [100, 200, 300, 400].forEach((v) => { line(ctx, [[gx, yv(v)], [gx + gw, yv(v)]], col.line, 0.5); text(ctx, String(v), gx - 4, yv(v), { color: col.muted, size: 9, align: 'right' }); });
    line(ctx, [[gx, yv(126)], [gx + gw, yv(126)]], col.s[7], 1, [4, 3]); text(ctx, 'diabetes level 126', gx + 4, yv(126) - 7, { color: col.s[7], size: 9.5 });
    const n = T.length; if (n > 1) { const pts = T.map(([tt, g], i) => [gx + (i / 200) * gw, yv(g)]); line(ctx, pts, col.s[0], 2.5); const ins = T.map(([tt, g, i2], i) => [gx + (i / 200) * gw, gy + gh - clamp(i2, 0, 2) / 2 * 30]); line(ctx, ins, col.s[4], 2); }
    dot(ctx, gx + (Math.max(0, n - 1) / 200) * gw, yv(G), 5, col.s[1], col.ink);
    text(ctx, `now: ${G.toFixed(0)} mg/dL  (${(G / 18.016).toFixed(1)} mmol/L)`, w / 2, h - 50, { color: col.ink, size: 12, weight: 700, align: 'center' });
    text(ctx, 'blue: blood glucose · pink: insulin released (bottom)', w / 2, h - 34, { color: col.muted, size: 10, align: 'center' });
    // loop diagram
    const lx = w / 2; text(ctx, pan === 'ok' ? 'glucose ↑ → pancreas → insulin ↑ → glucose ↓' : 'glucose ↑ → no insulin → glucose stays high', lx, h - 14, { color: col.s[2], size: 10.5, weight: 700, align: 'center' });
  };
  reset();
}
