// #947 relativistic kinematics calculator
export const path = '/science/relativistic-kinematics/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/science/relativistic-kinematics/`); await page.waitForTimeout(600);
  const t = (c) => page.textContent(`.rkn ${c}`), wait = () => page.waitForTimeout(150);
  check((await t('.rk-big1')) === 'Invariant mass 66.435 GeV' && (await t('.rk-tab1')).includes('p* in rest frame'), 'rel: dimuon invariant mass and table');
  check((await t('.rk-big2')).includes('0.20514 GeV') && (await t('.rk-facts2')).includes('0.14496 to 0.97603 GeV') && (await t('.rk-facts2')).includes('46.52°') && await page.isVisible('.rkn .rk-fig'), 'rel: K+ → π+ π0, lab range, largest angle and chart');
  check((await t('.rk-big3')) === 'In the new frame: E = 1.006 GeV, p = (0, 0, 0.363) GeV' && (await t('.rk-facts3')).includes('0.93827'), 'rel: boost of a proton, mass unchanged');
  check((await t('.rk-big4')) === 'Threshold beam kinetic energy 5.6296 GeV' && (await t('.rk-facts4')).includes('0.93827 GeV each'), 'rel: antiproton threshold and collider');
  for (const fmt of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.rkn .dl [data-f=${fmt}]`)]); check(d.suggestedFilename() === `relativistic-kinematics.${fmt}`, `rel: ${fmt} download`); }
  await page.selectOption('.rkn .rk-u', '1'); await page.fill('.rkn .rk-ta', 'gamma'); await page.fill('.rkn .rk-tp', 'p pi0'); await page.fill('.rkn .rk-P', '0'); await wait();
  check((await t('.rk-big4')) === 'Threshold beam kinetic energy 144.69 MeV' && !(await t('.rk-facts4')).includes('Colliding'), 'rel: MeV, π0 photoproduction threshold');
  check((await t('.rk-big2')).includes('205.14 MeV') && (await t('.rk-facts2')).includes('any direction'), 'rel: kaon decay at rest in MeV');
  await page.fill('.rkn .rk-parts', '0 50 0 0\n0 -40 69.282 0'); await wait();
  check((await t('.rk-big1')) === 'Invariant mass 109.54 MeV', 'rel: two photons');
  await page.fill('.rkn .rk-tp', 'p'); await page.fill('.rkn .rk-ta', 'pi+'); await wait();
  check((await t('.rk-big4')).startsWith('No threshold'), 'rel: exothermic reaction, no threshold');
  await page.fill('.rkn .rk-bz', '1.2'); await wait();
  check((await t('.rk-err3')).includes('below 1') && await page.isHidden('.rkn .rk-out3'), 'rel: faster than light message');
  await page.fill('.rkn .rk-M', 'pi+'); await page.fill('.rkn .rk-m1', 'K+'); await wait();
  check((await t('.rk-err2')).includes('not allowed'), 'rel: forbidden decay message');
  await page.fill('.rkn .rk-parts', 'banana 1 2 3'); await wait();
  check((await t('.rk-err1')).includes('Line 1'), 'rel: bad particle line message');
  await page.fill('.rkn .rk-tp', 'p + unobtainium'); await wait();
  check((await t('.rk-err4')).includes('List the products'), 'rel: bad product message');
};
