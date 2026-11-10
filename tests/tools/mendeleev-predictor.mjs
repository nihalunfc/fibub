// #1358 Mendeleev's predictions
export const path = '/learn/mendeleev-predictor/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/mendeleev-predictor/`); await page.waitForTimeout(600);
  const facts = () => page.textContent('.md .md-facts'), mid = () => page.textContent('.md .md-mid');
  check((await page.$$('.md .md-cell')).length === 5 && (await mid()).includes('?') && (await mid()).includes('72.86 u') && (await facts()).includes('Si, Sn, Ga, As'), 'mendeleev-predictor: germanium hidden, 72.86 u predicted');
  await page.click('.md .md-reveal'); await page.waitForTimeout(50);
  check((await mid()).includes('Ge') && (await facts()).includes('72.63 u') && (await facts()).includes('+0.32 %') && (await facts()).includes('very close'), 'mendeleev-predictor: reveal: 72.63 u, +0.32 %');
  await page.click('.md .md-prop [data-v="density"]'); await page.waitForTimeout(50);
  check((await facts()).includes('5.32 g/cm³') && (await facts()).includes('(2.33 + 7.29 + 5.91 + 5.73) ÷ 4'), 'mendeleev-predictor: germanium density');
  await page.click('.md .md-hide [data-v="50"]'); await page.click('.md .md-prop [data-v="mass"]'); await page.waitForTimeout(50);
  check((await mid()).includes('?') && (await facts()).includes('Ge, Pb, In, Sb'), 'mendeleev-predictor: new element hides again');
  await page.click('.md .md-reveal'); await page.waitForTimeout(50);
  check((await facts()).includes('+8.75 %') && (await facts()).includes('not so close'), 'mendeleev-predictor: tin 8.75 % off');
  const rows = await page.$$eval('.md .md-eka tbody tr', (r) => r.map((x) => x.textContent));
  check(rows.length === 3 && rows[2].includes('Germanium (Ge), 1886') && rows[2].includes('72 / 72.63') && rows[0].includes('5.9 / 5.91'), 'mendeleev-predictor: eka table');
  const ans = await page.$eval('.md .sq-q', (e) => e.dataset.ans);
  await page.fill('.md .sq-q .sq-in', ans); await page.click('.md .sq-q .sq-check');
  check((await page.textContent('.md .sq-q .sq-res')) === 'Right!' && (await page.$$('.md .sq-q')).length === 4, 'mendeleev-predictor: quiz');
};
