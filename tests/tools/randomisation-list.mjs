// #470 Randomisation list generator
export const path = '/science/randomisation-list/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/randomisation-list/`); await page.waitForTimeout(800);
  const big = () => page.textContent('.rl .rl-big'), err = () => page.textContent('.rl .rl-err');
  const arms = () => page.$$eval('.rl .rl-list tr', (rs) => rs.slice(1).map((r) => r.lastElementChild.textContent));
  check((await page.textContent('.rl .rl-med')).includes('not medical advice'), 'randomisation: medical notice near the top');
  check((await big()) === '160 allocations in 4 strata: 80 Treatment, 80 Control', `randomisation: example (${await big()})`);
  { const a = (await arms()).slice(0, 40).map((x) => x[0]).join(''); check(a === 'TCTTCCCTCTCTCTTCTCCTCTTTTCCCTCTCCTCCTTTC', 'randomisation: first stratum matches the Python reimplementation'); }
  check((await page.textContent('.rl .rl-sum')).includes('3. Site: Clinic 2, Age: under 65202071') && (await page.textContent('.rl .rl-sum')).includes('8*'), 'randomisation: balance table per stratum');
  check((await page.textContent('.rl .rl-list tr:nth-child(2)')).startsWith('P001116Treatment'), 'randomisation: IDs with prefix and stratum');
  // Same seed again gives the same list; a new seed a different one.
  const before = (await arms()).join();
  await page.fill('.rl .rl-seed', 'other'); await page.waitForTimeout(400); const other = (await arms()).join();
  await page.fill('.rl .rl-seed', 'my-trial-2026'); await page.waitForTimeout(400);
  check((await arms()).join() === before && other !== before, 'randomisation: the seed reproduces the list');
  await page.locator('.rl .rl-new').scrollIntoViewIfNeeded(); await page.click('.rl .rl-new'); await page.waitForTimeout(200);
  check((await page.inputValue('.rl .rl-seed')) !== 'my-trial-2026' && (await arms()).join() !== before, 'randomisation: new random seed');
  await page.fill('.rl .rl-seed', 'my-trial-2026');
  await page.fill('.rl .rl-ratio', '2:1'); await page.fill('.rl .rl-bs', '6'); await page.selectOption('.rl .rl-method', 'blocks'); await page.fill('.rl .rl-strata', ''); await page.fill('.rl .rl-n', '60'); await page.waitForTimeout(400);
  check((await big()) === '60 allocations: 40 Treatment, 20 Control', `randomisation: 2:1 in fixed blocks of 6 (${await big()})`);
  { const t = await page.$$eval('.rl .rl-list tr', (rs) => rs.slice(1).map((r) => [...r.children].map((c) => c.textContent))); const ok = [...Array(10).keys()].every((b) => t.slice(6 * b, 6 * b + 6).filter((r) => r[3] === 'Treatment').length === 4 && t[6 * b][1] === String(b + 1) && t[6 * b][2] === '6'); check(ok, 'randomisation: every block of 6 holds 4 and 2'); }
  await page.fill('.rl .rl-bs', '4'); await page.waitForTimeout(400);
  check((await err()).includes('multiple of 3') && await page.isHidden('.rl .rl-out'), 'randomisation: block size not fitting the ratio is refused');
  await page.selectOption('.rl .rl-method', 'simple'); await page.waitForTimeout(300);
  check(await page.isHidden('.rl .rl-bsl') && (await big()).startsWith('60 allocations:') && (await page.textContent('.rl .rl-list tr')).trim() === 'IDArm', 'randomisation: simple randomisation hides block sizes');
  await page.fill('.rl .rl-arms', 'A, B, C'); await page.fill('.rl .rl-ratio', '1:1:1'); await page.selectOption('.rl .rl-method', 'random-blocks'); await page.fill('.rl .rl-bs', '3, 6, 9'); await page.fill('.rl .rl-n', '300'); await page.waitForTimeout(400);
  check((await page.textContent('.rl .rl-shown')).includes('first 200 of 300'), 'randomisation: long lists show the first 200');
  await page.locator('.rl .rl-show').scrollIntoViewIfNeeded(); await page.click('.rl .rl-show'); await page.waitForTimeout(200);
  check((await arms()).every((a) => a === '•••') && (await page.textContent('.rl .rl-shown')).includes('Arms hidden'), 'randomisation: arms can be hidden on screen');
  await page.locator('.rl .rl-csv').scrollIntoViewIfNeeded();
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.rl .rl-csv')]); const f = OUT + 'rl.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8').trim().split('\n'); const c = { A: 0, B: 0, C: 0 }; t.slice(1).forEach((l) => c[l.split(',').pop()]++); check(t.length === 301 && t[0] === 'id,stratum,number_in_stratum,block,block_size,arm' && c.A === 100 && c.B === 100 && c.C === 100, 'randomisation: CSV holds the whole list, balanced'); }
  await page.fill('.rl .rl-n', '5'); await page.fill('.rl .rl-strata', 'Sex: F, M'); await page.waitForTimeout(400);
  await page.evaluate(() => { window.print = () => { window.__printed = true; }; });
  await page.click('.rl .rl-print'); await page.waitForTimeout(200);
  { const n = await page.$$eval('.rl-printout .rl-env', (e) => e.length); const t = await page.textContent('.rl-printout'); check(n === 10 && t.includes('Envelope P001') && t.includes('Stratum: Sex: F') && await page.evaluate(() => window.__printed === true), `randomisation: sealed envelopes (${n})`); }
  await page.locator('.rl .dl button[data-f=docx]').scrollIntoViewIfNeeded();
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.rl .dl button[data-f=docx]')]); const f = OUT + 'rl.docx'; await d.saveAs(f); check(readFileSync(f).subarray(0, 2).toString() === 'PK', 'randomisation: Word report'); }
  await page.fill('.rl .rl-strata', 'Sex: F'); await page.waitForTimeout(400);
  check((await err()).includes('at least two levels'), 'randomisation: one-level stratum message');
  await page.fill('.rl .rl-strata', ''); await page.fill('.rl .rl-arms', 'Only'); await page.fill('.rl .rl-ratio', ''); await page.waitForTimeout(400);
  check((await err()).includes('at least two arms'), 'randomisation: one arm message');
  await page.fill('.rl .rl-arms', 'A, B'); await page.fill('.rl .rl-ratio', '2:1:1'); await page.waitForTimeout(400);
  check((await err()).includes('3 parts'), 'randomisation: ratio parts message');
  await page.fill('.rl .rl-ratio', '1:1'); await page.fill('.rl .rl-bs', '4'); await page.fill('.rl .rl-seed', ''); await page.waitForTimeout(400);
  check((await err()).includes('Type a seed'), 'randomisation: empty seed message');
};
