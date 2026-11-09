// #912 skin depth calculator
export const path = '/science/skin-depth-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/skin-depth-calculator/`); await page.waitForTimeout(800);
  const t = (c) => page.textContent('.skd ' + c), set = async (c, v) => { await page.fill('.skd ' + c, v); await page.waitForTimeout(200); };
  check((await t('.sk-big')) === 'Skin depth δ = 66 µm at 1 MHz' && (await t('.sk-facts')).includes('261 µΩ per square'), 'skin: copper at 1 MHz');
  check((await t('.sk-wire')).includes('21.9 mΩ/m') && (await t('.sk-wire')).includes('88.7 mΩ/m') && (await t('.sk-wire')).includes('4.050 × the DC value'), 'skin: 1 mm wire AC resistance');
  check((await t('.sk-sheet')).includes('495 µΩ') && (await t('.sk-sheet')).includes('4.61 dB'), 'skin: 35 µm sheet');
  check((await t('.sk-coax')).includes('1.10 dB per 100 m') && (await t('.sk-coax')).includes('47.45 Ω'), 'skin: coax conductor loss');
  check((await t('.sk-tab')).includes('50 Hz9.33 mm') && (await page.$$('.skd .sk-tab tr')).length === 10 && await page.isVisible('.skd .sk-fig2'), 'skin: frequency table and charts');
  await page.selectOption('.skd .sk-fu', '1'); await set('.sk-f', '50');
  check((await t('.sk-big')) === 'Skin depth δ = 9.33 mm at 50 Hz' && (await t('.sk-wire')).includes('1 × the DC value (a/δ = 0.0536)'), 'skin: mains frequency');
  await page.selectOption('.skd .sk-fu', '1e9'); await set('.sk-f', '1');
  check((await t('.sk-big')) === 'Skin depth δ = 2.09 µm at 1 GHz', 'skin: GHz unit');
  await page.selectOption('.skd .sk-mat', '1.59e-8|1|1'); await page.waitForTimeout(200);
  check((await t('.sk-big')).startsWith('Skin depth δ = 2.01 µm'), 'skin: silver');
  await page.selectOption('.skd .sk-mat', '7.2e-7|1|1'); await page.waitForTimeout(200);
  check((await t('.sk-big')).startsWith('Skin depth δ = 13.5 µm'), 'skin: stainless steel');
  await page.selectOption('.skd .sk-mat', '7e-8|100|1'); await page.waitForTimeout(200);
  check((await t('.sk-big')).startsWith('Skin depth δ = 421 nm') && (await page.inputValue('.skd .sk-mr')) === '100', 'skin: nickel with μr');
  await page.selectOption('.skd .sk-mat', '0.2|1|80'); await page.waitForTimeout(200);
  check((await t('.sk-big')) === 'Skin depth δ = 10.6 mm at 1 GHz' && (await t('.sk-facts')).includes('differs') && (await t('.sk-wire')).includes('not a good conductor'), 'skin: sea water at 1 GHz uses the exact formula');
  await set('.sk-rho', '1e-7');
  check((await page.inputValue('.skd .sk-mat')) === 'custom', 'skin: typing switches to custom');
  await page.selectOption('.skd .sk-mat', '1.72e-8|1|1'); await page.selectOption('.skd .sk-fu', '1e6'); await set('.sk-dw', '0.1');
  check((await t('.sk-wire')).includes('a/δ = 0.758'), 'skin: thin wire');
  await set('.sk-t', '1000');
  check((await t('.sk-sheet')).includes('thicker than δ'), 'skin: thick sheet');
  await set('.sk-co', '5');
  check(!(await t('.sk-coax')).includes('47.45 Ω'), 'skin: coax sizes');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.skd .sk-csv')]); const f = OUT + 'skin.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 10 && r[0].startsWith('frequency_Hz,skin_depth_m'), 'skin: table CSV'); }
  for (const x of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.skd .dl [data-f=${x}]`)]); check(d.suggestedFilename() === `skin-depth.${x}`, `skin: ${x} report`); }
  await set('.sk-rho', '0'); check((await t('.sk-err')).includes('resistivity') && await page.isHidden('.skd .sk-out'), 'skin: bad resistivity message');
  await set('.sk-rho', '1.72e-8'); await set('.sk-mr', '0.5'); check((await t('.sk-err')).includes('μr'), 'skin: bad μr message');
  await set('.sk-mr', '1'); await set('.sk-f', '-1'); check((await t('.sk-err')).includes('frequency'), 'skin: bad frequency message');
  await set('.sk-f', '1'); await set('.sk-co', '0.5'); check((await t('.sk-err')).includes('coax shield'), 'skin: bad coax message');
  await set('.sk-co', '2.95'); await set('.sk-dw', ''); check((await t('.sk-err')).includes('wire diameter'), 'skin: missing wire message');
};
