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
  await page.fill('.tcl .tcl-in', '# Title\n\n**bold** and *it* `code`'); await page.check('.tcl input[data-o=markdown]'); await page.waitForTimeout(100);
  check((await out()) === 'Title\n\nbold and it code', `tcl: markdown (${JSON.stringify(await out())})`);
  await page.fill('.tcl .tcl-in', 'Yes \u2014 no'); await page.check('.tcl input[data-o=dashes]'); await page.waitForTimeout(100);
  check((await out()) === 'Yes, no', 'tcl: long dash');
  await page.fill('.tcl .tcl-in', 'a <b>bold</b> word'); await page.check('.tcl input[data-o=htmlTags]'); await page.waitForTimeout(100);
  check((await out()) === 'a bold word', 'tcl: html tags');
  await page.click('.tcl .tcl-pre-b[data-p=list]'); await page.fill('.tcl .tcl-in', '- pear\n- apple\n- pear\n- banana'); await page.waitForTimeout(100);
  check((await out()) === 'apple\nbanana\npear', `tcl: list preset dedupes and sorts (${JSON.stringify(await out())})`);
  await page.click('.tcl .tcl-pre-b[data-p=ai]'); await page.fill('.tcl .tcl-in', '## Plan \u2014 now \u{1F600}'); await page.waitForTimeout(100);
  check((await out()) === 'Plan, now', `tcl: AI preset (${JSON.stringify(await out())})`);
  check(await page.isVisible('.kit-bar'), 'tcl: copy link bar present');
};
