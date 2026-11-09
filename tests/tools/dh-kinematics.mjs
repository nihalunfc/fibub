// #635 D-H forward kinematics
export const path = '/science/dh-kinematics/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/dh-kinematics/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.dhk .dh-big'), facts = () => page.textContent('.dhk .dh-facts');
  check((await big()) === 'x 0.5329, y 0.3076, z 1.0860 m', `dh: 6-axis example pose (${await big()})`);
  { const f = await facts(); check(f.includes('0.00°, -25.00°, -150.00°') && f.includes('0.2527, -0.2091, -0.0560, -0.9430') && f.includes('6 of 6'), 'dh: roll, pitch, yaw, quaternion and Jacobian rank'); }
  check((await page.locator('.dhk .dh-joints .dh-j').count()) === 6 && await page.isVisible('.dhk .dh-fig'), 'dh: six joint sliders and the 3D view');
  { const t = await page.textContent('.dhk .dh-end'); check(t.includes('-0.7849') && t.includes('1.0860'), 'dh: base to end transform table'); }
  // joint picker shows A_i
  await page.selectOption('.dhk .dh-pick', '1'); await page.waitForTimeout(100);
  check((await page.textContent('.dhk .dh-al')).startsWith('A2') && (await page.textContent('.dhk .dh-ai')).includes('0.4229'), 'dh: transform of joint 2');
  check((await page.locator('.dhk .dh-jac tr').count()) === 7, 'dh: Jacobian table 6 rows');
  // convert keeps the pose
  await page.click('.dhk .dh-swap'); await page.waitForTimeout(200);
  check((await page.inputValue('.dhk .dh-conv')) === 'modified' && (await big()) === 'x 0.5329, y 0.3076, z 1.0860 m' && (await page.textContent('.dhk .dh-tab')).includes('α₍ᵢ₋₁₎'), 'dh: convert to modified keeps the pose');
  await page.click('.dhk .dh-swap'); await page.waitForTimeout(200);
  check((await page.inputValue('.dhk .dh-conv')) === 'standard' && (await big()) === 'x 0.5329, y 0.3076, z 1.0860 m', 'dh: and back again');
  // reading the same table the other way changes the pose
  await page.selectOption('.dhk .dh-conv', 'modified'); await page.waitForTimeout(200);
  check((await big()) !== 'x 0.5329, y 0.3076, z 1.0860 m', 'dh: modified reading of the same numbers gives another pose');
  // planar 2-link: closed form and singular pose
  await page.selectOption('.dhk .dh-ex', 'planar2'); await page.waitForTimeout(200);
  check((await big()) === 'x 0.5365, y 0.6364, z 0.0000 m', `dh: planar 2-link example (${await big()})`);
  await page.fill('.dhk .dh-j[data-i="1"] .dh-qv', '0'); await page.waitForTimeout(200);
  check((await big()) === 'x 0.7794, y 0.4500, z 0.0000 m' && (await facts()).includes('move in 1 direction') && (await facts()).includes('singular'), 'dh: stretched-out arm, typed joint value, singular note');
  await page.locator('.dhk .dh-j[data-i="0"] .dh-sl').fill('0'); await page.waitForTimeout(200);
  check((await big()) === 'x 0.9000, y 0.0000, z 0.0000 m', 'dh: slider moves joint 1');
  // SCARA with prismatic joint, unit label
  await page.selectOption('.dhk .dh-ex', 'scara'); await page.selectOption('.dhk .dh-unit', 'mm'); await page.waitForTimeout(200);
  check((await big()) === 'x 0.3810, y 0.4151, z 0.3000 mm' && (await page.textContent('.dhk .dh-joints')).includes('q3 (mm)'), 'dh: SCARA example with a prismatic joint and unit label');
  // add a fixed tool row
  await page.click('.dhk .dh-add'); await page.waitForTimeout(100);
  const last = page.locator('.dhk .dh-tab tr[data-i="4"]');
  await last.locator('.dh-ty').selectOption('F'); await last.locator('.dh-a').fill('0'); await last.locator('.dh-d').fill('0.05'); await page.waitForTimeout(200);
  check((await big()) === 'x 0.3810, y 0.4151, z 0.2500 mm' && (await page.locator('.dhk .dh-joints .dh-j').count()) === 4, 'dh: fixed tool row lowers the tool by 0.05 and adds no slider');
  await last.locator('.dh-del').click(); await page.waitForTimeout(200);
  check((await page.locator('.dhk .dh-tab tr[data-i]').count()) === 4, 'dh: remove a row');
  // bad input
  await page.fill('.dhk .dh-tab tr[data-i="0"] .dh-a', 'abc'); await page.waitForTimeout(200);
  check((await page.textContent('.dhk .dh-err')).includes('Joint 1: "abc" is not a number') && await page.isHidden('.dhk .dh-out'), 'dh: bad number message');
  await page.fill('.dhk .dh-tab tr[data-i="0"] .dh-a', '0.35'); await page.fill('.dhk .dh-tab tr[data-i="0"] .dh-hi', '-200'); await page.waitForTimeout(200);
  check((await page.textContent('.dhk .dh-err')).includes('High must be more than Low'), 'dh: bad joint range message');
  await page.fill('.dhk .dh-tab tr[data-i="0"] .dh-hi', '130'); await page.waitForTimeout(200);
  check(await page.isVisible('.dhk .dh-out'), 'dh: recovers after fixing');
  // view controls, frames, zero
  await page.locator('.dhk .dh-az').fill('100'); await page.click('.dhk .dh-frames'); await page.click('.dhk .dh-zero'); await page.waitForTimeout(200);
  check((await page.inputValue('.dhk .dh-j[data-i="0"] .dh-qv')) === '0', 'dh: all joints to 0');
  { const c = page.locator('.dhk .dh-fig'); await c.scrollIntoViewIfNeeded(); const b = await c.boundingBox(); await page.mouse.move(b.x + 200, b.y + 100); await page.mouse.down(); await page.mouse.move(b.x + 100, b.y + 100, { steps: 4 }); await page.mouse.up();
    check((await page.inputValue('.dhk .dh-az')) !== '100', 'dh: drag turns the view'); }
  await page.click('.dhk .dh-reset'); check((await page.inputValue('.dhk .dh-az')) === '40', 'dh: reset view');
  // downloads
  await page.selectOption('.dhk .dh-ex', 'arm6'); await page.waitForTimeout(200);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.dhk .dh-csv')]); const f = OUT + 'dh.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 14 && rows[1].startsWith('joint,type') && rows[13].includes('0T6') && rows[13].includes('1.0859'), 'dh: transforms CSV'); }
  for (const fmt of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.dhk .dl [data-f=${fmt}]`)]); check(d.suggestedFilename() === `dh-forward-kinematics.${fmt}`, `dh: ${fmt} report`); }
};
