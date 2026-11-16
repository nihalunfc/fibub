// #T996 Heat stress
import { stullWetBulb, wbgtOutdoor, wbgtIndoor, wbgtEstimate, flagFor } from '../../src/lib/sci/wbgt.ts';
export const path = '/science/heat-stress/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/science/heat-stress/`); await page.waitForTimeout(300);
  const lead = () => page.textContent('.hx .hx-lead');
  check((await lead()).includes('29.3 °C') && (await lead()).includes('Green'), 'heat-stress: estimate 30 C 50% is 29.3 C green (green band 27.8-29.4) (' + (await lead()) + ')');
  check((await page.textContent('.hx .hx-stats')).includes('Wet-bulb'), 'heat-stress: shows wet-bulb');
  await page.selectOption('.hx [data-k="mode"]', 'meas'); await page.fill('.hx [data-k="ta"]', '32'); await page.waitForTimeout(100);
  check((await lead()).includes('28.7 °C') && (await lead()).includes('Green'), 'heat-stress: measured in sun 28.7 C (' + (await lead()) + ')');
  await page.selectOption('.hx [data-k="where"]', 'shade'); await page.waitForTimeout(100);
  check((await lead()).includes('29.5 °C'), 'heat-stress: shade 29.5 C');
  await page.selectOption('.hx [data-k="unit"]', 'F'); await page.waitForTimeout(100);
  check((await lead()).includes('85.1 °F'), 'heat-stress: switch to F (' + (await lead()) + ')');
  check(Math.abs(stullWetBulb(20, 50) - 13.7) < 0.05 && Math.abs(wbgtOutdoor(25, 40, 32) - 28.7) < 1e-9 && Math.abs(wbgtIndoor(25, 40) - 29.5) < 1e-9 && Math.abs(wbgtEstimate(30, 50) - 29.26) < 0.01 && flagFor(32.2).id === 'black' && flagFor(27.7).id === 'white', 'heat-stress: lib checks');
};
