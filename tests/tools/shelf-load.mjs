// #T1012 Shelf load
import { shelfLoad, allowedKg } from '../../src/lib/home/carpentry.ts';
export const path = '/everyday/shelf-load/';
export default async ({ page, check, BASE }) => {
  // Hand-worked: 22 kg (800 mm of books at 25 kg/m + 2 kg), W = 215.82 N, depth 250 so arm 125, h 200, 2 brackets x 2 screws.
  // Pull total 215.82 x 125 / 200 = 134.89 N, per top screw 67.44 N = 6.875 kg. Shear 215.82 / 4 = 53.96 N = 5.5 kg.
  { const r = shelfLoad({ kg: 22, depth: 250, brackets: 2, h: 200, screws: 2 });
    check(Math.abs(r.pull - 67.44) < 0.01 && Math.abs(r.pullKg - 6.875) < 1e-6 && Math.abs(r.shearKg - 5.5) < 1e-9 && r.tops === 2, `shelf-load: hand example (${r.pull})`); }
  { const r = shelfLoad({ kg: 22, depth: 250, brackets: 2, h: 300, screws: 2 }); check(Math.abs(r.pullKg - 4.583) < 0.001, 'shelf-load: taller bracket 300 mm -> 4.6 kg'); }
  { const r = shelfLoad({ kg: 22, depth: 250, brackets: 2, h: 200, screws: 2, front: true }); check(Math.abs(r.pullKg - 13.75) < 1e-6, 'shelf-load: load at the front edge doubles the pull'); }
  { const r = shelfLoad({ kg: 22, depth: 250, brackets: 2, h: 200, screws: 4 }); check(r.tops === 4 && Math.abs(r.pullKg - 3.4375) < 1e-6 && r.all === 8, 'shelf-load: 4 screws per bracket, 2 top screws each'); }
  check(Math.abs(allowedKg(25, 'ultimate', 3) - 8.333) < 0.001 && allowedKg(25, 'safe', 3) === 25, 'shelf-load: allowed load with safety factor');
  await page.goto(`${BASE}/everyday/shelf-load/`); await page.waitForTimeout(300);
  const R = '.shl ';
  const big = () => page.textContent(R + '.shl-big'), ver = () => page.textContent(R + '.shl-verdict');
  check((await big()) === 'Top screw pulled out with 6.9 kg (67 N)', `shelf-load: default on page (${await big()})`);
  check((await ver()).startsWith('Close to the limit: 6.9 kg on the busiest screw against 8.3 kg allowed'), `shelf-load: verdict (${await ver()})`);
  check((await page.textContent(R + '.shl-lines')).includes('54 N = 5.5 kg'), 'shelf-load: shear per screw on page');
  check((await page.locator(R + '.shl-fig path').count()) > 5, 'shelf-load: side-view drawing');
  await page.fill(R + '[data-k=h]', '300');
  check((await big()) === 'Top screw pulled out with 4.6 kg (45 N)', `shelf-load: taller bracket on page (${await big()})`);
  check((await ver()).startsWith('Within the rating'), 'shelf-load: within the rating');
  await page.selectOption(R + '[data-k=what]', 'kg'); await page.fill(R + '[data-k=kg]', '60');
  check((await ver()).startsWith('Over the rating'), `shelf-load: 62 kg is over (${await ver()})`);
  await page.selectOption(R + '[data-k=kind]', 'safe');
  check(await page.locator(R + '.shl-sf').isHidden(), 'shelf-load: safety factor hidden for a safe working load');
};
