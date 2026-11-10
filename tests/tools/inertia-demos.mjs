// #1484 Inertia demos
export const path = '/learn/inertia-demos/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/inertia-demos/`); await page.waitForTimeout(300);
  const st = () => page.getAttribute('.id .id-out', 'data-state');
  await page.fill('.id .id-s', '2'); await page.dispatchEvent('.id .id-s', 'input');
  check((await st()) === 'drops', 'inertia-demos: fast flick leaves the coin');
  await page.fill('.id .id-s', '0.2'); await page.dispatchEvent('.id .id-s', 'input');
  check((await st()) === 'dragged', 'inertia-demos: slow pull drags the coin');
  await page.click('.id .id-mode [data-m="bus"]');
  await page.fill('.id .id-a', '-3'); await page.dispatchEvent('.id .id-a', 'input');
  const l1 = await page.getAttribute('.id .id-out', 'data-lean');
  await page.fill('.id .id-a', '3'); await page.dispatchEvent('.id .id-a', 'input');
  const l2 = await page.getAttribute('.id .id-out', 'data-lean');
  check(l1 === 'forward' && l2 === 'back', 'inertia-demos: lean is opposite to acceleration');
  await page.click('.id .id-mode [data-m="mass"]');
  await page.fill('.id .id-m', '20'); await page.dispatchEvent('.id .id-m', 'input');
  check(+(await page.getAttribute('.id .id-out', 'data-t')) === 2, 'inertia-demos: 20 kg takes 2 s');
  { const a = await page.getAttribute('.id .lq-item', 'data-ans'); await page.fill('.id .lq-in', a); await page.click('.id .lq-check');
    check((await page.textContent('.id .lq-fb')) === 'Right.', 'inertia-demos: quiz accepts the right answer'); }
};
