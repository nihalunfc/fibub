// Figures and numbers for src/blog/discoveries/pig-nosed-turtle-kernel-core-area-ratio-impossible.md, made with
// the maths of the Home range analyser (src/lib/sci/homerange.ts: MCP, the fixed kernel and its isopleths).
// Run: node scripts/blog-figures/pig-nosed-turtle-kernel-core-area-ratio-impossible.mjs
import fs from 'node:fs';
import { project, mcp, href, kde, isopleth, steps } from '../../src/lib/sci/homerange.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/pig-nosed-turtle-kernel-core-area-ratio-impossible.md', import.meta.url);

// Values from Sawaki et al. (2025), J. Pengelolaan Sumberdaya Alam dan Lingkungan 15: 554 (CC BY 4.0):
// six adults, three days, daily movements 84.95 to 648.77 m, mean areas MCP 18.03 ha, 50 % kernel 7.51 ha,
// 95 % kernel 12.44 ha, hotspots 76.16 ha.
const PAPER = { mcp: 18.03, k95: 12.44, k50: 7.51, dayMin: 84.95, dayMax: 648.77, turtles: 6, days: 3 };
const RATIO_UNIFORM = 0.5 / 0.95;                    // the largest ratio any utilisation distribution allows
const RATIO_NORMAL = Math.log(2) / Math.log(20);      // a bivariate normal utilisation distribution
const HA = (m2) => m2 / 1e4;

let seed = 155354;
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());

/** A three-day river track: fixes every `perDay` hours along a channel that bends, in metres then degrees. */
function track(perDay, dayStep, bend = 0.35) {
  const n = perDay * PAPER.days + 1, step = dayStep / perDay;
  let x = 0, y = 0, dir = 0.2;
  const pts = [{ x, y }];
  for (let i = 1; i < n; i++) {
    dir += bend * gauss();
    const s = step * (0.6 + 0.8 * rnd());
    x += s * Math.cos(dir); y += s * Math.sin(dir);
    pts.push({ x, y });
  }
  const lat0 = -6.3, lon0 = 139.6, mPerDeg = 111320;
  return pts.map((p, i) => ({ t: i * (24 / perDay) * 3600, lat: lat0 + p.y / mPerDeg, lon: lon0 + p.x / (mPerDeg * Math.cos((lat0 * Math.PI) / 180)) }));
}
function summary(fixes, h = null) {
  const { pts } = project(fixes), hh = h ?? href(pts), k = kde(pts, hh, 200);
  const m = mcp(pts, 100), i95 = isopleth(k, 95), i50 = isopleth(k, 50);
  return { n: pts.length, h: hh, mcp: HA(m.area), k95: HA(i95.area), k50: HA(i50.area), ratio: i50.area / i95.area, pts };
}

console.log(`Paper: MCP ${PAPER.mcp} ha, 95 % kernel ${PAPER.k95} ha, 50 % kernel ${PAPER.k50} ha`);
console.log(`Paper's core ratio 50 % / 95 % = ${(PAPER.k50 / PAPER.k95).toFixed(4)}`);
console.log(`Largest ratio any utilisation distribution allows (a flat one): ${RATIO_UNIFORM.toFixed(4)}`);
console.log(`Ratio for a bivariate normal utilisation distribution, ln 2 / ln 20: ${RATIO_NORMAL.toFixed(4)}`);

// 1. The tool on points drawn from a bivariate normal: the ratio must land near ln 2 / ln 20.
{
  const sd = 300, fixes = Array.from({ length: 400 }, (_, i) => ({ t: i * 3600, lat: -6.3 + (sd * gauss()) / 111320, lon: 139.6 + (sd * gauss()) / (111320 * Math.cos((-6.3 * Math.PI) / 180)) }));
  const s = summary(fixes);
  console.log(`\n400 fixes from a round normal cloud (sd 300 m): h ${s.h.toFixed(0)} m, 95 % ${s.k95.toFixed(2)} ha, 50 % ${s.k50.toFixed(2)} ha, ratio ${s.ratio.toFixed(4)}`);
}

// 2. Simulated three-day river tracks at a few fix rates, with the reference bandwidth.
const RATES = [1, 2, 4, 8, 24];
const tracks = RATES.map((r) => {
  const s = summary(track(r, 350));
  return { rate: r, ...s };
});
console.log('\nSimulated three-day tracks, 350 m of travel a day, reference bandwidth:');
for (const t of tracks) console.log(`   ${String(t.n).padStart(3)} fixes (every ${(24 / t.rate).toFixed(0)} h): h ${t.h.toFixed(0)} m, MCP ${t.mcp.toFixed(2)} ha, 95 % ${t.k95.toFixed(2)} ha, 50 % ${t.k50.toFixed(2)} ha, ratio ${t.ratio.toFixed(4)}`);

// 3. The ratio against bandwidth, on the 4-fixes-a-day track.
const one = track(4, 350), { pts: onePts } = project(one);
const h0 = href(onePts);
const HS = Array.from({ length: 25 }, (_, i) => Math.round(h0 * (0.3 + (i * 2.4) / 24)));
const curve = HS.map((h) => { const s = summary(one, h); return { h, ...s }; });
console.log(`\nReference bandwidth for that track: ${h0.toFixed(1)} m. Ratio against bandwidth:`);
for (const c of curve.filter((_, i) => i % 4 === 0)) console.log(`   h ${c.h} m: 95 % ${c.k95.toFixed(2)} ha, 50 % ${c.k50.toFixed(2)} ha, ratio ${c.ratio.toFixed(4)}`);
console.log(`   highest ratio over all 25 bandwidths: ${Math.max(...curve.map((c) => c.ratio)).toFixed(4)}`);

// 4. Daily travel needed for an 18 ha minimum convex polygon over three days, at two fix rates.
console.log('\nMCP of a three-day track against daily travel:');
const DAYS = [100, 200, 350, 500, 650];
const byDay = DAYS.map((d) => ({ d, four: summary(track(4, d)).mcp, hourly: summary(track(24, d)).mcp }));
for (const b of byDay) console.log(`   ${b.d} m a day: MCP ${b.four.toFixed(2)} ha with 4 fixes a day, ${b.hourly.toFixed(2)} ha with 24`);

// 5. The worked example of "Check it yourself": 13 fixes of one simulated turtle.
// The example is rounded to five decimals, exactly as the article prints it, so the numbers match what a reader sees.
const EX = track(4, 420).map((f) => ({ t: f.t, lat: +f.lat.toFixed(5), lon: +f.lon.toFixed(5) }));
const rows = EX.map((f) => `${new Date(1701000000000 + f.t * 1000).toISOString().slice(0, 16).replace('T', ' ')}\t${f.lat.toFixed(5)}\t${f.lon.toFixed(5)}`);
console.log('\nCheck it yourself rows (time, latitude, longitude):');
for (const r of rows) console.log('   ' + r);
{
  const s = summary(EX), st = steps(s.pts, EX.map((f) => f.t));
  const lens = st.map((x) => x.len);
  console.log(`   ${s.n} fixes: h_ref ${s.h.toFixed(1)} m, MCP ${s.mcp.toFixed(2)} ha, 95 % ${s.k95.toFixed(2)} ha, 50 % ${s.k50.toFixed(2)} ha, ratio ${s.ratio.toFixed(3)}`);
  console.log(`   steps: ${st.length}, shortest ${Math.min(...lens).toFixed(0)} m, longest ${Math.max(...lens).toFixed(0)} m, total ${lens.reduce((a, b) => a + b, 0).toFixed(0)} m`);
}

// ---- Figure 1: the core ratio against bandwidth, with the two limits and the paper's value.
const fig1 = chart({
  title: 'Core area ÷ home range, against bandwidth', xLabel: 'Kernel bandwidth h (m)', yLabel: '50 % area ÷ 95 % area',
  series: [{ name: 'Simulated three-day track', kind: 'line', x: curve.map((c) => c.h), y: curve.map((c) => +c.ratio.toFixed(4)) }],
  xDomain: [HS[0], HS[HS.length - 1]], yDomain: [0, 0.7],
  hlines: [{ y: PAPER.k50 / PAPER.k95, text: 'the paper: 0.604' }, { y: RATIO_UNIFORM, text: 'flat utilisation: 0.526, the ceiling' }, { y: RATIO_NORMAL, text: 'normal utilisation: 0.231' }],
  height: 300,
  desc: 'The ratio of the 50 per cent kernel area to the 95 per cent kernel area for a simulated three-day turtle track, over a wide range of bandwidths. It stays near 0.23 and never approaches the ceiling of 0.526 that any utilisation distribution obeys, let alone the published 0.604.',
});

// ---- Figure 2: how the areas grow with the number of fixes.
const fig2 = chart({
  title: 'How far must a turtle swim for 18 ha?', xLabel: 'Travel a day (m)', yLabel: 'Minimum convex polygon (ha)',
  series: [
    { name: '4 fixes a day', kind: 'line', x: DAYS, y: byDay.map((b) => +b.four.toFixed(2)) },
    { name: '24 fixes a day', kind: 'line', x: DAYS, y: byDay.map((b) => +b.hourly.toFixed(2)) },
  ],
  xDomain: [100, 650], yDomain: [0, 45], hlines: [{ y: PAPER.mcp, text: "the paper's mean MCP: 18.03 ha" }], height: 300,
  desc: 'Minimum convex polygon area of a simulated three-day river track against how far the turtle travels a day, at four and twenty-four fixes a day. Reaching 18 hectares in three days takes travel near the top of the range the paper reports.',
});

let md = fs.readFileSync(ART, 'utf8');
md = inject(md, 'ratio', figure(fig1, 'Figure 1. The 50 % kernel area divided by the 95 % kernel area, for a simulated three-day river track, over bandwidths from a third to nearly three times the reference value. The upper dashed line is the ceiling that holds for every utilisation distribution; the published pair of areas sits above it.'));
md = inject(md, 'fixes', figure(fig2, 'Figure 2. Minimum convex polygon of a simulated three-day river track against how far the turtle moves a day, at two fix rates, with the paper\'s mean of 18.03 ha marked. A few fixes always give a smaller polygon than the same track sampled often.'));
fs.writeFileSync(ART, md);
console.log(`\nFigure 1 ${fig1.length} bytes; Figure 2 ${fig2.length} bytes`);
