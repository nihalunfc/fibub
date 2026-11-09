// #395 sensory triangle and duo-trio test analyser
export const path = '/science/sensory-difference-test/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const S = '.sens ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  check(await page.isHidden(S + '.sd-out') && (await page.textContent(S + '.sd-tab')).includes('60'), 'sensory: table shown before input');
  await page.click(S + '.sd-ex'); await page.waitForTimeout(200);
  check((await page.textContent(S + '.sd-big')) === 'Significant: 18 of 36 correct, p = 0.0283', 'sensory: example result');
  { const t = await page.textContent(S + '.sd-facts'); check(t.includes('18 of 36') && t.includes('25.0 ± 12.5 %') && t.includes('1.47 ± 0.44'), 'sensory: distinguishers and d′'); }
  check((await page.textContent(S + '.sd-pbig')) === 'Power with n = 36: 71.6 %. 40 answers for 80 % power' && (await page.textContent(S + '.sd-pnote')).includes('d′ 1.64'), 'sensory: power and sample size');
  { const rows = await page.$$eval('.sens .sd-tab tr', (r) => r.map((x) => x.textContent)); check(rows.length === 52 && rows.includes('2412131516') , `sensory: triangle critical table (${rows.find((r) => r.startsWith('24'))})`); }
  await page.selectOption(S + '.sd-m', 'duotrio'); await page.waitForTimeout(100);
  check((await page.textContent(S + '.sd-big')) === 'Not significant: 18 of 36 correct, p = 0.5660' && (await page.textContent(S + '.sd-say')).includes('does not prove'), 'sensory: duo-trio');
  await page.selectOption(S + '.sd-m', 'twoAFC'); await page.fill(S + '.sd-x', '26'); await page.waitForTimeout(400);
  check((await page.textContent(S + '.sd-big')).startsWith('Significant: 26 of 36'), 'sensory: 2-AFC');
  await page.selectOption(S + '.sd-m', 'tetrad'); await page.fill(S + '.sd-x', '18'); await page.waitForTimeout(400);
  check((await page.textContent(S + '.sd-facts')).includes('d′1.02') || (await page.textContent(S + '.sd-facts')).includes('d′1.022'), 'sensory: tetrad d′');
  await page.selectOption(S + '.sd-a', '0.001'); await page.waitForTimeout(100);
  check((await page.textContent(S + '.sd-big')).startsWith('Not significant') && (await page.textContent(S + '.sd-facts')).includes('22 of 36'), 'sensory: other alpha');
  await page.selectOption(S + '.sd-pk', 'd'); await page.waitForTimeout(100);
  check((await page.inputValue(S + '.sd-pv')) === '1' && (await page.textContent(S + '.sd-pnote')).includes('49.4 % chance'), 'sensory: power from d′');
  await page.fill(S + '.sd-t1', '5'); await page.fill(S + '.sd-t2', '7'); await page.waitForTimeout(400);
  check((await page.textContent(S + '.sd-tab')).includes('–'), 'sensory: dash when n is too small');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(S + '.sd-csv')]); const f = OUT + 'sd.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8').trim().split('\n'); check(t.length === 4 && t[0] === 'n,min_correct_alpha_0.1,min_correct_alpha_0.05,min_correct_alpha_0.01,min_correct_alpha_0.001' && t[1].startsWith('5,'), 'sensory: CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(S + '.dl [data-f=pdf]')]); check((await d.suggestedFilename()) === 'tetrad-test.pdf', 'sensory: PDF download'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(S + '.dl [data-f=docx]')]); check((await d.suggestedFilename()) === 'tetrad-test.docx', 'sensory: Word download'); }
  await page.fill(S + '.sd-x', '40'); await page.waitForTimeout(400);
  check((await page.textContent(S + '.sd-err')).includes('0 to 36'), 'sensory: too many correct message');
  await page.fill(S + '.sd-pv', '0'); await page.waitForTimeout(400);
  check((await page.textContent(S + '.sd-perr')).includes('above 0'), 'sensory: zero difference message');
  await page.click(S + '.sd-ex'); const vp0 = page.viewportSize(); await page.setViewportSize({ width: 375, height: 800 }); await page.waitForTimeout(200);
  await page.locator('.sens').screenshot({ path: OUT + 'sens-375.png' }); await page.setViewportSize(vp0);
};
