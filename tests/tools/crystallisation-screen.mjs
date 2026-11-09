// #187 crystallisation screen designer
export const path = '/science/crystallisation-screen/';
export default async ({ page, check, OUT, BASE, readFileSync }) => {
  const R = '.cxs ';
  const txt = (c) => page.textContent(R + c);
  const F = (i, k) => `${R}.cx-f:nth-child(${i}) [data-k=${k}]`;
  const set = async (c, v) => { await page.fill(c, String(v)); await page.waitForTimeout(350); };
  const pick = async (c, v) => { await page.selectOption(c, v); await page.waitForTimeout(150); };
  const dl = async (sel, name) => { await page.locator(sel).scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click(sel)]); const f = OUT + name; await d.saveAs(f); return f; };
  await page.goto(`${BASE}/science/crystallisation-screen/`); await page.waitForTimeout(500);

  // The example loads with the page.
  check((await txt('.cx-big')) === '96 conditions on a 96-well plate, 4 stocks', 'cxs: example headline');
  { const f = await txt('.cx-facts'); check(f.includes('100 µL') && f.includes('Water per plate4.51 mL') && f.includes('Most water in a well69.0 µL') && f.includes('50 % of each condition'), 'cxs: example facts'); }
  check((await txt('.cx-f:nth-child(1) .cx-lv')) === '12 levels (step 2): 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30 % w/v', 'cxs: PEG levels across the columns');
  check((await txt('.cx-f:nth-child(2) .cx-lv')) === '8 levels (step 0.2): 6.6, 6.8, 7, 7.2, 7.4, 7.6, 7.8, 8', 'cxs: pH levels down the rows');
  check((await txt('.cx-f:nth-child(3) .cx-lv')) === '0.2 M in all 96 wells.' && await page.isHidden(F(3, 'to')), 'cxs: fixed salt, no "to" box');
  { const t = await txt('.cx-tot'); check(t.includes('PEG 335050 % w/v3.65 mL4.01 mL') && t.includes('Buffer pH 6.51 M, pH 6.5585.6 µL644.2 µL') && t.includes('Buffer pH 8.51 M, pH 8.5374.4 µL411.8 µL') && t.includes('Sodium chloride4 M480.0 µL528.0 µL') && t.includes('Water4.51 mL4.96 mL'), 'cxs: stocks to make with 10 % spare'); }
  check((await txt('.cx-small')).startsWith('24 wells have a volume below 1 µL (Buffer pH 8.5; A1,') && await page.isHidden(R + '.cx-over'), 'cxs: small-volume warning, nothing over-full');
  check((await txt('.cx-well')).startsWith('A1: PEG 3350 8 % w/v, pH 6.6 (0.1 M Buffer), Sodium chloride 0.2 M. Pipette PEG 3350 16.0 µL, Buffer pH 6.5 9.7 µL, Buffer pH 8.5 0.3 µL, Sodium chloride 5.0 µL and water 69.0 µL.'), 'cxs: well A1 recipe');
  check((await page.locator(R + '.cx-w').count()) === 96 && (await page.textContent(R + '.cx-w[data-i="11"]')) === '30', 'cxs: 96 wells coloured by PEG');

  check((await page.inputValue(R + '.cx-by')) === '0' && (await page.$eval(R + '.cx-by', (e) => e.selectedOptions[0]?.textContent)) === 'PEG 3350 (% w/v)', 'cxs: colour-by shows the first varying factor');
  await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; document.dispatchEvent(new CustomEvent('fibub:theme')); }); await page.waitForTimeout(100);
  check((await page.$eval(R + '.cx-w[data-i="0"]', (e) => e.style.background)) === 'rgb(45, 45, 45)', 'cxs: dark page uses greys on the map');
  await page.evaluate(() => { document.documentElement.dataset.theme = 'light'; document.dispatchEvent(new CustomEvent('fibub:theme')); }); await page.waitForTimeout(100);
  check((await page.$eval(R + '.cx-w[data-i="0"]', (e) => e.style.background)) === 'rgb(222, 235, 247)', 'cxs: light page uses the blue ramp');

  // Tap a well; colour by pH.
  await page.locator(R + '.cx-w[data-i="95"]').scrollIntoViewIfNeeded(); await page.click(R + '.cx-w[data-i="95"]');
  check((await txt('.cx-well')).includes('H12: PEG 3350 30 % w/v, pH 8 (0.1 M Buffer)') && (await txt('.cx-well')).includes('Buffer pH 6.5 1.8 µL, Buffer pH 8.5 8.2 µL, Sodium chloride 5.0 µL and water 25.0 µL') && (await page.getAttribute(R + '.cx-w[data-i="95"]', 'aria-pressed')) === 'true', 'cxs: tap H12 for its recipe');
  await pick(R + '.cx-by', '1');
  check((await page.textContent(R + '.cx-w[data-i="95"]')) === '8' && (await page.textContent(R + '.cx-w[data-i="0"]')) === '6.6' && (await txt('.cx-hi')) === '8' && (await txt('.cx-lo')) === '6.6', 'cxs: colour by pH with legend');
  { const a = await page.$eval(R + '.cx-w[data-i="0"]', (e) => e.style.background), b = await page.$eval(R + '.cx-w[data-i="95"]', (e) => e.style.background); check(a !== b, 'cxs: low and high wells differ in colour'); }

  // Pipetting table views.
  { const t = await txt('.cx-tab'); check(t.startsWith('WellPEG 3350 (% w/v)Buffer pHSodium chloride (M)PEG 3350 µL') && t.includes('H12308') && (await page.locator(R + '.cx-tab tr').count()) === 97, 'cxs: every-well table'); }
  await pick(R + '.cx-view', '2');
  { const rows = await page.$$eval(R + '.cx-tab tr', (tr) => tr.map((r) => [...r.cells].map((c) => c.textContent))); check(rows.length === 9 && rows[0][12] === '12' && rows[1].slice(0, 3).join() === 'A,0.3,0.3' && rows[8][12] === '8.2', 'cxs: high-pH stock as a plate'); }
  await pick(R + '.cx-view', 'water');
  { const rows = await page.$$eval(R + '.cx-tab tr', (tr) => tr.map((r) => [...r.cells].map((c) => c.textContent))); check(rows[1][1] === '69.0' && rows[8][12] === '25.0', 'cxs: water as a plate'); }

  // Downloads.
  { const rows = readFileSync(await dl(R + '.cx-csv', 'cxs.csv'), 'utf8').trim().split('\n'); check(rows.length === 97 && rows[0] === 'well,row,column,PEG 3350 (% w/v),Buffer pH,Sodium chloride (M),PEG 3350 uL,Buffer pH 6.5 uL,Buffer pH 8.5 uL,Sodium chloride uL,water uL,total uL,note' && rows[96] === 'H12,H,12,30,8,0.2,60.0,1.8,8.2,5.0,25.0,100,' && rows[1].endsWith('volume below pipette limit'), 'cxs: well CSV'); }
  { const rows = readFileSync(await dl(R + '.cx-scsv', 'cxs-stocks.csv'), 'utf8').trim().split('\n'); check(rows.length === 6 && rows[1] === 'PEG 3350,50,% w/v,,3648.00,4012.80' && rows[2] === 'Buffer pH 6.5,1,M,6.5,585.60,644.16' && rows[5] === 'water,,,,4512.00,4963.20', 'cxs: stocks CSV'); }
  { const f = await dl(R + '.dl button[data-f=pdf]', 'cxs.pdf'); check(readFileSync(f).subarray(0, 4).toString() === '%PDF', 'cxs: PDF report'); }
  { const f = await dl(R + '.dl button[data-f=png]', 'cxs.png'); check(readFileSync(f).subarray(1, 4).toString() === 'PNG', 'cxs: PNG report'); }
  { const f = await dl(R + '.dl button[data-f=docx]', 'cxs.docx'); check(readFileSync(f).subarray(0, 2).toString() === 'PK', 'cxs: Word report'); }

  // Spare, minimum volume, drop.
  await set(R + '.cx-spare', '20');
  check((await txt('.cx-tot')).includes('3.65 mL4.38 mL') && (await txt('.cx-tot')).includes('With 20 % spare'), 'cxs: 20 % spare');
  await set(R + '.cx-min', '0.2');
  check(await page.isHidden(R + '.cx-small'), 'cxs: smaller pipette limit clears the warning');
  await set(R + '.cx-dp', '2');
  check((await txt('.cx-facts')).includes('33 % of each condition'), 'cxs: 2 + 1 drop');

  // Mixing in a straight line.
  await pick(F(2, 'mix'), 'lin');
  check((await txt('.cx-tot')).includes('Buffer pH 6.51 M, pH 6.5576.0 µL') && (await txt('.cx-tot')).includes('384.0 µL'), 'cxs: straight-line pH mix');
  await pick(F(2, 'mix'), 'hh');

  // 24-well plate: 500 µL per well and rounding to 0.5 µL.
  await pick(R + '.cx-size', '24'); await page.waitForTimeout(200);
  check((await txt('.cx-big')) === '24 conditions on a 24-well plate, 4 stocks' && (await page.inputValue(R + '.cx-vol')) === '500' && (await page.locator(R + '.cx-w').count()) === 24, 'cxs: 24-well plate, 500 µL');
  check((await txt('.cx-f:nth-child(1) .cx-lv')) === '6 levels (step 4.4): 8, 12.4, 16.8, 21.2, 25.6, 30 % w/v', 'cxs: 24-well PEG levels');
  await pick(R + '.cx-round', '0.5');
  check((await txt('.cx-well')).includes('Pipette PEG 3350 80.0 µL, Buffer pH 6.5 48.5 µL, Buffer pH 8.5 1.5 µL, Sodium chloride 25.0 µL and water 345.0 µL'), 'cxs: rounded to 0.5 µL (A1)');
  await pick(R + '.cx-round', '1');
  check((await txt('.cx-well')).includes('Buffer pH 6.5 49 µL, Buffer pH 8.5 1 µL'), 'cxs: rounded to 1 µL');
  await pick(R + '.cx-round', '0.1'); await pick(R + '.cx-size', '96'); await page.waitForTimeout(200);
  check((await page.inputValue(R + '.cx-vol')) === '100', 'cxs: back to 96 wells and 100 µL');

  // Log steps.
  await pick(F(1, 'spacing'), 'log');
  check((await txt('.cx-f:nth-child(1) .cx-lv')).startsWith('12 levels (each 1.13 times the last): 8, 9.02, 10.2,') && (await txt('.cx-f:nth-child(1) .cx-lv')).endsWith('26.6, 30 % w/v'), 'cxs: even ratios');
  await pick(F(1, 'spacing'), 'lin');

  // Over-full wells.
  await set(F(1, 'to'), '45');
  check((await txt('.cx-over')).startsWith('8 wells need more than 100 µL of stocks (A12, B12,') && (await page.locator(R + '.cx-w.over').count()) === 8, 'cxs: over-full wells flagged');
  await set(F(1, 'to'), '30');

  // Add and remove factors.
  await page.click(R + '.cx-addc'); await page.waitForTimeout(200);
  check((await txt('.cx-big')) === '96 conditions on a 96-well plate, 5 stocks' && (await txt('.cx-f:nth-child(4) .cx-lv')) === '10 mM in all 96 wells.', 'cxs: add a fixed additive');
  await pick(F(4, 'dir'), 'col'); await set(F(4, 'to'), '20');
  check((await txt('.cx-f:nth-child(4) .cx-lv')).startsWith('12 levels (step 0.909)') && (await page.isVisible(F(4, 'to'))), 'cxs: additive across the columns');
  await page.click(R + '.cx-f:nth-child(4) .cx-rm'); await page.waitForTimeout(200);
  await page.click(R + '.cx-addp'); await page.waitForTimeout(200);
  check((await txt('.cx-big')) === '96 conditions on a 96-well plate, 6 stocks' && (await txt('.cx-tot')).includes('Buffer 2 pH 5.5'), 'cxs: add a second pH factor');
  await page.click(R + '.cx-f:nth-child(4) .cx-rm'); await page.waitForTimeout(200);
  check((await txt('.cx-big')).endsWith('4 stocks'), 'cxs: remove a factor');

  // Bad input.
  await set(F(1, 'stock'), '20');
  check((await txt('.cx-err')).includes('weaker than the highest final value (30 % w/v)') && await page.isHidden(R + '.cx-out'), 'cxs: weak stock message');
  await set(F(1, 'stock'), '50');
  await set(F(2, 'to'), '9');
  check((await txt('.cx-err')).includes('outside the two stocks (pH 6.5 and 8.5)'), 'cxs: pH outside the stocks');
  await set(F(2, 'to'), '8');
  await set(F(1, 'name'), '');
  check((await txt('.cx-err')) === 'Give every factor a name.', 'cxs: empty name');
  await set(F(1, 'name'), 'PEG 3350');
  await set(R + '.cx-vol', '0');
  check((await txt('.cx-err')).includes('volume per well above 0'), 'cxs: zero volume');
  await set(R + '.cx-vol', '100');
  check(await page.isHidden(R + '.cx-err') && await page.isVisible(R + '.cx-out'), 'cxs: fixed input clears the message');

  // The example button restores everything.
  await set(F(1, 'from'), '5'); await page.click(R + '.cx-ex'); await page.waitForTimeout(200);
  check((await txt('.cx-tot')).includes('PEG 335050 % w/v3.65 mL4.01 mL') && (await txt('.cx-facts')).includes('50 % of each condition'), 'cxs: example button');
};
