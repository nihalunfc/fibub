// #493 herd immunity threshold calculator
export const path = '/science/herd-immunity/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/herd-immunity/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.hit .hi-big'), facts = () => page.textContent('.hit .hi-facts'), tab = () => page.textContent('.hit .hi-tab');
  const set = async (sel, v) => { await page.fill(`.hit ${sel}`, v); await page.waitForTimeout(450); };
  check((await page.textContent('.hit .hi-warn')).includes('For study and teaching, not medical advice. Check with a qualified professional.'), 'herd: medical line shown');
  check((await big()) === 'Herd immunity threshold 66.7 %; vaccinate 74.1 %', `herd: example (${await big()})`);
  { const f = await facts(); check(f.includes('Effective R at your coverage0.84') && f.includes('72 %') && f.includes('3.57'), 'herd: effective R, immune share, highest R0'); }
  { const t = await tab(); check(t.includes('Example C') && t.includes('92.6 %') && t.includes('1.68 ▲') && t.includes('102 % ✗') && t.includes('0.42') && (await page.$$('.hit .hi-tab tbody tr')).length === 5 && (await page.$$('.hit .hi-tab tr.dim')).length === 2, 'herd: example table'); }
  check(await page.isVisible('.hit .hi-fig') && (await page.getAttribute('.hit .hi-fig', 'aria-label')).includes('up to 20'), 'herd: chart');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.hit .hi-csv')]); const f = OUT + 'herd.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(rows.length === 6 && rows[0].startsWith('name,R0,threshold_percent') && rows[2] === 'Example B,3,66.6667,74.0741,yes,0.84,90,80' && rows[4].includes(',no,'), `herd: CSV (${rows[2]})`); }
  for (const f of ['png', 'pdf', 'docx']) {
    await page.locator(`.hit .dl [data-f=${f}]`).scrollIntoViewIfNeeded();
    const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.hit .dl [data-f=${f}]`)]);
    check(d.suggestedFilename() === `herd-immunity.${f}`, `herd: ${f} report download`);
  }
  // Effectiveness and coverage options.
  await set('.hi-e', '60');
  check((await big()) === 'Herd immunity threshold 66.7 %; vaccinate over 100 %' && (await facts()).includes('not reachable'), `herd: weak vaccine cannot reach it (${await big()})`);
  await set('.hi-e', '100'); await set('.hi-c', '70');
  check((await big()).endsWith('vaccinate 66.7 %') && (await facts()).includes('0.9'), 'herd: perfect vaccine needs exactly the threshold');
  await set('.hi-r0', '0.8');
  check((await big()).includes('not above 1'), 'herd: R0 below 1');
  await set('.hi-r0', '3');
  // Own rows, wider chart.
  await set('.hi-rows', 'Mine 25\n4');
  check((await tab()).includes('Mine') && (await tab()).includes('Row 2') && (await page.getAttribute('.hit .hi-fig', 'aria-label')).includes('up to 25'), 'herd: own rows');
  // Bad inputs.
  await set('.hi-rows', 'Bad, -2');
  check(await page.isVisible('.hit .hi-rerr') && (await page.textContent('.hit .hi-rerr')).includes('above 0'), 'herd: bad row message');
  await set('.hi-e', '0');
  check(await page.isVisible('.hit .hi-err') && await page.isHidden('.hit .hi-out'), 'herd: zero effectiveness message');
  await set('.hi-e', '90'); await set('.hi-c', '120');
  check((await page.textContent('.hit .hi-err')).includes('Coverage'), 'herd: coverage over 100 % message');
  await set('.hi-c', '80');
  check(await page.isHidden('.hit .hi-err') && await page.isVisible('.hit .hi-out'), 'herd: recovers after a fix');
};
