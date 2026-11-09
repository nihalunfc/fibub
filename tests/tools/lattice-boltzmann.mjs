// #957 lattice Boltzmann wind tunnel
export const path = '/science/lattice-boltzmann/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.lbw ';
  await page.goto(`${BASE}/science/lattice-boltzmann/`); await page.waitForTimeout(1500);
  const step = async () => Number((await page.textContent(R + '.lb-big')).match(/Step (\d+)/)?.[1] ?? -1);
  const s1 = await step(); await page.waitForTimeout(1200); const s2 = await step();
  check(s2 > s1 && s1 >= 0, `lbm: the tunnel runs (${s1} → ${s2} steps)`);
  { const t = await page.textContent(R + '.lb-facts'); check(t.includes('body height 20 cells') && t.includes('τ = 0.5600') && t.includes('Strouhal'), 'lbm: example cylinder, Re 100, τ'); }
  check(await page.isHidden(R + '.lb-ang'), 'lbm: no angle box for a cylinder');
  await page.click(R + '.lb-play'); const p1 = await step(); await page.waitForTimeout(600);
  check((await step()) === p1 && (await page.textContent(R + '.lb-play')) === 'Play', 'lbm: pause stops the clock');
  // Draw a wall with the mouse while paused: the body gets taller.
  await page.locator(R + '.lb-cv').scrollIntoViewIfNeeded();
  { const bb = await page.locator(R + '.lb-cv').boundingBox(); await page.mouse.move(bb.x + bb.width * 0.5, bb.y + bb.height * 0.15); await page.mouse.down(); await page.mouse.move(bb.x + bb.width * 0.5, bb.y + bb.height * 0.85, { steps: 25 }); await page.mouse.up(); }
  await page.waitForTimeout(200);
  { const t = await page.textContent(R + '.lb-facts'); const h = Number(t.match(/body height (\d+) cells/)[1]); check(h > 60, `lbm: drawing a wall changes the body height (${h} cells)`); }
  await page.click(R + '.lb-tool [data-t=erase]');
  { const bb = await page.locator(R + '.lb-cv').boundingBox(); await page.mouse.move(bb.x + bb.width * 0.5, bb.y + bb.height * 0.1); await page.mouse.down(); await page.mouse.move(bb.x + bb.width * 0.5, bb.y + bb.height * 0.9, { steps: 25 }); await page.mouse.up(); }
  await page.waitForTimeout(200);
  { const t = await page.textContent(R + '.lb-facts'); check(t.includes('body height 20 cells'), `lbm: erasing the wall leaves the cylinder (${t.match(/body height (\d+)/)?.[1]})`); }
  await page.click(R + '.lb-tool [data-t=off]'); check(await page.getAttribute(R + '.lb-tool [data-t=off]', 'aria-pressed') === 'true', 'lbm: touch off');
  for (const v of ['speed', 'press', 'vort']) await page.selectOption(R + '.lb-v', v);
  check(true, 'lbm: speed, pressure and vorticity views');
  await page.selectOption(R + '.lb-sh', 'airfoil'); await page.fill(R + '.lb-sz', '50'); await page.fill(R + '.lb-ang', '8'); await page.press(R + '.lb-ang', 'Enter'); await page.dispatchEvent(R + '.lb-ang', 'change'); await page.waitForTimeout(400);
  { const t = await page.textContent(R + '.lb-facts'); check(await page.isVisible(R + '.lb-ang') && /body height (1[0-9]|9) cells/.test(t), `lbm: airfoil at 8°: height across the flow ${t.match(/body height (\d+)/)?.[1]}`); }
  await page.selectOption(R + '.lb-sh', 'square'); await page.fill(R + '.lb-sz', '16'); await page.dispatchEvent(R + '.lb-sz', 'change'); await page.waitForTimeout(300);
  check((await page.textContent(R + '.lb-facts')).includes('body height 16 cells'), 'lbm: square body');
  await page.selectOption(R + '.lb-sh', 'plate'); await page.waitForTimeout(300);
  check((await page.textContent(R + '.lb-facts')).includes('body height 16 cells'), 'lbm: flat plate');
  await page.selectOption(R + '.lb-g', '200x80'); await page.waitForTimeout(300);
  check((await page.getAttribute(R + '.lb-cv', 'width')) === '200', 'lbm: smaller grid');
  await page.selectOption(R + '.lb-sh', 'cylinder'); await page.fill(R + '.lb-re', '20'); await page.dispatchEvent(R + '.lb-re', 'change'); await page.waitForTimeout(300);
  check((await page.textContent(R + '.lb-facts')).includes('τ = 0.7400'), 'lbm: Re 20 gives τ 0.74');
  await page.click(R + '.lb-reset'); await page.waitForTimeout(800);
  check((await step()) > 0, 'lbm: restart runs again');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.lb-csv')]); const f = OUT + 'lbm.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'step,Cd,Cl' && rows.length > 2, 'lbm: drag and lift CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=png]')]); check(d.suggestedFilename() === 'wind-tunnel.png', 'lbm: image download'); }
  await page.fill(R + '.lb-re', '3000'); await page.dispatchEvent(R + '.lb-re', 'change'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.lb-err')).includes('too close to ½') && await page.isHidden(R + '.lb-out'), 'lbm: too high Re message');
  await page.fill(R + '.lb-re', '100'); await page.fill(R + '.lb-sz', '2'); await page.dispatchEvent(R + '.lb-sz', 'change'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.lb-err')).includes('whole number of cells'), 'lbm: bad size message');
  await page.fill(R + '.lb-sz', '20'); await page.dispatchEvent(R + '.lb-sz', 'change'); await page.waitForTimeout(200);
  await page.click(R + '.lb-play');
};
