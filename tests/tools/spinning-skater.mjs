// #1491 Spinning skater
export const path = '/learn/spinning-skater/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/spinning-skater/`); await page.waitForTimeout(300);
  await page.click('.ss .ss-pause'); await page.waitForTimeout(100);
  const facts = () => page.textContent('.ss .ss-facts');
  const setR = async (sel, v) => { await page.$eval(sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(100); };
  { const f = await facts(); check(f.includes('5 kg m²') && f.includes('10 kg m²/s') && f.includes('10 J'), `spinning-skater: arms out I=5, L=10, KE=10 (${f})`); }
  await setR('.ss .ss-r', 0.5);
  { const f = await facts(); check(f.includes('2 kg m²') && f.includes('5 rad/s') && f.includes('10 kg m²/s') && f.includes('25 J'), `spinning-skater: r=0.5 gives I=2, ω=5, L still 10, KE=25 (${f})`); }
  await setR('.ss .ss-m', 0);
  { const f = await facts(); check(f.includes('Spin now ω2 rad/s'), 'spinning-skater: no weights, no change'); }
  await page.click('.ss .ss-pause'); await setR('.ss .ss-m', 2); await setR('.ss .ss-r', 1);
  await page.click('.ss .ss-in'); await page.waitForTimeout(2200);
  check((await page.$eval('.ss .ss-r', (e) => e.value)) === '0.2', 'spinning-skater: Pull arms in moves r to 0.2');
  { const a = await page.getAttribute('.ss .lq-item', 'data-ans'); await page.fill('.ss .lq-in', a); await page.click('.ss .lq-check');
    check((await page.textContent('.ss .lq-fb')) === 'Right.', 'spinning-skater: quiz accepts the right answer'); }
};
