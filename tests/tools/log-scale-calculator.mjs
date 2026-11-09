// #335 log scale calculator
export const path = '/science/log-scale-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.lgs ';
  const t = async (c) => (await page.textContent(R + c)) ?? '';
  const fill = async (c, v) => { await page.fill(R + c, v); await page.waitForTimeout(400); };
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(600);
  check((await t('.ls-big')) === '925 bd ft by International ¼-inch, 867 Scribner, 775 Doyle (6 logs)', 'log scale: example totals');
  { const f = await t('.ls-facts'); check(f.includes('132.5 ft³') && f.includes('131.3 ft³') && f.includes('131.7 ft³') && f.includes('L1, L2, L4, L6'), 'log scale: Smalian, Huber, Newton and the small-log note'); }
  { const tb = await t('.ls-tab'); check(tb.includes('L1') && tb.includes('97') && tb.includes('86') && tb.includes('64'), 'log scale: per-log table'); }
  check(await page.isVisible(R + '.ls-fig'), 'log scale: chart');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.ls-csv')]); const f = OUT + 'logs.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 7 && rows[0].startsWith('log,small_end_in,length_ft') && rows[2].startsWith('L2,16,16,19,17.4,180.638,166.24,144,26.9217,26.4208,26.5878'), 'log scale: CSV'); }
  await fill('.ls-data', '12,16');
  check((await t('.ls-big')) === '97 bd ft by International ¼-inch, 86 Scribner, 64 Doyle (1 log)' && (await t('.ls-facts')).includes('needs both end diameters'), 'log scale: one log, small end and length only');
  await fill('.ls-cl', '8'); check(await page.isVisible(R + '.ls-fig'), 'log scale: chart length');
  await page.selectOption(R + '.ls-u', 'met'); await fill('.ls-data', 'M,30,4,34');
  check((await t('.ls-big')) === '74 bd ft by International ¼-inch, 68 Scribner, 50 Doyle (1 log)' && (await t('.ls-facts')).includes('0.323 m³') && (await page.inputValue(R + '.ls-cl')) === '5', 'log scale: metric');
  await fill('.ls-data', 'A,30,4,25'); check((await t('.ls-err')).includes('at least the small-end'), 'log scale: large end smaller message');
  await fill('.ls-data', 'A,30,0'); check((await t('.ls-err')).includes('give the length') && await page.isHidden(R + '.ls-out'), 'log scale: bad length message');
  await fill('.ls-data', 'nothing'); check((await t('.ls-err')).includes('at least one log'), 'log scale: empty message');
  await page.selectOption(R + '.ls-u', 'imp'); await fill('.ls-data', 'L1,12,16,14,13\nL2,16,16,19,17.4');
  for (const f of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R}.dl button[data-f=${f}]`)]); check((await d.suggestedFilename()) === `log-scale.${f}`, `log scale: ${f} download`); }
};
