// Cherenkov light: a charged particle faster than light's speed in a material (c/n) leaves a cone of light,
// like a boat's bow wave. Each ring is light sent out at one moment; when the particle outruns its own rings
// they pile up on a cone at cos θ = 1/(nβ). Change the speed and the material.
import { stage, clear, text, dot, line, type Stage } from '../kit';

const MEDIA: [string, string, number][] = [['ice', 'Ice (n = 1.31)', 1.31], ['water', 'Water (1.33)', 1.33], ['glass', 'Glass (1.5)', 1.5], ['air', 'Air (1.0003)', 1.0003]];

export default function (el: HTMLElement) {
  const s: Stage = stage(el, { tag: 'Try it: a light boom', title: 'Make a particle outrun light in ice', h: 340, alt: 'A dot moves right, dropping expanding circles of light. When it is faster than light in the material the circles pile up into a cone.', caption: 'Each circle is light sent out at one moment, spreading at c/n. The angle shown is between the particle\'s path and the light it sends out.' });
  let n = 1.31, beta = 0.99, x = 0, rings: { x: number; r: number }[] = [], tEmit = 0;
  s.choice(MEDIA.map(([id, label]) => [id, label]), 'ice', (v) => { n = MEDIA.find((m) => m[0] === v)![2]; rings = []; x = 0; });
  s.slider('Particle speed', 0.5, 0.999, 0.001, beta, (v) => `${v.toFixed(3)} c`, (v) => { beta = v; rings = []; x = 0; });
  const SC = 260; // pixels per light-unit-time of travel at speed c
  s.play((dt) => {
    const step = dt * 0.9;
    x += beta * SC * step; tEmit += step;
    for (const g of rings) g.r += (SC / n) * step;
    if (tEmit > 0.06) { tEmit = 0; rings.push({ x, r: 0 }); }
    if (x > s.W + 200) { x = 0; rings = []; }
    rings = rings.filter((g) => g.r < 700);
    clear(s); const c = s.col, y = s.H / 2;
    line(s, [[0, y], [s.W, y]], c.line, 1, [4, 6]);
    for (const g of rings) { s.c.strokeStyle = c.blue; s.c.globalAlpha = 0.45; s.c.lineWidth = 1.4; s.c.beginPath(); s.c.arc(g.x, y, g.r, 0, Math.PI * 2); s.c.stroke(); s.c.globalAlpha = 1; }
    const above = beta * n > 1;
    if (above && rings.length > 2) {
      const half = Math.asin(1 / (n * beta)); // cone half-angle at the tip, measured from the path
      const len = 520;
      for (const sg of [-1, 1]) line(s, [[x, y], [x - len * Math.cos(half), y + sg * len * Math.sin(half)]], c.amber, 3);
    }
    dot(s, x, y, 6, c.ink);
    const th = above ? (Math.acos(1 / (n * beta)) * 180) / Math.PI : null;
    text(s, above ? `Cherenkov angle θ = ${th!.toFixed(1)}°` : 'No cone: slower than light in this material', 14, 24, { bold: true });
    text(s, `light here moves at c/n = ${(1 / n).toFixed(3)} c`, 14, 44, { size: 12, colour: c.muted });
    s.mark();
    s.out(above
      ? `The particle (${beta.toFixed(3)} c) beats light (${(1 / n).toFixed(3)} c), so its light piles into a cone. Light leaves at <b>θ = ${th!.toFixed(1)}°</b> to the path (cos θ = 1/(nβ)). In ice a near-light-speed muon gives about 41°: that angle is how IceCube works out where a muon came from.`
      : `Below the threshold speed c/n = ${(1 / n).toFixed(3)} c the rings never overlap, so there is no bright front. That is why slow particles make no Cherenkov light.`);
  });
}
