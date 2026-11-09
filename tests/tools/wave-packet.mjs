// #924 wave packet tunnelling
export const path = '/science/wave-packet/';
export default async ({ page, check, OUT, BASE, readFileSync }) => {
  await page.goto(`${BASE}/science/wave-packet/`); await page.waitForTimeout(2000);
  const big = () => page.textContent('.wpk .wp-big'), facts = () => page.textContent('.wpk .wp-facts');
  const wait = () => page.waitForTimeout(2600);
  check((await big()) === 'R = 64.4 %, T = 35.6 %', 'packet: rectangular barrier example');
  check((await facts()).includes('0.356') && (await facts()).includes('0.3474'), 'packet: stationary comparison shown');
  check((await page.textContent('.wpk .wp-tl')) === 't = 0', 'packet: starts at t = 0');
  await page.locator('.wpk .wp-play').scrollIntoViewIfNeeded(); await page.click('.wpk .wp-play'); await page.waitForTimeout(1200);
  const tl = await page.textContent('.wpk .wp-tl'); check(tl !== 't = 0' && (await page.textContent('.wpk .wp-play')) === 'Pause', `packet: animation plays (${tl})`);
  await page.click('.wpk .wp-play');
  await page.fill('.wpk .wp-time', '75'); await page.dispatchEvent('.wpk .wp-time', 'input'); await page.waitForTimeout(200);
  check((await page.textContent('.wpk .wp-tl')).startsWith('t = 41'), 'packet: time slider');
  await page.selectOption('.wpk .wp-show', 're'); await page.waitForTimeout(200); check(await page.isVisible('.wpk .wp-anim'), 'packet: Re ψ drawing');
  await page.selectOption('.wpk .wp-b', 'double'); await wait();
  check((await big()) === 'R = 73.8 %, T = 26.2 %' && await page.isVisible('.wpk .wp-d'), 'packet: double barrier');
  await page.selectOption('.wpk .wp-b', 'step'); await wait();
  check((await big()) === 'R = 83.7 %, T = 16.3 %' && await page.isHidden('.wpk .wp-a'), 'packet: step');
  await page.selectOption('.wpk .wp-b', 'well'); await wait();
  check((await big()) === 'R = 0.4 %, T = 99.6 %', 'packet: well');
  await page.selectOption('.wpk .wp-b', 'gauss'); await wait();
  check((await big()) === 'R = 64.5 %, T = 35.5 %', 'packet: smooth barrier');
  await page.selectOption('.wpk .wp-b', 'rect'); await page.selectOption('.wpk .wp-u', 'electron'); await page.waitForTimeout(4000);
  check((await big()) === 'R = 86.6 %, T = 13.4 %' && (await facts()).includes('nm/fs'), 'packet: electron units');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.wpk .wp-csv')]); const f = OUT + 'wpT.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 301 && r[0] === 'E,T,R', 'packet: T(E) CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.wpk .wp-pcsv')]); const f = OUT + 'wpP.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 2049 && r[0] === 'x,V,prob_density,re_psi', 'packet: |ψ|² CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.wpk .dl [data-f=png]')]); check((await d.suggestedFilename()).endsWith('.png'), 'packet: image report'); }
  await page.selectOption('.wpk .wp-u', 'natural'); await page.waitForTimeout(2000);
  await page.fill('.wpk .wp-t', '20'); await wait();
  check((await page.textContent('.wpk .wp-note')).includes('still near the barrier'), 'packet: short run time leaves the packet near the barrier');
  await page.fill('.wpk .wp-t', ''); await page.fill('.wpk .wp-x', '-2'); await page.waitForTimeout(600);
  check((await page.textContent('.wpk .wp-err')).includes('on top of the barrier') && await page.isHidden('.wpk .wp-out'), 'packet: overlap message');
  await page.fill('.wpk .wp-x', '-20'); await page.fill('.wpk .wp-e', '400'); await page.waitForTimeout(600);
  check((await page.textContent('.wpk .wp-err')).includes('too coarse'), 'packet: coarse grid message');
  await page.fill('.wpk .wp-e', '0'); await page.waitForTimeout(600);
  check((await page.textContent('.wpk .wp-err')).includes('energy'), 'packet: energy message');
  await page.fill('.wpk .wp-e', '1.125'); await page.fill('.wpk .wp-s', '0.1'); await page.waitForTimeout(600);
  check((await page.textContent('.wpk .wp-err')).includes('too narrow'), 'packet: narrow packet message');
};
