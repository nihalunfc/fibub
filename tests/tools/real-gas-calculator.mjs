// #916 real gas calculator
export const path = '/science/real-gas-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/real-gas-calculator/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.rgc .rg-big'), facts = () => page.textContent('.rgc .rg-facts'), tab = () => page.textContent('.rgc .rg-tab');
  check((await big()) === 'Z = 0.6712 (Peng-Robinson): 67.1 % of the ideal-gas volume', 'real gas: example CO2 300 K 50 bar, Peng-Robinson Z');
  { const f = await facts(); check(f.includes('0.3348 L/mol') && f.includes('131.4 kg/m³') && f.includes('37.33 bar') && f.includes('0.9865') && f.includes('67.33 bar'), 'real gas: example volume, density, fugacity, Tr and saturation pressure'); }
  { const t = await tab(); check(t.includes('0.7315') && t.includes('0.6974') && t.includes('0.6947') && t.includes('0.4989') && t.includes('−32.9 %'), 'real gas: comparison table of every equation'); }
  check(await page.isVisible('.rgc .rg-fig1') && await page.isVisible('.rgc .rg-fig2') && await page.isVisible('.rgc .rg-fig3'), 'real gas: three charts');
  await page.fill('.rgc .rg-p', '80'); await page.waitForTimeout(150);
  check((await big()).startsWith('Z = 0.2047') && (await facts()).includes('liquid'), 'real gas: 80 bar has condensed');
  await page.selectOption('.rgc .rg-eos', 'vdw'); await page.waitForTimeout(150);
  check((await big()).includes('van der Waals') && (await facts()).includes('69.88 bar'), 'real gas: van der Waals chosen, its saturation pressure');
  for (const e of ['rk', 'srk']) { await page.selectOption('.rgc .rg-eos', e); await page.waitForTimeout(100); check((await big()).includes(e === 'rk' ? 'Redlich-Kwong' : 'Soave'), `real gas: equation ${e}`); }
  await page.selectOption('.rgc .rg-eos', 'pr');
  await page.selectOption('.rgc .rg-gas', 'n2'); await page.fill('.rgc .rg-p', '200'); await page.waitForTimeout(150);
  check((await page.inputValue('.rgc .rg-tc')) === '126.2' && (await big()).startsWith('Z = 1.029') && (await facts()).includes('above the critical temperature'), 'real gas: nitrogen at 200 bar, Z above 1');
  await page.selectOption('.rgc .rg-pu', '1e6'); await page.waitForTimeout(150);
  check((await big()).startsWith('Z = 2.771') && (await facts()).includes('MPa'), 'real gas: 200 MPa in MPa units');
  await page.selectOption('.rgc .rg-pu', '1e5'); await page.selectOption('.rgc .rg-tu', 'C'); await page.fill('.rgc .rg-t', '26.85'); await page.waitForTimeout(150);
  check((await big()).startsWith('Z = 1.029'), 'real gas: Celsius gives the same state');
  await page.selectOption('.rgc .rg-tu', 'F'); await page.fill('.rgc .rg-t', '80.33'); await page.waitForTimeout(150);
  check((await big()).startsWith('Z = 1.029'), 'real gas: Fahrenheit gives the same state');
  await page.fill('.rgc .rg-w', '0.1'); await page.waitForTimeout(150);
  check((await page.inputValue('.rgc .rg-gas')) === 'custom', 'real gas: typing a constant switches to Other');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.rgc .rg-csv')]); const f = OUT + 'rg.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 161 && rows[0].startsWith('P (bar),Z Ideal gas,Z van der Waals'), 'real gas: Z curves CSV'); }
  for (const fm of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.rgc .dl button[data-f=${fm}]`)]); check(d.suggestedFilename() === `real-gas.${fm}`, `real gas: ${fm} download`); }
  await page.fill('.rgc .rg-t', '-500'); await page.waitForTimeout(150);
  check((await page.textContent('.rgc .rg-err')).includes('absolute zero') && await page.isHidden('.rgc .rg-out'), 'real gas: below absolute zero message');
  await page.fill('.rgc .rg-t', '80'); await page.fill('.rgc .rg-p', 'abc'); await page.waitForTimeout(150);
  check((await page.textContent('.rgc .rg-err')).includes('pressure'), 'real gas: bad pressure message');
  await page.fill('.rgc .rg-p', '50'); await page.fill('.rgc .rg-pc', '0'); await page.waitForTimeout(150);
  check((await page.textContent('.rgc .rg-err')).includes('critical pressure'), 'real gas: bad critical pressure message');
  // van der Waals constants for the default CO2: a = 3.655 L2 bar/mol2, b = 0.04283 L/mol
  await page.selectOption('.rgc .rg-tu', 'K'); await page.selectOption('.rgc .rg-gas', 'co2'); await page.fill('.rgc .rg-t', '300'); await page.fill('.rgc .rg-p', '50'); await page.waitForTimeout(200);
  check((await facts()).includes('a = 3.655 L² bar/mol², b = 0.04283 L/mol'), 'real gas: van der Waals constants and working');
  // container: 1 mol in 1 L at 300 K, Peng-Robinson 21.83 bar, ideal 24.94 bar
  const ct = () => page.textContent('.rgc .rg-ct-msg'), ctab = () => page.textContent('.rgc .rg-ct-tab');
  await page.fill('.rgc .rg-n', '1'); await page.fill('.rgc .rg-v', '1'); await page.waitForTimeout(200);
  check((await ct()).includes('Peng-Robinson gives 21.83 bar') && (await ct()).includes('ideal gas would give 24.94 bar'), 'real gas: container pressure');
  check((await ctab()).includes('22.4') && (await ctab()).includes('0.8982'), 'real gas: container table van der Waals row');
  await page.selectOption('.rgc .rg-vu', '1e-6'); await page.fill('.rgc .rg-v', '1000'); await page.waitForTimeout(200);
  check((await ct()).includes('21.83 bar'), 'real gas: container volume in mL');
  await page.selectOption('.rgc .rg-vu', '1'); await page.fill('.rgc .rg-v', '0.001'); await page.waitForTimeout(200);
  check((await ct()).includes('21.83 bar'), 'real gas: container volume in cubic metres');
  await page.selectOption('.rgc .rg-vu', '1e-3');
  // 10 mol in 1 L is a liquid-vapour mixture at 300 K
  await page.fill('.rgc .rg-n', '10'); await page.fill('.rgc .rg-v', '1'); await page.waitForTimeout(200);
  check((await ct()).includes('67.33 bar (liquid and vapour together') && (await ctab()).includes('70.82') && (await ctab()).includes('two phases'), 'real gas: container inside the two-phase region');
  // amount in grams, no volume: 44.01 g = 1 mol takes 0.3348 L at 50 bar (Peng-Robinson)
  await page.selectOption('.rgc .rg-nu', 'g'); await page.fill('.rgc .rg-n', '44.01'); await page.fill('.rgc .rg-v', ''); await page.waitForTimeout(200);
  check((await ct()).includes('takes 0.3348 litres') && (await ct()).includes('50 bar'), 'real gas: volume from an amount in grams');
  await page.selectOption('.rgc .rg-nu', 'mol'); await page.fill('.rgc .rg-n', '1'); await page.fill('.rgc .rg-v', '0.02'); await page.waitForTimeout(200);
  check((await ct()).includes('cannot fit'), 'real gas: container too small for the molecules');
  await page.fill('.rgc .rg-n', '-3'); await page.waitForTimeout(200);
  check((await ct()).includes('above zero'), 'real gas: negative amount message');
};
