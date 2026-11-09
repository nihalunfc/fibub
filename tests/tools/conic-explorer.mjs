// #1188 conic explorer (maths checked with NumPy in tests/sci-tools/conic-explorer.mjs)
export const path = '/learn/conic-explorer/';
export default async ({ page, check, BASE }) => {
  const R = '.cnx ';
  const t = (s) => page.textContent(R + s);
  const slide = (s, v) => page.$eval(R + s, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v));
  const pick = (k) => page.click(R + `.cn-k button[data-k="${k}"]`);
  await page.goto(`${BASE}/learn/conic-explorer/`); await page.waitForTimeout(500);
  check((await t('.cn-eq')) === 'x²/25 + y²/9 = 1', `conics: example ellipse (${await t('.cn-eq')})`);
  { const f = await t('.cn-facts'); check(f.includes('Eccentricity e0.8') && f.includes('(4, 0) and (−4, 0)') && f.includes('x = 6.25, x = −6.25') && f.includes('Latus rectum3.6'), `conics: ellipse facts (${f})`); }
  check((await t('.cn-pnote')).includes('sum = 10 = 2a') && (await t('.cn-pnote')).includes('= 0.8 = e'), `conics: ellipse distances (${await t('.cn-pnote')})`);
  const px = await page.evaluate(() => { const c = document.querySelector('.cn-fig'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] > 120 && d[i + 1] < 80 && d[i + 2] < 80) n++; return n; });
  check(px > 20, `conics: foci drawn in red (${px} px)`);
  await slide('.cn-t', 700); check((await t('.cn-pnote')).includes('sum = 10 = 2a'), 'conics: sum stays 2a as P moves');
  await slide('.cn-b', 5); check((await t('.cn-pnote')).includes('is a circle') && (await t('.cn-facts')).includes('Eccentricity e0'), 'conics: a = b gives a circle');
  await slide('.cn-b', 6); check((await t('.cn-facts')).includes('(0, 3.32) and (0, −3.32)'), `conics: vertical ellipse (${await t('.cn-facts')})`);
  await pick('hyperbola'); await slide('.cn-a', 3); await slide('.cn-b', 4);
  { const f = await t('.cn-facts'); check((await t('.cn-eq')) === 'x²/9 − y²/16 = 1' && f.includes('1.6667') && f.includes('x = 1.8') && f.includes('10.6667'), `conics: hyperbola (${f})`); }
  check(/difference = −?6 = ±2a/.test((await t('.cn-pnote')).replace('−', '-').replace('-6', '6')), `conics: hyperbola difference (${await t('.cn-pnote')})`);
  await page.check(R + '.cn-vert'); check((await t('.cn-eq')) === 'y²/9 − x²/16 = 1' && (await t('.cn-facts')).includes('(0, 5)'), 'conics: vertical hyperbola');
  await pick('parabola'); check((await t('.cn-eq')) === 'y² = 6x' && (await t('.cn-facts')).includes('x = −1.5') && (await t('.cn-facts')).includes('Latus rectum6'), `conics: parabola (${await t('.cn-facts')})`);
  { const m = (await t('.cn-pnote')).match(/PF = (\d+(?:\.\d+)?) and to the directrix PD = (\d+(?:\.\d+)?)/); check(m && m[1] === m[2], `conics: PF = PD (${await t('.cn-pnote')})`); }
  await page.selectOption(R + '.cn-dir', 'down'); check((await t('.cn-eq')) === 'x² = −6y' && (await t('.cn-facts')).includes('(0, −1.5)'), 'conics: parabola opening down');
  check(await page.isHidden(R + '.cn-a') && await page.isVisible(R + '.cn-p'), 'conics: only the parabola sliders show');
  await pick('circle'); check((await t('.cn-eq')) === '(x − 1)² + y² = 9' && (await t('.cn-pnote')).includes('r = 3 away'), `conics: circle (${await t('.cn-eq')})`);
  await pick('slice');
  check((await t('.cn-stitle')) === 'The plane cuts an ellipse' && (await t('.cn-snote')).includes('= 0.5774'), `conics: slice ellipse (${await t('.cn-snote')})`);
  await slide('.cn-be', 30); check((await t('.cn-stitle')) === 'The plane cuts a parabola', 'conics: slice parabola');
  await slide('.cn-be', 20); check((await t('.cn-stitle')) === 'The plane cuts a hyperbola' && (await t('.cn-snote')).includes('1.0851'), 'conics: slice hyperbola');
  await slide('.cn-be', 90); check((await t('.cn-stitle')) === 'The plane cuts a circle', 'conics: slice circle');
  check(await page.isHidden(R + '.cn-main'), 'conics: slice view hides the equation view');
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'conics: five quiz questions');
  const q2 = await t('.smq-q:nth-child(2) .smq-text'); const N = +q2.match(/y² = (\d+)x/)[1];
  await page.fill(R + '.smq-q:nth-child(2) .smq-in', String(N / 4)); await page.click(R + '.smq-q:nth-child(2) .smq-check');
  check((await t('.smq-q:nth-child(2) .smq-out')) === 'Right!', 'conics: quiz answer');
};
