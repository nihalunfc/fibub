// #T1063 Device Info. Everything is read locally; the clipboard is stubbed to capture the report.
export const path = '/everyday/device-info/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/device-info/`); await page.waitForTimeout(300);
  const R = '.di ', t = (s) => page.textContent(R + s);
  const facts = await t('.di-facts');
  check(facts.includes('Operating system') && facts.includes('Browser') && facts.includes('Processor threads'), 'device-info: lists system, browser and processor threads');
  const threads = await page.evaluate(() => String(navigator.hardwareConcurrency));
  check(facts.includes(threads), `device-info: threads match the browser (${threads})`);
  check(facts.includes('Secure (https) page') && facts.includes('Time zone'), 'device-info: shows secure page and time zone');
  const hrefs = await page.$$eval('.di .di-sup a', (as) => as.map((a) => a.getAttribute('href')));
  check(hrefs.length === 12 && hrefs.includes('/everyday/mic-test/') && hrefs.includes('/everyday/midi-test/'), `device-info: links to all 12 testers (${hrefs.length})`);
  await page.evaluate(() => { window.__copied = ''; Object.defineProperty(navigator, 'clipboard', { value: { writeText: async (s) => { window.__copied = s; } }, configurable: true }); });
  await page.click(R + '.di-copy'); await page.waitForTimeout(150);
  const copied = await page.evaluate(() => window.__copied);
  check(copied.startsWith('fibub device report') && copied.includes('Browser:') && (await t('.di-copied')).includes('copied'), 'device-info: Copy report puts a plain-text summary on the clipboard');
};
