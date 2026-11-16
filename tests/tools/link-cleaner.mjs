// Link cleaner
export const path = '/everyday/link-cleaner/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/link-cleaner/`);
  await page.fill('.lc-in', 'https://a.com/p?utm_source=x&id=3&gclid=1');
  check((await page.inputValue('.lc-out')) === 'https://a.com/p?id=3', 'link-cleaner: tracking removed');
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await page.fill('.lc-keep', 'utm_*');
  check((await page.inputValue('.lc-out')) === 'https://a.com/p?utm_source=x&id=3', 'link-cleaner: keep-list keeps utm_source');
  await page.fill('.lc-keep', ''); await page.check('.lc-all'); await page.waitForTimeout(80);
  check((await page.inputValue('.lc-out')) === 'https://a.com/p', 'link-cleaner: remove-all strips every parameter');
};
