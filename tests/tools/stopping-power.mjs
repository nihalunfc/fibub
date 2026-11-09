// #948 Bethe-Bloch stopping power and range calculator
export const path = '/science/stopping-power/';
export default async ({ page, check, OUT, BASE, readFileSync }) => {
  await page.goto(`${BASE}/science/stopping-power/`); await page.waitForTimeout(800);
  const big = () => page.textContent('.stp .st-big'), facts = () => page.textContent('.stp .st-facts'), wait = () => page.waitForTimeout(400);
  check((await big()) === 'Range 7.711 cm of water (7.711 g/cm²)', '100 MeV protons in water: range');
  { const f = await facts(); check(f.includes('7.29 MeV cm²/g') && f.includes('0.729 keV/µm') && f.includes('β = 0.4282') && f.includes('229.2 keV') && await page.isHidden('.stp .st-warn'), 'stopping: stopping power, LET, β and Tmax'); }
  check(await page.isVisible('.stp .st-fig1') && await page.isVisible('.stp .st-fig2'), 'stopping: both charts');
  await page.fill('.stp .st-x', '5'); await wait();
  check((await facts()).includes('55.82 MeV') && (await facts()).includes('11.42'), 'stopping: energy left after 5 cm');
  await page.selectOption('.stp .st-xu', 'mm'); await page.fill('.stp .st-x', '80'); await wait();
  check((await facts()).includes('stops inside'), 'stopping: stops inside 80 mm');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.stp .st-csv')]); const f = OUT + 'range.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 62 && r[0].startsWith('kinetic energy (MeV),') && r[61].startsWith('100,'), 'stopping: range-energy CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.stp .st-bcsv')]); const f = OUT + 'bragg.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 302 && r[0] === 'depth (cm),mean energy loss with straggling (MeV/cm)', 'stopping: Bragg curve CSV (straggled)'); }
  await page.selectOption('.stp .st-bs', '0'); await wait();
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.stp .st-bcsv')]); const f = OUT + 'bragg0.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 162 && r[1].startsWith('0,100,'), 'stopping: pristine Bragg curve CSV'); }
  for (const fmt of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.stp .dl [data-f=${fmt}]`)]); check(d.suggestedFilename() === `stopping-power.${fmt}`, `stopping: ${fmt} download`); }
  await page.fill('.stp .st-x', ''); await page.selectOption('.stp .st-p', 'alpha'); await page.fill('.stp .st-T', '5'); await page.selectOption('.stp .st-m', 'air'); await wait();
  check((await big()) === 'Range 3.017 cm of air (0.003635 g/cm²)' && await page.isVisible('.stp .st-warn'), 'stopping: 5 MeV alpha in air, low-energy warning');
  await page.selectOption('.stp .st-p', 'muon'); await page.fill('.stp .st-T', '1000'); await page.selectOption('.stp .st-m', 'lead'); await wait();
  check((await big()) === 'Range 70.39 cm of lead (798.9 g/cm²)', 'stopping: 1 GeV muon in lead');
  await page.selectOption('.stp .st-p', 'carbon'); await page.selectOption('.stp .st-Tu', 'u'); await page.fill('.stp .st-T', '250'); await page.selectOption('.stp .st-m', 'water'); await wait();
  check((await big()) === 'Range 12.7 cm of water (12.7 g/cm²)', 'stopping: 250 MeV/u carbon ions');
  await page.selectOption('.stp .st-p', 'custom'); await page.fill('.stp .st-z', '1'); await page.fill('.stp .st-mu', '1.00728'); await page.selectOption('.stp .st-Tu', 'tot'); await page.fill('.stp .st-T', '100'); await wait();
  check((await big()).startsWith('Range 7.71'), 'stopping: own ion (a proton by z and mass)');
  await page.fill('.stp .st-I', '5000'); await wait();
  check((await page.textContent('.stp .st-err')).includes('mean excitation energy') && await page.isHidden('.stp .st-out'), 'stopping: bad I message');
  await page.fill('.stp .st-I', '75'); await page.fill('.stp .st-z', '0'); await wait();
  check((await page.textContent('.stp .st-err')).includes('charge number'), 'stopping: bad charge message');
  await page.fill('.stp .st-z', '1'); await page.fill('.stp .st-T', 'abc'); await wait();
  check((await page.textContent('.stp .st-err')).includes('kinetic energy'), 'stopping: bad energy message');
};
