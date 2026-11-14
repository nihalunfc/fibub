#!/usr/bin/env node
// Charts for the internet-tool guides (blog/guides/internet-speed-test, wifi-spot-finder, cell-signal-guide).
// Every number is worked out with the tools' own maths (src/lib/net/speed.ts and cell.ts), then drawn as a
// one-line inline SVG between <!-- fig:<name> --> and <!-- /fig --> in the article. Colours use the site's
// CSS variables, so the charts follow light, dark and red-light modes.
// Run: node scripts/net-figures.mjs   (rewrites the figures in place; prints one line per figure)
import { readFileSync, writeFileSync } from 'node:fs';
import { median, jitter, bloat, spotScore } from '../src/lib/net/speed.ts';
import { rateSignal } from '../src/lib/net/cell.ts';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const T = (x, y, s, a = 'start', extra = '') => `<text x="${x}" y="${y}" text-anchor="${a}" style="fill:var(--ink);font:12px system-ui,sans-serif" ${extra}>${esc(s)}</text>`;
const M = (x, y, s, a = 'start') => `<text x="${x}" y="${y}" text-anchor="${a}" style="fill:var(--muted);font:11px system-ui,sans-serif">${esc(s)}</text>`;
const svg = (w, h, label, body) => `<figure class="fig"><svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="${esc(label)}">${body}</svg><figcaption>${esc(label)}</figcaption></figure>`;
const tone = (t) => `var(--${t === 'good' ? 'good' : t === 'warn' ? 'warn' : 'bad'})`;

const figs = {};

// 1. Speed test: idle pings vs pings while a download fills the line (made-up but typical series).
{
  const idle = [21, 19, 22, 20, 24, 19, 21, 23, 20, 22, 19, 21, 25, 20, 21, 22, 19, 20, 23, 21];
  const busy = [24, 48, 77, 103, 128, 141, 152, 149, 160, 155, 158, 162, 150, 157, 161, 154, 159, 163, 156, 160];
  const W = 640, H = 240, x0 = 44, y0 = 200, top = 20, xs = (i) => x0 + (i * (W - x0 - 20)) / 19, ys = (v) => y0 - ((y0 - top) * v) / 180;
  let b = '';
  for (const v of [0, 60, 120, 180]) b += `<line x1="${x0}" x2="${W - 20}" y1="${ys(v)}" y2="${ys(v)}" style="stroke:var(--line)"/>` + M(x0 - 6, ys(v) + 4, v, 'end');
  b += M(x0 - 6, 14, 'ms', 'end') + M(W / 2, 232, 'ping number (one every 0.35 s)', 'middle');
  const line = (a, col) => `<polyline fill="none" stroke-width="2.5" style="stroke:${col}" points="${a.map((v, i) => `${xs(i).toFixed(1)},${ys(v).toFixed(1)}`).join(' ')}"/>`;
  b += line(idle, 'var(--good)') + line(busy, 'var(--bad)');
  const mi = median(idle), ji = jitter(idle), mb = median(busy);
  b += T(xs(19), ys(mi) - 8, `idle: median ${mi} ms, jitter ${ji.toFixed(1)} ms`, 'end');
  b += T(xs(19), ys(mb) + 18, `while downloading: median ${mb} ms (bufferbloat: ${bloat(mi, mb)})`, 'end');
  figs['ping-bloat'] = svg(W, H, `Pings on a quiet line and while a download runs. Median and jitter from the Speed Test's own maths: idle ${mi} ms (jitter ${ji.toFixed(1)} ms), busy ${mb} ms.`, b);
}

// 2. Speed test: time to download a 1 GB file at common plan speeds (8,000 megabits / speed).
{
  const speeds = [10, 25, 50, 100, 300, 1000];
  const W = 640, H = 230, x0 = 90, bw = W - x0 - 120;
  const sec = speeds.map((s) => 8000 / s), max = sec[0];
  const fmt = (s) => (s >= 60 ? `${Math.floor(s / 60)} min ${Math.round(s % 60)} s` : `${s.toFixed(0)} s`);
  let b = '';
  speeds.forEach((s, i) => {
    const y = 14 + i * 34, w = Math.max(3, (bw * sec[i]) / max);
    b += T(x0 - 8, y + 16, `${s} Mbps`, 'end') + `<rect x="${x0}" y="${y}" width="${w.toFixed(1)}" height="22" rx="3" style="fill:var(--accent)"/>` + T(x0 + w + 6, y + 16, fmt(sec[i]));
  });
  figs['gb-time'] = svg(W, H, 'Time to download a 1 GB file at each speed: 1 GB is 8,000 megabits, so time = 8,000 / Mbps (before any slowdowns).', b);
}

// 3. Wi-Fi: the sample house, score per spot with the bars each spot showed.
{
  const spots = [['Living room', '4 bars', 210, 38, 14, 2], ['Kitchen', '3 bars', 120, 30, 18, 4], ['Bedroom upstairs', '2 bars', 35, 9, 32, 11], ['Back porch', '4 bars', 4, 1.5, 120, 45], ['Basement', '1 bar', 2.4, 0.8, 140, 55]];
  const W = 640, H = 200, x0 = 130, bw = W - x0 - 150;
  let b = '';
  spots.forEach(([n, bars, d, u, l, j], i) => {
    const s = spotScore({ down: d, up: u, latency: l, jitter: j }), y = 10 + i * 36, w = (bw * s) / 100;
    const t = s >= 65 ? 'good' : s >= 40 ? 'warn' : 'bad';
    b += T(x0 - 8, y + 17, n, 'end') + `<rect x="${x0}" y="${y}" width="${w.toFixed(1)}" height="24" rx="3" style="fill:${tone(t)}"/>` + T(x0 + w + 6, y + 17, `${s}  (${bars}, ${d} Mbps)`);
  });
  figs['wifi-spots'] = svg(W, H, 'Spot scores (0 to 100) from the Wi-Fi Finder\'s scoring for a made-up house. The back porch shows full bars yet scores low: signal and connectivity are different things.', b);
}

// 4. Cell: LTE RSRP rating bands with three networks' average readings placed on them.
{
  const W = 640, H = 150, lo = -125, hi = -65, x0 = 20, x1 = W - 20, xs = (v) => x0 + ((v - lo) * (x1 - x0)) / (hi - lo);
  let b = '';
  for (let v = lo; v < hi; v++) { const r = rateSignal('lte', v + 0.5); b += `<rect x="${xs(v).toFixed(1)}" y="40" width="${(xs(v + 1) - xs(v) + 0.5).toFixed(1)}" height="26" style="fill:${tone(r.tone)};opacity:${r.label === 'Excellent' || r.label === 'Very poor' ? 1 : 0.75}"/>`; }
  for (const v of [-120, -110, -100, -90, -80, -70]) b += M(xs(v), 84, v, 'middle');
  for (const [v, l] of [[-117, 'Very poor'], [-105, 'Poor'], [-95, 'Fair'], [-85, 'Good'], [-73, 'Excellent']]) b += T(xs(v), 32, l, 'middle');
  const nets = [['A', [-92, -99]], ['B', [-104, -84]], ['C', [-113, -101]]];
  nets.forEach(([n, r], i) => {
    const a = r.reduce((x, y) => x + y, 0) / r.length;
    b += `<line x1="${xs(a)}" x2="${xs(a)}" y1="38" y2="${100 + i * 16}" style="stroke:var(--ink)" stroke-width="1.5"/>` + T(xs(a) + 4, 110 + i * 16, `Network ${n}: ${a} dBm (${rateSignal('lte', a).label})`);
  });
  b += M(W / 2, 146, 'LTE RSRP, dBm (less negative = stronger)', 'middle');
  figs['lte-bands'] = svg(W, H, 'LTE signal bands used by the Cell Signal tool, with the average of two made-up readings per network placed on them.', b);
}

const files = { 'src/blog/guides/internet-speed-test.md': ['ping-bloat', 'gb-time'], 'src/blog/guides/wifi-spot-finder.md': ['wifi-spots'], 'src/blog/guides/cell-signal-guide.md': ['lte-bands'] };
for (const [f, names] of Object.entries(files)) {
  let s = readFileSync(f, 'utf8');
  for (const n of names) {
    const re = new RegExp(`<!-- fig:${n} -->[\\s\\S]*?<!-- /fig -->`);
    if (!re.test(s)) throw new Error(`${f}: no <!-- fig:${n} --> marker`);
    s = s.replace(re, `<!-- fig:${n} -->${figs[n]}<!-- /fig -->`);
    console.log(`${f}: ${n}`);
  }
  writeFileSync(f, s);
}
