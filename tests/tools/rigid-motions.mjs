// #L334 Rigid motions
export const path = '/learn/rigid-motions/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/rigid-motions/`); await page.waitForTimeout(300);
  const at = (k) => page.getAttribute('.rm .rm-out', 'data-' + k);
  check((await at('x0')) === '4.000' && (await at('y0')) === '3.000' && (await at('rigid')) === 'true', 'rigid-motions: slide (3, 2) puts A at (4, 3)');
  await page.click('.rm .rm-kind [data-k="dilate"]');
  check(Math.abs(+(await at('area')) - 8) < 1e-3 && (await at('rigid')) === 'false', 'rigid-motions: resize by 2 makes area 8 and is not rigid');
  await page.click('.rm .rm-kind [data-k="rotate"]');
  check(Math.abs(+(await at('x0')) + 1) < 1e-3 && Math.abs(+(await at('y0')) - 1) < 1e-3, 'rigid-motions: turn 90 degrees sends (1, 1) to (-1, 1)');
  { const a = await page.getAttribute('.rm .lq-item', 'data-ans'); await page.fill('.rm .lq-in', a); await page.click('.rm .lq-check');
    check((await page.textContent('.rm .lq-fb')) === 'Right.', 'rigid-motions: quiz accepts the right answer'); }
};
