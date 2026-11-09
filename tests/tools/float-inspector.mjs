// #575 floating point inspector
export const path = '/science/float-inspector/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/float-inspector/`); await page.waitForTimeout(600);
  const R = '.fl';
  const facts = async () => Object.fromEntries((await page.$$eval(`${R} .fl-facts div`, (ds) => ds.map((d) => [d.querySelector('dt').textContent, d.querySelector('dd').textContent]))));
  const all = () => page.$$eval(`${R} .fl-all tr`, (rs) => rs.map((r) => [...r.children].map((c) => c.textContent)));
  check((await page.textContent(`${R} .fl-big`)) === '0.1 is stored as 0.1000000000000000055511151231257827021181583404541015625', 'float: 0.1 double exact value');
  { const f = await facts(); check(f['Exponent bits'] === '01111111011 = 1019, minus bias 1023 = −4' && f['Rounding error (stored − typed)'] === '0.0000000000000000055511151231257827021181583404541015625' && f['Error in ULPs'].startsWith('0.4 ') && f['ULP: gap to the next larger magnitude'].endsWith('= 2^−56') && f['Shortest decimal that gives these bits'] === '0.1', `float: 0.1 facts (${f['Exponent bits']})`); }
  check((await page.inputValue(`${R} .fl-hex`)) === '0x3FB999999999999A' && (await page.$$(`${R} .fl-bits button`)).length === 64, 'float: hex and 64 bit buttons');
  { const t = await all(); check(t[1].join('|') === 'Half (16-bit)|0x2E66|0.1|-2.441e-5|-0.4' && t[2].join('|') === 'Single (32-bit)|0x3DCCCCCD|0.1|1.490e-9|0.2', `float: all formats table (${t[1].join('|')})`); }
  // Formats
  await page.click(`${R} .fl-fmt button[data-f=half]`); await page.waitForTimeout(100);
  check((await page.textContent(`${R} .fl-big`)) === '0.1 is stored as 0.0999755859375' && (await page.$$(`${R} .fl-bits button`)).length === 16, 'float: half precision');
  await page.click(`${R} .fl-fmt button[data-f=single]`); await page.waitForTimeout(100);
  check((await page.inputValue(`${R} .fl-hex`)) === '0x3DCCCCCD', 'float: single precision');
  // 0.3 next up is 0.30000000000000004 in double.
  await page.click(`${R} .fl-fmt button[data-f=double]`); await page.fill(`${R} .fl-in`, '0.3'); await page.waitForTimeout(400);
  await page.click(`${R} .fl-up`); await page.waitForTimeout(100);
  check((await page.inputValue(`${R} .fl-in`)) === '0.30000000000000004' && (await page.inputValue(`${R} .fl-hex`)) === '0x3FD3333333333334' && (await page.textContent(`${R} .fl-big`)).startsWith('This pattern is 0.3000000000000000444'), 'float: next up from 0.3');
  await page.click(`${R} .fl-down`); await page.click(`${R} .fl-down`); await page.waitForTimeout(100);
  check((await page.inputValue(`${R} .fl-in`)) === '0.29999999999999993', 'float: next down twice');
  // Flip the sign bit.
  await page.locator(`${R} .fl-bits button`).first().click(); await page.waitForTimeout(100);
  check((await page.inputValue(`${R} .fl-in`)) === '-0.29999999999999993' && (await facts())['Sign bit'] === '1 (negative)', 'float: flipping the sign bit');
  // Hex in, special values.
  await page.fill(`${R} .fl-hex`, '0x7FF0000000000000'); await page.press(`${R} .fl-hex`, 'Enter'); await page.waitForTimeout(100);
  check((await page.textContent(`${R} .fl-big`)) === 'This pattern is infinity.' && (await facts())['Kind'] === 'Infinity', 'float: hex pattern for infinity');
  await page.click(`${R} .fl-fmt button[data-f=half]`); await page.waitForTimeout(100);
  check((await page.inputValue(`${R} .fl-hex`)) === '0x7C00', 'float: infinity carried to half');
  await page.selectOption(`${R} .fl-spec`, { label: 'Smallest subnormal: 6e-8' }); await page.waitForTimeout(100);
  check((await facts())['Kind'].startsWith('Subnormal') && (await page.textContent(`${R} .fl-big`)) === 'This pattern is 0.000000059604644775390625', 'float: smallest half subnormal');
  await page.selectOption(`${R} .fl-spec`, { label: 'Largest finite: 65500' }); await page.waitForTimeout(100);
  await page.click(`${R} .fl-up`); await page.waitForTimeout(100);
  check((await page.inputValue(`${R} .fl-in`)) === 'Infinity', 'float: next up from the largest half is infinity');
  await page.selectOption(`${R} .fl-spec`, { label: 'NaN (quiet): NaN' }); await page.waitForTimeout(100);
  check((await page.textContent(`${R} .fl-big`)).includes('NaN') && (await facts())['Mantissa bits'].includes('NaN'), 'float: NaN');
  await page.fill(`${R} .fl-in`, '65520'); await page.waitForTimeout(400);
  check((await page.inputValue(`${R} .fl-hex`)) === '0x7C00', 'float: 65520 rounds to infinity in half');
  await page.click(`${R} .fl-fmt button[data-f=double]`); await page.fill(`${R} .fl-in`, '9007199254740993'); await page.waitForTimeout(400);
  check((await page.textContent(`${R} .fl-big`)) === '9007199254740993 is stored as 9007199254740992' && (await facts())['Error in ULPs'].startsWith('-0.5 '), 'float: 2^53 + 1 rounds to even');
  await page.click(`${R} .fl-fmt button[data-f=single]`); await page.fill(`${R} .fl-in`, '1.00000005960464477539062501'); await page.waitForTimeout(400);
  check((await page.inputValue(`${R} .fl-hex`)) === '0x3F800001', 'float: exact rounding just above halfway in single');
  // CSV and report
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .fl-csv`)]); const f = OUT + 'fl.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 4 && rows[0].startsWith('format,bits hex') && rows[2].startsWith('Single (32-bit),0x3F800001'), 'float: CSV of the formats'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .dl button[data-f=pdf]`)]); check((await d.suggestedFilename()) === 'float-single.pdf', 'float: PDF report'); }
  // Bad input
  await page.fill(`${R} .fl-in`, 'abc'); await page.waitForTimeout(400);
  check((await page.textContent(`${R} .fl-err`)).includes('"abc" is not a number') && await page.isHidden(`${R} .fl-out`), 'float: bad number message');
  await page.fill(`${R} .fl-in`, '1'); await page.waitForTimeout(400);
  await page.fill(`${R} .fl-hex`, '0x123456789'); await page.press(`${R} .fl-hex`, 'Enter'); await page.waitForTimeout(100);
  check((await page.textContent(`${R} .fl-err`)).includes('more than 32 bits'), 'float: too-long hex message');
  await page.fill(`${R} .fl-in`, '-0'); await page.waitForTimeout(400);
  check((await page.inputValue(`${R} .fl-hex`)) === '0x80000000' && (await facts())['Kind'] === 'Zero', 'float: negative zero');
  await page.screenshot({ path: OUT + 'float-inspector.png', fullPage: true });
};
