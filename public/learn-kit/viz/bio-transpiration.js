// Transpiration pull. Water evaporates from the leaf, the water column in the xylem is under tension, and hydrogen bonding
// (cohesion) plus sticking to the wall (adhesion) pulls the whole column up from the root. Change air dryness, light (stomata)
// and soil water and watch the flow and the tension at the top. Night or very dry soil: the pull stops and stomata close.
import { canvas, loop, row, slider, choice, readout, text, title } from '../kit.js';

export default function (host) {
  let hum = 40, lightOn = 'day', soil = 'wet', t = 0;
  const cv = canvas(host, { aspect: 1.0, max: 430, min: 340, label: 'Water rising through xylem to the leaf, pulled by evaporation' });
  const ctl = row(host);
  loop(host, (dt) => { t += dt * rate() * 2.2; cv.redraw(); }).button(ctl);
  slider(ctl, { label: 'Air humidity', min: 10, max: 100, step: 5, value: hum, fmt: (v) => `${v}%`, oninput: (v) => { hum = v; show(); } });
  const c2 = row(host);
  choice(c2, 'Light', [['day', 'Day (stomata open)'], ['night', 'Night (closed)']], lightOn, (v) => { lightOn = v; show(); });
  choice(c2, 'Soil', [['wet', 'Moist'], ['dry', 'Dry']], soil, (v) => { soil = v; show(); });
  const out = readout(host);
  const open = () => (lightOn === 'day' ? (soil === 'dry' ? 0.35 : 1) : 0.05);
  const rate = () => open() * (1 - hum / 100) * 1.1 + 0.03;
  const psiLeaf = () => -(0.6 + 2.6 * (1 - hum / 100) * open() + (soil === 'dry' ? 0.8 : 0));
  const show = () => { out.innerHTML = `Transpiration rate (relative): <b>${(rate() * 100).toFixed(0)}</b>. Leaf water potential about <b>${psiLeaf().toFixed(1)} MPa</b> (more negative = stronger pull). ${lightOn === 'night' ? 'Stomata are shut, so very little water leaves and the pull is weak.' : soil === 'dry' ? 'Dry soil: guard cells lose turgor (abscisic acid), stomata close partly, saving water but slowing photosynthesis.' : hum < 40 ? 'Dry air: steep gradient, rapid water loss, strong tension.' : 'Humid air: a small gradient, slow water loss.'} Cohesion keeps the column unbroken; the energy comes from the Sun, not the plant.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Transpiration pull', col);
    const x = w * 0.36, top = 70, bot = h - 62, r = rate();
    // soil
    ctx.fillStyle = soil === 'wet' ? col.s[1] : col.s[7]; ctx.globalAlpha = soil === 'wet' ? 0.25 : 0.12; ctx.fillRect(0, bot, w, h - bot); ctx.globalAlpha = 1;
    text(ctx, soil === 'wet' ? 'moist soil' : 'dry soil', 8, h - 12, { color: col.muted, size: 10.5 });
    // root hairs
    ctx.strokeStyle = col.s[2]; ctx.lineWidth = 1.5; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(x, bot + 4 + i * 6); ctx.lineTo(x + (i % 2 ? 24 : -24), bot + 10 + i * 6); ctx.stroke(); }
    // xylem tube
    ctx.strokeStyle = col.muted; ctx.lineWidth = 2; ctx.strokeRect(x - 12, top, 24, bot - top + 6);
    for (let i = 0; i < 18; i++) { const f = ((i / 18) + t * 0.12) % 1, y = bot - f * (bot - top - 8); ctx.beginPath(); ctx.arc(x - 6 + (i % 2) * 12, y, 3.4, 0, 7); ctx.fillStyle = col.s[4]; ctx.fill(); }
    // chain line to show cohesion
    ctx.strokeStyle = col.s[4]; ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.moveTo(x, top + 2); ctx.lineTo(x, bot); ctx.stroke(); ctx.globalAlpha = 1;
    // leaf
    ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.4; ctx.beginPath(); ctx.ellipse(x + 70, top - 8, 80, 22, -0.1, 0, 7); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.stroke();
    text(ctx, 'leaf: water evaporates from mesophyll walls', x + 6, top - 36, { color: col.s[2], size: 10, weight: 700 });
    // stomata and vapour
    const op = open(); for (let i = 0; i < 4; i++) { const sx = x + 30 + i * 36, sy = top + 6; ctx.fillStyle = col.ink; ctx.fillRect(sx - 4, sy - 4, 3, 8); ctx.fillRect(sx + 1, sy - 4, 3, 8); ctx.fillStyle = col.panel; ctx.fillRect(sx - 1 + (1 - op) * 0, sy - 3, 2 * op + 0.5, 6);
      const n = Math.round(r * 5); for (let j = 0; j < n; j++) { const f = (t * 0.5 + j / n + i * 0.2) % 1; ctx.beginPath(); ctx.arc(sx + Math.sin(f * 6 + i) * 4, sy + 12 + f * 30, 2.6, 0, 7); ctx.fillStyle = col.s[4]; ctx.globalAlpha = 1 - f; ctx.fill(); ctx.globalAlpha = 1; } }
    text(ctx, 'vapour out via stomata', x + 20, top + 62, { color: col.s[4], size: 10, weight: 700, fit: true });
    // tension gauge
    const gx = w - 40, gh = bot - top, tfrac = (-psiLeaf() - 0.4) / 3.6; ctx.strokeStyle = col.line; ctx.strokeRect(gx, top, 16, gh); ctx.fillStyle = col.bad; ctx.fillRect(gx, top + gh * (1 - tfrac), 16, gh * tfrac);
    text(ctx, 'tension', gx + 8, top - 8, { color: col.bad, size: 10, weight: 700, align: 'center', fit: false });
    text(ctx, 'root hairs absorb water', x + 34, bot + 26, { color: col.s[2], size: 10, align: 'left', fit: true });
  };
  show();
}
