// #969 gravitational-wave chirp calculator
export const path = '/science/gw-chirp/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.gwc ';
  const big = () => page.textContent(R + '.gw-big'), facts = () => page.textContent(R + '.gw-facts'), err = () => page.textContent(R + '.gw-err');
  const set = async (c, v) => { await page.fill(R + c, v); await page.waitForTimeout(400); };
  await page.goto(`${BASE}/science/gw-chirp/`); await page.waitForTimeout(800);
  check((await big()) === '1.09 s and 32.1 cycles from 20 Hz to 79.9 Hz', 'gw: example chirp');
  { const f = await facts(); check(f.includes('23.82 M☉') && f.includes('79.95 Hz') && f.includes('6.74 Hz/s') && f.includes('4.32 × 10⁻²²') && f.includes('1.09 × 10⁻²¹') && f.includes('1227 km') && f.includes('1.11 s to the formal'), 'gw: chirp facts'); }
  check(await page.isVisible(R + '.gw-ffig') && await page.isVisible(R + '.gw-hfig') && await page.isVisible(R + '.gw-cfig'), 'gw: three charts');
  await set('.gw-d', '800'); check((await facts()).includes('2.16 × 10⁻²²') && (await big()).startsWith('1.09 s'), 'gw: distance changes strain, not timing');
  await set('.gw-d', '400'); await set('.gw-z', '1'); { const f = await facts(); check(f.includes('47.64 M☉ as seen by the detector') && (await big()).includes('to 40 Hz'), 'gw: redshift'); }
  await set('.gw-z', '0'); await set('.gw-m1', '1.4'); await set('.gw-m2', '1.4'); check((await big()).startsWith('2.63 min and 5048 cycles from 20 Hz to 1570 Hz'), `gw: neutron star binary (${await big()})`);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.gw-csv')]); const f = OUT + 'gw.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 402 && rows[0].startsWith('time to coalescence (s),GW frequency') && rows[1].split(',')[1] === '20', 'gw: CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=pdf]')]); const f = OUT + 'gw.pdf'; await d.saveAs(f); check(readFileSync(f).subarray(0, 4).toString() === '%PDF', 'gw: PDF report'); }
  await set('.gw-f', '2000'); check((await err()).includes('below the ISCO frequency') && await page.isHidden(R + '.gw-out'), 'gw: start above ISCO message');
  await set('.gw-f', '0.001'); check((await big()).includes('from 0.001 Hz'), 'gw: millihertz start');
  await set('.gw-f', '20'); await set('.gw-m1', '0'); check((await err()).includes('both masses'), 'gw: bad mass message');
  await set('.gw-m1', '30'); await set('.gw-d', '-5'); check((await err()).includes('distance'), 'gw: bad distance message');
  await set('.gw-d', '400'); await set('.gw-z', '30'); check((await err()).includes('redshift'), 'gw: bad redshift message');
  await set('.gw-z', '0'); await set('.gw-m2', '25'); check((await big()) === '1.09 s and 32.1 cycles from 20 Hz to 79.9 Hz', 'gw: back to the example');
};
