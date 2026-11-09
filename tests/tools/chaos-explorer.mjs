// #552 Chaos explorer
export const path = '/science/chaos-explorer/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.chx ';
  const txt = (c) => page.textContent(R + c);
  const dl = async (sel, name) => { await page.locator(R + sel).scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + sel)]); const f = OUT + name; await d.saveAs(f); return readFileSync(f, 'utf8').trim().split('\n'); };
  await page.goto(`${BASE}/science/chaos-explorer/`); await page.waitForTimeout(1500);
  check((await txt('.cx-big')) === 'r = 3.7: chaos (λ = 0.3528)', 'chaos: example r = 3.7 is chaotic');
  { const t = await txt('.cx-dt'); check(['3.000000000', '3.449489743', '3.544090360', '3.564407266', '3.568759420', '3.569691610', '3.569891259', '4.7514', '4.6691'].every((s) => t.includes(s)), 'chaos: seven period-doubling points and gap ratios'); }
  check((await txt('.cx-dnote')).includes('r∞ ≈ 3.569946'), 'chaos: end of the cascade');
  for (const c of ['.cx-cob', '.cx-ts', '.cx-bif', '.cx-ly']) check(await page.isVisible(R + c), `chaos: figure ${c} drawn`);
  await page.fill(R + '.cx-r', '3.5'); await page.waitForTimeout(600);
  check((await txt('.cx-big')) === 'r = 3.5: a cycle of period 4 (λ = −0.8725)', 'chaos: r = 3.5 period 4');
  await page.fill(R + '.cx-r', '2.8'); await page.waitForTimeout(600);
  check((await txt('.cx-big')).startsWith('r = 2.8: settles to a fixed point') && (await txt('.cx-facts')).includes('0.642857'), 'chaos: r = 2.8 settles at 1 − 1/r = 0.642857');
  await page.fill(R + '.cx-r', '4'); await page.waitForTimeout(600);
  check((await txt('.cx-big')).includes('λ = 0.693'), 'chaos: r = 4 gives λ ≈ ln 2');
  // Slider.
  await page.locator(R + '.cx-rs').scrollIntoViewIfNeeded();
  await page.$eval(R + '.cx-rs', (el) => { el.value = '3.83'; el.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(400);
  check((await page.inputValue(R + '.cx-r')) === '3.83' && (await txt('.cx-big')).includes('period 3'), 'chaos: slider to the period-3 window');
  { const rows = await dl('.cx-csv', 'orbit.csv'); check(rows.length === 62 && rows[0] === 'n,x' && rows[1] === '0,0.2', 'chaos: orbit CSV'); }
  { const rows = await dl('.cx-bcsv', 'lyap.csv'); const at = rows.slice(1).map((r) => r.split(',').map(Number)); check(rows.length === 501 && rows[0] === 'r,lyapunov,period' && at.at(-1)[0] === 4 && Math.abs(at.at(-1)[1] - Math.LN2) < 0.01 && at[0][2] === 1, 'chaos: λ and period by r CSV'); }
  // Zoom in and another map.
  await page.fill(R + '.cx-ra', '3.54'); await page.fill(R + '.cx-rb', '3.58'); await page.waitForTimeout(1200);
  check((await txt('.cx-dnote')).includes('between r = 3.54 and 3.58') && (await txt('.cx-dt')).includes('3.564407266'), 'chaos: zoomed range finds the later doublings');
  await page.fill(R + '.cx-rb', '3.5'); await page.waitForTimeout(800);
  check((await txt('.cx-rerr')).includes('"to" larger'), 'chaos: bad r range message');
  await page.fill(R + '.cx-ra', '0.5'); await page.fill(R + '.cx-rb', '1'); await page.fill(R + '.cx-f', 'r*sin(pi*x)'); await page.fill(R + '.cx-r', '0.9'); await page.waitForTimeout(1500);
  check((await txt('.cx-big')).startsWith('r = 0.9:') && (await txt('.cx-dnote')).includes('period doublings found'), `chaos: sine map (${await txt('.cx-dnote')})`);
  await page.fill(R + '.cx-f', 'a*x'); await page.waitForTimeout(800);
  check((await txt('.cx-err')).includes('only x and r') && await page.isHidden(R + '.cx-lout'), 'chaos: bad map message');
  await page.fill(R + '.cx-f', 'r*x*(1 - x)'); await page.fill(R + '.cx-ra', '2.5'); await page.fill(R + '.cx-rb', '4'); await page.fill(R + '.cx-r', '3.7'); await page.waitForTimeout(1500);
  // Lorenz.
  await page.click(R + '[data-tab=flow]'); await page.waitForTimeout(800);
  check(await page.isVisible(R + '.cx-3d') && await page.isHidden(R + '.cx-p-log'), 'chaos: Lorenz tab shows the 3D view');
  { const bb = await page.locator(R + '.cx-3d').boundingBox(); await page.locator(R + '.cx-3d').scrollIntoViewIfNeeded(); const b2 = await page.locator(R + '.cx-3d').boundingBox(); await page.mouse.move(b2.x + 100, b2.y + 100); await page.mouse.down(); await page.mouse.move(b2.x + 150, b2.y + 130, { steps: 5 }); await page.mouse.up(); void bb; }
  check((await page.inputValue(R + '.cx-yaw')) === '340' && (await page.inputValue(R + '.cx-pitch')) === '28', `chaos: dragging turns the view (${await page.inputValue(R + '.cx-yaw')}, ${await page.inputValue(R + '.cx-pitch')})`);
  await page.$eval(R + '.cx-pitch', (el) => { el.value = '-30'; el.dispatchEvent(new Event('input', { bubbles: true })); });
  { const rows = await dl('.cx-tcsv', 'lorenz.csv'); const last = rows.at(-1).split(','); check(rows.length === 5002 && rows[0] === 't,x,y,z' && last[0] === '50', 'chaos: Lorenz path CSV'); }
  await page.click(R + '.cx-lgo'); await page.waitForTimeout(3500);
  check((await txt('.cx-lbig')) === 'λ₁ = 0.9069, λ₂ = −0.000704, λ₃ = −14.573' && (await txt('.cx-lf')).includes('chaotic') && (await txt('.cx-lf')).includes('−13.667 (should be −(σ + 1 + β) = −13.667)') && await page.isVisible(R + '.cx-lfig'), 'chaos: Lorenz Lyapunov spectrum');
  await page.fill(R + '.cx-lT', '5'); await page.click(R + '.cx-lgo'); await page.waitForTimeout(300);
  check((await txt('.cx-lerr')).includes('between 10 and 5000'), 'chaos: averaging time checked');
  await page.fill(R + '.cx-b', '15'); await page.waitForTimeout(800);
  check(await page.isHidden(R + '.cx-lbig'), 'chaos: changing a parameter clears the old exponents');
  await page.fill(R + '.cx-lT', '200'); await page.click(R + '.cx-lgo'); await page.waitForTimeout(2000);
  check((await txt('.cx-lf')).includes('settles to a point'), 'chaos: Lorenz at ρ = 15 settles');
  await page.selectOption(R + '.cx-sys', 'rossler'); await page.waitForTimeout(800);
  check((await txt('.cx-la')) === 'a' && (await page.inputValue(R + '.cx-c')) === '5.7' && (await txt('.cx-shelp')).includes('Rössler'), 'chaos: Rössler parameters');
  await page.fill(R + '.cx-lT', '1000'); await page.click(R + '.cx-lgo'); await page.waitForTimeout(3500);
  { const t = await txt('.cx-lbig'); const l1 = Number(t.split(',')[0].split('= ')[1]); check(l1 > 0.05 && l1 < 0.1, `chaos: Rössler λ₁ ≈ 0.07 (${t})`); }
  await page.fill(R + '.cx-h', '0.5'); await page.waitForTimeout(800);
  check((await txt('.cx-ferr')).includes('step between 0 and 0.1'), 'chaos: step size checked');
  await page.fill(R + '.cx-h', '0.01');
  // Hénon.
  await page.click(R + '[data-tab=hen]'); await page.waitForTimeout(800);
  check((await txt('.cx-hbig')) === 'λ₁ = 0.41801, λ₂ = −1.6220' && (await txt('.cx-hf')).includes('= ln|b| = −1.2040') && (await txt('.cx-hf')).includes('1.258'), 'chaos: Hénon exponents');
  { const rows = await dl('.cx-hcsv', 'henon.csv'); check(rows.length === 10001 && rows[0] === 'x,y', 'chaos: Hénon points CSV'); }
  await page.fill(R + '.cx-ha', '2'); await page.waitForTimeout(800);
  check((await txt('.cx-herr')).includes('escapes') && await page.isHidden(R + '.cx-hout'), 'chaos: escaping Hénon orbit');
  await page.fill(R + '.cx-ha', '1.2'); await page.waitForTimeout(800);
  check((await txt('.cx-hf')).includes('chaotic') || (await txt('.cx-hf')).includes('not chaotic'), 'chaos: other a');
  await page.fill(R + '.cx-hn', '5'); await page.waitForTimeout(800);
  check((await txt('.cx-herr')).includes('between 100 and 200,000'), 'chaos: point count checked');
  await page.fill(R + '.cx-hn', '10000'); await page.waitForTimeout(800);
  // Report.
  await page.locator(R + '.dl').scrollIntoViewIfNeeded();
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=pdf]')]); check(d.suggestedFilename() === 'chaos-explorer.pdf', 'chaos: report PDF'); }
};
