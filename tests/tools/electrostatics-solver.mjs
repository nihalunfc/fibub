// #915 2D electrostatics solver
export const path = '/science/electrostatics-solver/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/electrostatics-solver/`); await page.waitForTimeout(1200);
  const t = (c) => page.textContent('.esv ' + c), wait = () => page.waitForTimeout(900);
  check((await t('.es-big')) === 'C = 39.19 pF per metre', 'electrostatics: coax example capacitance');
  { const f = await t('.es-facts'); check(f.includes('Probe at (2.50, 0) cm32.58 V') && f.includes('2.82 kV/m at 0°') && f.includes('194.3 nJ per metre'), 'electrostatics: probe and energy'); }
  check((await t('.es-tab')).includes('100 V3.919 nC/m') && (await t('.es-tab')).includes('−3.919 nC/m') && (await t('.es-levels')).startsWith('Equipotentials every 10 V'), 'electrostatics: balanced charges and levels');
  await page.selectOption('.esv .es-n', '161'); await wait();
  const fine = await t('.es-big'); const cf = parseFloat(fine.slice(4));
  check(cf > 39.19 && cf < 40.13, `electrostatics: finer grid closer to 40.13 pF/m (${fine})`);
  await page.selectOption('.esv .es-n', '81'); await wait();
  check(parseFloat((await t('.es-big')).slice(4)) < 39.19, 'electrostatics: coarse grid');
  await page.selectOption('.esv .es-n', '121');
  await page.selectOption('.esv .es-pre', 'plates'); await wait();
  check((await t('.es-big')) === 'C = 37.14 pF per metre' && (await t('.es-facts')).includes('almost no charge'), 'electrostatics: parallel plates with fringing');
  await page.selectOption('.esv .es-pre', 'twin'); await wait();
  check((await t('.es-big')) === 'C = 15.07 pF per metre', 'electrostatics: twin wires');
  await page.selectOption('.esv .es-bnd', 'open'); await wait();
  check((await t('.es-big')).startsWith('C = ') && (await t('.es-big')) !== 'C = 15.07 pF per metre', `electrostatics: open edges (${await t('.es-big')})`);
  await page.selectOption('.esv .es-pre', 'plane'); await wait();
  check((await t('.es-big')) === 'C = 28.37 pF per metre', 'electrostatics: wire above a plane');
  await page.selectOption('.esv .es-pre', 'box'); await wait();
  check((await t('.es-big')) === 'C = 49.96 pF per metre', 'electrostatics: bar in a grounded box');
  await page.fill('.esv .es-shapes', 'rect -1.5 -1.5 1.5 1.5 100\ncircle 3 3 0.5 50'); await wait();
  check((await t('.es-big')) === '3 voltages: see the charge on each electrode' && (await page.$$('.esv .es-tab tr')).length === 4, 'electrostatics: three voltages');
  // Draw your own.
  await page.selectOption('.esv .es-pre', 'empty'); await wait();
  check((await t('.es-err')).includes('no electrodes yet') && await page.isHidden('.esv .es-out'), 'electrostatics: empty box message');
  await page.click('.esv .es-mode [data-m=draw]');
  // The picture is hidden while there is nothing to show, so paint with the shapes box first, then draw.
  await page.fill('.esv .es-shapes', 'line -4 -4 4 -4 0'); await page.selectOption('.esv .es-bnd', 'open'); await wait();
  check((await t('.es-err')).includes('same voltage'), 'electrostatics: one voltage only message');
  await page.selectOption('.esv .es-bnd', 'ground'); await page.fill('.esv .es-shapes', 'line -4 -4 4 -4 -20'); await wait();
  await page.locator('.esv .es-fig').scrollIntoViewIfNeeded();
  { let bb; const at = async () => { await page.locator('.esv .es-fig').scrollIntoViewIfNeeded(); bb = await page.locator('.esv .es-fig').boundingBox(); };
    const P = (cx, cy) => [bb.x + ((34 + (cx / 10 + 0.5) * 338) / 380) * bb.width, bb.y + ((8 + (0.5 - cy / 10) * 338) / 370) * bb.height];
    await at(); const [ax, ay] = P(-2, 1), [bx, by] = P(2, 1);
    await page.mouse.move(ax, ay); await page.mouse.down(); for (let k = 1; k <= 8; k++) await page.mouse.move(ax + ((bx - ax) * k) / 8, ay); await page.mouse.up(); await wait();
    check((await t('.es-tab')).includes('100 V') && (await t('.es-big')).includes('3 voltages'), 'electrostatics: drawn electrode at 100 V');
    await page.click('.esv .es-mode [data-m=erase]'); await page.fill('.esv .es-br', '3');
    await at(); await page.mouse.click(...P(0, 1)); await wait();
    check(!(await t('.es-tab')).includes('100 V'), 'electrostatics: erased the drawn electrode');
    await page.click('.esv .es-mode [data-m=probe]'); await at(); await page.mouse.click(...P(0, 0)); await page.waitForTimeout(300);
    check((await t('.es-facts')).startsWith('Probe at (0, 0) cm') || /^Probe at \(−?0\.0\d, −?0\.0\d\) cm/.test(await t('.es-facts')), `electrostatics: probe tap (${(await t('.es-facts')).slice(0, 30)})`); }
  await page.click('.esv .es-clear'); await wait();
  check((await t('.es-big')).startsWith('C = ') && !(await t('.es-tab')).includes('100 V') && (await t('.es-tab')).includes('−20 V'), 'electrostatics: clear drawing keeps typed shapes');
  await page.selectOption('.esv .es-pre', 'coax'); await wait();
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.esv .es-csv')]); const f = OUT + 'es.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 121 * 121 + 1 && r[0] === 'x_cm,y_cm,V_volt,Ex_V_per_m,Ey_V_per_m,electrode', 'electrostatics: grid CSV'); }
  for (const x of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.esv .dl [data-f=${x}]`)]); check(d.suggestedFilename() === `electrostatics.${x}`, `electrostatics: ${x} report`); }
  await page.fill('.esv .es-shapes', 'blob 1 2 3'); await wait();
  check((await t('.es-err')).includes('Shapes, line 1: start with'), 'electrostatics: bad shape message');
  await page.fill('.esv .es-shapes', 'circle 0 0 -1 100'); await wait();
  check((await t('.es-err')).includes('radius'), 'electrostatics: bad radius message');
  await page.fill('.esv .es-shapes', 'rect 1 2 3 100'); await wait();
  check((await t('.es-err')).includes('rect needs 5 numbers'), 'electrostatics: missing number message');
  await page.fill('.esv .es-shapes', 'circle 0 0 1 100'); await page.fill('.esv .es-L', '0'); await wait();
  check((await t('.es-err')).includes('box size'), 'electrostatics: bad box size message');
};
