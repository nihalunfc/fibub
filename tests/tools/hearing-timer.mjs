// #T1032 Hearing timer
export const path = '/everyday/hearing-timer/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/hearing-timer/`); await page.waitForTimeout(300);
  const out = async () => (await page.textContent('.ht .ht-out')).trim();
  check((await out()).startsWith('1 h 00 min allowed at 94'), 'hearing-timer: NIOSH 94 dB(A) = 1 h (' + (await out()) + ')');
  await page.selectOption('.ht [data-k="rule"]', 'osha'); await page.fill('.ht [data-k="level"]', '95'); await page.waitForTimeout(100);
  check((await out()).startsWith('4 h 00 min allowed at 95'), 'hearing-timer: OSHA 95 dB(A) = 4 h (' + (await out()) + ')');
  await page.selectOption('.ht [data-k="rule"]', 'niosh'); await page.fill('.ht [data-k="level"]', '94'); await page.waitForTimeout(100);
  check((await page.textContent('.ht .ht-dose')).includes('200%'), 'hearing-timer: 2 h set at 94 NIOSH = 200%');
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await page.check('.ht [data-k="plugs"]'); await page.fill('.ht [data-k="nrr"]', '27'); await page.waitForTimeout(100);
  check((await out()).startsWith('10 h 04 min allowed at 84'), 'hearing-timer: NRR 27 = 10 dB off, 84 dB(A) = 10.08 h (' + (await out()) + ')');
  await page.click('.ht .ht-start'); await page.waitForTimeout(1600);
  check((await page.textContent('.ht .ht-clock')).startsWith('0:00:01'), 'hearing-timer: countdown runs');
};
