// #T1041 LFO rates
export const path = '/everyday/lfo-rate-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/lfo-rate-calculator/`); await page.waitForTimeout(300);
  const rowOf = (label) => page.evaluate((l) => { const r = [...document.querySelectorAll('.lf .lf-body tr')].find((x) => x.firstElementChild.textContent === l); return r ? r.textContent : ''; }, label);
  check((await rowOf('1/4')).includes('2 Hz') && (await rowOf('1/4')).includes('500 ms'), 'lfo: 120 BPM 1/4 = 2 Hz, 500 ms');
  check((await rowOf('1/8')).includes('4 Hz') && (await rowOf('1/1 (1 bar)')).includes('0.5 Hz'), 'lfo: 1/8 = 4 Hz, 1 bar = 0.5 Hz');
  check((await rowOf('4 bars')).includes('0.125 Hz') && (await rowOf('4 bars')).includes('8,000 ms'), 'lfo: 4 bars = 0.125 Hz');
  check((await page.textContent('.lf .lf-near')).includes('closest to 1/4') && (await page.textContent('.lf .lf-near')).includes('5% faster'), `lfo: 2.1 Hz nearest note (${await page.textContent('.lf .lf-near')})`);
  check((await page.textContent('.lf .lf-side')).includes('250 ms'), 'lfo: sidechain release 250 ms at 120 BPM');
  await page.fill('.lf .lf-bpm', '90'); await page.waitForTimeout(100);
  check((await rowOf('1/4')).includes('1.5 Hz'), 'lfo: 90 BPM quarter = 1.5 Hz');
  await page.selectOption('.lf .lf-shape', 'square');
  check((await page.textContent('.lf .lf-cap')).startsWith('Square at'), 'lfo: shape caption');
};
