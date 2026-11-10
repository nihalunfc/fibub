// #1469 related rates (maths checked against sympy in tests/sci-tools/related-rates.mjs)
export const path = '/learn/related-rates/';
export default async ({ page, check, BASE }) => {
  const R = '.rrt ';
  const t = (s) => page.textContent(R + s);
  const set = (sel, v) => page.$eval(R + sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v));
  await page.goto(`${BASE}/learn/related-rates/`); await page.waitForTimeout(500);
  { const s = await t('.rr-steps'); check(s.includes('dy/dt = −(3 / 4) × 0.5 = −0.375 m/s'), `rates: ladder 3-4-5 (${s})`); }
  { const f = await t('.rr-facts'); check(f.includes('Top y4 m') && f.includes('dy/dt−0.375 m/s'), `rates: ladder facts (${f})`); }
  await page.waitForTimeout(200);
  const px = await page.evaluate(() => { const c = document.querySelector('.rr-fig'); const g = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < g.length; i += 4) if (g[i] > 150 && g[i + 1] > 70 && g[i + 1] < 140 && g[i + 2] < 60) n++; return n; });
  check(px > 200, `rates: ladder drawn in orange (${px} px)`);
  await set('.rr-t', 250);
  { const f = await t('.rr-facts'); check(/Foot x3\.49\d m/.test(f), `rates: time moves the ladder (${f})`); }
  await page.click(R + '.rr-play'); await page.waitForTimeout(600);
  check((await page.textContent(R + '.rr-play')) === 'Pause' && +(await page.inputValue(R + '.rr-t')) > 250, 'rates: Play runs time');
  await page.click(R + '.rr-play');
  check((await page.textContent(R + '.rr-play')) === 'Play', 'rates: Pause stops');
  // Change the ladder.
  await set('.rr-L', 10); await set('.rr-x0', 6); await set('.rr-v', 2); await set('.rr-t', 0);
  check((await t('.rr-steps')).includes('dy/dt = −(6 / 8) × 2 = −1.5 m/s'), `rates: 6-8-10 ladder (${await t('.rr-steps')})`);
  // Balloon.
  await page.click(R + '.rr-st button[data-s="balloon"]');
  check(await page.isVisible(R + '.rr-p-balloon') && await page.isHidden(R + '.rr-p-ladder'), 'rates: balloon sliders');
  { const s = await t('.rr-steps'); check(s.includes('r = ∛(3V / 4π) = 4.924 cm') && s.includes('= 0.3282 cm/s'), `rates: balloon matches sympy (${s})`); }
  // Cone.
  await page.click(R + '.rr-st button[data-s="cone"]');
  await set('.rr-t', Math.round(1000 * 4 / (Math.PI * 4 * 4 / 3 / 0.5)));
  { const f = await t('.rr-facts'); check(f.includes('Depth h1.96') && f.includes('dh/dt0.16'), `rates: cone at t ≈ 4 min close to sympy h = 1.969, dh/dt = 0.164 (${f})`); }
  check((await t('.rr-rnote')).includes('rises fast'), 'rates: cone note');
  // Quiz.
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'rates: five quiz questions');
  const ans = await page.$eval(R + '.smq-q:nth-child(3) .smq-work p', (e) => e.textContent.match(/= (\d+) cm²\/s\.$/)[1]);
  await page.fill(R + '.smq-q:nth-child(3) .smq-in', ans); await page.click(R + '.smq-q:nth-child(3) .smq-check');
  check((await t('.smq-q:nth-child(3) .smq-out')) === 'Right!', `rates: quiz answer accepted (${ans})`);
  await page.click(R + '.smq-q:nth-child(5) .smq-choices button:nth-child(3)'); await page.click(R + '.smq-q:nth-child(5) .smq-check');
  check((await t('.smq-q:nth-child(5) .smq-out')) === 'Right!', 'rates: choice question');
};
