// #958 airfoil calculator
export const path = '/science/airfoil-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.afc ';
  await page.goto(`${BASE}/science/airfoil-calculator/`); await page.waitForTimeout(800);
  const big = () => page.textContent(R + '.af-big'), facts = () => page.textContent(R + '.af-facts');
  check((await big()) === 'Cl = 0.742 at 4° (panel method); thin airfoil theory 0.666', 'airfoil: NACA 2412 at 4° example');
  { const t = await facts(); check(t.includes('−2.18° (panel), −2.08° (thin)') && t.includes('−0.0614 (panel), −0.0531 (thin)') && t.includes('2.03 × 10⁶') && t.includes('409 N') && t.includes('0.00991') && t.includes('L/D about 23.5'), 'airfoil: example moment, Re, lift, drag, wing'); }
  check(await page.isVisible(R + '.af-shape') && await page.isVisible(R + '.af-cp') && await page.isVisible(R + '.af-pol'), 'airfoil: three figures');
  await page.fill(R + '.af-code', 'NACA 0012'); await page.fill(R + '.af-a', '0'); await page.waitForTimeout(200);
  check((await big()).startsWith('Cl = 0 at 0°') && (await facts()).includes('symmetric section'), 'airfoil: symmetric section at 0° has no lift');
  await page.fill(R + '.af-a', '4'); await page.waitForTimeout(200);
  check((await big()).startsWith('Cl = 0.483'), `airfoil: 0012 at 4° (Hess-Smith 0.484) (${await big()})`);
  await page.selectOption(R + '.af-n', '60'); await page.waitForTimeout(200);
  check((await facts()).includes('60 linear vortex panels'), 'airfoil: fewer panels');
  await page.selectOption(R + '.af-n', '240'); await page.waitForTimeout(300);
  check((await facts()).includes('240 linear vortex panels'), 'airfoil: more panels');
  await page.fill(R + '.af-v', '3'); await page.fill(R + '.af-c', '0.1'); await page.waitForTimeout(200);
  check((await facts()).includes('laminar skin friction'), 'airfoil: low Re gives laminar drag');
  await page.selectOption(R + '.af-bl', 'turbulent'); await page.waitForTimeout(200);
  check((await facts()).includes('turbulent skin friction'), 'airfoil: forced turbulent boundary layer');
  await page.fill(R + '.af-ar', ''); await page.waitForTimeout(200);
  check(!(await facts()).includes('Induced drag'), 'airfoil: 2D only when the aspect ratio is blank');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.af-csv')]); const f = OUT + 'cp.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'surface,x_c,y_c,Cp' && rows.length === 241 && d.suggestedFilename() === 'naca-0012-cp.csv', `airfoil: Cp CSV (${rows.length} rows)`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.af-pcsv')]); const f = OUT + 'pol.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'alpha_deg,Cl_panel,Cl_thin' && rows.length === 24, 'airfoil: lift against angle CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=pdf]')]); check(d.suggestedFilename() === 'airfoil.pdf', 'airfoil: PDF download'); }
  await page.fill(R + '.af-code', '2012'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.af-err')).includes('NACA 4-digit code') && await page.isHidden(R + '.af-out'), 'airfoil: bad code message');
  await page.fill(R + '.af-code', '4415'); await page.fill(R + '.af-a', '40'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.af-err')).includes('between −25° and 25°'), 'airfoil: angle too large message');
  await page.fill(R + '.af-a', '4'); await page.fill(R + '.af-ar', '0.5'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.af-err')).includes('aspect ratio'), 'airfoil: bad aspect ratio message');
  await page.fill(R + '.af-ar', '8'); await page.fill(R + '.af-v', '0'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.af-err')).includes('greater than 0'), 'airfoil: bad speed message');
};
