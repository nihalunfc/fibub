// #1411 Internal resistance and terminal voltage
export const path = '/learn/internal-resistance/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/internal-resistance/`); await page.waitForTimeout(600);
  const R = '.irs ', txt = (s) => page.textContent(R + s);
  const setR = (s, v) => page.$eval(R + s, (e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  check((await txt('.irs-big')) === 'I = 0.500 A, terminal voltage V = 1.25 V', `internal: example (${await txt('.irs-big')})`);
  const f = await txt('.irs-facts');
  check(f.includes('0.250 V') && f.includes('0.625 W') && f.includes('1.13 W') && f.includes('83.3%'), `internal: facts (${f})`);
  check((await txt('.irs-formula')).includes('V = E − I r = 1.50 − 0.500 × 0.500 = 1.25 V'), `internal: formula (${await txt('.irs-formula')})`);
  const inked = (s) => page.$eval(R + s, (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - d[0]) > 60) n++; return n; });
  check((await inked('.irs-fig')) > 500 && (await inked('.irs-graph')) > 200, 'internal: circuit and graph drawn');
  await page.click(R + '.irs-open'); check((await txt('.irs-big')) === 'Open circuit: V = E = 1.50 V, I = 0' && (await txt('.irs-open')) === 'Close the switch', 'internal: open circuit');
  await page.click(R + '.irs-open');
  await page.click(R + '.irs-short'); check((await txt('.irs-big')) === 'I = 3 A, terminal voltage V = 0 V', `internal: short circuit (${await txt('.irs-big')})`);
  await setR('.irs-l', 0.5);
  await page.click(R + '.irs-gmode button[data-v=pr]'); await page.waitForTimeout(100);
  check((await txt('.irs-gnote')).includes('1.13 W') && (await txt('.irs-facts')).includes('1.13 W') && (await txt('.irs-facts')).includes('50%'), 'internal: power peak at R = r');
  check((await inked('.irs-graph')) > 200, 'internal: power graph drawn');
  await page.click(R + '.irs-gmode button[data-v=vi]');
  // Readings and fit.
  check((await txt('.irs-fit')) === 'No readings yet.', 'internal: no readings');
  await setR('.irs-l', 2.5); await page.click(R + '.irs-rec');
  check((await txt('.irs-fit')).startsWith('Record at least two'), 'internal: one reading');
  await page.click(R + '.irs-rec'); check(!(await page.isHidden(R + '.irs-rerr')), 'internal: duplicate reading refused');
  await setR('.irs-l', 1); await page.click(R + '.irs-rec');
  await setR('.irs-l', 6); await page.click(R + '.irs-rec');
  check((await txt('.irs-fit')) === 'Best straight line: E ≈ 1.50 V, r ≈ 0.500 Ω (from 3 readings).' && (await page.$$(R + '.irs-tab tr')).length === 4, `internal: fit (${await txt('.irs-fit')})`);
  await setR('.irs-e', 6); check((await txt('.irs-fit')) === 'No readings yet.', 'internal: new cell clears readings');
  await page.click(R + '.irs-clear');
  check((await page.$$(R + '.eq-q')).length === 4, 'internal: four practice questions');
  const q1 = await page.textContent(R + '.eq-q:nth-child(1) p'), [E, r, L] = q1.match(/emf ([\d.]+) V and internal resistance ([\d.]+) Ω is connected to a ([\d.]+) Ω/).slice(1).map(Number);
  await page.fill(R + '.eq-q:nth-child(1) .eq-in', String((E * L) / (L + r))); await page.click(R + '.eq-q:nth-child(1) .eq-go');
  check((await page.textContent(R + '.eq-q:nth-child(1) .eq-res')).startsWith('Right'), 'internal: right answer accepted');
};
