// 11.7 A toy of eternal inflation, drawn on a map that stretches with space (comoving). Each Hubble time, every
// inflating square doubles in width (4 times the area in this flat 2D toy; the real 3D factor is e³ ≈ 20) and so
// splits into 4 squares. Each new square stops inflating with chance p and becomes a "bubble" (a coloured disc)
// whose colour stands for a different kind of vacuum, if the string landscape is right. The fraction of the map
// still inflating falls as (1 − p)ⁿ, but the number of inflating regions, which is their real volume, grows as
// (4(1 − p))ⁿ whenever p < 3/4: inflation never ends everywhere. Choices are fixed per square (seeded), so the
// picture is stable as you move the sliders.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

const hash = (x, y, d) => { let h = (x * 374761393 + y * 668265263 + d * 2147483647) >>> 0; h = ((h ^ (h >>> 13)) * 1274126177) >>> 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };

export default function (host) {
  const cv = canvas(host, { aspect: 1.0, max: 520, min: 360, label: 'A square of inflating space splitting again and again, with bubble universes forming in some pieces' });
  let n = 5, p = 0.4;
  const ctl = row(host);
  slider(ctl, { label: 'Hubble times', min: 0, max: 7, step: 1, value: n, fmt: (v) => String(v), oninput: (v) => { n = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'Chance a piece stops (p)', min: 0.1, max: 0.9, step: 0.05, value: p, fmt: (v) => v.toFixed(2), oninput: (v) => { p = v; cv.redraw(); show(); } });
  const out = readout(host);
  let inflating = 0;
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Eternal inflation: bubbles in a growing sea', col);
    const S = Math.min(w - 20, h - top - 34), L = (w - S) / 2, T = top + 10;
    ctx.fillStyle = col.soft; ctx.fillRect(L, T, S, S);
    const pal = [col.s[0], col.s[1], col.s[2], col.s[3], col.s[4], col.s[5]];
    inflating = 0;
    const walk = (x, y, d) => { // x, y: integer cell coordinates at depth d
      if (d === n) { inflating++; return; }
      for (let i = 0; i < 4; i++) {
        const cx = 2 * x + (i & 1), cy = 2 * y + (i >> 1);
        if (hash(cx, cy, d + 3) < p) {
          const size = S / 2 ** (d + 1);
          ctx.beginPath(); ctx.arc(L + (cx + 0.5) * size, T + (cy + 0.5) * size, size * 0.46, 0, Math.PI * 2);
          ctx.fillStyle = pal[Math.floor(hash(cy, cx, d + 7) * pal.length)]; ctx.fill();
        } else walk(cx, cy, d + 1);
      }
    };
    walk(0, 0, 0);
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.strokeRect(L + 0.5, T + 0.5, S - 1, S - 1);
    text(ctx, 'pale: still inflating · discs: bubble universes', w / 2, h - 12, { color: col.muted, size: 10.5, align: 'center' });
  };
  const show = () => {
    const g = 4 * (1 - p), frac = inflating / 4 ** n;
    out.innerHTML = `After <b>${n}</b> Hubble times, <b>${inflating.toLocaleString('en-CA')}</b> pieces are still inflating, ${(frac * 100).toPrecision(2)}% of the map. On average, each Hubble time the inflating volume changes by ×${g.toFixed(2)}: ${g > 1 ? '<b>it keeps growing, so inflation never ends everywhere</b>.' : 'it shrinks, so inflation would end everywhere. In real 3D space the growth is e³ ≈ 20 per Hubble time, so only p above 95% would stop it.'}`;
  };
  cv.redraw(); show();
}
