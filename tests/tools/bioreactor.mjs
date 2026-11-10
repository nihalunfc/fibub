// #1457 bioreactor (model checked against scipy in tests/sci-tools/bioreactor.mjs)
export const path = '/learn/bioreactor/';
export default async ({ page, check, BASE }) => {
  const R = '.bre ';
  const t = (s) => page.textContent(R + s);
  const slide = (s, v) => page.$eval(R + s, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v));
  await page.goto(`${BASE}/learn/bioreactor/`); await page.waitForTimeout(500);
  { const f = await t('.br-facts'); check(f.includes('10.1 g/L') && f.includes('after 9.7 h') && f.includes('37.8 °C') && f.includes('6.85'), `bio: all loops on (${f})`); }
  check((await t('.br-gauges')).includes('37.6 °C') && (await t('.br-say')).includes('close to the best'), `bio: hour 8 (${await t('.br-gauges')})`);
  await page.uncheck(R + '.br-ton');
  check((await t('.br-facts')).includes('44.9 °C') && (await t('.br-facts')).includes('not in 24 h'), 'bio: no temperature control');
  await slide('.br-h', 12); check((await t('.br-say')).includes('too hot'), `bio: too hot sentence (${await t('.br-say')})`);
  await page.check(R + '.br-ton'); await page.uncheck(R + '.br-pon');
  check((await t('.br-facts')).includes('5.64'), 'bio: no pH control');
  await page.check(R + '.br-pon'); await page.uncheck(R + '.br-don');
  check(!(await page.$eval(R + '.br-stl', (e) => e.hidden)) && (await t('.br-facts')).includes('after 14.4 h') && (await t('.br-facts')).includes('2.8 %'), `bio: no oxygen control (${await t('.br-facts')})`);
  await slide('.br-h', 11); check((await t('.br-say')).includes('short of oxygen'), `bio: oxygen sentence (${await t('.br-say')})`);
  await page.check(R + '.br-don'); await slide('.br-ts', 30);
  check((await t('.br-facts')).includes('0.62 g/L'), 'bio: 30 °C set point grows slowly');
  await slide('.br-ts', 37); await slide('.br-h', 20); check((await t('.br-say')).includes('used up'), 'bio: harvest sentence');
  const px = await page.evaluate(() => { const c = document.querySelector('.br-ctl'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] > 150 && d[i + 1] < 80) n++; return n; });
  check(px > 100, `bio: control graphs drawn (${px})`);
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'bio: five quiz questions');
  const q2 = (await t('.smq-q:nth-child(2) .smq-text')).match(/\d+/g).map(Number);
  await page.fill(R + '.smq-q:nth-child(2) .smq-in', String((q2[0] * q2[1]) / 1000)); await page.click(R + '.smq-q:nth-child(2) .smq-check');
  check((await t('.smq-q:nth-child(2) .smq-out')) === 'Right!', 'bio: quiz kg');
};
