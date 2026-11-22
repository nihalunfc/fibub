// Class 9 Reproduction: pollination, the transfer of pollen from an anther to a stigma. Self-pollination is within
// the same flower (or another flower of the same plant); cross-pollination moves pollen to a flower of a different
// plant of the same kind, which mixes traits. Agents: insects (bees, butterflies), wind, water, birds and bats.
// Pollen of insect-pollinated flowers is sticky; wind-pollinated flowers make huge amounts of light pollen.
import { canvas, text, title, dot, line, row, choice, loop, readout, ease } from '../../kit.js';

const INFO = {
  self: 'Self-pollination: pollen falls from the anther onto the stigma of the same flower (as in pea and wheat). No agent is needed, but the offspring show little variation.',
  insect: 'Cross-pollination by an insect: the bee visits flower A for nectar, pollen sticks to its hairy body, and it brushes off on the stigma of flower B (another plant). Colour and scent attract it.',
  wind: 'Cross-pollination by wind (maize, grasses, coconut): the flowers are small and dull, make a huge amount of light dry pollen, and have feathery stigmas to catch it.',
};
export default function (host) {
  let mode = 'insect', t = 0;
  const cv = canvas(host, { aspect: 0.7, max: 400, min: 290, label: 'Pollen moving by self-pollination, by an insect and by wind' });
  loop(host, (dt) => { t += dt; cv.redraw(); }).button(row(host));
  const ctl = row(host);
  choice(ctl, 'Type', [['self', 'Self'], ['insect', 'Insect'], ['wind', 'Wind']], mode, (v) => { mode = v; t = 0; upd(); });
  const out = readout(host);
  function upd() { out.textContent = INFO[mode]; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, { self: 'Self-pollination', insect: 'Insect pollination', wind: 'Wind pollination' }[mode], col);
    const gy = h * 0.88, P = (t % 6) / 6;
    const flower = (x, label, petals) => {
      line(ctx, [[x, gy], [x, gy - 70]], col.s[2], 4);
      for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + (k - 2) * 0.55; ctx.fillStyle = petals; ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * 20, gy - 82 + Math.sin(a) * 18, 12, 8, a, 0, 7); ctx.fill(); }
      line(ctx, [[x - 8, gy - 82], [x - 10, gy - 106]], col.s[1], 2); dot(ctx, x - 10, gy - 108, 4, col.s[3]);
      line(ctx, [[x + 8, gy - 82], [x + 10, gy - 106]], col.s[1], 2); dot(ctx, x + 10, gy - 108, 4, col.s[3]);
      line(ctx, [[x, gy - 82], [x, gy - 112]], col.s[4], 3); dot(ctx, x, gy - 114, 4.5, col.s[1]);
      text(ctx, label, x, gy + 10, { color: col.ink, size: 10.5, align: 'center' });
    };
    if (mode === 'self') {
      const x = w / 2; flower(x, 'one flower', col.s[0]);
      for (let k = 0; k < 6; k++) { const f = ((t * 0.5 + k / 6) % 1), e = ease(f); dot(ctx, x + 10 + (-10) * e + Math.sin(k) * 2, gy - 108 + 0 + e * 4 - 6 * (1 - e), 2.4, col.s[3]); }
      text(ctx, 'pollen falls to the stigma of the same flower', w / 2, 44, { color: col.s[3], size: 10.5, align: 'center' });
    }
    if (mode === 'insect') {
      const x1 = w * 0.25, x2 = w * 0.75; flower(x1, 'flower A', col.s[0]); flower(x2, 'flower B (another plant)', col.s[0]);
      const e = ease(Math.min(1, Math.max(0, (P - 0.15) / 0.6))), bx = x1 + 10 + (x2 - 10 - x1 - 10) * e, by = gy - 128 - Math.sin(e * Math.PI) * 30 + (P < 0.15 ? 20 * (1 - P / 0.15) : 0);
      ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.ellipse(bx, by, 10, 6, 0, 0, 7); ctx.fill(); line(ctx, [[bx - 3, by - 4], [bx - 6, by - 12 + Math.sin(t * 40) * 3]], col.ink, 2); line(ctx, [[bx + 3, by - 4], [bx + 6, by - 12 + Math.sin(t * 40 + 1) * 3]], col.ink, 2);
      if (P > 0.15) for (let k = 0; k < 4; k++) dot(ctx, bx - 8 + k * 2, by + 6, 1.8, col.ink);
      text(ctx, P < 0.8 ? 'pollen sticks to the bee' : 'pollen reaches the stigma', w / 2, 44, { color: col.s[3], size: 10.5, align: 'center' });
    }
    if (mode === 'wind') {
      const x1 = w * 0.2, x2 = w * 0.78; flower(x1, 'plant A', col.panel); flower(x2, 'plant B', col.panel);
      for (let k = 0; k < 16; k++) { const f = (t * 0.25 + k / 16) % 1, x = x1 + 14 + (x2 - x1 - 24) * f, y = gy - 112 - Math.sin(f * Math.PI) * 40 + Math.sin(k * 2.1 + t * 3) * 8; dot(ctx, x, y, 2.2, col.s[3]); }
      for (let k = 0; k < 3; k++) { const y = 60 + k * 22; line(ctx, [[18, y], [60 + k * 14, y]], col.muted, 1.5, [4, 4]); }
      text(ctx, 'wind', 18, 52, { color: col.muted, size: 10.5 });
    }
  };
  upd();
}
