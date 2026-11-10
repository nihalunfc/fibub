// #1258 Distance and displacement
export const path = '/learn/distance-displacement/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/distance-displacement/`); await page.waitForTimeout(700);
  const facts = () => page.textContent('.dsp .dsp-facts'), eq = () => page.textContent('.dsp .dsp-eq'), pill = () => page.textContent('.dsp .dsp-pill');
  { const f = await facts(); check(f.includes('Distance walked700 m') && f.includes('Displacement500 m53.1° north of east') && f.includes('Average speed1.17 m/s') && f.includes('Average velocity0.83 m/s'), `distance-displacement: example 700 m, 500 m (${f})`); }
  check(await page.$eval('.dsp .dsp-scene', (c) => { const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < x.length; i += 4) if (x[i] < 120) n++; return n > 300; }), 'distance-displacement: map drawn');
  await page.selectOption('.dsp .dsp-pre', 'square'); await page.waitForTimeout(100);
  check((await pill()).startsWith('Back where you started') && (await facts()).includes('Distance walked400 m'), 'distance-displacement: round the block, displacement 0');
  // tap a walk: clear, then tap 2 squares east of Home
  await page.click('.dsp .dsp-clear');
  const box = await page.$eval('.dsp .dsp-scene', (c) => { c.scrollIntoView({ block: 'center' }); const r = c.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
  const s = Math.min(box.w, box.h) - 24, cell = s / 10, ox = (box.w - s) / 2, oy = (box.h - s) / 2;
  await page.mouse.click(box.x + ox + 7 * cell, box.y + oy + 5 * cell); await page.waitForTimeout(100);
  check((await facts()).includes('Distance walked200 m') && (await pill()).startsWith('A straight line'), 'distance-displacement: tap 200 m east: distance = displacement');
  await page.mouse.click(box.x + ox + 7 * cell, box.y + oy + 3 * cell); await page.waitForTimeout(100);
  check((await facts()).includes('Distance walked400 m') && (await facts()).includes('Displacement282.84 m45° north of east'), 'distance-displacement: then 200 m north: 282.84 m at 45°');
  await page.click('.dsp .dsp-undo'); await page.waitForTimeout(80);
  check((await facts()).includes('Distance walked200 m'), 'distance-displacement: undo');
  await page.click('.dsp .dsp-level [data-l="11"]'); await page.waitForTimeout(100);
  check((await facts()).includes('Bearing90°') && (await eq()).includes('200 î + 0 ĵ'), 'distance-displacement: Class 11 bearing and vector');
  check((await page.$$('.dsp .sq-q')).length === 5, 'distance-displacement: Class 11 five questions');
  await page.click('.dsp .dsp-mode [data-m="lap"]'); await page.waitForTimeout(100);
  await page.click('.dsp .dsp-jump [data-f="0.5"]'); await page.waitForTimeout(100);
  { const f = await facts(); check(f.includes('Distance run157.08 m') && f.includes('Displacement100 m') && f.includes('Time for one lap62.83 s') && f.includes('Centripetal acceleration0.5 m/s²'), `distance-displacement: half lap of r 50 m (${f})`); }
  await page.click('.dsp .dsp-jump [data-f="0.25"]'); await page.waitForTimeout(100);
  check((await facts()).includes('Displacement70.71 m') && (await facts()).includes('Velocity directionwest'), 'distance-displacement: quarter lap 70.71 m, moving west');
  await page.click('.dsp .dsp-jump [data-f="1"]'); await page.waitForTimeout(100);
  check((await pill()).startsWith('Back at the start after 1 lap'), 'distance-displacement: full lap, displacement zero');
  await page.click('.dsp .dsp-play'); await page.waitForTimeout(700);
  check((await page.textContent('.dsp .dsp-play')) === 'Pause' && (await pill()).startsWith('Same speed'), 'distance-displacement: running');
  await page.click('.dsp .dsp-play');
  await page.click('.dsp .dsp-level [data-l="9"]'); await page.waitForTimeout(100);
  const ans = await page.$eval('.dsp .sq-q', (e) => e.dataset.ans);
  await page.fill('.dsp .sq-q .sq-in', ans); await page.press('.dsp .sq-q .sq-in', 'Enter');
  check((await page.textContent('.dsp .sq-q .sq-res')) === 'Right!', 'distance-displacement: quiz answer with Enter');
};
