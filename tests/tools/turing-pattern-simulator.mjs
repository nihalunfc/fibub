// #352 Turing pattern simulator
export const path = '/science/turing-pattern-simulator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const P = '.tp ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(600);
  const pos = () => page.textContent(P + '.tp-pos'), status = () => page.textContent(P + '.tp-status');
  check((await page.textContent(P + '.tp-lam')) === 'λ = √(D/k) = 100 µm' && (await pos()).startsWith('Blue ends at 69.33 µm; white ends at 161.1 µm.'), `turing: example gradient (${await pos()})`);
  await page.click(P + '.tp-seal'); await page.waitForTimeout(100);
  check((await pos()).startsWith('Blue ends at 69.31 µm; white ends at 160.9 µm.'), 'turing: open-ended tissue');
  await page.fill(P + '.tp-k', '0.00005'); await page.waitForTimeout(100);
  check((await page.textContent(P + '.tp-lam')) === 'λ = √(D/k) = 141.4 µm', 'turing: halving k lengthens λ by √2');
  await page.fill(P + '.tp-t2', '0.1'); await page.fill(P + '.tp-l', '300'); await page.click(P + '.tp-seal'); await page.waitForTimeout(100);
  check((await pos()).includes('white ends at never'), 'turing: threshold never reached on a short sealed tissue');
  await page.fill(P + '.tp-t2', '60'); await page.waitForTimeout(100);
  check((await page.textContent(P + '.tp-gerr')).includes('Threshold 1 must be above threshold 2'), 'turing: bad thresholds message');
  await page.fill(P + '.tp-t2', '20'); await page.fill(P + '.tp-d', '0'); await page.waitForTimeout(100);
  check((await page.textContent(P + '.tp-gerr')).includes('must all be above 0'), 'turing: bad gradient input message');
  await page.fill(P + '.tp-d', '1');
  // Gray-Scott spots at 64 cells.
  await page.selectOption(P + '.tp-n', '64'); await page.waitForTimeout(100);
  check((await status()).startsWith('Step 0') && (await page.textContent(P + '.tp-lin')).includes('grow out of the seeded squares') && await page.isVisible(P + '.tp-F'), 'turing: Gray-Scott preset loaded');
  for (let i = 0; i < 3; i++) { await page.locator(P + '.tp-adv').scrollIntoViewIfNeeded(); await page.click(P + '.tp-adv'); }
  await page.waitForTimeout(200);
  check((await status()).startsWith('Step 6,000 (time 6000)'), `turing: jumped 6000 steps (${await status()})`);
  const img = () => page.evaluate(() => document.querySelector('.tp .tp-fig').toDataURL());
  const a = await img();
  await page.click(P + '.tp-reset'); for (let i = 0; i < 3; i++) await page.click(P + '.tp-adv'); await page.waitForTimeout(200);
  check((await img()) === a, 'turing: same seed gives the same pattern');
  await page.fill(P + '.tp-seed', '2'); await page.dispatchEvent(P + '.tp-seed', 'change'); for (let i = 0; i < 3; i++) await page.click(P + '.tp-adv'); await page.waitForTimeout(200);
  check((await img()) !== a, 'turing: another seed gives another pattern');
  await page.selectOption(P + '.tp-cm', 'colour'); await page.waitForTimeout(100);
  { const px = await page.evaluate(() => { const c = document.querySelector('.tp .tp-fig'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let col = 0; for (let i = 0; i < d.length; i += 4) if (d[i] !== d[i + 1] || d[i + 1] !== d[i + 2]) col++; return col; }); check(px > 1000, 'turing: colour map'); }
  // Run and pause.
  await page.click(P + '.tp-run'); await page.waitForTimeout(500); await page.click(P + '.tp-run');
  { const s = Number((await status()).match(/Step ([\d,]+)/)[1].replace(/,/g, '')); check(s > 6000 && (await page.textContent(P + '.tp-run')) === 'Run', `turing: run and pause (${s})`); }
  // Gierer-Meinhardt spots: Turing check and a pattern.
  await page.selectOption(P + '.tp-preset', 'gm-spots'); await page.waitForTimeout(200);
  { const t = await page.textContent(P + '.tp-lin'); check(t.includes('uniform state (2, 2) is stable without diffusion') && t.includes('fastest is about 18.4 cells') && await page.isVisible(P + '.tp-Dh') && await page.isHidden(P + '.tp-F'), `turing: GM Turing check (${t})`); }
  for (let i = 0; i < 10; i++) await page.click(P + '.tp-adv');
  await page.waitForTimeout(200);
  { const m = (await status()).match(/a: ([\d.]+) \(light\) to ([\d.]+)/) || (await status()).match(/a: ([\d.]+) \(dark\) to ([\d.]+)/); check(m && parseFloat(m[2]) > 5 && parseFloat(m[1]) < 0.5, `turing: GM spots formed (${await status()})`); }
  await page.selectOption(P + '.tp-preset', 'gm-stripes'); await page.waitForTimeout(100);
  check((await page.inputValue(P + '.tp-kap')) === '0.05', 'turing: GM stripes preset');
  await page.fill(P + '.tp-Dh', '0.02'); await page.waitForTimeout(100);
  check((await page.textContent(P + '.tp-lin')).includes('no wavelength grows'), 'turing: equal diffusion, no pattern expected');
  await page.fill(P + '.tp-Dh', '1'); await page.fill(P + '.tp-dt', '0.3'); await page.waitForTimeout(100);
  check((await page.textContent(P + '.tp-err')).includes('time step must be below 0.25'), 'turing: unstable time step refused');
  await page.fill(P + '.tp-dt', '0.2'); await page.selectOption(P + '.tp-preset', 'gs-stripes'); await page.fill(P + '.tp-kk', '-1'); await page.waitForTimeout(100);
  check((await page.textContent(P + '.tp-err')).includes('0 or more'), 'turing: negative rate refused');
  await page.selectOption(P + '.tp-preset', 'gs-stripes'); await page.click(P + '.tp-adv'); await page.waitForTimeout(100);
  { await page.locator(P + '.dl [data-f=png]').scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.dl [data-f=png]')]); const f = OUT + 'tp.png'; await d.saveAs(f); const b = readFileSync(f); check(b.length > 20000 && b[1] === 0x50 && d.suggestedFilename() === 'turing-pattern.png', 'turing: PNG download'); }
};
