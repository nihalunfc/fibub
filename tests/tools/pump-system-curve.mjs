// #662 pump and system curve
export const path = '/science/pump-system-curve/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.pss ';
  await page.goto(`${BASE}/science/pump-system-curve/`); await page.waitForTimeout(700);
  check((await page.textContent(R + '.ps-big')) === '40.33 L/s at 27.2 m head', 'pump: example operating point');
  { const t = await page.textContent(R + '.ps-facts'); check(t.includes('71.1 %') && t.includes('15.11 kW') && t.includes('31.25 L/s per pump') && t.includes('129 %') && t.includes('6.604 m') && t.includes('4.033 m') && t.includes('comfortable'), 'pump: example facts'); }
  check(await page.isVisible(R + '.ps-fig') && await page.isVisible(R + '.ps-fig2'), 'pump: both charts drawn');
  await page.selectOption(R + '.ps-arr', 'parallel'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.ps-big')) === '52.69 L/s at 35.82 m head' && (await page.textContent(R + '.ps-facts')).includes('One pump alone'), 'pump: two in parallel');
  await page.selectOption(R + '.ps-arr', 'series'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.ps-big')) === '51.64 L/s at 35 m head', 'pump: two in series');
  await page.selectOption(R + '.ps-arr', 'single'); await page.selectOption(R + '.ps-chg', 'speed'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.ps-big')) === '33.65 L/s at 23.49 m head' && (await page.textContent(R + '.ps-facts')).includes('Speed ratio'), 'pump: slower speed by the affinity laws');
  await page.selectOption(R + '.ps-chg', 'dia'); await page.fill(R + '.ps-c1', '250'); await page.fill(R + '.ps-c2', '225'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.ps-big')) === '33.88 L/s at 23.61 m head' && (await page.textContent(R + '.ps-facts')).includes('Diameter ratio'), 'pump: trimmed impeller');
  await page.selectOption(R + '.ps-chg', 'none');
  await page.selectOption(R + '.ps-fm', 'pipe'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.ps-big')) === '41.78 L/s at 26.09 m head', 'pump: pipe system curve');
  await page.selectOption(R + '.ps-fm', 'known');
  await page.fill(R + '.ps-zs', '-8'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.ps-facts')).includes('short by'), 'pump: cavitation warning with a big suction lift');
  await page.fill(R + '.ps-zs', '-3'); await page.fill(R + '.ps-t', '80'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.ps-facts')).includes('short by'), 'pump: hot water cuts NPSH available');
  await page.fill(R + '.ps-t', '20');
  await page.selectOption(R + '.ps-qu', '0.000277777777777778'); await page.fill(R + '.ps-pts', '0, 151.2\n36, 147.6\n72, 138.6\n108, 122.4\n144, 99\n180, 68.4'); await page.fill(R + '.ps-qr', '144'); await page.fill(R + '.ps-hlq', '144'); await page.fill(R + '.ps-hs', '54'); await page.fill(R + '.ps-hr', '43.2'); await page.waitForTimeout(500);
  { const t = await page.textContent(R + '.ps-big'); check(t.endsWith('m³/h at 97.92 m head') && t.startsWith('145.2'), `pump: m³/h with heads only (${t})`); }
  check(await page.isHidden(R + '.ps-fig2'), 'pump: no efficiency chart without efficiency points');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.ps-csv')]); const f = OUT + 'pump.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 82 && rows[0].startsWith('flow_m_h,pump_set_head_m'), `pump: curves CSV (${rows[0]})`); }
  await page.fill(R + '.ps-hs', '200'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.ps-err')).includes('cannot overcome') && await page.isHidden(R + '.ps-out'), 'pump: static head too high message');
  await page.fill(R + '.ps-pts', '0, 10\n10, 20\n20, 30'); await page.waitForTimeout(500);
  check((await page.textContent(R + '.ps-perr')).includes('do not look like a pump curve'), 'pump: rising curve message');
  await page.fill(R + '.ps-pts', '0, 10'); await page.waitForTimeout(500);
  check((await page.textContent(R + '.ps-perr')).includes('at least three points'), 'pump: too few points message');
  writeFileSync(OUT + 'pump.csv', 'Flow,Head,Eff\n0,42,0\n10,41,45\n20,38.5,66\n30,34,75\n40,27.5,72\n50,19,60\n');
  await page.selectOption(R + '.ps-qu', '0.001'); await page.fill(R + '.ps-hs', '15'); await page.fill(R + '.ps-hr', '12'); await page.fill(R + '.ps-qr', '40'); await page.fill(R + '.ps-hlq', '40');
  await page.setInputFiles(R + '.dfb-in', OUT + 'pump.csv'); await page.waitForTimeout(600);
  check((await page.textContent(R + '.ps-big')) === '40.33 L/s at 27.2 m head', 'pump: points opened from a file');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=png]')]); check((await d.suggestedFilename()) === 'pump-system-curve.png', 'pump: image report'); }
};
