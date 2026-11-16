// #1748 Bill splitter
export const path = '/money/bill-splitter/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/bill-splitter/`); await page.waitForTimeout(400);
  const R = '.bs ';
  const row = (name) => page.evaluate((n) => { const r = [...document.querySelectorAll('.bs-table tbody tr')].find((x) => x.cells[0].textContent === n); return r ? [...r.cells].map((c) => c.textContent) : null; }, name);
  const foot = () => page.evaluate(() => [...document.querySelector('.bs-table tfoot tr').cells].map((c) => c.textContent));
  let r = await row('Rent');
  check(r && r[2] === '1,200.00' && r[3] === '800.00', `bill-splitter: rent 2,000 by room 12/8 -> 1,200/800 (${r})`);
  r = await row('Internet');
  check(r && r[2] === '30.00' && r[3] === '30.00', 'bill-splitter: equal split of 60 -> 30/30');
  let t = await foot();
  check(t[2] === '1,230.00' && t[3] === '830.00', `bill-splitter: totals per person (${t})`);
  // odd cents add up
  await page.fill(R + '.bs-b:nth-child(2) [data-f="amount"]', '100'); await page.click(R + '.bs-addp');
  await page.fill(R + '.bs-p:nth-child(3) [data-f="name"]', 'Kim'); await page.waitForTimeout(100);
  r = await row('Internet');
  check(r && r[2] === '33.34' && r[3] === '33.33' && r[4] === '33.33', `bill-splitter: 100 between 3 adds up (${r})`);
  // income split
  await page.selectOption(R + '.bs-b:nth-child(2) [data-f="by"]', 'income');
  await page.fill(R + '.bs-p:nth-child(1) [data-f="income"]', '3000'); await page.fill(R + '.bs-p:nth-child(2) [data-f="income"]', '1000'); await page.waitForTimeout(100);
  r = await row('Internet');
  check(r && r[2] === '75.00' && r[3] === '25.00' && r[4] === '0.00', `bill-splitter: by income 3000/1000 -> 75/25 (${r})`);
  // nothing stored unless ticked
  const stored = await page.evaluate(() => localStorage.getItem('fibub-bill-splitter-v1'));
  check(stored === null, 'bill-splitter: nothing saved while the box is unticked');
  await page.check(R + '.bs-remember'); await page.waitForTimeout(100);
  check(await page.evaluate(() => !!localStorage.getItem('fibub-bill-splitter-v1')), 'bill-splitter: saved when ticked');
  await page.click(R + '.bs-clear'); await page.waitForTimeout(100);
  check(await page.evaluate(() => localStorage.getItem('fibub-bill-splitter-v1')) === null, 'bill-splitter: Clear removes it');
  // new options: answer line, tax and tip, who paid -> settle up (details are closed by default, so open them first)
  check(/Sam pays 1,275\.00/.test(await page.textContent('.bs-answer')), 'bill-splitter: plain answer line names who pays ' + await page.textContent('.bs-answer'));
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await page.fill(R + '[data-k="tax"]', '10'); await page.waitForTimeout(100);
  r = await row('Internet');
  check(r && r[1] === '110.00' && r[2] === '82.50' && r[3] === '27.50', `bill-splitter: 10% tax added to a 100 bill split 75/25 (${r})`);
  check(/10% tax/.test(await page.textContent('.bs-note')), 'bill-splitter: says tax is included');
  await page.fill(R + '[data-k="tip"]', '20'); await page.waitForTimeout(100);
  r = await row('Internet');
  check(r && r[1] === '130.00', `bill-splitter: tax and tip add up (${r})`);
  await page.fill(R + '[data-k="tip"]', '');
  await page.selectOption(R + '.bs-payer[data-i="1"]', { label: 'Sam' }); await page.waitForTimeout(100);
  check(/Alex pays Sam 27\.50/.test(await page.textContent('.bs-settle')), 'bill-splitter: settle-up says Alex pays Sam 27.50 ' + await page.textContent('.bs-settle'));
  await page.selectOption(R + '.bs-payer[data-i="0"]', { label: 'Alex' }); await page.waitForTimeout(100);
  check(/Sam pays Alex 1,292\.50/.test(await page.textContent('.bs-settle')), 'bill-splitter: two payers net out into one payment ' + await page.textContent('.bs-settle'));
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click(R + '.bs-csv')]);
  check(dl.suggestedFilename().endsWith('.csv'), 'bill-splitter: CSV downloads');
  // friendly messages: negative, blank
  await page.fill(R + '.bs-b:nth-child(2) [data-f="amount"]', '-5'); await page.waitForTimeout(100);
  check(/negative/.test(await page.textContent('.bs-note')) && !/NaN/.test(await page.textContent('.bs-table')), 'bill-splitter: a negative amount is counted as zero with a note');
  await page.fill(R + '.bs-b:nth-child(1) [data-f="amount"]', ''); await page.fill(R + '.bs-b:nth-child(2) [data-f="amount"]', ''); await page.waitForTimeout(100);
  check(/Type an amount/.test(await page.textContent('.bs-answer')) && !/NaN/.test(await page.textContent('.bs-table')), 'bill-splitter: blank amounts get a friendly message');
};
