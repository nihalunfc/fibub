// #1351 pendulum-lab
export const path = '/learn/pendulum-lab/';
export default async ({ page, check, BASE }) => {
  const R = '.pdl ';
  const t = (s) => page.textContent(R + s);
  const slide = async (sel, v) => { await page.$eval(R + sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(150); };
  await page.goto(BASE + path); await page.waitForTimeout(600);
  { const e = await t('.pd-eq');
    check(e.includes('T = 2π√(L/g) = 2π√(1.00 / 9.8) = 2.007 s.  Time for 10 swings ≈ 20.07 s.') && !e.includes('Exact'), 'pendulum: 1 m on Earth T = 2.007 s (Python)'); }
  check((await t('.pd-facts')).includes('Swings per minute29.9'), 'pendulum: 29.9 swings a minute');
  { const f = await t('.pd-feq');
    check(f.includes('T² = 4.044 × L − 0.00509') && f.includes('(r² = 0.99992)') && f.includes('g = 4π² / 4.044 = 9.763 m/s² ± 0.049 m/s²') && f.includes('−0.38 % from 9.8'), 'pendulum: example fit g = 9.763 ± 0.049 (numpy polyfit)'); }
  for (const id of ['.pd-cv', '.pd-fit']) {
    const inked = await page.$eval(R + id, (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 150 || Math.abs(d[i] - d[i + 2]) > 60) n++; return n; });
    check(inked > 300, `pendulum: ${id} drawn (${inked})`);
  }
  await page.waitForTimeout(4500);
  check(/Swings so far: [1-9]/.test(await t('.pd-live')), `pendulum: swings are counted (${await t('.pd-live')})`);
  check((await page.$eval(R + '.pd-A', (e) => e.max)) === '45' && await page.isHidden(R + '.pd-err'), 'pendulum: Class 7–9 caps the swing at 45°, no error graph');
  await page.selectOption(R + '.pd-g', '1.62'); await page.waitForTimeout(150);
  check((await t('.pd-eq')).includes('2π√(1.00 / 1.62) = 4.937 s'), 'pendulum: on the Moon 4.937 s');
  await page.selectOption(R + '.pd-g', '9.8');
  await slide('.pd-L', 0.25);
  check((await t('.pd-eq')).includes('= 1.004 s') && (await page.inputValue(R + '.pd-Lu')) === '0.25', 'pendulum: a quarter of the length halves the period; length used follows');
  await slide('.pd-L', 1);
  await page.click(R + '[data-level="11"]'); await page.waitForTimeout(150);
  await slide('.pd-A', 60);
  check((await t('.pd-eq')).includes('Exact period for a 60° swing: T = 2.154 s, 7.32 % longer than the formula.'), 'pendulum: 60° swing is 7.32 % longer (RK4 and series in Python)');
  check(await page.isVisible(R + '.pd-err') && (await page.$eval(R + '.pd-A', (e) => e.max)) === '170', 'pendulum: Class 11 error graph and swings to 170°');
  await slide('.pd-A', 90);
  check((await t('.pd-facts')).includes('18 %'), 'pendulum: 90° swing 18.0 % longer');
  await page.click(R + '.pd-rel'); await page.click(R + '.pd-play');
  check((await t('.pd-play')) === 'Play', 'pendulum: pause');
  // Stopwatch and adding a reading
  await page.click(R + '.pd-ss'); await page.waitForTimeout(700); await page.click(R + '.pd-ss');
  const shown = parseFloat(await t('.pd-watch'));
  check(shown > 0.4 && shown < 5 && (await t('.pd-ss')) === 'Start', `pendulum: stopwatch runs and stops (${shown} s)`);
  await page.click(R + '.pd-add'); await page.waitForTimeout(150);
  check((await page.inputValue(R + '.pd-data')).trim().split('\n').length === 6 && (await page.inputValue(R + '.pd-data')).includes(`1, ${shown.toFixed(2)}`), 'pendulum: reading added');
  await page.click(R + '.pd-sr');
  check((await t('.pd-watch')) === '0.00 s', 'pendulum: stopwatch reset');
  await page.fill(R + '.pd-data', '0.5, 14.2\nabc'); await page.waitForTimeout(100);
  check((await t('.pd-ferr')).includes('Line 2'), 'pendulum: bad line named');
  await page.fill(R + '.pd-data', '0.5, 14.2\n1, 20'); await page.waitForTimeout(100);
  check((await t('.pd-ferr')).includes('at least 3'), 'pendulum: needs 3 readings');
  await page.fill(R + '.pd-data', '0.5, 28.4\n1.0, 40.2\n1.5, 49.1'); await page.fill(R + '.pd-N', '20'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.pd-ferr') && (await t('.pd-feq')).includes('time ÷ 20'), 'pendulum: 20 swings per reading');
  await page.fill(R + '.pd-N', '0'); await page.waitForTimeout(100);
  check((await t('.pd-ferr')).includes('whole number'), 'pendulum: bad swing count');
  const items = await page.$$(R + '.lq-item');
  check(items.length === 5, 'pendulum: five questions');
  const ans = await items[1].getAttribute('data-ans');
  await (await items[1].$('.lq-in')).fill(String(+(+ans).toPrecision(3))); await (await items[1].$('.lq-check')).click();
  check((await (await items[1].$('.lq-fb')).textContent()) === 'Right.', 'pendulum: length answer accepted');
  const ch = await items[3].$$('.lq-choice');
  await ch[1].click();
  check((await (await items[3].$('.lq-fb')).textContent()) === 'Right.', 'pendulum: √k times longer');
};
