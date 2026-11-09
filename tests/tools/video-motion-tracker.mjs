// #906 video motion tracker
export const path = '/science/video-motion-tracker/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/video-motion-tracker/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.vmt .vm-big'), facts = () => page.textContent('.vmt .vm-facts'), err = () => page.textContent('.vmt .vm-err');
  check(await page.isHidden('.vmt .vm-out') && await page.isHidden('.vmt .vm-stage') && await page.isHidden('.vmt .vm-err'), 'video: starts empty, no error');
  await page.click('.vmt .vm-ex'); await page.waitForTimeout(200);
  check((await big()) === 'Vertical acceleration −9.829 ± 0.050 m/s²', 'video: made-up example, g from the parabola fit');
  { const f = await facts(); check(f.includes('1.4989 ± 0.0062 m/s') && f.includes('−0.02 ± 0.20') && f.includes('5 mm per pixel') && f.includes('0.401 m across'), 'video: example horizontal speed, scale, distance'); }
  check((await page.$$('.vmt .vm-tab tr')).length === 9 && await page.isVisible('.vmt .vm-fig3'), 'video: table and three charts');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.vmt .vm-csv')]); const f = OUT + 'motion.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 9 && rows[0].startsWith('t_s,x_m,y_m,vx_m_s'), 'video: CSV in metres'); }
  for (const [f, n] of [['png', 'Image'], ['pdf', 'PDF'], ['docx', 'Word']]) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.vmt .dl [data-f=${f}]`)]); check(d.suggestedFilename().endsWith('.' + f), `video: ${n} download`); }
  await page.fill('.vmt .vm-s1', ''); await page.fill('.vmt .vm-s2', ''); await page.waitForTimeout(150);
  check((await facts()).includes('no scale set') && (await big()).includes('px/s²'), 'video: without a scale, pixels');
  await page.fill('.vmt .vm-s1', '20'); await page.waitForTimeout(150);
  check((await err()).includes('two numbers'), 'video: bad scale point message');
  await page.fill('.vmt .vm-s1', '20, 227'); await page.fill('.vmt .vm-s2', '220, 227'); await page.fill('.vmt .vm-sd', '0'); await page.waitForTimeout(150);
  check((await err()).includes('real distance'), 'video: missing distance message');
  await page.fill('.vmt .vm-sd', '1'); await page.fill('.vmt .vm-pts', '0, 1, 1\n0, 2, 2\n0.1, 3, 3'); await page.waitForTimeout(150);
  check((await err()).includes('same time'), 'video: duplicate time message');
  await page.fill('.vmt .vm-pts', '0, 1, 1\n0.1, 2, 2'); await page.waitForTimeout(150);
  check((await err()).includes('at least 3 points'), 'video: too few points message');
  await page.fill('.vmt .vm-pts', 'a, b'); await page.waitForTimeout(150);
  check((await err()).includes('three numbers'), 'video: bad points message');
  // A real video: a generated clip of a ball moving 240 px/s sideways and falling at 1962 px/s² (200 px = 1 m, so 1.2 m/s and 9.81 m/s²).
  await page.fill('.vmt .vm-pts', ''); await page.fill('.vmt .vm-s1', ''); await page.fill('.vmt .vm-s2', '');
  await page.setInputFiles('.vmt .vm-file', new URL('../fixtures/ball-throw.webm', import.meta.url).pathname); await page.waitForTimeout(1200);
  check(await page.isVisible('.vmt .vm-stage') && (await page.textContent('.vmt .vm-pos')) === 'Frame 1 of 13, t = 0.000 s', 'video: opens a local video (13 frames at 30 fps)');
  const over = page.locator('.vmt .vm-over'); await over.scrollIntoViewIfNeeded();
  const at = async (x, y) => { await over.evaluate((e) => e.scrollIntoView({ block: "center", behavior: "instant" })); const b = await over.boundingBox(); await page.mouse.click(b.x + (x / 320) * b.width, b.y + (y / 240) * b.height); await page.waitForTimeout(250); };
  await page.click('.vmt .vm-mode [data-m="scale"]'); await at(20, 227); await at(220, 227);
  check((await page.inputValue('.vmt .vm-s1')).startsWith('20') && (await page.inputValue('.vmt .vm-s2')).startsWith('22'), 'video: scale set by two clicks');
  await page.click('.vmt .vm-mode [data-m="origin"]'); await at(40, 40);
  for (let k = 0; k < 13; k++) { const t = k / 30; await at(40 + 240 * t, 40 + 981 * t * t); }
  { const n = (await page.inputValue('.vmt .vm-pts')).trim().split('\n').length, b = await big(), g = Number(b.match(/−([\d.]+) ±/)[1]), f = await facts(), v = Number(f.match(/Horizontal speed \(straight-line fit\)([\d.]+) ±/)[1]);
    check(n === 13 && Math.abs(g - 9.81) < 0.25 && Math.abs(v - 1.2) < 0.02, `video: clicking the ball in 13 frames gives g ≈ 9.81 and 1.2 m/s (${b}, ${v})`); }
  check((await page.textContent('.vmt .vm-pos')).startsWith('Frame 13'), 'video: stops at the last frame');
  await page.click('.vmt .vm-undo'); await page.waitForTimeout(200);
  check((await page.inputValue('.vmt .vm-pts')).trim().split('\n').length === 12, 'video: undo removes the last point');
  await page.click('.vmt .vm-prev'); await page.waitForTimeout(200);
  check((await page.textContent('.vmt .vm-pos')).startsWith('Frame 12'), 'video: previous frame');
  await page.click('.vmt .vm-clear'); await page.waitForTimeout(200);
  check((await page.inputValue('.vmt .vm-pts')) === '' && await page.isHidden('.vmt .vm-out'), 'video: clear points');
};
