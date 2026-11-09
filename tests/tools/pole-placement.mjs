// #638 state space and pole placement
export const path = '/science/pole-placement/';
export default async ({ page, check, OUT, BASE, readFileSync }) => {
  await page.goto(`${BASE}/science/pole-placement/`); await page.waitForTimeout(700);
  const big = () => page.textContent('.ppl .pp-big'), facts = () => page.textContent('.ppl .pp-facts'), dfacts = () => page.textContent('.ppl .pp-dfacts');
  check((await big()) === 'K = [20, 9.8125, 1.375]', `pole placement: example K (${await big()})`);
  { const t = await facts(); check(t.includes('3 states, 1 input, 1 output') && t.includes('0, −0.7769, −7.723') && t.includes('rank 3 of 3') && t.includes('not asymptotically stable'), 'pole placement: analysis facts'); }
  { const t = await dfacts(); check(t.includes('−2 + 2j, −2 − 2j, −10') && t.includes('Reference gain N20') && t.includes('[47.5, 358.25, 1969]') && t.includes('−8 + 8j, −8 − 8j, −40'), 'pole placement: closed-loop poles, N and observer'); }
  { const t = await page.textContent('.ppl .pp-sfacts'); check(t.includes('Overshoot4.1') && /Rise time \(10–90 %\)0\.79/.test(t) && /Settling time \(2 %\)2\.2/.test(t), `pole placement: step info (${t})`); }
  check((await page.$$eval('.ppl .pp-ctab tr', (r) => r.length)) === 3 && (await page.textContent('.ppl .pp-ctab')).includes('−32'), 'pole placement: controllability matrix');
  await page.fill('.ppl .pp-O', ''); await page.waitForTimeout(500);
  check((await dfacts()).includes('−8 + 8j, −8 − 8j, −40'), 'pole placement: automatic observer poles 4 × faster');
  await page.uncheck('.ppl .pp-N'); await page.waitForTimeout(300);
  check((await dfacts()).includes('1 (off)') && (await page.textContent('.ppl .pp-sfacts')).includes('Final value0.05'), 'pole placement: without reference scaling the output settles at 1/N');
  await page.check('.ppl .pp-N'); await page.fill('.ppl .pp-P', '-1±1j, -3'); await page.waitForTimeout(500);
  check((await dfacts()).includes('−1 + 1j, −1 − 1j, −3') && !(await big()).includes('9.8125'), 'pole placement: other poles');
  await page.fill('.ppl .pp-P', '-1+1j, -3, -4'); await page.waitForTimeout(500);
  check((await page.textContent('.ppl .pp-derr')).includes('conjugate'), 'pole placement: missing conjugate message');
  await page.fill('.ppl .pp-P', '-1, -2'); await page.waitForTimeout(500);
  check((await page.textContent('.ppl .pp-derr')).includes('Give 3 poles'), 'pole placement: wrong number of poles');
  await page.fill('.ppl .pp-P', '1, -2, -3'); await page.waitForTimeout(500);
  check((await page.textContent('.ppl .pp-sfacts')).includes('unstable closed loop'), 'pole placement: unstable choice reported');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.ppl .pp-csv')]); const f = OUT + 'pp.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'time_s,y1' && rows.length === 406 && rows[403].startsWith('K,') && rows[404].startsWith('N,') && rows[405].startsWith('L,'), 'pole placement: CSV'); }
  // A stable two-state system with two inputs: analysis works, placement says it is not supported.
  await page.fill('.ppl .pp-A', '-1 1\n0 -2'); await page.fill('.ppl .pp-B', '1 0\n0 1'); await page.fill('.ppl .pp-C', '1 0\n0 1'); await page.fill('.ppl .pp-D', ''); await page.waitForTimeout(600);
  check((await facts()).includes('2 states, 2 inputs, 2 outputs') && (await facts()).includes('stable') && (await page.textContent('.ppl .pp-derr')).includes('single input'), 'pole placement: MIMO analysis, placement not supported');
  await page.fill('.ppl .pp-A', '-1 0\n0 -2'); await page.fill('.ppl .pp-B', '1\n0'); await page.fill('.ppl .pp-C', '1 1'); await page.fill('.ppl .pp-P', '-3, -4'); await page.waitForTimeout(600);
  check((await facts()).includes('rank 1 of 2') && (await page.textContent('.ppl .pp-derr')).includes('not controllable'), 'pole placement: uncontrollable system');
  await page.fill('.ppl .pp-A', '-1 0\n0 -2'); await page.fill('.ppl .pp-B', '1\n1'); await page.fill('.ppl .pp-C', '1 0'); await page.fill('.ppl .pp-O', ''); await page.waitForTimeout(600);
  check((await dfacts()).includes('not observable') && await page.isVisible('.ppl .pp-fig'), 'pole placement: unobservable, observer refused but feedback works');
  await page.fill('.ppl .pp-A', '1 2\n3'); await page.waitForTimeout(500);
  check((await page.textContent('.ppl .pp-err')).includes('same number of entries') && await page.isHidden('.ppl .pp-out'), 'pole placement: ragged matrix message');
  await page.fill('.ppl .pp-A', '1 2\n3 4'); await page.fill('.ppl .pp-B', '1\n2\n3'); await page.waitForTimeout(500);
  check((await page.textContent('.ppl .pp-err')).includes('B needs 2 rows'), 'pole placement: size mismatch message');
  await page.click('.ppl .pp-ex'); await page.waitForTimeout(500);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.ppl .dl [data-f=pdf]')]); const f = OUT + 'pp.pdf'; await d.saveAs(f); check(readFileSync(f).subarray(0, 4).toString() === '%PDF', 'pole placement: PDF report'); }
};
