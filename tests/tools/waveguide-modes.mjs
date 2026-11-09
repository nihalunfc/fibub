// #913 waveguide modes
export const path = '/science/waveguide-modes/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/waveguide-modes/`); await page.waitForTimeout(800);
  const t = (c) => page.textContent('.wgm ' + c), set = async (c, v) => { await page.fill('.wgm ' + c, v); await page.waitForTimeout(250); };
  check((await t('.wg-big')) === '1 mode propagates at 10 GHz: TE10', 'waveguide: X-band guide at 10 GHz');
  { const f = await t('.wg-facts'); check(f.includes('6.557 GHz') && f.includes('6.557 GHz to 13.11 GHz') && f.includes('8.196 GHz to 12.46 GHz') && f.includes('39.71 mm') && f.includes('0.7550 c') && f.includes('499 Ω') && f.includes('0.108 dB/m'), 'waveguide: cutoff, bands, λg, vg, Z and loss'); }
  check((await t('.wg-tab')).includes('TE2013.114evanescent') && (await t('.wg-tab')).includes('1.54 dB/mm') && (await page.$$('.wgm .wg-tab tr')).length === 7 && await page.isVisible('.wgm .wg-fig'), 'waveguide: mode table and chart');
  await set('.wg-f', '15');
  check((await t('.wg-big')) === '3 modes propagate at 15 GHz: TE10, TE20, TE01', 'waveguide: three modes at 15 GHz');
  await set('.wg-f', '5');
  check((await t('.wg-big')) === 'Below cutoff at 5 GHz: nothing propagates' && (await t('.wg-facts')).includes('dies away at'), 'waveguide: below cutoff');
  await set('.wg-f', '10'); await set('.wg-er', '2.1');
  check((await t('.wg-facts')).includes('4.525 GHz'), 'waveguide: PTFE filling lowers the cutoff by √εr');
  await set('.wg-er', '1'); await page.selectOption('.wgm .wg-rho', '2.82e-8'); await page.waitForTimeout(250);
  check((await t('.wg-facts')).includes('0.139 dB/m'), 'waveguide: aluminium walls lose more');
  await page.selectOption('.wgm .wg-span', '5'); await page.waitForTimeout(250);
  check((await page.$$('.wgm .wg-tab tr')).length > 15, 'waveguide: longer mode list');
  await page.selectOption('.wgm .wg-span', '3');
  await page.selectOption('.wgm .wg-shape', 'circ'); await page.waitForTimeout(500);
  check((await t('.wg-big')) === '1 mode propagates at 10 GHz: TE11' && (await t('.wg-facts')).includes('8.785 GHz') && (await t('.wg-facts')).includes('to 11.47 GHz') && (await t('.wg-facts')).includes('next mode is TM01'), 'waveguide: circular 20 mm guide');
  check((await t('.wg-tab')).includes('TE01') && (await t('.wg-tab')).includes('TM11') && (await t('.wg-facts')).includes('dB/m'), 'waveguide: circular modes and TE11 loss');
  await set('.wg-f', '20');
  check((await t('.wg-big')) === '5 modes propagate at 20 GHz: TE11, TM01, TE21, TE01, TM11', `waveguide: circular at 20 GHz (${await t('.wg-big')})`);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.wgm .wg-csv')]); const f = OUT + 'wg.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r[0].startsWith('mode,cutoff_GHz') && r[1].startsWith('TE11,8.78') && r.length === (await page.$$('.wgm .wg-tab tr')).length, 'waveguide: modes CSV'); }
  for (const x of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.wgm .dl [data-f=${x}]`)]); check(d.suggestedFilename() === `waveguide-modes.${x}`, `waveguide: ${x} report`); }
  await set('.wg-d', '0'); check((await t('.wg-err')).includes('inside diameter') && await page.isHidden('.wgm .wg-out'), 'waveguide: bad diameter message');
  await page.selectOption('.wgm .wg-shape', 'rect'); await set('.wg-b', '30'); check((await t('.wg-err')).includes('swap a and b'), 'waveguide: sides swapped message');
  await set('.wg-b', '10.16'); await set('.wg-er', '0.5'); check((await t('.wg-err')).includes('εr'), 'waveguide: bad εr message');
  await set('.wg-er', '1'); await set('.wg-f', 'x'); check((await t('.wg-err')).includes('frequency'), 'waveguide: bad frequency message');
};
