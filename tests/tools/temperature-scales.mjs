// #1346 temperature-scales
export const path = '/learn/temperature-scales/';
export default async ({ page, check, BASE }) => {
  const R = '.tsc ';
  const t = (s) => page.textContent(R + s);
  const typeIn = async (v) => { await page.fill(R + '.ts-in', String(v)); await page.waitForTimeout(150); };
  const slide = async (sel, v) => { await page.$eval(R + sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(150); };
  await page.goto(BASE + path); await page.waitForTimeout(600);
  { const e = await t('.ts-eq');
    check(e.includes('F = 9/5 × C + 32 = 1.8 × 25 + 32 = 77 °F') && e.includes('K = C + 273.15 = 25 + 273.15 = 298.15 K') && !e.includes('Rankine'), 'temp: 25 °C = 77 °F = 298.15 K (Python)'); }
  check((await t('.ts-geq')).includes('= 109.2 kPa at 25 °C'), 'temp: gas 100 kPa at 0 °C is 109.2 kPa at 25 °C');
  const inked = await page.$eval(R + '.ts-cv', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 120 || Math.abs(d[i] - d[i + 2]) > 60) n++; return n; });
  check(inked > 500, `temp: thermometers drawn (${inked})`);
  await page.click(R + '.ts-jump[data-c="-40"]'); await page.waitForTimeout(150);
  check((await t('.ts-eq')).includes('= −40 °F') && (await t('.ts-eq')).includes('= 233.15 K'), 'temp: −40 °C = −40 °F');
  await page.click(R + '.ts-jump[data-c="-273.15"]'); await page.waitForTimeout(150);
  check((await t('.ts-eq')).includes('= 0 K') && (await t('.ts-eq')).includes('= −459.67 °F'), 'temp: absolute zero is 0 K and −459.67 °F');
  await page.selectOption(R + '.ts-unit', 'F'); await typeIn(98.6);
  check((await t('.ts-cv-v')) === '37 °C' && await page.isHidden(R + '.ts-err'), 'temp: typed 98.6 °F is 37 °C');
  await page.selectOption(R + '.ts-unit', 'C'); await typeIn(-300);
  check(await page.isVisible(R + '.ts-err') && (await t('.ts-err')).includes('colder than absolute zero'), 'temp: −300 °C refused');
  await typeIn('abc');
  check((await t('.ts-err')).includes('Type a number'), 'temp: bad input message');
  await page.selectOption(R + '.ts-unit', 'K'); await typeIn(373.15);
  check((await t('.ts-cv-v')) === '100 °C' && (await t('.ts-eq')).includes('= 212 °F'), 'temp: 373.15 K = 100 °C = 212 °F');
  await slide('.ts-sl', 0);
  check((await t('.ts-eq')).includes('= 32 °F') && (await page.inputValue(R + '.ts-in')) === '273.15', 'temp: slider to 0 °C updates typed box in K');
  await page.$eval(R + '.ts-cv', (e) => e.scrollIntoView({ block: 'center' })); await page.waitForTimeout(100);
  const b2 = await (await page.$(R + '.ts-cv')).boundingBox();
  await page.mouse.click(b2.x + b2.width * 0.3, b2.y + 30); await page.waitForTimeout(150);
  check(parseFloat((await t('.ts-cv-v')).replace('−', '-')) > 400, `temp: tap near top of thermometer warms it (${await t('.ts-cv-v')})`);
  await slide('.ts-p0', 200);
  check((await t('.ts-p0v')) === '200 kPa', 'temp: gas slider');
  // Class 11
  await page.click(R + '[data-level="11"]'); await page.waitForTimeout(150);
  await slide('.ts-sl', 25);
  check(await page.isVisible(R + '.ts-ceq') && (await t('.ts-ceq')).includes('= 70 on your scale') && (await t('.ts-ceq')).includes('= −20 °C'), 'temp: own scale 20/220 reads 70 at 25 °C, agrees at −20 °C');
  check((await t('.ts-eq')).includes('Rankine = 9/5 × K = 536.67 °R'), 'temp: Rankine at Class 11 (536.67 °R at 25 °C)');
  await page.fill(R + '.ts-a', '0'); await page.fill(R + '.ts-b', '100'); await page.waitForTimeout(100);
  check((await t('.ts-ceq')).includes('never reads the same'), 'temp: same-size degrees message');
  await page.fill(R + '.ts-b', '0'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.ts-cerr'), 'temp: equal fixed points refused');
  await page.click(R + '[data-level="8"]'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.ts-ceq'), 'temp: own-scale card hidden at Class 8–10');
  const items = await page.$$(R + '.lq-item');
  check(items.length === 5, 'temp: five questions');
  const ans = await items[0].getAttribute('data-ans');
  await (await items[0].$('.lq-in')).fill(String(+(+ans).toFixed(1))); await (await items[0].$('.lq-check')).click();
  check((await (await items[0].$('.lq-fb')).textContent()) === 'Right.', 'temp: C to F answer accepted');
  await (await items[1].$('.lq-in')).fill('9999'); await (await items[1].$('.lq-check')).click();
  check((await (await items[1].$('.lq-fb')).textContent()).startsWith('Not quite'), 'temp: wrong answer marked');

  // ---- Solve my numbers ----
  {
    await page.goto(BASE + path); await page.waitForTimeout(500);
    const ans = () => page.textContent('.ps-host .ps-ans'), work = () => page.textContent('.ps-host .ps-work');
    const pre = async (n) => { await page.click(`.ps-host .ps-pre button:has-text("${n}")`); await page.waitForTimeout(80); };
    const set = async (id, vals) => { await page.selectOption('.ps-host [data-k="prob"]', id); for (const [k, v] of Object.entries(vals)) { if (v[0] === '#') await page.selectOption(`.ps-host [data-k="${k}"]`, v.slice(1)); else await page.fill(`.ps-host [data-k="${k}"]`, v); } await page.waitForTimeout(80); };
    const ok = async (s, m) => check((await ans()).includes(s), `${'temperature-scales'}: ${m} (${await ans()})`);
    await pre('Body 98.6'); await ok('37 °C = 98.6 °F = 310.15 K = 558.27 °R', '98.6 °F');
    await pre('Room 25'); await ok('25 °C = 77 °F = 298.15 K', '25 °C');
    await pre('Liquid nitrogen'); await ok('−196.15 °C = −321.07 °F = 77 K', '77 K');
    await pre('Own scale'); await ok('reads 70', '20 + 200·25/100');
    await pre('Gas to 100'); await ok('137 kPa', '100·373.15/273.15');
    await set('conv', { 'conv-v': '-300', 'conv-s': '#0' }); await ok('below absolute zero', '-300 °C impossible');
    await set('conv', { 'conv-v': '-40', 'conv-s': '#0' }); await ok('−40 °C = −40 °F', '−40 is the same on both');
    await set('agree', { 'agree-L': '20', 'agree-H': '220' }); await ok('Both read −20 at −20 °C', 'scales agree at −20');
    await set('diff', { 'diff-d': '10', 'diff-s': '#2' }); await ok('is 10 °C = 10 K = 18 °F', '10 K change = 18 °F');
    await page.click('.ps-host .ps-pre button'); await page.waitForTimeout(80);
    check((await work()).length > 20 && !/NaN|Infinity/.test(await page.textContent('.ps-host')), `temperature-scales: working shown, no NaN`);
  }
};
