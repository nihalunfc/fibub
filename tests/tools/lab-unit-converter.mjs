// #501 lab unit converter
export const path = '/science/lab-unit-converter/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/lab-unit-converter/`); await page.waitForTimeout(500);
  const R = '.luc ';
  check((await page.textContent(R + '.luc-warn')).includes('For study and teaching, not medical advice. Check with a qualified professional.'), 'lab units: medical note shown');
  check((await page.textContent(R + '.luc-out')) === '100 mg/dL = 5.551 mmol/L', 'lab units: example glucose 100 mg/dL');
  { const f = await page.textContent(R + '.luc-facts'); check(f.includes('180.156 g/mol') && f.includes('1 mg/dL = 0.055507 mmol/L'), 'lab units: molar mass and factor shown'); }
  { const t = await page.textContent(R + '.luc-tab'); check(['3.997', '5.273', '6.106', '6.994', '<2.220', '10.16'].every((x) => t.includes(x)), 'lab units: example list converted'); }
  await page.selectOption(R + '.luc-d', '1'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.luc-out')) === '100 mg/dL = 5.6 mmol/L', 'lab units: 1 decimal');
  await page.locator(R + '.luc-swap').scrollIntoViewIfNeeded(); await page.click(R + '.luc-swap'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.luc-out')) === '100 mmol/L = 1801.6 mg/dL', 'lab units: swap units');
  await page.selectOption(R + '.luc-d', ''); await page.selectOption(R + '.luc-a', 'creat'); await page.fill(R + '.luc-x', '1.2'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.luc-out')) === '1.2 mg/dL = 106.1 µmol/L', 'lab units: creatinine 1.2 mg/dL');
  await page.selectOption(R + '.luc-a', 'hba1c'); await page.fill(R + '.luc-x', '7'); await page.selectOption(R + '.luc-d', '0'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.luc-out')) === '7 % = 53 mmol/mol' && (await page.textContent(R + '.luc-facts')).includes('0.09148'), 'lab units: HbA1c master equation');
  await page.selectOption(R + '.luc-a', 'bun'); await page.selectOption(R + '.luc-d', ''); await page.fill(R + '.luc-x', '14'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.luc-out')) === '14 mg/dL = 4.998 mmol/L' && (await page.textContent(R + '.luc-note')).includes('nitrogen'), 'lab units: BUN to urea with note');
  await page.selectOption(R + '.luc-a', 'ca'); await page.selectOption(R + '.luc-to', 'mEq/L'); await page.fill(R + '.luc-x', '10'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.luc-out')) === '10 mg/dL = 4.990 mEq/L', 'lab units: calcium mEq/L');
  await page.selectOption(R + '.luc-a', 'tg'); await page.fill(R + '.luc-x', '150'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.luc-out')) === '150 mg/dL = 1.694 mmol/L' && (await page.textContent(R + '.luc-facts')).includes('triolein'), 'lab units: triglycerides as triolein');
  await page.fill(R + '.luc-x', 'abc'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.luc-err') && (await page.textContent(R + '.luc-err')).includes('Type a value'), 'lab units: bad value message');
  check((await page.textContent(R + '.luc-all')).includes('885.453') && (await page.textContent(R + '.luc-all')).includes('× 88.40mg/dL → µmol/L'), 'lab units: every-factor table');
  await page.selectOption(R + '.luc-a', 'glucose');
  await page.fill(R + '.luc-list', '90\n126 mg/dL\nhigh\n-2'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.luc-lsum')).includes('2 values converted') && (await page.textContent(R + '.luc-tab')).includes('not a number') && (await page.textContent(R + '.luc-tab')).includes('below zero'), 'lab units: list marks bad lines');
  await page.locator(R + '.luc-csv').scrollIntoViewIfNeeded();
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.luc-csv')]); const f = OUT + 'labunits.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8').trim().split('\n'); check(t.length === 6 && t[0].includes('180.156') && t[1].startsWith('input,value (mg/dL)') && t[2] === '90,90,4.996,' && t[4].endsWith('not a number'), `lab units: CSV download (${t[2]})`); }
};
