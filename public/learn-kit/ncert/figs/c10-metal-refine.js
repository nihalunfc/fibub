// Class 10 Metals and Non-metals: electrolytic refining of copper. Impure copper is the anode (+), pure copper the
// cathode (-), acidified CuSO4 the electrolyte. Anode: Cu -> Cu2+ + 2e-. Cathode: Cu2+ + 2e- -> Cu. Pure copper builds up
// on the cathode, the anode shrinks, and the impurities fall to the bottom as anode mud (with silver and gold).
import { canvas, text, title, line, dot, row, slider, readout, loop, clamp, rng } from '../../kit.js';

export default function (host) {
  let hrs = 0, t = 0;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 300, label: 'A copper refining tank where the impure anode shrinks and the pure cathode grows' });
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Time', min: 0, max: 10, step: 0.1, value: 0, fmt: (v) => `${v.toFixed(1)} h`, oninput: (v) => { hrs = v; say(); } });
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); }); anim.button(ctl);
  const out = readout(host);
  function say() { out.innerHTML = `After ${hrs.toFixed(1)} h: the anode has lost <b>${(hrs * 3.2).toFixed(0)}%</b> of its copper, the cathode has gained pure copper and <b>${(hrs * 0.4).toFixed(1)}%</b> of the anode is now mud at the bottom. Cu → Cu²⁺ + 2e⁻ at the anode; Cu²⁺ + 2e⁻ → Cu at the cathode.`; cv.redraw(); }
  const rg = rng(8), dust = Array.from({ length: 14 }, () => [rg(), rg()]);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Electrolytic refining of copper', col) + 8, f = hrs / 10, tx = 14, tw = w - 28, ty = top + 40, th = h - ty - 26;
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.18; ctx.fillRect(tx, ty + th * 0.1, tw, th * 0.9); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.strokeRect(tx, ty, tw, th);
    const ax = tx + tw * 0.22, cx = tx + tw * 0.72, ah = th * 0.78;
    const aw = 30 * (1 - 0.7 * f), cw = 6 + 26 * f; ctx.fillStyle = '#9b5a30'; ctx.fillRect(ax - aw / 2, ty - 14, aw, ah); ctx.fillStyle = '#c8773a'; ctx.fillRect(cx - cw / 2, ty - 14, cw, ah);
    ctx.fillStyle = col.ink; ctx.fillRect(ax - 3, ty - 24, 6, 14); ctx.fillRect(cx - 3, ty - 24, 6, 14);
    text(ctx, '+', ax, ty - 30, { color: col.s[7], size: 14, weight: 700, align: 'center' }); text(ctx, '−', cx, ty - 30, { color: col.s[0], size: 14, weight: 700, align: 'center' });
    text(ctx, 'impure Cu (anode)', ax, ty + th + 13, { color: col.muted, size: 10, align: 'center' }); text(ctx, 'pure Cu (cathode)', cx, ty + th + 13, { color: col.muted, size: 10, align: 'center' });
    // ions drifting from anode to cathode
    for (let i = 0; i < 6; i++) { const q = (t * 0.35 + i / 6) % 1; dot(ctx, lerpX(ax + aw / 2 + 3, cx - cw / 2 - 3, q), ty + 18 + i * 22, 3.8, col.s[0]); text(ctx, '2+', lerpX(ax + aw / 2 + 3, cx - cw / 2 - 3, q) + 6, ty + 14 + i * 22, { color: col.s[0], size: 8.5, fit: false }); }
    // mud
    dust.forEach(([a, b], i) => { if (i / dust.length < f * 1.5) { ctx.fillStyle = col.muted; ctx.fillRect(ax - 18 + a * 36, ty + th - 10 - b * 5, 3, 3); } });
    if (f > 0.1) text(ctx, 'anode mud (Ag, Au…)', ax, ty + th - 18, { color: col.ink, size: 9.5, align: 'center' });
    // bars
  };
  say();
}
function lerpX(a, b, f) { return a + (b - a) * f; }
