// #931 Thin-film coating simulator
export const path = '/science/thin-film-coating/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.tfc ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  const big = () => page.textContent(R + '.tf-big'), facts = () => page.textContent(R + '.tf-facts');
  check((await big()) === 'R 0.183 %, T 99.82 % at 550 nm, 0°, unpolarised', `film: example AR at 550 nm (${await big()})`);
  { const f = await facts(); check(f.includes('bare substrate 4.26 %') && f.includes('0.525 %') && f.includes('0.0035 % at 648 nm') && f.includes('4.62 % at 400 nm') && f.includes('3 layers, 314.9 nm'), `film: example facts ${f}`); }
  { const t = await page.textContent(R + '.tf-tab'); check((await page.$$(R + '.tf-tab tr')).length === 4 && t.includes('MgF2') && t.includes('99.64') && t.includes('131') && t.includes('84.36'), 'film: layer table'); }
  check(await page.isVisible(R + '.tf-fig') && await page.isVisible(R + '.tf-fig2'), 'film: spectrum and angle charts');
  await page.fill(R + '.tf-a', '45'); await page.waitForTimeout(200);
  check((await facts()).includes('R_s 1.39 %, R_p 0.088 %') && (await big()).includes('45°'), 'film: 45° splits s and p');
  await page.selectOption(R + '.tf-pol', 's'); await page.waitForTimeout(200);
  check((await big()).startsWith('R 1.39 %') && (await big()).includes('s-polarised'), 'film: s-polarised');
  await page.selectOption(R + '.tf-pol', 'p'); await page.waitForTimeout(200);
  check((await big()).startsWith('R 0.088 %'), 'film: p-polarised');
  await page.selectOption(R + '.tf-pol', 'u'); await page.fill(R + '.tf-a', '0');
  await page.selectOption(R + '.tf-pre', 'mgf2'); await page.waitForTimeout(200);
  check((await big()).startsWith('R 1.26 %'), 'film: single MgF2 layer 1.26 %');
  await page.selectOption(R + '.tf-pre', 'bragg'); await page.waitForTimeout(300);
  check((await big()).startsWith('R 99.87 %') && (await facts()).includes('16 layers'), `film: Bragg mirror (${await big()})`);
  await page.selectOption(R + '.tf-pre', 'metal'); await page.waitForTimeout(200);
  check(!(await facts()).includes('none: all layers are clear') && (await facts()).includes('in the absorbing layers'), 'film: absorbing layer absorbs');
  await page.selectOption(R + '.tf-pre', 'soap'); await page.waitForTimeout(200);
  check((await page.inputValue(R + '.tf-ns')) === '1' && (await facts()).includes('1 layer, 300 nm'), 'film: soap film in air');
  await page.fill(R + '.tf-lay', '2.1 2QW'); await page.fill(R + '.tf-ns', '1.52'); await page.waitForTimeout(200);
  check((await page.inputValue(R + '.tf-pre')) === 'custom' && (await big()).startsWith('R 4.26 %'), 'film: half-wave layer is absent, custom layers');
  await page.fill(R + '.tf-lay', ''); await page.waitForTimeout(200);
  check((await page.textContent(R + '.tf-tab')).includes('bare substrate'), 'film: no layers is bare substrate');
  await page.fill(R + '.tf-lay', 'kryptonite QW'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.tf-err')).includes('not a refractive index') && await page.isHidden(R + '.tf-out'), 'film: unknown material message');
  await page.fill(R + '.tf-lay', '1.38 QW'); await page.fill(R + '.tf-a', '95'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.tf-err')).includes('angle'), 'film: bad angle message');
  await page.fill(R + '.tf-a', '0'); await page.fill(R + '.tf-a2', '300'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.tf-err')).includes('spectrum range'), 'film: bad range message');
  await page.fill(R + '.tf-a2', '800'); await page.fill(R + '.tf-n0', '0.5'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.tf-err')).includes('incident medium'), 'film: bad incident index message');
  await page.fill(R + '.tf-n0', '1'); await page.selectOption(R + '.tf-pre', 'qhq'); await page.waitForTimeout(300);
  check(await page.isVisible(R + '.tf-out') && (await big()).startsWith('R 0.183 %'), 'film: back to the example');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.tf-csv')]); const f = OUT + 'film.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 402 && rows[0].startsWith('wavelength_nm,R_s,R_p') && rows[1].startsWith('400,'), 'film: spectrum CSV'); }
  for (const fmt of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R}.dl [data-f=${fmt}]`)]); check(d.suggestedFilename().endsWith('.' + fmt), `film: ${fmt} download`); }
};
