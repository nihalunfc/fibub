// #1124 Mendel's pea garden
export const path = '/learn/mendel-peas/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.mdp ';
  await page.goto(`${BASE}/learn/mendel-peas/?seed=42`); await page.waitForTimeout(600);
  const tap = async (sel) => { await page.locator(R + sel).first().scrollIntoViewIfNeeded(); await page.locator(R + sel).first().click(); await page.waitForTimeout(250); };
  const big = () => page.textContent(R + '.mdp-big');
  const counts = () => page.$$eval(R + '.mdp-tab tbody tr', (t) => t.map((r) => Number(r.cells[1].textContent)));
  check((await big()) === 'All 100 are tall' && (await page.textContent(R + '.mdp-say')).includes('Tt 1/1'), `mendel: pure tall × pure short gives all tall (${await big()})`);
  const drawn = await page.$eval(R + '.mdp-fig', (c) => c.width > 0 && c.toDataURL().length);
  check(drawn > 3000, 'mendel: garden drawn');
  // F1 × F1
  await tap('.mdp-qk[data-q="1"]');
  { const b = await big(), c = await counts(); check(b.startsWith('Expected 3 : 1; you got ') && c.length === 2 && c[0] + c[1] === 100 && c[0] > 55 && c[0] < 92, `mendel: F2 3:1 (${b})`); }
  check((await page.textContent(R + '.mdp-tab')).includes('3/4') && (await page.textContent(R + '.mdp-tab')).includes('75.0'), 'mendel: expected chance and count');
  { const sq = await page.$$eval(R + '.mdp-sq td b', (t) => t.map((x) => x.textContent).join()); check(sq === 'TT,Tt,Tt,tt', `mendel: Punnett square (${sq})`); }
  check(await page.isHidden(R + '.mdp-chi'), 'mendel: no chi-square at Class 10');
  // 1000 children
  await tap('.mdp-n button[data-v="1000"]');
  { const c = await counts(); check(c[0] + c[1] === 1000 && Math.abs(c[0] / 1000 - 0.75) < 0.05 && (await page.textContent(R + '.mdp-shown')).includes('first 100 of 1000'), `mendel: 1000 children (${c})`); }
  // Test cross
  await tap('.mdp-qk[data-q="2"]');
  check((await big()).startsWith('Expected 1 : 1'), 'mendel: test cross 1:1');
  // Own parents via the selects
  await page.selectOption(R + '.mdp-g00', 'tt'); await page.waitForTimeout(250);
  check((await big()) === 'All 1000 are short', 'mendel: tt × tt all short');
  // Dihybrid
  await tap('.mdp-mode button[data-v=di]');
  check((await big()) === 'All 1000 are round, yellow', 'mendel: dihybrid P cross');
  await tap('.mdp-qk[data-q="1"]');
  { const b = await big(), c = await counts(); check(b.startsWith('Expected 9 : 3 : 3 : 1') && c.length === 4 && c.reduce((s, x) => s + x, 0) === 1000, `mendel: 9:3:3:1 (${b})`); }
  check((await page.$$eval(R + '.mdp-sq td', (t) => t.length)) === 16, 'mendel: 4 × 4 Punnett square');
  check(await page.isHidden(R + '.mdp-mode button[data-v=flower]'), 'mendel: snapdragon hidden at Class 10');
  // Class 12
  await tap('.mdp-level button[data-v="12"]');
  check(await page.isVisible(R + '.mdp-chi') && /χ² = Σ \(O − E\)² ÷ E = \(\d+ − 562\.5\)² ÷ 562\.5/.test(await page.textContent(R + '.mdp-formula')) && (await page.textContent(R + '.mdp-facts')).includes('3 (classes − 1)'), 'mendel: chi-square with numbers');
  check(/p = 0\.\d{3} is 0\.05 or more|p is below 0\.05/.test(await page.textContent(R + '.mdp-verdict')), 'mendel: chi-square verdict');
  await tap('.mdp-mode button[data-v=flower]'); await tap('.mdp-qk[data-q="1"]');
  check((await big()).startsWith('Expected 1 : 2 : 1') && (await page.textContent(R + '.mdp-tab')).includes('pink'), 'mendel: incomplete dominance 1:2:1');
  await tap('.mdp-mode button[data-v=blood]');
  check((await big()).startsWith('Expected 1 : 1 : 1 : 1') && (await page.textContent(R + '.mdp-tab')).includes('AB'), 'mendel: ABO codominance');
  await tap('.mdp-mode button[data-v=di]'); await tap('.mdp-qk[data-q="1"]'); await tap('.mdp-n button[data-v="20"]');
  check((await page.textContent(R + '.mdp-verdict')).includes('below 5'), 'mendel: small-count warning');
  await tap('.mdp-mode button[data-v=blood]');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.mdp-csv')]); const f = OUT + 'mendel.csv'; await d.saveAs(f); const l = readFileSync(f, 'utf8').trim().split('\n');
    check(l[0] === 'phenotype,counted,expected_chance,expected_count' && l.some((x) => x.startsWith('chi_square,')) && l.some((x) => x === 'degrees_of_freedom,3'), 'mendel: CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=png]')]); const f = OUT + 'mendel.png'; await d.saveAs(f); check(readFileSync(f).subarray(1, 4).toString() === 'PNG', 'mendel: image report'); }
  // Back to Class 10 hides Class 12 crosses
  await tap('.mdp-level button[data-v="10"]');
  check(await page.isHidden(R + '.mdp-mode button[data-v=blood]') && (await page.getAttribute(R + '.mdp-mode button[data-v=mono]', 'aria-pressed')) === 'true', 'mendel: Class 10 returns to height');
  // Check yourself
  for (const lv of ['12', '10']) {
    await tap(`.mdp-level button[data-v="${lv}"]`);
    const n = await page.$$eval(R + '.mdp-qs li', (l) => l.length);
    await tap('.mdp-check');
    check((await page.textContent(R + '.mdp-score')) === `0 of ${n} right.`, `mendel: Class ${lv} blanks wrong`);
    await page.$$eval(R + '.mdp-qs li', (lis) => lis.forEach((li) => { li.querySelector('.mdp-ans').value = li.dataset.a; }));
    await tap('.mdp-check');
    check((await page.textContent(R + '.mdp-score')) === `${n} of ${n} right.` && n === (lv === '12' ? 5 : 4), `mendel: Class ${lv} quiz (${n})`);
  }
};
