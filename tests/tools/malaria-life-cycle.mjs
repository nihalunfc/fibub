// #1454 malaria life cycle (stage data and fever days checked in tests/sci-tools/malaria-life-cycle.mjs)
export const path = '/learn/malaria-life-cycle/';
export default async ({ page, check, BASE }) => {
  const R = '.mlc ';
  const t = (s) => page.textContent(R + s);
  await page.goto(`${BASE}/learn/malaria-life-cycle/`); await page.waitForTimeout(400);
  check((await t('.ml-step')) === 'Stage 1 of 9' && (await t('.ml-name')).includes('Sporozoites'), 'malaria: starts at stage 1');
  check((await page.$$eval(R + '.ml-node', (e) => e.length)) === 9, 'malaria: nine nodes');
  for (let i = 0; i < 6; i++) await page.click(R + '.ml-next');
  check((await t('.ml-name')) === 'Fertilisation' && (await t('.ml-where')).includes('mosquito'), `malaria: stage 7 (${await t('.ml-name')})`);
  await page.click(R + '.ml-prev'); check((await t('.ml-step')) === 'Stage 6 of 9', 'malaria: back');
  await page.click(R + '.ml-node[data-i="3"]'); check((await t('.ml-text')).includes('haemozoin'), 'malaria: tap stage 4');
  await page.click(R + '.ml-node[data-i="8"]'); await page.click(R + '.ml-next'); check((await t('.ml-step')) === 'Stage 1 of 9', 'malaria: loops round');
  check((await t('.ml-fsay')).includes('days 1, 3, 5, 7, 9, 11'), 'malaria: vivax fever days');
  await page.click(R + '.ml-sp button[data-v=malariae]'); check((await t('.ml-fsay')).includes('days 1, 4, 7, 10') && (await t('.ml-fsay')).includes('quartan'), 'malaria: malariae fever days');
  const px = await page.evaluate(() => { const c = document.querySelector('.ml-fig'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] > 120 && d[i + 1] < 90) n++; return n; });
  check(px > 500, `malaria: fever bars drawn (${px})`);
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'malaria: five quiz questions');
  const q5 = (await t('.smq-q:nth-child(5) .smq-text')).match(/\d+/g).map(Number);
  await page.fill(R + '.smq-q:nth-child(5) .smq-in', String(q5[1] + ((q5[2] - 1) * q5[0]) / 24)); await page.click(R + '.smq-q:nth-child(5) .smq-check');
  check((await t('.smq-q:nth-child(5) .smq-out')) === 'Right!', `malaria: quiz fever day (${q5})`);
};
