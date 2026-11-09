// #623 analog filter designer
export const path = '/science/filter-designer/';
export default async ({ page, check, BASE }) => {
  const R = '.fdz ';
  await page.goto(`${BASE}/science/filter-designer/`); await page.waitForTimeout(600);
  const t = (c) => page.textContent(R + c);
  check((await t('.fd-big')) === 'Fourth-order Butterworth low-pass, −3 dB at 1 kHz', `filter: example (${await t('.fd-big')})`);
  { const f = await t('.fd-facts'), tab = await t('.fd-tab'); check(f.includes('−24.1 dB and −80.0 dB') && f.includes('Q 0.541') && f.includes('Q 1.307') && tab.includes('14.7 kΩ') && tab.includes('11.72 nF') && tab.includes('15 kΩ') && tab.includes('12 nF'), 'filter: example stages, parts and rounding'); }
  check(await page.isVisible(R + '.fd-mag') && await page.isVisible(R + '.fd-ph') && await page.isHidden(R + '.fd-netbox'), 'filter: Bode plots, no netlist for active');
  await page.click(R + '.fd-ord summary'); await page.waitForTimeout(100);
  check((await t('.fd-ordout')).includes('needs order 5'), 'filter: order needed for 40 dB at 3 kHz');
  await page.click(R + '.fd-use'); await page.waitForTimeout(200);
  check((await t('.fd-big')).startsWith('Fifth-order') && (await t('.fd-tab')).includes('first order') === false && (await t('.fd-facts')).includes('(first order)'), 'filter: use suggested order');
  await page.selectOption(R + '.fd-kind', 'cheby'); await page.waitForTimeout(200);
  check((await t('.fd-big')) === 'Fifth-order Chebyshev (1 dB) high-pass, edge at 1 kHz'.replace('high', 'low') && await page.isVisible(R + '.fd-rip'), `filter: Chebyshev (${await t('.fd-big')})`);
  await page.selectOption(R + '.fd-resp', 'hp'); await page.fill(R + '.fd-rip', '0.5'); await page.waitForTimeout(200);
  check((await t('.fd-big')) === 'Fifth-order Chebyshev (0.5 dB) high-pass, edge at 1 kHz' && (await t('.fd-facts')).includes('Q 4.545'), `filter: Chebyshev high-pass (${await t('.fd-big')})`);
  await page.selectOption(R + '.fd-build', 'lc'); await page.waitForTimeout(300);
  { const net = await page.inputValue(R + '.fd-net'); check(net.includes('RS src in 50') && net.includes('RL out 0 50') && (await t('.fd-tab')).includes('to ground'), 'filter: LC ladder netlist'); }
  await page.fill(R + '.fd-n', '4'); await page.waitForTimeout(300);
  check((await t('.fd-tab')).includes('RL') && !(await page.inputValue(R + '.fd-net')).includes('RL out 0 50\n'), 'filter: even-order Chebyshev ladder load differs');
  await page.selectOption(R + '.fd-build', 'rc'); await page.selectOption(R + '.fd-resp', 'lp'); await page.selectOption(R + '.fd-round', '0'); await page.waitForTimeout(200);
  check((await t('.fd-big')) === 'First-order RC low-pass, −3 dB at 1 kHz' && (await t('.fd-tab')).includes('1.592 kΩ') && await page.isHidden(R + '.fd-n'), `filter: RC (${await t('.fd-tab')})`);
  await page.selectOption(R + '.fd-build', 'rl'); await page.waitForTimeout(200);
  check((await t('.fd-tab')).includes('159.2 mH') && (await page.inputValue(R + '.fd-net')).includes('L1 in out'), 'filter: RL');
  await page.fill(R + '.fd-fc', 'abc'); await page.waitForTimeout(200);
  check((await t('.fd-err')).includes('corner frequency') && await page.isHidden(R + '.fd-out'), 'filter: bad frequency message');
  await page.fill(R + '.fd-fc', '1k'); await page.selectOption(R + '.fd-build', 'sk'); await page.fill(R + '.fd-n', '13'); await page.waitForTimeout(200);
  check((await t('.fd-err')).includes('1 to 12'), 'filter: order limit message');
  await page.fill(R + '.fd-n', '2'); await page.fill(R + '.fd-c', '0'); await page.waitForTimeout(200);
  check((await t('.fd-err')).includes('capacitor'), 'filter: bad capacitor message');
  await page.fill(R + '.fd-c', '10n'); await page.waitForTimeout(200);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=pdf]')]); check((await d.suggestedFilename()).endsWith('.pdf'), 'filter: PDF download'); }
};
