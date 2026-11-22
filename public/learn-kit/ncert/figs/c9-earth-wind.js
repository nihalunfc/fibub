// Class 9 Earth as a system: winds and the monsoon from uneven heating. Land warms and cools faster than the sea.
// Air over the hotter side rises (low pressure at the surface); cooler air from the other side flows in to replace it
// (wind), rises, spreads out aloft and sinks over the cooler side: a loop. Wind speed here grows with the
// temperature difference. Presets: sea breeze (day), land breeze (night), summer and winter monsoon.
import { canvas, text, title, line, dot, arrow, row, slider, choice, loop, readout } from '../../kit.js';

export default function (host) {
  let d = 6, t = 0;
  const cv = canvas(host, { aspect: 0.74, max: 440, min: 270, label: 'Land and sea with a circulating loop of air driven by the temperature difference' });
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Land minus sea temperature', min: -10, max: 10, step: 1, value: d, fmt: (v) => (v > 0 ? '+' : '') + v + ' °C', oninput: (v) => { d = v; msg(); } });
  const pr = row(host);
  choice(pr, 'Try', [['day', 'Day: sea breeze'], ['night', 'Night: land breeze'], ['sum', 'Summer monsoon'], ['win', 'Winter monsoon']], 'day', (v) => { d = { day: 6, night: -5, sum: 10, win: -8 }[v]; sl.set(d); msg(); });
  const out = readout(host);
  const msg = () => { out.innerHTML = d === 0 ? 'Land and sea are equally warm: no pressure difference, so no wind.' : d > 0 ? `Land is ${d} °C hotter. Air over land rises, so cool moist air blows <b>from the sea to the land</b>. ${d >= 8 ? 'On the scale of a season this is the summer monsoon: it brings rain to most of India from June to September.' : 'This is a sea breeze, felt on a hot afternoon in Mumbai or Chennai.'}` : `The sea is ${-d} °C warmer. Air over the sea rises, so air blows <b>from the land to the sea</b>. ${d <= -7 ? 'On the scale of a season this is the dry winter monsoon, from about November to February.' : 'This is a land breeze, felt at night.'}`; cv.redraw(); };
  loop(host, (dt) => { t += dt * Math.abs(d) / 6; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Why the wind blows', col) + 4, hz = top + (h - top) * 0.7, mid = w / 2;
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.4; ctx.fillRect(0, hz, mid, h - hz); ctx.globalAlpha = 1;
    ctx.fillStyle = col.soft; ctx.fillRect(mid, hz, w - mid, h - hz);
    line(ctx, [[mid, hz], [mid, h]], col.line, 1);
    text(ctx, 'SEA', mid / 2, h - 14, { color: col.ink, size: 11, weight: 700, align: 'center' });
    text(ctx, 'LAND', mid + mid / 2, h - 14, { color: col.ink, size: 11, weight: 700, align: 'center' });
    // temperature chips
    const hotLand = d > 0, a = Math.min(1, Math.abs(d) / 10);
    ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.15 + 0.5 * a; ctx.fillRect(hotLand ? mid : 0, hz - 2, mid, 10); ctx.globalAlpha = 1;
    if (d === 0) return text(ctx, 'no difference: no wind', w / 2, top + (hz - top) / 2, { color: col.muted, size: 12, align: 'center' });
    // loop: surface flow from cool side to hot side, up over hot side, aloft back, down over cool side
    const xc = hotLand ? mid / 2 : mid + mid / 2, xh = hotLand ? mid + mid / 2 : mid / 2;
    const yU = top + 22, yS = hz - 18;
    const path = [[xc, yS], [xh, yS], [xh, yU], [xc, yU], [xc, yS]];
    const seg = path.slice(1).map((p, i) => Math.hypot(p[0] - path[i][0], p[1] - path[i][1])), tot = seg.reduce((x, y) => x + y, 0);
    line(ctx, path, col.line, 1.5, [4, 4]);
    for (let k = 0; k < 14; k++) {
      let dd = ((t * 0.18 + k / 14) % 1) * tot, i = 0; while (dd > seg[i]) { dd -= seg[i]; i++; }
      const f = dd / seg[i]; dot(ctx, path[i][0] + f * (path[i + 1][0] - path[i][0]), path[i][1] + f * (path[i + 1][1] - path[i][1]), 3, col.s[0]);
    }
    arrow(ctx, xc - (xh - xc) * 0.2, yS + 10, xc + (xh - xc) * 0.3, yS + 10, col.s[0], 3, 10);
    text(ctx, 'WIND at the surface', (xc + xh) / 2, yS - 12, { color: col.s[0], size: 10.5, weight: 700, align: 'center' });
    text(ctx, 'warm air rises', xh, (yU + yS) / 2, { color: col.s[1], size: 10.5, weight: 700, align: 'center', halo: col.panel });
    text(ctx, 'cool air sinks', xc, (yU + yS) / 2, { color: col.s[0], size: 10.5, weight: 700, align: 'center', halo: col.panel });
  };
  msg();
}
