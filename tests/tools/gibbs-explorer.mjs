// #1361 ΔG = ΔH − TΔS explorer (maths in tests/sci-tools/gibbs-explorer.mjs)
export const path = '/learn/gibbs-explorer/';
export default async ({ page, check, BASE }) => {
  const R = '.gbx ';
  const t = (s) => page.textContent(R + s);
  const slide = (s, v) => page.$eval(R + s, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v));
  await page.goto(`${BASE}/learn/gibbs-explorer/`); await page.waitForTimeout(500);
  check((await t('.gb-big')) === 'ΔG = −32.99 kJ/mol: spontaneous', `gibbs: ammonia at 298 K (${await t('.gb-big')})`);
  check((await t('.gb-eq')).includes('−92.2 − 298 × (−198.7 ÷ 1000)'), `gibbs: formula with numbers (${await t('.gb-eq')})`);
  { const f = await t('.gb-facts'); check(f.includes('464 K') && f.includes('−92200 ÷ −198.7') && f.includes('Spontaneous when cold'), `gibbs: crossover and case (${f})`); }
  check(await page.$eval(R + '.gb-cases tr[data-c=low]', (e) => e.classList.contains('gb-on')), 'gibbs: low-temperature row lit');
  const px = await page.evaluate(() => { const c = document.querySelector('.gb-fig'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 80 && d[i + 2] > 140) n++; return n; });
  check(px > 50, `gibbs: ΔG line drawn (${px} px)`);
  await slide('.gb-t', 600); check((await t('.gb-big')).includes('not spontaneous'), 'gibbs: ammonia not spontaneous at 600 K');
  await page.selectOption(R + '.gb-pre', 'ice'); check((await t('.gb-big')).includes('not spontaneous') && (await t('.gb-facts')).includes('273.2 K'), `gibbs: ice below melting (${await t('.gb-facts')})`);
  await page.fill(R + '.gb-tn', '300'); check((await t('.gb-big')) === 'ΔG = −0.59 kJ/mol: spontaneous', `gibbs: typed T 300 (${await t('.gb-big')})`);
  check(await page.$eval(R + '.gb-pre', (e) => e.value) === 'own', 'gibbs: typing switches to own numbers');
  await page.fill(R + '.gb-tn', '5000'); check(await page.isVisible(R + '.gb-err'), 'gibbs: out of range message');
  await page.fill(R + '.gb-tn', '298'); check(await page.isHidden(R + '.gb-err'), 'gibbs: message clears');
  await page.selectOption(R + '.gb-pre', 'h2o2'); check((await t('.gb-facts')).includes('Always spontaneous') && (await t('.gb-facts')).includes('never'), 'gibbs: always case');
  await page.selectOption(R + '.gb-pre', 'o3'); check((await t('.gb-facts')).includes('Never spontaneous'), 'gibbs: never case');
  await page.selectOption(R + '.gb-pre', 'caco3'); check((await t('.gb-facts')).includes('1110.9 K') && (await t('.gb-facts')).includes('Spontaneous when hot'), 'gibbs: limestone');
  check(await page.isHidden(R + '.gb-for12'), 'gibbs: n hidden at Class 11');
  await page.selectOption(R + '.gb-pre', 'nh3'); await page.click(R + '.gb-lv button[data-l="12"]');
  { const f = await t('.gb-facts'); check(f.includes('6.05 × 10^5') && f.includes('0.171 V'), `gibbs: K and E° at Class 12 (${f})`); }
  check(await page.isVisible(R + '.gb-n'), 'gibbs: n shown at Class 12');
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 4, 'gibbs: four quiz questions');
  const q1 = await t('.smq-q:nth-child(1) .smq-text'); const m = q1.match(/ΔH = (−?\d+) kJ\/mol and ΔS = (−?\d+) J\/\(K·mol\)\. What is ΔG at (\d+) K/);
  const ans = +m[1].replace('−', '-') - (+m[3] * +m[2].replace('−', '-')) / 1000;
  await page.fill(R + '.smq-q:nth-child(1) .smq-in', String(ans)); await page.click(R + '.smq-q:nth-child(1) .smq-check');
  check((await t('.smq-q:nth-child(1) .smq-out')) === 'Right!', 'gibbs: quiz answer');
};
