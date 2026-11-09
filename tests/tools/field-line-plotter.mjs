// #909 electric field line plotter
export const path = '/science/field-line-plotter/';
export default async ({ page, check, OUT, BASE, readFileSync }) => {
  await page.goto(`${BASE}/science/field-line-plotter/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.flp .fl-big'), facts = () => page.textContent('.flp .fl-facts'), ftab = () => page.textContent('.flp .fl-ftab');
  check((await big()) === 'E = 7.06 kV/m at 0°, V = 0 V', 'field lines: example dipole field on the bisector');
  check((await facts()).includes('7.06 µN') && (await facts()).includes('Net point charge0 nC'), 'field lines: test-charge force and net charge');
  check((await ftab()).includes('2.50 µN0°') && (await ftab()).includes('2.50 µN180°'), 'field lines: Coulomb forces between the pair');
  check((await page.textContent('.flp .fl-levels')).startsWith('Equipotentials at −1000') && await page.isVisible('.flp .fl-fig'), 'field lines: equipotential levels and picture');
  // Presets
  await page.selectOption('.flp .fl-pre', 'like'); await page.waitForTimeout(200);
  check((await big()).startsWith('E = 7.06 kV/m at 90°, V = 4') && (await ftab()).includes('2.50 µN180°'), `field lines: like charges push apart (${await big()})`);
  await page.selectOption('.flp .fl-pre', 'unequal'); await page.waitForTimeout(200);
  check((await facts()).includes('Net point charge1 nC') && (await ftab()).includes('4.99 µN'), 'field lines: unequal pair');
  await page.selectOption('.flp .fl-pre', 'quad'); await page.waitForTimeout(200);
  check((await page.$$('.flp .fl-src tr')).length === 5, 'field lines: quadrupole has four sources');
  await page.selectOption('.flp .fl-pre', 'lines'); await page.waitForTimeout(200);
  check((await ftab()).includes('/m') && (await ftab()).includes('Line charge'), 'field lines: force per metre on line charges');
  await page.selectOption('.flp .fl-pre', 'dip'); await page.waitForTimeout(200);
  check((await ftab()).includes('torque and force not shown'), 'field lines: dipole preset');
  // Typed values: one charge, field at the probe 3 cm away.
  await page.selectOption('.flp .fl-pre', 'pair'); await page.waitForTimeout(200);
  await page.click('.flp .fl-del[data-i="1"]'); await page.waitForTimeout(200);
  await page.fill('.flp .fl-x[data-i="0"]', '0'); await page.waitForTimeout(200);
  check((await big()) === 'E = 9.99 kV/m at 90°, V = 300 V', `field lines: single 1 nC charge 3 cm away (${await big()})`);
  // Add buttons
  await page.click('.flp .fl-add[data-k="line"]'); await page.click('.flp .fl-add[data-k="dipole"]'); await page.click('.flp .fl-add[data-q="-1"]'); await page.waitForTimeout(300);
  check((await page.$$('.flp .fl-src tr')).length === 5 && (await page.$$('.flp .fl-a')).length === 1, 'field lines: added a line charge, a dipole and a − charge');
  // Options
  await page.selectOption('.flp .fl-n', '8'); await page.uncheck('.flp .fl-showv'); await page.waitForTimeout(200);
  check((await page.textContent('.flp .fl-levels')) === '', 'field lines: equipotentials off');
  await page.uncheck('.flp .fl-showl'); await page.check('.flp .fl-showv'); await page.waitForTimeout(200);
  check((await page.textContent('.flp .fl-levels')).startsWith('Equipotentials'), 'field lines: field lines off, equipotentials on');
  // Drag and tap on the picture.
  await page.selectOption('.flp .fl-pre', 'pair'); await page.check('.flp .fl-showl'); await page.waitForTimeout(300);
  await page.locator('.flp .fl-fig').scrollIntoViewIfNeeded();
  { const bb = await page.locator('.flp .fl-fig').boundingBox(), P = (x, y) => [bb.x + (x / 380) * bb.width, bb.y + (y / 320) * bb.height];
    const X = (cm) => 34 + ((cm + 10) / 20) * 338, hh = (10 * 288) / 338, Y = (cm) => 8 + 288 - ((cm + hh) / (2 * hh)) * 288;
    const [ax, ay] = P(X(-3), Y(0)), [bx, by] = P(X(-3), Y(-3));
    await page.mouse.move(ax, ay); await page.mouse.down(); await page.mouse.move((ax + bx) / 2, (ay + by) / 2, { steps: 3 }); await page.mouse.move(bx, by, { steps: 3 }); await page.mouse.up(); await page.waitForTimeout(300);
    const y = +(await page.inputValue('.flp .fl-y[data-i="0"]'));
    check(Math.abs(y + 3) < 0.3 && Math.abs(+(await page.inputValue('.flp .fl-x[data-i="0"]')) + 3) < 0.3, `field lines: dragged the + charge (y ${y})`);
    const [cx, cy] = P(X(0), Y(0)); await page.mouse.click(cx, cy); await page.waitForTimeout(300);
    check(/^Probe position\(−?0(\.\d)?, −?0(\.\d)?\) cm/.test(await facts()), `field lines: tap moves the probe (${(await facts()).slice(0, 30)})`); }
  // Downloads
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.flp .fl-csv')]); const f = OUT + 'flgrid.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 1682 && r[0] === 'x_cm,y_cm,V_volt,Ex_V_per_m,Ey_V_per_m', 'field lines: field grid CSV'); }
  for (const t of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.flp .dl [data-f=${t}]`)]); check(d.suggestedFilename() === `field-lines.${t}`, `field lines: ${t} report`); }
  // Bad input
  await page.fill('.flp .fl-w', '0'); await page.waitForTimeout(200);
  check((await page.textContent('.flp .fl-err')).includes('half-width') && await page.isHidden('.flp .fl-out'), 'field lines: bad view size message');
  await page.fill('.flp .fl-w', '10'); await page.fill('.flp .fl-q[data-i="0"]', 'abc'); await page.waitForTimeout(200);
  check((await page.textContent('.flp .fl-err')).includes('Source 1'), 'field lines: bad charge message');
  await page.fill('.flp .fl-q[data-i="0"]', '0'); await page.fill('.flp .fl-q[data-i="1"]', '0'); await page.waitForTimeout(200);
  check((await page.textContent('.flp .fl-err')).includes('zero charge'), 'field lines: all-zero message');
  await page.click('.flp .fl-del[data-i="1"]'); await page.click('.flp .fl-del[data-i="0"]'); await page.waitForTimeout(200);
  check((await page.textContent('.flp .fl-err')).includes('Add at least one'), 'field lines: no sources message');
};
