// #99 decay calculator: half-life solver
export const path = '/science/decay-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/science/decay-calculator/`); await page.waitForTimeout(600);
  const R = '.dec ', big = () => page.textContent(R + '.hl-big'), err = () => page.textContent(R + '.hl-err');
  const wait = () => page.waitForTimeout(150);
  check((await big()) === 'Amount left N = 25' && (await page.textContent(R + '.hl-facts')).includes('2'), `decay: default 100 after 10 y with T½ 5 y (${await big()})`);
  check((await page.textContent(R + '.hl-steps')).includes('2^(−2)'), 'decay: working shown');
  await page.fill(R + '.hl-nt', '12.5'); await page.fill(R + '.hl-t', ''); await wait();
  check((await big()) === 'Time passed t = 15 years', `decay: solve for time (${await big()})`);
  await page.click(R + '.hl-clear'); await page.fill(R + '.hl-n0', '100'); await page.fill(R + '.hl-nt', '25'); await page.fill(R + '.hl-t', '10'); await wait();
  check((await big()) === 'Half-life T½ = 5 years', `decay: solve for half-life (${await big()})`);
  await page.click(R + '.hl-clear'); await page.fill(R + '.hl-nt', '25'); await page.fill(R + '.hl-t', '10'); await page.fill(R + '.hl-T', '5'); await wait();
  check((await big()) === 'Starting amount N₀ = 100', `decay: solve for the start (${await big()})`);
  await page.fill(R + '.hl-nt', '200'); await page.fill(R + '.hl-n0', ''); await page.fill(R + '.hl-t', ''); await wait();
  check((await err()).includes('three boxes'), `decay: two empty boxes asked about (${await err()})`);
  await page.fill(R + '.hl-n0', '100'); await page.fill(R + '.hl-T', ''); await page.fill(R + '.hl-t', '5'); await wait();
  check((await err()).includes('cannot be more'), `decay: amount left above the start refused (${await err()})`);
  await page.click(R + '.hl-use'); await wait();
  check((await page.inputValue(R + '.hl-u')) === 'min' && (await page.inputValue(R + '.hl-T')) === '109.77', 'decay: use the nuclide half-life');
};
