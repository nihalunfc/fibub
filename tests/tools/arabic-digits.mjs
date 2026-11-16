// #T994 Arabic digits
export const path = '/documents/arabic-digits/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/documents/arabic-digits/`); await page.waitForTimeout(300);
  const out = () => page.textContent('.ad .ad-out');
  await page.fill('.ad .ad-in', '١٢٣٤٥٫٦٧ and ۴۵۶، ٧'); await page.waitForTimeout(100);
  check((await out()) === '12345.67 and 456, 7', 'arabic-digits: to Western (' + (await out()) + ')');
  await page.check('.ad input[value="ar"]'); await page.fill('.ad .ad-in', '12,345.67 abc 9'); await page.waitForTimeout(100);
  check((await out()) === '١٢٬٣٤٥٫٦٧ abc ٩', 'arabic-digits: to Eastern Arabic (' + (await out()) + ')');
  await page.check('.ad input[value="fa"]'); await page.waitForTimeout(100);
  check((await out()).startsWith('۱۲٬۳۴۵٫۶۷'), 'arabic-digits: to Persian style (' + (await out()) + ')');
  await page.fill('.ad .ad-num', '١٢٣٤٥٦٧٫٨٩'); await page.waitForTimeout(100);
  check((await page.textContent('.ad .ad-numout')) === '1,234,567.89', 'arabic-digits: groups a number');
  check((await page.locator('.ad-big').count()) === 20, 'arabic-digits: reference table has 20 glyphs');
};
