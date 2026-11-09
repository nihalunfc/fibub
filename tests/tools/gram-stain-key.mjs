// #197 Gram stain and biochemical test key
export const path = '/science/gram-stain-key/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/gram-stain-key/`); await page.waitForTimeout(500);
  const big = () => page.textContent('.gsk .gk-big');
  check((await page.textContent('.gsk .gk-warn')).includes('For teaching only') && (await page.textContent('.gsk .gk-sum')) === '19 groups and 15 tests read.', 'gram key: teaching warning and example key loaded');
  check((await big()) === '19 groups still possible' && (await page.textContent('.gsk .gk-qt')) === 'Next test: Gram stain' && (await page.textContent('.gsk .gk-split')).includes('Positive leaves 10, negative leaves 9'), 'gram key: first question is the Gram stain');
  // E. coli path from the guide: 9, 8, 6, 3, 2, 1.
  const want = [['no', 'Shape', 9], ['no', 'Oxidase', 8], ['no', 'Lactose (MacConkey)', 6], ['yes', 'Motility', 3], ['yes', 'Indole', 2], ['yes', null, 1]];
  let ok = true;
  for (const [b, nextT, left] of want) {
    await page.click(`.gsk .gk-${b}`); await page.waitForTimeout(50);
    const b2 = await big(), qt = await page.textContent('.gsk .gk-qt');
    if (left > 1 ? b2 !== `${left} groups still possible` || qt !== `Next test: ${nextT}` : b2 !== 'Matches: Escherichia coli') { ok = false; console.log('  at', b, nextT, b2, qt); }
  }
  check(ok, 'gram key: worked example path to E. coli (9, 8, 6, 3, 2, 1 left)');
  { const p = await page.textContent('.gsk .gk-path'); const c = await page.textContent('.gsk .gk-cands'); check(p.includes('Gram stain: Gram-negative (pink) (9 left)') && p.includes('Indole: Red ring (1 left)') && c.includes('Neisseriaruled out by Shape') && c.includes('Staphylococcus aureusruled out by Gram stain') && await page.isHidden('.gsk .gk-ans'), 'gram key: path, ruled-out groups and no more questions'); }
  await page.click('.gsk .gk-back'); await page.waitForTimeout(50);
  check((await big()) === '2 groups still possible', 'gram key: back one step');
  await page.click('.gsk .gk-skip'); await page.waitForTimeout(50);
  check((await page.textContent('.gsk .gk-path')).includes('Indole: not done (skipped)') && (await page.textContent('.gsk .gk-qt')) === 'Next test: Citrate', 'gram key: skip a test, the next one is asked');
  await page.selectOption('.gsk .gk-other', { label: 'Urease' }); await page.waitForTimeout(50);
  check((await page.textContent('.gsk .gk-qt')) === 'Next test: Urease' && (await page.textContent('.gsk .gk-split')).includes('Positive leaves 0'), 'gram key: answer another test');
  await page.click('.gsk .gk-yes'); await page.waitForTimeout(50);
  check((await big()) === 'No group in this key fits these answers', 'gram key: answers no group fits');
  await page.click('.gsk .gk-back'); await page.click('.gsk .gk-to-table'); await page.waitForTimeout(100);
  check(await page.isVisible('.gsk .gk-table') && (await page.textContent('.gsk .gk-rbig')).startsWith('2 groups fit equally'), 'gram key: answers copied to the results table');
  await page.click('.gsk .gk-view button[data-v=step]'); await page.click('.gsk .gk-reset'); await page.waitForTimeout(50);
  check((await big()) === '19 groups still possible' && await page.isHidden('.gsk .gk-path li'), 'gram key: start again');
  await page.selectOption('.gsk .gk-mode', 'best'); await page.click('.gsk .gk-yes'); await page.waitForTimeout(50);
  check((await page.textContent('.gsk .gk-qt')) === 'Next test: Catalase', 'gram key: fewest steps asks catalase after Gram-positive');
  await page.selectOption('.gsk .gk-mode', 'order');

  // Results table
  await page.click('.gsk .gk-view button[data-v=table]'); await page.click('.gsk .gk-rclear'); await page.click('.gsk .gk-rex'); await page.waitForTimeout(100);
  check((await page.textContent('.gsk .gk-rbig')) === 'Best fit: Salmonella (7 of 7 results agree)', 'gram key: example results, best fit Salmonella');
  { const t = await page.textContent('.gsk .gk-rank tr:nth-child(3)'); check(t.includes('Proteus') && t.includes('85.7 %') && t.includes('Urease'), 'gram key: Proteus second with the urease conflict'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.gsk .gk-rcsv')]); const f = OUT + 'gsk-rank.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 20 && r[0].startsWith('rank,group,fit_percent') && r[1] === '1,Salmonella,100.0,7,0,0,0,' && r[2].endsWith(',Urease'), 'gram key: ranking CSV'); }
  await page.selectOption('.gsk .gk-res select[data-t="13"]', '+'); await page.waitForTimeout(50);
  check((await page.textContent('.gsk .gk-rbig')) === 'Best fit: Proteus (7 of 7 results agree)', 'gram key: urease positive moves Proteus to the top');
  await page.selectOption('.gsk .gk-res select[data-t="0"]', '+'); await page.waitForTimeout(50);
  check((await page.textContent('.gsk .gk-rbig')) === '2 groups fit equally (3 of 3 results agree)' && (await page.textContent('.gsk .gk-rnote')).includes('Do more tests'), 'gram key: a Gram-positive result: tests not used for Bacillus and Listeria are left out');
  await page.selectOption('.gsk .gk-res select[data-t="10"]', '-'); await page.waitForTimeout(50);
  check((await page.textContent('.gsk .gk-rbig')) === 'Best fit: Corynebacterium (3 of 3 results agree)', 'gram key: Gram-positive non-motile rod fits Corynebacterium');
  await page.selectOption('.gsk .gk-res select[data-t="2"]', '-'); await page.selectOption('.gsk .gk-res select[data-t="4"]', '-'); await page.waitForTimeout(50);
  check((await page.textContent('.gsk .gk-rbig')).startsWith('No group fits every result. Closest: Streptococcus pyogenes (1 conflict)'), 'gram key: no perfect fit (catalase- and spore-negative rod)');

  // Printed key
  await page.click('.gsk .gk-view button[data-v=print]'); await page.waitForTimeout(50);
  check((await page.textContent('.gsk .gk-pnote')).startsWith('20 couplets') && (await page.textContent('.gsk .gk-lines li:first-child')) === '1a. Gram stain: Gram-positive (purple) ... go to 2', 'gram key: printed key in table order');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.gsk .gk-ptxt')]); const f = OUT + 'gsk.txt'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(t.includes('For teaching only') && t.includes('4a. Coagulase: Clots plasma ... Staphylococcus aureus') && t.trim().split('\n').length === 43, 'gram key: printed key text download'); }
  await page.selectOption('.gsk .gk-mode', 'best'); await page.waitForTimeout(50);
  check((await page.textContent('.gsk .gk-pnote')).startsWith('19 couplets'), 'gram key: printed key, fewest steps');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.gsk .dl button[data-f=pdf]')]); const f = OUT + 'gsk.pdf'; await d.saveAs(f); check(readFileSync(f).subarray(0, 4).toString() === '%PDF', 'gram key: PDF report'); }

  // Key downloads and loading your own key
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.gsk .gk-kcsv')]); const f = OUT + 'gsk-key.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8').trim().split('\n'); check(t.length === 22 && t[1].startsWith('+ means,Gram-positive (purple)') && t[3].startsWith('Staphylococcus aureus,+,+,+,,-,+,v'), 'gram key: key CSV download'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.gsk .gk-kjson')]); const f = OUT + 'gsk-key.json'; await d.saveAs(f); const j = JSON.parse(readFileSync(f, 'utf8')); check(j.tests.length === 15 && j.groups.length === 19 && j.groups[10].results.Indole === '+', 'gram key: key JSON download'); }
  writeFileSync(OUT + 'mykey.json', JSON.stringify({ name: 'Yeasts', tests: [{ name: 'Germ tube', yes: 'Tubes', no: 'None' }, { name: 'Urease' }], groups: [{ name: 'Alpha', results: { 'Germ tube': '+', Urease: '-' } }, { name: 'Beta', results: { 'Germ tube': '-', Urease: '+' } }, { name: 'Gamma', results: { 'Germ tube': '-', Urease: '-' } }] }));
  await page.setInputFiles('.gsk .gk-file', OUT + 'mykey.json'); await page.waitForTimeout(200);
  await page.click('.gsk .gk-view button[data-v=step]');
  check((await page.textContent('.gsk .gk-sum')) === '3 groups and 2 tests read.' && (await big()) === '3 groups still possible' && (await page.textContent('.gsk .gk-yes')) === '+ Tubes', 'gram key: own JSON key opened');
  await page.fill('.gsk .gk-in', 'Group;A;B\nX;+;-\nY;maybe;+\nZ;-;-'); await page.waitForTimeout(500);
  check((await page.textContent('.gsk .gk-err')).includes('"maybe" is not +, -, v or blank') && (await page.textContent('.gsk .gk-sum')) === '3 groups and 2 tests read.', 'gram key: typed semicolon key with a bad cell');
  await page.fill('.gsk .gk-in', 'Group,A\nX,+'); await page.waitForTimeout(500);
  check((await page.textContent('.gsk .gk-err')).includes('at least two groups') && await page.isHidden('.gsk .gk-out'), 'gram key: one group is refused');
  await page.click('.gsk .gk-ex'); await page.waitForTimeout(100);
  check((await page.textContent('.gsk .gk-sum')) === '19 groups and 15 tests read.' && await page.isHidden('.gsk .gk-err'), 'gram key: back to the example');
};
