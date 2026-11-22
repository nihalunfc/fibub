// Class 10 Colourful World: why stars twinkle but planets do not. Starlight crosses layers of air whose density is always
// shifting (turbulence), so its path bends by a slightly different amount from moment to moment: the star seems to wobble
// in position and brightness. A star is so far away that it is a point source: all its light follows one wobbling path.
// A planet is close enough to be a tiny disc, a collection of many point sources, whose wobbles average out, so it shines steadily.
// Layers get denser downwards, so every ray bends towards the normal and the apparent position is higher than the true one.
import { canvas, text, title, line, dot, row, slider, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let kind = 'star', turb = 0.6, t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Light from a star or a planet bending through shifting layers of air' });
  const ctl = row(host);
  choice(ctl, 'Looking at', [['star', 'A star (point source)'], ['planet', 'A planet (tiny disc)']], kind, (v) => { kind = v; update(); });
  slider(ctl, { label: 'Turbulence in the air', min: 0, max: 1, step: 0.05, value: turb, fmt: (v) => (v < 0.2 ? 'calm' : v < 0.65 ? 'some' : 'windy'), oninput: (v) => { turb = v; update(); } });
  const out = readout(host);
  loop(host, (dt) => { t += dt; cv.redraw(); });
  function update() { out.innerHTML = kind === 'star' ? `A star is a <b>point</b> of light: one path, so when the air shifts the whole star seems to jump and its brightness flickers. ${turb === 0 ? 'With perfectly calm air there would be no twinkling.' : 'This is <b>twinkling</b>.'}` : 'A planet is a tiny <b>disc</b>: many paths at once. Some get brighter while others get dimmer, so on the whole its light stays <b>steady</b>.'; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, kind === 'star' ? 'A star twinkles' : 'A planet shines steadily', col);
    const yTop = h * 0.4, yBot = h - 30, N = 6, O = [w * 0.5, yBot], S = [w * 0.28, 66], n = 6;
    // atmosphere: layers darker (denser) towards the ground
    for (let k = 0; k < N; k++) { ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.05 + 0.05 * k; ctx.fillRect(0, yTop + (k * (yBot - yTop)) / N, w, (yBot - yTop) / N); ctx.globalAlpha = 1; }
    for (let k = 0; k <= N; k++) line(ctx, [[0, yTop + (k * (yBot - yTop)) / N], [w, yTop + (k * (yBot - yTop)) / N]], col.line, 1, [2, 4]);
    text(ctx, 'thin air (rarer)', 8, yTop + 12, { color: col.muted, size: 10.5 }); text(ctx, 'dense air', 8, yBot - 12, { color: col.muted, size: 10.5 });
    line(ctx, [[0, yBot], [w, yBot]], col.ink, 2); dot(ctx, O[0], O[1] + 10, 6, col.ink); text(ctx, 'you', O[0] + 10, O[1] + 12, { color: col.ink, size: 11, weight: 700 });
    const srcs = kind === 'star' ? [0] : [-3, -1, 1, 3], apps = [];
    srcs.forEach((o, si) => {
      const Ss = [S[0] + o * 3, S[1]], T0 = [Ss[0] + (O[0] - Ss[0]) * ((yTop - Ss[1]) / (O[1] - Ss[1])), yTop], pts = [Ss, T0];
      for (let k = 1; k < n; k++) {
        const f = k / n, y = yTop + (yBot - yTop) * f, base = T0[0] + (O[0] - T0[0]) * (f + 0.12 * Math.sin(Math.PI * f)), j = turb * 14 * Math.sin(t * (1.7 + k * 0.9 + si * 0.37) + k * 2.1 + si * 1.3) * Math.sin(Math.PI * f);
        pts.push([base + j, y]);
      }
      pts.push(O); line(ctx, pts, col.s[3], kind === 'star' ? 2 : 1.3);
      const a = pts[pts.length - 2], dx = O[0] - a[0], dy = O[1] - a[1], up = (O[1] - 70) / dy, A = [O[0] - dx * up, O[1] - dy * up]; apps.push(A);
      if (kind === 'star') line(ctx, [O, A], col.s[3], 1.2, [4, 4]);
    });
    // the star / planet as the observer sees it (apparent position), and its true place
    const ax = apps.reduce((a, p) => a + p[0], 0) / apps.length, ay = apps.reduce((a, p) => a + p[1], 0) / apps.length;
    if (kind === 'star') { const fl = 0.6 + 0.4 * (1 - turb) + turb * 0.4 * Math.sin(t * 13), r = 3 + 5 * fl; ctx.save(); ctx.globalAlpha = Math.max(0.3, fl); dot(ctx, ax, ay, r, col.s[3]); ctx.restore(); }
    else { dot(ctx, ax, ay, 7, col.s[3]); }
    dot(ctx, S[0], S[1], 3, col.ink); text(ctx, 'true position', S[0] - 6, S[1] - 12, { color: col.muted, size: 10.5, align: 'center' });
    text(ctx, `apparent ${kind}`, ax + 12, ay - 4, { color: col.s[3], size: 11, weight: 700, halo: col.panel });
    text(ctx, 'rays bend towards the normal in denser air', w - 8, h - 8, { color: col.muted, size: 10, align: 'right' });
  };
  update();
}
