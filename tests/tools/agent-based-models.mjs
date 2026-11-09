// #587 agent-based model playground
export const path = '/science/agent-based-models/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/agent-based-models/`); await page.waitForTimeout(600);
  const status = () => page.textContent('.abm .ab-status'), facts = () => page.textContent('.abm .ab-facts');
  check((await status()) === 'Step 0' && (await facts()).includes('Polarisation0.102') && await page.isVisible('.abm .ab-world') && await page.isVisible('.abm .ab-chart'), 'abm: boids at step 0 (polarisation 0.102)');
  for (let k = 0; k < 3; k++) await page.click('.abm .ab-step');
  check((await status()) === 'Step 3', 'abm: step button');
  await page.click('.abm .ab-run'); await page.waitForTimeout(800);
  check((await page.textContent('.abm .ab-run')) === 'Pause' && (await status()).endsWith('running'), 'abm: run');
  await page.click('.abm .ab-run'); await page.waitForTimeout(100);
  { const s = await status(), n = Number(s.match(/Step (\d+)/)[1]); await page.waitForTimeout(300); check(n > 10 && (await status()) === s && (await page.textContent('.abm .ab-run')) === 'Run', `abm: pause (${s})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.abm .ab-csv')]); const f = OUT + 'boids.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'step,polarisation,mean nearest distance' && rows[1].startsWith('0,0.1015993') && rows.length > 10, 'abm: boids CSV'); }
  await page.click('.abm .ab-reset'); check((await status()) === 'Step 0', 'abm: reset');
  await page.selectOption('.abm .ab-m', 'schelling'); await page.waitForTimeout(200);
  check((await facts()).includes('Neighbours alike49.5 %') && (await facts()).includes('Unhappy30.8 %') && (await page.textContent('.abm .ab-legend')).includes('Group A'), 'abm: Schelling start');
  await page.selectOption('.abm .ab-speed', '10'); await page.click('.abm .ab-run'); await page.waitForTimeout(2500);
  check((await status()) === 'Step 27. Stopped: everyone is happy.' && (await facts()).includes('83.2 %') && (await page.textContent('.abm .ab-run')) === 'Run', `abm: Schelling settles after 26 moves (${await status()})`);
  await page.fill('.abm .ab-st', '0'); await page.waitForTimeout(600); await page.click('.abm .ab-step');
  check((await status()).includes('everyone is happy') && (await status()).startsWith('Step 1'), 'abm: threshold 0, nobody moves');
  await page.selectOption('.abm .ab-m', 'sir'); await page.waitForTimeout(200);
  check((await facts()).includes('Infected5') && (await facts()).includes('Susceptible6,395'), 'abm: SIR start');
  await page.click('.abm .ab-run'); await page.waitForTimeout(4000);
  check((await status()) === 'Step 183. Stopped: nobody is infected any more.' && (await facts()).includes('Recovered6,383') && (await facts()).includes('16.4 %'), `abm: SIR epidemic runs its course (${await status()})`);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.abm .ab-csv')]); const f = OUT + 'sir.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'step,susceptible %,infected %,recovered %' && rows.length === 185, 'abm: SIR CSV'); }
  await page.selectOption('.abm .ab-inb', '8'); await page.fill('.abm .ab-seed', '9'); await page.waitForTimeout(600);
  check((await status()) === 'Step 0' && (await page.inputValue('.abm .ab-seed')) === '9', 'abm: changing a parameter resets');
  await page.fill('.abm .ab-ib', '2'); await page.waitForTimeout(600);
  check((await page.textContent('.abm .ab-err')).includes('β must be between 0 and 1') && await page.isHidden('.abm .ab-out'), 'abm: bad input message');
  await page.fill('.abm .ab-ib', '0.25'); await page.waitForTimeout(600);
  await page.selectOption('.abm .ab-m', 'boids'); await page.fill('.abm .ab-n', '0'); await page.waitForTimeout(600);
  check((await page.textContent('.abm .ab-err')).includes('number of boids'), 'abm: boids count message');
  await page.fill('.abm .ab-n', '150'); await page.waitForTimeout(600);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.abm .dl [data-f=png]')]); check((await d.suggestedFilename()).endsWith('.png'), 'abm: image report'); }
};
