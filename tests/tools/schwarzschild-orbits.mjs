// #968 Schwarzschild orbit plotter
export const path = '/science/schwarzschild-orbits/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.swo ';
  const big = () => page.textContent(R + '.sw-big'), facts = () => page.textContent(R + '.sw-facts'), err = () => page.textContent(R + '.sw-err');
  const set = async (c, v) => { await page.fill(R + c, v); await page.waitForTimeout(350); };
  await page.goto(`${BASE}/science/schwarzschild-orbits/`); await page.waitForTimeout(900);
  check((await big()) === 'Periapsis advances 105.8° per orbit', 'gr: example orbit precession');
  { const f = await facts(); check(f.includes('0.976315') && f.includes('4.3759 M c') && f.includes('formula 6πM/(a(1 − e²)) gives 72°') && f.includes('147.7 km and 443 km'), 'gr: orbit facts'); }
  { const t = await page.textContent(R + '.sw-tab'); check(t.includes('29.53 km') && t.includes('88.6 km') && t.includes('4.548 ms') && t.includes('5.196M'), 'gr: key radii table'); }
  check(await page.isVisible(R + '.sw-fig') && await page.isVisible(R + '.sw-vfig'), 'gr: orbit and potential figures');
  await set('.sw-ra', '10'); { const f = await facts(); check(f.includes('Circular orbit period') && f.includes('speed 0.354c'), 'gr: circular orbit'); }
  await set('.sw-rp', '5'); await set('.sw-ra', '5'); check((await err()).includes('unstable') && await page.isHidden(R + '.sw-out'), 'gr: circular orbit inside the ISCO');
  await set('.sw-ra', '8'); check((await err()).includes('plunge'), 'gr: plunging orbit message');
  await set('.sw-rp', '10'); await set('.sw-ra', '30'); await set('.sw-n', '2');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.sw-csv')]); const f = OUT + 'sw.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'phi (rad),r (M),x (M),y (M)' && rows[1].startsWith('0,10,10,0') && rows.length > 100, 'gr: orbit path CSV'); }
  await set('.sw-n', '11'); check((await err()).includes('1 to 10'), 'gr: turns message');
  await set('.sw-n', '4'); await set('.sw-m', '4e6'); { const t = await page.textContent(R + '.sw-tab'); check(t.includes('0.07897 au'), 'gr: supermassive black hole horizon in au'); }
  await set('.sw-m', '10');
  await page.selectOption(R + '.sw-mode', 'light'); await page.waitForTimeout(500);
  check((await big()) === 'Bent by 98.51°, closest approach 4.453M' && await page.isHidden(R + '.sw-vfig') && await page.isHidden(R + '.sw-rp'), 'gr: light ray bending');
  check((await facts()).includes('65.76 km'), 'gr: closest approach in km');
  await set('.sw-b', '5'); check((await big()).startsWith('Captured') && (await facts()).includes('falls through the horizon'), 'gr: captured light ray');
  await set('.sw-b', '5.2'); check((await facts()).includes('loops the hole'), 'gr: ray looping near the photon sphere');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=docx]')]); const f = OUT + 'sw.docx'; await d.saveAs(f); check(readFileSync(f).subarray(0, 2).toString() === 'PK', 'gr: Word report'); }
  await set('.sw-b', '-1'); check((await err()).includes('impact parameter'), 'gr: bad impact parameter message');
  await set('.sw-b', '6'); await set('.sw-m', '0'); check((await err()).includes('solar masses'), 'gr: bad mass message');
  await set('.sw-m', '10'); check((await big()).startsWith('Bent by 98.51°'), 'gr: back to the light ray');
};
