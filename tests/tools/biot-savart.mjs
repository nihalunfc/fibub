// #1409 Biot–Savart field builder and Ampère's law
export const path = '/learn/biot-savart/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/biot-savart/`); await page.waitForTimeout(600);
  const R = '.bsv ', txt = (s) => page.textContent(R + s);
  const setR = (s, v) => page.$eval(R + s, (e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  check((await txt('.bsv-big')) === 'B at P = 17.9 µT (pieces so far: 17.9 µT)', `biot: wire example (${await txt('.bsv-big')})`);
  const f = await txt('.bsv-facts');
  check(f.includes('20 µT') && f.includes('89.4%') && f.includes('into the page'), `biot: wire facts (${f})`);
  const inked = (s) => page.$eval(R + s, (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - d[0]) > 60) n++; return n; });
  check((await inked('.bsv-fig')) > 400 && (await inked('.bsv-graph')) > 300, 'biot: picture and bar chart drawn');
  await setR('.bsv-k', 12); check((await txt('.bsv-big')).includes('pieces so far: 8.95 µT') && (await txt('.bsv-kv')) === '12 of 24', `biot: half the pieces (${await txt('.bsv-big')})`);
  await setR('.bsv-k', 0); check((await txt('.bsv-big')).includes('pieces so far: 0 nT'), 'biot: no pieces');
  await page.click(R + '.bsv-build'); await page.waitForTimeout(6500);
  check((await txt('.bsv-kv')) === '24 of 24', 'biot: add one by one finishes');
  await setR('.bsv-l', 100); await setR('.bsv-d', 2);
  check((await txt('.bsv-facts')).includes('99.'), `biot: long wire near the long-wire value (${await txt('.bsv-facts')})`);
  // Loop.
  await page.click(R + '.bsv-mode button[data-v=loop]'); await page.waitForTimeout(100);
  check((await txt('.bsv-big')) === 'B at P = 31.4 µT along the axis' && await page.isHidden(R + '.bsv-l'), `biot: loop centre (${await txt('.bsv-big')})`);
  await setR('.bsv-x', 7); check((await txt('.bsv-big')) === 'B at P = 17.3 µT along the axis', `biot: loop off-centre (${await txt('.bsv-big')})`);
  await setR('.bsv-k', 6); check((await txt('.bsv-facts')).includes('cancels once the loop is complete'), 'biot: partial loop leaves a sideways part');
  await setR('.bsv-k', 24); check((await txt('.bsv-facts')).includes('cancels to zero'), 'biot: full loop cancels');
  await setR('.bsv-n', 10); await setR('.bsv-x', 0); check((await txt('.bsv-big')) === 'B at P = 314 µT along the axis', 'biot: ten turns');
  // Solenoid.
  await page.click(R + '.bsv-mode button[data-v=sol]'); await page.waitForTimeout(100);
  check((await txt('.bsv-big')) === 'B at P = 6.16 mT (98.1% of μ₀nI)' && (await txt('.bsv-facts')).includes('3.13 mT'), `biot: solenoid (${await txt('.bsv-big')} ${await txt('.bsv-facts')})`);
  await setR('.bsv-x', 10); check((await txt('.bsv-big')).startsWith('B at P = 3.13 mT'), 'biot: solenoid end');
  check((await inked('.bsv-graph')) > 300, 'biot: axis graph drawn');
  // Ampère.
  await page.click(R + '.bsv-mode button[data-v=amp]'); await page.waitForTimeout(100);
  check((await txt('.bsv-big')) === '∮B·dl = 6.28 µT m = μ₀ × 5 A' && await page.isHidden(R + '.bsv-graph'), `biot: Ampère round A (${await txt('.bsv-big')})`);
  await setR('.bsv-lr', 7); await setR('.bsv-lx', 0); await setR('.bsv-ly', 0);
  check((await txt('.bsv-big')) === '∮B·dl = 5.03 µT m = μ₀ × 4 A' && (await txt('.bsv-facts')).includes('A (5 A), B (−3 A), C (2 A)'), `biot: Ampère round all (${await txt('.bsv-big')})`);
  await setR('.bsv-b', 0); check((await txt('.bsv-big')).includes('μ₀ × 7 A'), 'biot: wire B current changed');
  // Drag the loop on the picture to an empty corner.
  await setR('.bsv-lr', 1);
  await page.$eval(R + '.bsv-fig', (e) => e.scrollIntoView({ block: 'center' }));
  const box = await page.$eval(R + '.bsv-fig', (e) => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width }; });
  const k = box.w / 360;
  await page.mouse.move(box.x + 180 * k, box.y + 120 * k); await page.mouse.down(); await page.mouse.move(box.x + 300 * k, box.y + 200 * k, { steps: 4 }); await page.mouse.up();
  await page.waitForTimeout(100);
  check((await txt('.bsv-big')).includes('μ₀ × 0 A') && (await txt('.bsv-facts')).includes('none'), `biot: dragged loop encloses nothing (${await txt('.bsv-big')})`);
  check((await page.$$(R + '.eq-q')).length === 4, 'biot: four practice questions');
  const q3 = await page.textContent(R + '.eq-q:nth-child(3) p'), n = Number(q3.match(/has (\d+) turns/)[1]), I = Number(q3.match(/carries ([\d.]+) A/)[1]);
  await page.fill(R + '.eq-q:nth-child(3) .eq-in', String(4 * Math.PI * 1e-7 * n * I * 1000)); await page.click(R + '.eq-q:nth-child(3) .eq-go');
  check((await page.textContent(R + '.eq-q:nth-child(3) .eq-res')).startsWith('Right'), 'biot: right answer accepted');
};
