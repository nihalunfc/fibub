// #1042 Series and parallel circuit builder
export const path = '/learn/series-parallel/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/series-parallel/`); await page.waitForTimeout(600);
  const R = '.spc ', txt = (s) => page.textContent(R + s);
  check((await txt('.spc-big')) === 'R = 16 Ω,  I = 375 mA', `sp: example total and current (${await txt('.spc-big')})`);
  const steps = await txt('.spc-steps');
  check(steps.includes('R_s = R1 = 10 = 10 Ω') && steps.includes('1/R_p = 1/10 + 1/15 = 0.1667 per Ω, so R_p = 6 Ω') && steps.includes('I2 = 2.25 / 10 = 225 mA, I3 = 2.25 / 15 = 150 mA') && steps.includes('add up to 375 mA'), `sp: worked steps (${steps.slice(0, 200)})`);
  check((await txt('.spc-parts')).includes('R1 (10 Ω)Series3.75 V375 mA1.41 W') && (await page.$$(R + '.spc-parts tr')).length === 4, 'sp: per-resistor table');
  check((await txt('.spc-bill')) === 'Energy: 2.25 W × 150 h = 0.338 kWh (units). Cost: ₹2.36.', `sp: bill (${await txt('.spc-bill')})`);
  const inked = () => page.$eval(R + '.spc-fig', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 128) n++; return n; });
  check((await inked()) > 500, 'sp: circuit picture drawn');
  // Drag R4 from the tray into the parallel box, then R1 from the top wire to the tray.
  await page.locator(R + '.spc-fig').scrollIntoViewIfNeeded();
  const bb = await page.locator(R + '.spc-fig').boundingBox(), P = (x, y) => [bb.x + (x / 360) * bb.width, bb.y + (y / 360) * bb.height];
  const dragTo = async (a, b) => { const [ax, ay] = P(...a), [bx, by] = P(...b); await page.mouse.move(ax, ay); await page.mouse.down(); await page.mouse.move((ax + bx) / 2, (ay + by) / 2, { steps: 4 }); await page.mouse.move(bx, by, { steps: 4 }); await page.mouse.up(); await page.waitForTimeout(200); };
  await dragTo([60, 318], [180, 255]);
  check((await page.inputValue(R + '.spc-p[data-i="3"]')) === 'parallel' && (await txt('.spc-big')).startsWith('R = 14.6 Ω'), `sp: dragged R4 into the parallel box (${await txt('.spc-big')})`);
  await dragTo([200, 40], [200, 320]);
  check((await page.inputValue(R + '.spc-p[data-i="0"]')) === 'out' && (await txt('.spc-big')).startsWith('R = 4.62 Ω') && (await txt('.spc-steps')).includes('no resistors on the top wire'), `sp: dragged R1 to the tray (${await txt('.spc-big')})`);
  // Table controls: all in series.
  for (const i of [0, 1, 2, 3]) await page.selectOption(R + `.spc-p[data-i="${i}"]`, 'series');
  check((await txt('.spc-big')).startsWith('R = 55 Ω') && (await txt('.spc-steps')).includes('Parallel box: empty'), 'sp: all four in series is 55 Ω');
  await page.fill(R + '.spc-R[data-i="3"]', '45'); await page.waitForTimeout(100);
  check((await txt('.spc-big')).startsWith('R = 80 Ω'), 'sp: typed resistance');
  await page.fill(R + '.spc-R[data-i="3"]', 'abc'); await page.waitForTimeout(100);
  check((await txt('.spc-err')).includes('R4') && await page.isHidden(R + '.spc-out'), 'sp: bad resistance message');
  await page.fill(R + '.spc-R[data-i="3"]', '20'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.spc-out') && await page.isHidden(R + '.spc-err'), 'sp: error clears');
  for (const i of [0, 1, 2, 3]) await page.selectOption(R + `.spc-p[data-i="${i}"]`, 'out');
  check((await txt('.spc-big')) === 'Short circuit!' && (await txt('.spc-bill')).startsWith('No bill'), 'sp: empty circuit is a short circuit');
  // Mains: two 50 Ω heaters in parallel at 230 V.
  await page.click(R + '.spc-reset'); await page.waitForTimeout(100);
  check((await txt('.spc-big')) === 'R = 16 Ω,  I = 375 mA', 'sp: start again');
  for (const [i, p, v] of [[0, 'out', 10], [1, 'parallel', 50], [2, 'parallel', 50], [3, 'out', 20]]) { await page.selectOption(R + `.spc-p[data-i="${i}"]`, p); await page.fill(R + `.spc-R[data-i="${i}"]`, String(v)); }
  await page.selectOption(R + '.spc-v', '230'); await page.fill(R + '.spc-h', '2'); await page.fill(R + '.spc-rate', '8'); await page.waitForTimeout(100);
  check((await txt('.spc-big')) === 'R = 25 Ω,  I = 9.20 A' && (await txt('.spc-facts')).includes('2.12 kW') && (await txt('.spc-bill')) === 'Energy: 2.12 kW × 60 h = 127 kWh (units). Cost: ₹1,016.', `sp: mains heaters and bill (${await txt('.spc-bill')})`);
  await page.fill(R + '.spc-h', '25'); await page.waitForTimeout(100);
  check((await txt('.spc-berr')).includes('between 0 and 24'), 'sp: bad hours message');
  await page.fill(R + '.spc-h', '5');
  // Class 12: internal resistance.
  await page.click(R + '.spc-reset'); await page.selectOption(R + '.spc-v', '6');
  check(await page.isHidden(R + '.spc-ronly'), 'sp: internal resistance hidden at Class 10');
  await page.click(R + '.spc-level [data-v="12"]'); await page.waitForTimeout(100);
  check((await txt('.spc-big')) === 'R = 16 Ω,  I = 364 mA' && (await txt('.spc-facts')).includes('Terminal voltage5.82 V') && (await txt('.spc-steps')).includes("Kirchhoff's loop rule"), `sp: internal resistance 0.5 Ω (${await txt('.spc-big')})`);
  await page.$eval(R + '.spc-r', (e) => { e.value = '2'; e.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(100);
  check((await txt('.spc-rv')) === '2.0 Ω' && (await txt('.spc-big')) === 'R = 16 Ω,  I = 333 mA', 'sp: internal resistance slider');
  await page.click(R + '.spc-level [data-v="10"]');
  // Check yourself.
  check((await page.$$(R + '.eq-q')).length === 4, 'sp: four practice questions');
  const q1 = await page.textContent(R + '.eq-q:nth-child(1) p'), [a, b, c] = q1.match(/of ([\d.]+) Ω, ([\d.]+) Ω and ([\d.]+) Ω/).slice(1).map(Number);
  await page.fill(R + '.eq-q:nth-child(1) .eq-in', String(a + b + c)); await page.click(R + '.eq-q:nth-child(1) .eq-go');
  check((await page.textContent(R + '.eq-q:nth-child(1) .eq-res')).startsWith('Right'), 'sp: right answer accepted');
  await page.fill(R + '.eq-q:nth-child(2) .eq-in', '0.001'); await page.click(R + '.eq-q:nth-child(2) .eq-go');
  check((await page.textContent(R + '.eq-q:nth-child(2) .eq-res')).startsWith('Not quite'), 'sp: wrong answer flagged');
};
