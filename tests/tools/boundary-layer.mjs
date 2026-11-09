// #960 flat plate boundary layer
export const path = '/science/boundary-layer/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.blc ';
  await page.goto(`${BASE}/science/boundary-layer/`); await page.waitForTimeout(800);
  const big = () => page.textContent(R + '.bl-big'), facts = () => page.textContent(R + '.bl-facts');
  check((await big()) === 'Drag 0.373 N (CD = 0.00310); boundary layer 25.4 mm thick at x = 1 m', 'bl: air plate example');
  { const t = await facts(); check(t.includes('1.32 × 10⁶') && t.includes('0.758 m from the leading edge') && t.includes('3.17 mm') && t.includes('0.00406') && t.includes('0.244 Pa') && t.includes('0.003097') && t.includes('1742/Re_L'), 'bl: example details'); }
  check(await page.isVisible(R + '.bl-fig') && await page.isVisible(R + '.bl-fig2'), 'bl: thickness and profile charts');
  await page.fill(R + '.bl-x', '0.5'); await page.waitForTimeout(150);
  { const t = await facts(); check(t.includes('laminar, Reₓ = 329815') && t.includes('4.27 mm') && t.includes('H = δ*/θ = 2.59'), 'bl: laminar Blasius values at 0.5 m'); }
  await page.selectOption(R + '.bl-m', 'laminar'); await page.waitForTimeout(150);
  check((await big()).startsWith('Drag 0.139 N'), `bl: laminar all the way (${await big()})`);
  await page.selectOption(R + '.bl-m', 'turbulent'); await page.waitForTimeout(150);
  check((await facts()).includes('turbulent, Reₓ') && (await facts()).includes('0.074 Re_L^−0.2'), 'bl: tripped turbulent');
  await page.selectOption(R + '.bl-law', 'schlichting'); await page.waitForTimeout(150);
  check((await facts()).includes('0.455/(log₁₀ Re_L)^2.58'), 'bl: Prandtl-Schlichting law');
  await page.check(R + '.bl-two'); await page.waitForTimeout(150);
  check((await facts()).includes('both sides'), 'bl: both sides');
  await page.selectOption(R + '.bl-m', 'auto'); await page.selectOption(R + '.bl-fl', 'water'); await page.waitForTimeout(150);
  check((await page.inputValue(R + '.bl-nu')) === '0.000001004' && (await facts()).includes('laminar to 0.0502 m'), `bl: water preset (${await page.inputValue(R + '.bl-nu')})`);
  for (const f of ['sea', 'oil', 'air']) { await page.selectOption(R + '.bl-fl', f); await page.waitForTimeout(80); }
  await page.fill(R + '.bl-nu', '2e-5'); await page.waitForTimeout(150);
  check((await page.inputValue(R + '.bl-fl')) === 'own', 'bl: editing viscosity switches to your own fluid');
  await page.fill(R + '.bl-rc', '3e5'); await page.waitForTimeout(150);
  check((await facts()).includes('0.600 m from the leading edge'), 'bl: earlier transition');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.bl-csv')]); const f = OUT + 'bl.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0].startsWith('x_m,Re_x,regime') && rows.length === 202, 'bl: values along the plate CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=pdf]')]); check(d.suggestedFilename() === 'boundary-layer.pdf', 'bl: PDF download'); }
  await page.fill(R + '.bl-x', '5'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.bl-err')).includes('between 0 and the plate length') && await page.isHidden(R + '.bl-out'), 'bl: x beyond the plate message');
  await page.fill(R + '.bl-x', '1'); await page.fill(R + '.bl-u', '0'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.bl-err')).includes('speed'), 'bl: bad speed message');
  await page.fill(R + '.bl-u', '10'); await page.fill(R + '.bl-rc', '10'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.bl-err')).includes('transition Reynolds'), 'bl: bad transition Re message');
};
