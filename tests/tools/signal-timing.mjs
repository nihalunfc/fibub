// #684 Signal timing (Webster's method)
export const path = '/science/signal-timing/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/signal-timing/`); await page.waitForTimeout(1000);
  const big = () => page.textContent('.wbs .wb-big'), facts = () => page.textContent('.wbs .wb-facts'), ptab = () => page.textContent('.wbs .wb-ptab'), atab = () => page.textContent('.wbs .wb-atab'), err = () => page.textContent('.wbs .wb-err');
  const wait = () => page.waitForTimeout(400);
  const EX = 'Cycle 45 s · Y = 0.615 · average delay 15.0 s per vehicle';
  check((await big()) === EX, 'signal: example cycle, Y and delay');
  { const f = await facts(); check(f.includes('Webster optimum cycle C₀44.1 s') && f.includes('C₀ rounded up to 5 s') && f.includes('Shortest workable cycle20.8 s') && f.includes('Degree of saturation (critical)0.747') && f.includes('8.12 vehicle-hours'), 'signal: example facts'); }
  check((await ptab()).includes('1North0.33320.120.14.04.0') && (await ptab()).includes('2East0.28116.916.94.04.0'), 'signal: phase greens');
  { const t = await atab(); check(t.includes('North160018000.3338030.74714.84.26.244') && t.includes('East245016000.2816020.74718.03.54.934') && t.includes('West240016000.2506020.66415.53.14.229'), 'signal: approach capacity, saturation, delay and queues'); }
  check(await page.isVisible('.wbs .wb-bar') && await page.isVisible('.wbs .wb-curve'), 'signal: timing diagram and delay curve');
  // Rounding options.
  await page.selectOption('.wbs .wb-round', '0'); await wait();
  check((await big()) === 'Cycle 44.1 s · Y = 0.615 · average delay 14.9 s per vehicle' && (await facts()).includes('Cycle used44.1 sC₀'), 'signal: no rounding uses C0');
  await page.selectOption('.wbs .wb-round', '10'); await wait();
  check((await big()).startsWith('Cycle 50 s'), 'signal: round up to 10 s');
  await page.selectOption('.wbs .wb-round', '5');
  // Cycle limits and own cycle.
  await page.fill('.wbs .wb-cmin', '60'); await wait();
  check((await big()).startsWith('Cycle 60 s') && (await facts()).includes('raised to your shortest cycle'), 'signal: shortest cycle limit');
  await page.fill('.wbs .wb-cmin', ''); await page.fill('.wbs .wb-cmax', '40'); await wait();
  check((await big()).startsWith('Cycle 40 s') && (await facts()).includes('cut to your longest cycle'), 'signal: longest cycle limit');
  await page.fill('.wbs .wb-cmax', ''); await page.fill('.wbs .wb-cyc', '90'); await wait();
  check((await big()).startsWith('Cycle 90 s') && (await facts()).includes('your cycle') && (await ptab()).includes('1North0.33344.544.5'), 'signal: own cycle of 90 s');
  await page.fill('.wbs .wb-cyc', '20'); await wait();
  check((await err()).includes('over capacity') && await page.isVisible('.wbs .wb-out'), 'signal: too short a cycle warns of over capacity');
  await page.fill('.wbs .wb-cyc', ''); await wait();
  // Lost time, intergreen and space per vehicle.
  await page.fill('.wbs .wb-lost', '5'); await wait();
  check((await facts()).includes('Total lost time L10.0 s') && (await facts()).includes('(1.5 × 10.0 + 5)'), 'signal: lost time 5 s per phase');
  await page.fill('.wbs .wb-lost', '4'); await page.fill('.wbs .wb-int', '5'); await wait();
  check((await ptab()).includes('1North0.33320.119.15.04.0'), 'signal: intergreen 5 s shortens the displayed green');
  await page.fill('.wbs .wb-int', '4'); await page.fill('.wbs .wb-sp', '6'); await wait();
  check((await atab()).includes('North160018000.3338030.74714.84.26.237'), 'signal: queue in metres at 6 m per vehicle');
  await page.fill('.wbs .wb-sp', '7'); await wait();
  check((await big()) === EX, 'signal: back to the example');
  // Downloads.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.wbs .wb-csv')]); const f = OUT + 'sig.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 9 && r[0].startsWith('Phase,Critical approach') && r[4].startsWith('Approach,Phase') && r[5].startsWith('North,1,600,1800'), 'signal: CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.wbs .dl button[data-f=pdf]')]); check((await d.suggestedFilename()) === 'signal-timing.pdf', 'signal: report PDF'); }
  // Three phases, opened as a file.
  writeFileSync(OUT + 'sig3.csv', 'approach,phase,flow,sat\nN,1,500,1800\nS,1,450,1800\nE,2,400,1700\nW,2,350,1700\nLeft turns,3,200,1500\n');
  await page.setInputFiles('.wbs .dfb-in', OUT + 'sig3.csv'); await page.waitForTimeout(1000);
  { const y = 500 / 1800 + 400 / 1700 + 200 / 1500, c0 = (1.5 * 12 + 5) / (1 - y);
    check((await facts()).includes(`Webster optimum cycle C₀${c0.toFixed(1)} s`) && (await big()).startsWith(`Cycle ${Math.ceil(c0 / 5) * 5} s · Y = ${y.toFixed(3)}`) && (await ptab()).includes('3Left turns'), 'signal: three phases from a file (C0 by hand)'); }
  // Bad input.
  await page.fill('.wbs .wb-data', 'A\t1\t1200\t1800\nB\t2\t700\t1800'); await wait();
  check((await err()).includes('Y = 1.056') && await page.isHidden('.wbs .wb-out'), 'signal: Y ≥ 1 message');
  await page.fill('.wbs .wb-data', 'A\t1\t500\t1800\nB\t1\t400\t1800'); await wait();
  check((await err()).includes('at least 2 phases'), 'signal: one phase message');
  await page.fill('.wbs .wb-data', 'A\t1.5\t500\t1800\nB\t2\t400\t1800'); await wait();
  check((await err()).includes('whole number'), 'signal: bad phase number');
  await page.fill('.wbs .wb-data', 'A\t1\t500\t0\nB\t2\t400\t1800'); await wait();
  check((await err()).includes('saturation flow above 0'), 'signal: zero saturation flow');
  await page.fill('.wbs .wb-data', 'approach\tphase\tflow (veh/h)\tsaturation flow (veh/h)\nNorth\t1\t600\t1800\nSouth\t1\t500\t1800\nEast\t2\t450\t1600\nWest\t2\t400\t1600'); await page.fill('.wbs .wb-cmin', '80'); await page.fill('.wbs .wb-cmax', '60'); await wait();
  check((await err()).includes('shortest cycle allowed is longer'), 'signal: cycle limits the wrong way round');
  await page.fill('.wbs .wb-cmin', ''); await page.fill('.wbs .wb-cmax', ''); await wait();
  check((await big()) === EX, 'signal: example restored');
};
