// #1770 Text cleaner
export const path = '/documents/text-cleaner/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/documents/text-cleaner/`); await page.waitForTimeout(400);
  const out = () => page.textContent('.tcl .tcl-out');
  await page.fill('.tcl .tcl-in', 'This is a docu-\nment that wraps\nover  two lines.\n\n\n\n• Next “para”');
  await page.waitForTimeout(100);
  check((await out()) === 'This is a document that wraps over two lines.\n\n• Next “para”', `tcl: defaults join and hyphen (${JSON.stringify(await out())})`);
  await page.check('.tcl input[data-o=bullets]'); await page.check('.tcl input[data-o=straightQuotes]'); await page.waitForTimeout(100);
  check((await out()) === 'This is a document that wraps over two lines.\n\nNext "para"', `tcl: bullets and quotes (${JSON.stringify(await out())})`);
  await page.fill('.tcl .tcl-in', 'Hi \u{1F600} there​'); await page.check('.tcl input[data-o=emojis]'); await page.waitForTimeout(100);
  check((await out()) === 'Hi  there'.replace('  ', ' '), `tcl: emoji and hidden (${JSON.stringify(await out())})`);
};
