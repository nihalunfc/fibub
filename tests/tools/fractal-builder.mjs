// #1248 Fractal builder
export const path = '/learn/fractal-builder/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/fractal-builder/`); await page.waitForSelector('.fb .fb-fig .fb-shape');
  const R = '.fb ', txt = (s) => page.textContent(R + s);
  check((await txt('.fb-big')) === 'Step 2: 48 sides, perimeter 48 cm, area 51.962 cm²', 'fb: Koch step 2 from 9 cm');
  check((await page.getAttribute(R + '.fb-shape', 'points')).split(' ').length === 48, 'fb: 48 corners drawn');
  check((await page.$$(R + '.fb-tab tr')).length === 8 && (await txt('.fb-tab tr.fb-cur')).startsWith('248'), 'fb: table with step 2 highlighted');
  check((await txt('.fb-lim')).includes('56.118 cm²'), 'fb: area limit 8/5');
  await page.fill(R + '.fb-n', '6'); await page.waitForTimeout(150);
  check((await txt('.fb-big')).startsWith('Step 6: 12,288 sides, perimeter 151.7 cm'), 'fb: step 6');
  await page.fill(R + '.fb-n', '1'); await page.waitForTimeout(80);
  check((await txt('.fb-big')) === 'Step 1: 12 sides, perimeter 36 cm, area 46.765 cm²', 'fb: step 1');
  await page.fill(R + '.fb-s', '0'); await page.waitForTimeout(80);
  check(await page.isVisible(R + '.fb-err'), 'fb: bad side message');
  await page.click(R + '.fb-k button[data-k="sier"]'); await page.fill(R + '.fb-n', '3'); await page.waitForTimeout(80);
  check(await page.isHidden(R + '.fb-err') && (await txt('.fb-big')) === 'Step 3: 27 triangles, area 11.691 cm²' && (await page.$$(R + '.fb-tri')).length === 27, 'fb: Sierpinski step 3 from 8 cm');
  check((await txt('.fb-f')).includes('8 ÷ 2^3 = 1 cm') && (await txt('.fb-f')).includes('All their edges together: 81 cm'), 'fb: Sierpinski side and edges');
  check((await page.$$(R + '.sm-q')).length === 4, 'fb: four questions');
  const get = [/= (\d+)\.$/, /= ([\d.]+) cm\.$/, /= (\d+)\.$/, /= ([\d.]+)\.$/];
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`), m = get[i - 1].exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `fb: quiz question ${i} (${w})`);
  }
};
