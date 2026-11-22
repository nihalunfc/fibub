// Class 9 Earth as a system: the water cycle. The Sun's heat evaporates sea water (and leaves give out vapour, called
// transpiration); vapour rises, cools, condenses into clouds; wind carries clouds inland; rain and snow fall;
// water runs back to the sea in rivers or soaks into the ground. The slider changes the Sun's heating, which speeds
// the whole cycle. The "Where is the water?" view shows how the world's water is split (USGS, Shiklomanov 1993).
import { canvas, text, title, line, dot, arrow, row, slider, choice, loop, readout } from '../../kit.js';

export default function (host) {
  let heat = 1, view = 'cycle', t = 0;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 280, label: 'Animated water cycle with evaporation, clouds, rain and rivers, or bars showing where the Earth\'s water is stored' });
  const ctl = row(host);
  choice(ctl, 'View', [['cycle', 'Cycle'], ['stores', 'Where is the water?']], 'cycle', (v) => { view = v; msg(); });
  slider(ctl, { label: 'Sun’s heat', min: 0.3, max: 2, step: 0.1, value: 1, fmt: (v) => v.toFixed(1) + '×', oninput: (v) => { heat = v; msg(); } });
  const out = readout(host);
  const msg = () => { out.innerHTML = view === 'cycle' ? (heat > 1.3 ? 'Hotter sun: faster evaporation, more cloud, heavier rain. The same water just moves round faster.' : heat < 0.6 ? 'Weak sun: little evaporation, so few clouds and little rain.' : 'The water you drink today has been round this cycle many times. Water is never used up, only moved.') : 'Of all the water on Earth, only about 2.5% is fresh, and most of that is frozen or underground. The rivers and lakes we use are a tiny sliver.'; cv.redraw(); };
  loop(host, (dt) => { t += dt * heat; if (view === 'cycle') cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, view === 'cycle' ? 'The water cycle' : 'Where is Earth’s water? (share of the total)', col) + 6;
    if (view === 'stores') {
      const bars = [
        ['All water', [['Oceans 96.5%', 96.5, 0], ['Ice 1.7%', 1.74, 2], ['Underground 1.7%', 1.69, 3], ['Other', 0.06, 5]]],
        ['Fresh water only', [['Ice and snow 69%', 68.7, 2], ['Underground 30%', 30.1, 3], ['Lakes, rivers, soil 1.2%', 1.2, 0]]],
      ];
      bars.forEach(([name, parts], i) => {
        const y = top + 30 + i * 125, bw = w - 24; text(ctx, name, 12, y - 12, { color: col.ink, size: 12, weight: 700 });
        let x = 12;
        parts.forEach(([lab, v, c], j) => { const ww = Math.max(2, bw * v / 100); ctx.fillStyle = col.s[c]; ctx.fillRect(x, y, ww, 28); if (ww > 22 || j === 0) { } x += ww; });
        let ly = y + 44; parts.forEach(([lab, v, c]) => { ctx.fillStyle = col.s[c]; ctx.fillRect(14, ly - 5, 10, 10); text(ctx, lab, 30, ly, { color: col.ink, size: 11 }); ly += 15; });
      });
      return;
    }
    const hz = top + (h - top) * 0.58, mid = w * 0.5;
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.45; ctx.fillRect(0, hz, mid - 10, h - hz); ctx.globalAlpha = 1;
    ctx.fillStyle = col.soft; ctx.beginPath(); ctx.moveTo(mid - 10, hz + 14); ctx.lineTo(mid + (w - mid) * 0.6, hz - 38); ctx.lineTo(w, hz - 10); ctx.lineTo(w, h); ctx.lineTo(mid - 10, h); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.stroke();
    dot(ctx, 28, top + 22, 10 + heat * 2, col.s[2]);
    // tree
    const tx = w * 0.88, ty = hz - 6; line(ctx, [[tx, ty + 8], [tx, ty - 14]], col.muted, 3); dot(ctx, tx, ty - 22, 11, col.s[3]);
    // cloud
    const cx = mid + 10, cy = top + 34; for (const [dx, r] of [[-22, 13], [0, 18], [24, 13]]) dot(ctx, cx + dx, cy, r, col.soft, col.line);
    text(ctx, 'cloud', cx, cy - 26, { color: col.muted, size: 10.5, align: 'center' });
    const ph = (s) => (((t * 0.25 + s) % 1) + 1) % 1;
    const n = Math.round(4 + heat * 4);
    for (let k = 0; k < n; k++) { const p = ph(k / n); dot(ctx, 24 + (mid - 70) * ((k * 0.382) % 1), hz - p * (hz - cy - 22), 2.8, col.s[0]); }
    for (let k = 0; k < n; k++) { const p = ph(k / n + 0.5); dot(ctx, tx - 6 + 4 * Math.sin(p * 9), ty - 30 - p * (ty - cy - 30), 2.5, col.s[0]); }
    for (let k = 0; k < n; k++) { const p = ph(k / n); dot(ctx, cx - 14 + (k % 4) * 14, cy + 24 + p * (hz - 6 - cy - 24), 2.6, col.s[0]); }
    // river back to the sea
    for (let k = 0; k < 5; k++) { const p = ph(k / 5); dot(ctx, w * 0.8 - p * (w * 0.8 - mid + 20), hz - 24 + p * 30 + 2 * Math.sin(p * 12), 2.8, col.s[0]); }
    text(ctx, 'evaporation', 14, hz - 18, { color: col.s[0], size: 10.5, weight: 700, halo: col.panel });
    text(ctx, 'rain', cx + 46, cy + 56, { color: col.s[0], size: 10.5, weight: 700 });
    text(ctx, 'river runs back to the sea', mid + 2, h - 12, { color: col.s[0], size: 10.5, weight: 700 });
    text(ctx, 'plants give out vapour', w - 8, h - 30, { color: col.s[3], size: 10, weight: 700, align: 'right' });
    text(ctx, 'sea', 12, h - 12, { color: col.ink, size: 11, weight: 700 });
  };
  msg();
}
