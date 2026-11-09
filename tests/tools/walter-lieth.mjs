// #900 Walter-Lieth climate diagram
export const path = '/science/walter-lieth/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/walter-lieth/`); await page.waitForTimeout(500);
  const R = '.wlt ', facts = () => page.textContent(R + '.wl-facts');
  const wait = () => page.waitForTimeout(550);
  { const f = await facts(); check(f.includes('Annual mean temperature17.4 °C') && f.includes('Annual precipitation601 mm') && f.includes('Dry season5 monthslate April to late September') && f.includes('Dry months (P < 2T)5May, Jun, Jul, Aug, Sep') && f.includes('Very wet months (> 100 mm)2Nov, Dec') && f.includes('Frost0 sure, 3 probableprobable: Jan, Feb, Dec') && f.includes('Warmest month, mean daily max32.4 °C') && f.includes('Absolute minimum−2.5 °C'), 'walter-lieth: example A facts'); }
  check(await page.isVisible(R + '.wl-fig') && (await page.$eval(R + '.wl-fig', (c) => c.width)) > 400, 'walter-lieth: diagram drawn');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.wl-svg')]); const f = OUT + 'wl.svg'; await d.saveAs(f); const s = readFileSync(f, 'utf8');
    check(d.suggestedFilename() === 'Example-A-made-up-walter-lieth.svg' && s.includes('<svg xmlns') && s.includes('>Example A (made up) (120 m)<') && s.includes('>601 mm<') && s.includes('>17.4 °C<') && s.includes('stroke-dasharray="1.4 2.6"') && (s.match(/<polygon[^>]*fill="#0072B2"/g) ?? []).length === 2 && s.includes('>Warmest month max 32.4 · coldest month min 4.5 · absolute min −2.5 °C<'), 'walter-lieth: SVG download'); }
  await page.selectOption(R + '.wl-ex', 'mon'); await wait();
  { const f = await facts(); check(f.includes('Annual precipitation2158 mm') && f.includes('Very wet months (> 100 mm)5May, Jun, Jul, Aug, Sep') && f.includes('Frost0 sure, 0 probableno month below 0 °C'), 'walter-lieth: monsoon example'); }
  await page.selectOption(R + '.wl-ex', 'con'); await wait();
  { const f = await facts(); check(f.includes('Dry seasonnone') && f.includes('Frost5 sure, 4 probablesure: Jan, Feb, Mar, Nov, Dec; probable: Apr, May, Sep, Oct'), 'walter-lieth: continental example, frost'); }
  await page.selectOption(R + '.wl-ex', 'sth'); await wait();
  { const f = await facts(); check((await page.inputValue(R + '.wl-h')) === 's' && f.includes('Dry months (P < 2T)5Jul, Aug, Sep, May, Jun') && f.includes('Very wet months (> 100 mm)2Dec, Jan') && f.includes('Frost0 sure, 4 probableprobable: Jul, Aug, May, Jun') && f.includes('Dry season4.7 monthsearly May to late September'), 'walter-lieth: southern example in July-first order'); }
  // °F and inches.
  await page.fill(R + '.wl-text', Array.from({ length: 12 }, () => '50, 2').join('\n')); await page.selectOption(R + '.wl-u', 'us'); await wait();
  { const f = await facts(); check(f.includes('Annual mean temperature10.0 °C') && f.includes('Annual precipitation610 mm') && (await page.textContent(R + '.wl-note')).includes('Converted to °C and mm') && f.includes('Frostnot shown'), 'walter-lieth: °F and inches converted'); }
  await page.selectOption(R + '.wl-u', 'si'); await wait();
  // Errors and notes.
  await page.fill(R + '.wl-text', Array.from({ length: 11 }, () => '10, 50').join('\n')); await wait();
  check((await page.textContent(R + '.wl-err')).includes('Found 11 month rows') && await page.isHidden(R + '.wl-out'), 'walter-lieth: needs 12 months');
  await page.fill(R + '.wl-text', Array.from({ length: 12 }, (_, i) => `${i + 1}, 10, 50${i < 6 ? ', 15' : ''}`).join('\n')); await wait();
  check((await page.textContent(R + '.wl-note')).includes('6 of 12 months') && (await facts()).includes('Dry seasonnone'), 'walter-lieth: month numbers and a partial column');
  await page.fill(R + '.wl-text', Array.from({ length: 12 }, () => '10, -5').join('\n')); await wait();
  check((await page.textContent(R + '.wl-err')).includes('cannot be negative'), 'walter-lieth: negative precipitation');
  // Open a file.
  const csvf = OUT + 'wl-in.csv';
  writeFileSync(csvf, 'Month;T;P\n' + ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => `${m};${i < 6 ? 20 : 25};${i < 6 ? 100 : 10}`).join('\n') + '\nYear;22.5;660\n');
  await page.setInputFiles(R + '.dfb-in', csvf); await wait();
  { const f = await facts(); check(f.includes('Annual mean temperature22.5 °C') && f.includes('Annual precipitation660 mm') && f.includes('Dry months (P < 2T)6Jul, Aug, Sep, Oct, Nov, Dec'), 'walter-lieth: opens a CSV file'); }
  await page.fill(R + '.wl-name', 'My site'); await page.fill(R + '.wl-z', ''); await wait();
  for (const f of ['pdf', 'docx', 'png']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.wlt .dl [data-f=${f}]`)]); const p = OUT + 'wl.' + f; await d.saveAs(p); check(readFileSync(p).length > 3000 && d.suggestedFilename().startsWith('My-site-walter-lieth'), `walter-lieth: ${f} download`); }
};
