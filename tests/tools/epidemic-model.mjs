// #462 epidemic model simulator
export const path = '/science/epidemic-model/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/epidemic-model/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.epm .em-big'), facts = () => page.textContent('.epm .em-facts');
  const set = async (sel, v) => { await page.fill(`.epm ${sel}`, v); await page.waitForTimeout(450); };
  check((await page.textContent('.epm .em-warn')).includes('For study and teaching, not medical advice. Check with a qualified professional.'), 'epidemic: medical line shown');
  check((await big()) === 'Peak: 14,386 infectious (14.4 %) on day 63.9', `epidemic: example SEIR peak (${await big()})`);
  { const f = await facts(); check(f.includes('89.3 %') && f.includes('Final size (equation)89.3 %') && f.includes('60 %') && f.includes('R at the start2.5'), 'epidemic: example attack, final size, threshold'); }
  check(await page.isVisible('.epm .em-fig') && await page.isVisible('.epm .em-fig2') && await page.isVisible('.epm .em-lat') && await page.isHidden('.epm .em-imm'), 'epidemic: charts and SEIR fields');
  // Interventions.
  await set('.em-iv', '30, 60, 40');
  check((await big()) === 'Peak: 12,563 infectious (12.6 %) on day 84.1' && (await facts()).includes('88.1 %') && (await facts()).includes('without the interventions'), `epidemic: contact cut 30-60 (${await big()})`);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.epm .em-csv')]); const f = OUT + 'epi.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(d.suggestedFilename() === 'epidemic-seir.csv' && rows.length === 202 && rows[0].startsWith('day,susceptible,exposed,infectious') && rows[1].startsWith('0,99990,0,10,0,') && rows[31].endsWith(',40') && rows[61].endsWith(',0'), `epidemic: daily CSV (${rows[31]})`); }
  for (const [f, name] of [['png', 'png'], ['pdf', 'pdf'], ['docx', 'docx']]) {
    await page.locator(`.epm .dl [data-f=${f}]`).scrollIntoViewIfNeeded();
    const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.epm .dl [data-f=${f}]`)]);
    check(d.suggestedFilename().endsWith('.' + name), `epidemic: ${f} report download (${d.suggestedFilename()})`);
  }
  await set('.em-iv', '');
  // SIR.
  await page.selectOption('.epm .em-model', 'SIR'); await page.waitForTimeout(300);
  check((await big()) === 'Peak: 23,352 infectious (23.4 %) on day 32.1' && await page.isHidden('.epm .em-lat'), `epidemic: SIR (${await big()})`);
  // Per cent view.
  await page.selectOption('.epm .em-show', 'p'); await page.waitForTimeout(300);
  check((await page.getAttribute('.epm .em-fig', 'aria-label')).startsWith('SIR model'), 'epidemic: per cent view draws');
  await page.selectOption('.epm .em-show', 'n');
  // Vaccination above the threshold: no outbreak.
  await set('.em-vac', '65');
  check((await big()).startsWith('No outbreak') && (await big()).includes('0.875'), `epidemic: vaccinated above threshold (${await big()})`);
  await set('.em-vac', '0');
  // SEIRS.
  await page.selectOption('.epm .em-model', 'SEIRS'); await set('.em-days', '730'); await set('.em-r0', '3'); await set('.em-lat', '2'); await set('.em-inf', '4'); await set('.em-i0', '50'); await set('.em-n', '1000000'); await set('.em-vac', '5');
  check(await page.isVisible('.epm .em-imm') && (await big()) === 'Peak: 181,924 infectious (18.2 %) on day 43.8' && (await facts()).includes('3.11 per person') && !(await facts()).includes('Final size'), `epidemic: SEIRS with waning immunity (${await big()})`);
  // Short run: still rising.
  await set('.em-days', '20');
  check((await facts()).includes('still rising at the end'), 'epidemic: peak beyond the run');
  // Bad inputs.
  await set('.em-inf', '0');
  check(await page.isVisible('.epm .em-err') && (await page.textContent('.epm .em-err')).includes('infectious period') && await page.isHidden('.epm .em-out'), 'epidemic: infectious period message');
  await set('.em-inf', '4'); await set('.em-iv', '60, 30, 20');
  check((await page.textContent('.epm .em-err')).includes('end day must be after'), 'epidemic: bad intervention message');
  await set('.em-iv', ''); await set('.em-vac', '100');
  check((await page.textContent('.epm .em-err')).includes('vaccinated share'), 'epidemic: vaccinated 100 % message');
  await set('.em-vac', '0');
  check(await page.isHidden('.epm .em-err') && await page.isVisible('.epm .em-out'), 'epidemic: recovers after a fix');
};
