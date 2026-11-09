export const path = '/science/voting-systems/';
export default async ({ page, check, BASE, readFileSync }) => {
  await page.goto(BASE + path);
  const big = () => page.textContent('.vs-big');
  const tabs = () => page.textContent('.vs-tabs');
  check(/5 different winners|4 different winners/.test(await big()), `voting: example winners differ (${await big()})`);
  const w = await page.$$eval('.vs-tabs > div:first-of-type tbody tr', (rs) => rs.map((r) => r.cells[1].textContent));
  check(w.join() === 'Ash,Birch,Birch,Elm,Elm,Elm,Cedar,Birch, Elm', `voting: winners by method (${w.join()})`);
  const t = await tabs();
  check(/Instant-runoff rounds/.test(t) && /Run-off/.test(t) && /247/.test(t) && /Quota 34/.test(t), 'voting: IRV, run-off, Borda and STV tables shown');
  check(/7 ÷ 41|0\.17073/.test(t), 'voting: STV transfer value shown');
  // Seats and approval options.
  await page.fill('.vs-seats', '3'); await page.waitForTimeout(400);
  check(/3 seats/.test(await tabs()), 'voting: 3-seat STV');
  await page.fill('.vs-seats', '5'); await page.waitForTimeout(400);
  check(/fewer seats than candidates/.test(await page.textContent('.vs-note')), 'voting: too many seats explained');
  await page.fill('.vs-seats', '2');
  await page.fill('.vs-k', '1'); await page.waitForTimeout(400);
  check(/approves its first 1|approve their first 1|first 1\./.test(await tabs()), 'voting: approval k option');
  // CSV download.
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.vs-csv')]);
  const txt = readFileSync(await dl.path(), 'utf8');
  check(dl.suggestedFilename() === 'voting-results.csv' && /Instant-runoff rounds/.test(txt) && /Ash/.test(txt), 'voting: CSV download');
  const [pdf] = await Promise.all([page.waitForEvent('download'), page.click('.vs .dl button[data-f="pdf"]')]);
  check(pdf.suggestedFilename() === 'voting-results.pdf', 'voting: PDF download');
  // Bad input.
  await page.fill('.vs-ballots', '3: A > A'); await page.waitForTimeout(400);
  check(/ranks A twice/.test(await page.textContent('.vs-err')), 'voting: repeated name refused');
  await page.fill('.vs-ballots', 'Tennessee example\n42: Memphis > Nashville > Chattanooga > Knoxville\n26: Nashville > Chattanooga > Knoxville > Memphis\n15: Chattanooga > Knoxville > Nashville > Memphis\n17: Knoxville > Chattanooga > Nashville > Memphis');
  await page.waitForTimeout(400);
  check(/Line 1/.test(await page.textContent('.vs-err')) || /different winners/.test(await big()), 'voting: stray text line handled');
  await page.fill('.vs-ballots', '42: Memphis > Nashville > Chattanooga > Knoxville\n26: Nashville > Chattanooga > Knoxville > Memphis\n15: Chattanooga > Knoxville > Nashville > Memphis\n17: Knoxville > Chattanooga > Nashville > Memphis');
  await page.waitForTimeout(400);
  const w2 = await page.$$eval('.vs-tabs > div:first-of-type tbody tr', (rs) => rs.map((r) => r.cells[1].textContent));
  check(w2[0] === 'Memphis' && w2[2] === 'Knoxville' && w2[4] === 'Nashville', `voting: Tennessee example (${w2.join()})`);
  // Party lists.
  await page.click('.vs-mode button[data-m="list"]');
  await page.waitForTimeout(200);
  check(/D'Hondt: Green 5, Blue 4, Red 1/.test(await big()), `voting: D'Hondt example (${await big()})`);
  check(/Teal \(below threshold\)/.test(await tabs()) && /#10/.test(await tabs()), 'voting: threshold and quotient table');
  await page.selectOption('.vs-meth', 'hare'); await page.waitForTimeout(200);
  check(/Green 4, Blue 3, Red 2, Gold 1/.test(await big()) && /Hare quota 9660/.test(await tabs()), `voting: Hare example (${await big()})`);
  await page.selectOption('.vs-meth', 'droop'); await page.waitForTimeout(200);
  check(/Green 4, Blue 4, Red 2/.test(await big()), 'voting: Droop example');
  await page.selectOption('.vs-meth', 'sainte-lague'); await page.fill('.vs-thr', '0'); await page.waitForTimeout(400);
  check(/Sainte-Laguë: Green 4, Blue 3, Red 2, Gold 1/.test(await big()), `voting: Sainte-Laguë without threshold (${await big()})`);
  const [dl2] = await Promise.all([page.waitForEvent('download'), page.click('.vs-csv')]);
  check(dl2.suggestedFilename() === 'party-list-seats.csv', 'voting: party CSV');
  await page.fill('.vs-parties', 'Green lots'); await page.waitForTimeout(400);
  check(/party name, then its votes|at least two parties/.test(await page.textContent('.vs-err')), 'voting: bad party line refused');
};
