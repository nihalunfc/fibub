// #403 Harris matrix builder
export const path = '/science/harris-matrix-builder/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/harris-matrix-builder/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.hmx .hm-big');
  check((await big()) === '11 contexts in 10 units and 6 levels; 11 relations kept, 1 redundant', 'harris: example loads with the page');
  check(await page.isVisible('.hmx .hm-fig') && (await page.textContent('.hmx .hm-warn')).includes('2 of 2 contemporary pairs drawn level'), 'harris: figure and contemporary pairs');
  { const t = await page.textContent('.hmx .hm-rtab'); check(t.includes('5 > 6 > 7'), 'harris: redundant relation and the chain implying it'); }
  check((await page.textContent('.hmx .hm-ltab')).includes('8 = 9'), 'harris: same-as unit in the levels table');
  const dl = async (sel, name) => { await page.locator(sel).scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click(sel)]); const f = OUT + name; await d.saveAs(f); return f; };
  { const f = await dl('.hmx .hm-ccsv', 'harris-c.csv'); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 12 && rows[0].startsWith('context,same_as,level') && rows.some((r) => r.startsWith('9,8,')), 'harris: contexts CSV'); }
  { const f = await dl('.hmx .hm-rcsv', 'harris-r.csv'); const t = readFileSync(f, 'utf8'); check(t.includes('5,above,7,redundant,9') && t.split('\n').filter((l) => l.includes(',kept,')).length === 13, 'harris: relations CSV'); }
  { const f = await dl('.hmx .hm-svg', 'harris.svg'); const t = readFileSync(f, 'utf8'); check(t.startsWith('<?xml') && (t.match(/<polygon/g) || []).length >= 11 && t.includes('>8 = 9<'), 'harris: SVG figure'); }
  { const f = await dl('.hmx .hm-png', 'harris.png'); check(readFileSync(f).subarray(1, 4).toString() === 'PNG', 'harris: PNG figure'); }
  { const f = await dl('.hmx .dl [data-f=pdf]', 'harris.pdf'); check(readFileSync(f).subarray(0, 5).toString() === '%PDF-', 'harris: PDF report'); }
  await page.fill('.hmx .hm-in', (await page.inputValue('.hmx .hm-in')) + '\n7 above 1'); await page.waitForTimeout(500);
  check((await big()).startsWith('The sequence is impossible: 1 loop') && (await page.textContent('.hmx .hm-warn')).includes('Loop: 1 above 2 above 3 above 5 above 7 above 1') && await page.isHidden('.hmx .hm-figwrap'), 'harris: loop found and named');
  await page.fill('.hmx .hm-in', '3 ~ 4\n3 > 8\n8 > 4\nA = B\nB cuts A\nnonsense here'); await page.waitForTimeout(500);
  check((await page.textContent('.hmx .hm-errs')).includes('Line 6: "nonsense here" is not a relation') && (await page.textContent('.hmx .hm-warn')).includes('A = B: these are recorded as the same deposit'), 'harris: bad line and same-as contradiction');
  await page.fill('.hmx .hm-in', '3 ~ 4\n3 > 8\n8 > 4'); await page.waitForTimeout(500);
  check((await page.textContent('.hmx .hm-warn')).includes('3 and 4 are recorded as contemporary (line 1), but the sequence puts one above the other'), 'harris: contradicted contemporary pair');
  await page.click('.hmx .hm-clear'); await page.waitForTimeout(200);
  check(await page.isHidden('.hmx .hm-out'), 'harris: clear');
  writeFileSync(OUT + 'harris-rel.csv', 'context,relation,context\n10,above,20\n20,cut by,30\n');
  await page.setInputFiles('.hmx .dfb-in', OUT + 'harris-rel.csv'); await page.waitForTimeout(600);
  check(await page.isHidden('.hmx .hm-errs') && (await big()).startsWith('3 contexts in 3 units and 2 levels'), `harris: spreadsheet file with a header row (${await big()})`);
  await page.click('.hmx .hm-ex'); await page.waitForTimeout(300);
};
