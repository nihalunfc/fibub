// #946 gamma shielding calculator
export const path = '/science/gamma-shielding/';
export default async ({ page, check, OUT, BASE, readFileSync }) => {
  await page.goto(`${BASE}/science/gamma-shielding/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.gsh .gs-big'), facts = () => page.textContent('.gsh .gs-facts'), wait = () => page.waitForTimeout(200);
  check((await big()) === '2 cm of lead lets through 11.8 % of 0.662 MeV gamma rays', 'gamma: Cs-137 through 2 cm of lead');
  { const f = await facts(); check(f.includes('1.068 /cm') && f.includes('0.649 cm') && f.includes('2.16 cm') && f.includes('4.31 cm'), 'gamma: μ, HVL, TVL and thickness for 1 %'); }
  { const t = await page.textContent('.gsh .gs-tab'); check(t.includes('0.426') && t.includes('1.22') && t.includes('3.87') && t.includes('8.09'), 'gamma: all materials table'); }
  { const pill = await page.textContent('.gsh .gs-approx'), note = await page.textContent('.gsh .gs-note'), help = await page.textContent('.gsh .ax-card');
    check(pill.includes('approximate, computed from formulas') && /approximate formulas, not looked up/.test(note) && note.includes('NIST XCOM') && help.includes('not looked up in a table') && (await facts()).includes('% photoelectric (the approximate part)'), 'gamma: page says the built-in coefficients are an approximate computed model, and points to NIST XCOM'); }
  check(await page.isVisible('.gsh .gs-fig'), 'gamma: chart');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.gsh .gs-csv')]); const f = OUT + 'gamma.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 7 && r[0].startsWith('Material,') && r[1].startsWith('Lead,0.0941'), 'gamma: CSV table'); }
  for (const fmt of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.gsh .dl [data-f=${fmt}]`)]); check(d.suggestedFilename() === `gamma-shielding.${fmt}`, `gamma: ${fmt} download`); }
  await page.selectOption('.gsh .gs-b', 'linear'); await wait();
  { const f = await facts(); check((await big()).includes('37 %') && f.includes('6.22 cm'), 'gamma: simple buildup'); }
  await page.selectOption('.gsh .gs-b', 'berger'); await page.fill('.gsh .gs-ba', '1.2'); await page.fill('.gsh .gs-bb', '0.05'); await wait();
  check(await page.isVisible('.gsh .gs-ba') && (await facts()).includes('With buildup'), 'gamma: Berger buildup');
  await page.selectOption('.gsh .gs-b', 'none'); await page.selectOption('.gsh .gs-line', 'co60'); await page.selectOption('.gsh .gs-mat', 'concrete'); await wait();
  check((await facts()).includes('5.25 cm') && (await page.inputValue('.gsh .gs-mu')) === '0.0574' && (await facts()).includes('99.9 % Compton'), 'gamma: Co-60 in concrete, almost pure Compton');
  await page.selectOption('.gsh .gs-xu', '0.1'); await wait();
  check((await big()).startsWith('2 mm of concrete'), 'gamma: millimetres');
  await page.selectOption('.gsh .gs-line', 'custom'); await page.fill('.gsh .gs-e', '0.1'); await wait();
  check((await page.inputValue('.gsh .gs-mu')) === '0.153' && (await big()).includes('0.1 MeV'), 'gamma: own energy');
  await page.fill('.gsh .gs-mu', '0.2'); await page.fill('.gsh .gs-i0', '100'); await wait();
  { const f = await facts(); check(f.includes('Transmitted intensity') && f.includes('0.2 × 2.3') && !f.includes('% photoelectric') && (await page.textContent('.gsh .gs-approx')) === 'Using the μ/ρ you typed', 'gamma: own μ/ρ is used as typed, with no model note'); }
  await page.fill('.gsh .gs-e', '5'); await wait();
  check((await page.textContent('.gsh .gs-err')).includes('between 0.1 and 2 MeV') && await page.isHidden('.gsh .gs-out'), 'gamma: energy out of range message');
  await page.fill('.gsh .gs-e', '1'); await page.fill('.gsh .gs-want', '120'); await wait();
  check((await page.textContent('.gsh .gs-err')).includes('between 0 and 100 %'), 'gamma: bad wanted transmission message');
  await page.fill('.gsh .gs-want', '1'); await page.fill('.gsh .gs-x', '-1'); await wait();
  check((await page.textContent('.gsh .gs-err')).includes('thickness'), 'gamma: bad thickness message');
};
