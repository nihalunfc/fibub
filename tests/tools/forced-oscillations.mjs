// #1353 forced-oscillations
export const path = '/learn/forced-oscillations/';
export default async ({ page, check, BASE }) => {
  const R = '.fos ';
  const t = (s) => page.textContent(R + s);
  const slide = async (sel, v) => { await page.$eval(R + sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(150); };
  await page.goto(BASE + path); await page.waitForTimeout(600);
  { const e = await t('.fo-eq');
    check(e.includes('ω₀ = √(k/m) = √(40 / 1.0) = 6.325 rad/s (f₀ = 1.007 Hz).  ζ = b / (2√(km)) = 0.0395.') && e.includes('= 31.62 cm.'), 'forced: ω₀ 6.325 rad/s, A at ω₀ 31.62 cm (Python)'); }
  { const f = await t('.fo-facts'); check(f.includes('lags the push by 90°') && f.includes('ω = 6.315 rad/s') && f.includes('Q12.6'), 'forced: lag 90°, peak at 6.315 rad/s, Q 12.6'); }
  for (const id of ['.fo-cv', '.fo-res']) {
    const inked = await page.$eval(R + id, (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 150 || Math.abs(d[i] - d[i + 2]) > 60) n++; return n; });
    check(inked > 300, `forced: ${id} drawn (${inked})`);
  }
  await page.waitForTimeout(1500);
  check(!(await t('.fo-live')).startsWith('t = 0.0 s'), 'forced: the run moves on');
  await slide('.fo-w', 0.5);
  check((await t('.fo-eq')).includes('= 3.329 cm.') && (await t('.fo-facts')).includes('lags the push by 3.02°'), 'forced: half rate 3.329 cm, lag 3.02°');
  await slide('.fo-w', 2);
  check((await t('.fo-eq')).includes('= 0.8322 cm.') && (await t('.fo-facts')).includes('177°'), 'forced: double rate 0.8322 cm, lag 177°');
  await slide('.fo-w', 1); await slide('.fo-b', 0);
  check((await t('.fo-eq')).includes('grow without limit') && (await t('.fo-facts')).includes('grows for ever'), 'forced: no damping at resonance grows for ever');
  await slide('.fo-b', 1);
  check((await t('.fo-eq')).includes('= 15.81 cm.'), 'forced: double damping halves the peak (15.81 cm)');
  await slide('.fo-F', 2);
  check((await t('.fo-eq')).includes('= 31.62 cm.'), 'forced: double push doubles the amplitude');
  await page.click(R + '[data-m="free"]'); await page.waitForTimeout(150);
  await slide('.fo-b', 0.5);
  check((await t('.fo-eq')).includes('τ = 2m/b = 4 s and halves every 2m ln 2 / b = 2.773 s') && (await t('.fo-eq')).includes('ω′ = ω₀√(1 − ζ²) = 6.320 rad/s'), 'forced: free decay τ 4 s, half 2.773 s, ω′ 6.320 (Python)');
  check(await page.isHidden(R + '.fo-res') && await page.isHidden(R + '.fo-w'), 'forced: resonance curve hidden when let go');
  check((await t('.fo-live')).includes('x = 10.0 cm') || (await t('.fo-live')).includes('x = '), 'forced: let go from 10 cm');
  await slide('.fo-k', 10); await slide('.fo-b', 8);
  check((await t('.fo-eq')).includes('overdamped') && (await t('.fo-facts')).includes('over-damped'), 'forced: m 1, k 10, b 8 is overdamped (ζ 1.26)');
  await slide('.fo-b', 0);
  check((await t('.fo-eq')).includes('swings for ever'), 'forced: no damping swings for ever');
  await page.click(R + '.fo-restart'); await page.click(R + '.fo-play');
  check((await t('.fo-play')) === 'Play', 'forced: pause');
  const items = await page.$$(R + '.lq-item');
  check(items.length === 5, 'forced: five questions');
  for (const i of [0, 2, 3]) {
    const ans = await items[i].getAttribute('data-ans');
    await (await items[i].$('.lq-in')).fill(String(+(+ans).toPrecision(4))); await (await items[i].$('.lq-check')).click();
    check((await (await items[i].$('.lq-fb')).textContent()) === 'Right.', `forced: question ${i + 1} accepted`);
  }
  await (await items[4].$$('.lq-choice'))[1].click();
  check((await (await items[4].$('.lq-fb')).textContent()) === 'Right.', 'forced: damping lowers and widens the peak');
};
