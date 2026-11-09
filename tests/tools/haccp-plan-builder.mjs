// #396 HACCP plan builder
export const path = '/science/haccp-plan-builder/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const S = '.hacc ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  check((await page.textContent(S + '.hc-big')) === '0 steps, 0 hazards, 0 CCPs' && (await page.evaluate(() => localStorage.getItem('fibub-haccp-v1'))) === null, 'haccp: empty start, nothing stored');
  await page.click(S + '.hc-ex'); await page.waitForTimeout(200);
  check((await page.textContent(S + '.hc-big')) === '7 steps, 5 hazards, 3 CCPs', 'haccp: example summary');
  { const p = await page.$$eval('.hacc .hc-probs li', (l) => l.map((x) => x.textContent)); check(p.length === 2 && p[0].includes('CCP 2') && p[1].includes('CCP 3'), 'haccp: example still-to-do list'); }
  check((await page.textContent(S + '.hc-tab2')).includes('CCP 1 (B)') && (await page.textContent(S + '.hc-tab1')).includes('Not a CCP (a later step controls it)'), 'haccp: tables');
  check((await page.evaluate(() => localStorage.getItem('fibub-haccp-v1'))) === null, 'haccp: not stored without the Remember box');
  // Change an answer: hazard 1 (raw chicken) q4 to "no" makes it a CCP and renumbers.
  await page.locator(S + '.hc-item[data-i="0"] select[data-k=q4]').selectOption('no'); await page.waitForTimeout(100);
  check((await page.textContent(S + '.hc-big')) === '7 steps, 5 hazards, 4 CCPs' && (await page.textContent(S + '.hc-item[data-i="0"] .ax-pill')) === 'CCP 1' && (await page.locator(S + '.hc-item[data-i="0"] .hc-ccp textarea').count()) === 5, 'haccp: answer changes the decision and adds CCP fields');
  await page.locator(S + '.hc-item[data-i="0"] select[data-k=q1]').selectOption('no'); await page.waitForTimeout(100);
  check((await page.locator(S + '.hc-item[data-i="0"] select[data-k=q1b]').count()) === 1 && (await page.locator(S + '.hc-item[data-i="0"] select[data-k=q2]').count()) === 0, 'haccp: earlier answer resets the later questions');
  await page.locator(S + '.hc-item[data-i="0"] select[data-k=q1b]').selectOption('yes'); await page.waitForTimeout(100);
  check((await page.textContent(S + '.hc-item[data-i="0"]')).includes('change the step') && (await page.textContent(S + '.hc-probs')).includes('needs a control measure'), 'haccp: modify outcome');
  // Add a physical hazard with typing.
  await page.click(S + '.hc-add'); await page.waitForTimeout(100);
  const last = S + '.hc-item[data-i="5"] ';
  await page.selectOption(last + '.hc-s', 'Pack and seal'); await page.selectOption(last + '.hc-t', 'P');
  await page.fill(last + 'textarea[data-k=hazard]', 'Glass from a broken light'); await page.fill(last + 'textarea[data-k=control]', 'Shatterproof covers');
  await page.selectOption(last + 'select[data-k=q1]', 'yes'); await page.selectOption(last + 'select[data-k=q2]', 'yes'); await page.waitForTimeout(100);
  await page.fill(last + 'textarea[data-k=limit]', 'No uncovered glass');
  check((await page.textContent(S + '.hc-tab2')).includes('No uncovered glass') && (await page.textContent(S + '.hc-tab1')).includes('6. Pack and seal'), 'haccp: new hazard typed in');
  // Steps edit: remove a step that has a hazard.
  await page.fill(S + '.hc-steps', 'Receive raw chicken\nChilled storage\nCook chicken\nCool\nMix with pasta and dressing\nChilled dispatch'); await page.waitForTimeout(500);
  check((await page.textContent(S + '.hc-probs')).includes('not in the flow (Pack and seal)') && (await page.textContent(S + '.hc-big')).startsWith('6 steps'), 'haccp: hazard on a removed step flagged');
  await page.fill(S + '.hc-p[data-k=name]', 'Test salad');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(S + '.hc-csv')]); check((await d.suggestedFilename()) === 'Test-salad-haccp.csv', 'haccp: CSV name'); const f = OUT + 'hc.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(t.startsWith('Product\nProduct name,Test salad') && t.includes('HACCP plan') && t.includes('No uncovered glass'), 'haccp: CSV content'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(S + '.dl [data-f=pdf]')]); check((await d.suggestedFilename()) === 'Test-salad-haccp.pdf', 'haccp: PDF download'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(S + '.dl [data-f=docx]')]); check((await d.suggestedFilename()) === 'Test-salad-haccp.docx', 'haccp: Word download'); }
  // Remember, reload, clear.
  await page.check(S + '.hc-rem'); await page.waitForTimeout(100);
  check((await page.evaluate(() => JSON.parse(localStorage.getItem('fibub-haccp-v1')).product.name)) === 'Test salad', 'haccp: Remember stores the plan in this browser');
  await page.reload(); await page.waitForTimeout(500);
  check((await page.inputValue(S + '.hc-p[data-k=name]')) === 'Test salad' && await page.isChecked(S + '.hc-rem') && (await page.textContent(S + '.hc-saved')).includes('Loaded'), 'haccp: saved plan loads next visit');
  await page.click(S + '.hc-clear'); await page.waitForTimeout(100);
  check((await page.evaluate(() => localStorage.getItem('fibub-haccp-v1'))) === null && !(await page.isChecked(S + '.hc-rem')), 'haccp: Clear saved plan deletes it');
  page.once('dialog', (d) => d.accept());
  await page.click(S + '.hc-new'); await page.waitForTimeout(200);
  check((await page.textContent(S + '.hc-big')) === '0 steps, 0 hazards, 0 CCPs' && (await page.inputValue(S + '.hc-p[data-k=name]')) === '', 'haccp: start again');
  await page.reload(); await page.waitForTimeout(400);
  check((await page.inputValue(S + '.hc-p[data-k=name]')) === '', 'haccp: nothing comes back after clearing');
  await page.click(S + '.hc-ex'); await page.setViewportSize({ width: 375, height: 800 }); await page.waitForTimeout(200);
  await page.locator('.hacc').screenshot({ path: OUT + 'haccp-375.png' }); await page.setViewportSize({ width: 1280, height: 800 });
};
