// #1344 capillary rise
export const path = '/learn/capillary-rise/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/capillary-rise/`); await page.waitForTimeout(700);
  const facts = () => page.textContent('.cr .cr-facts'), pill = () => page.textContent('.cr .cr-pill');
  const setR = async (sel, v) => { await page.$eval(sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(100); };
  { const f = await facts(); check(f.includes('2.98 cm') && f.includes('0.5 mm') && f.includes('292 Pa') && f.includes('0.229 mN') && (await pill()).startsWith('Rises'), 'capillary-rise: water, 0.5 mm example'); }
  check(await page.$eval('.cr .cr-c', (c) => { const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < x.length; i += 4) if (x[i] < 100) n++; return n > 300; }), 'capillary-rise: picture drawn');
  await setR('.cr .cr-r', 0.25);
  check((await facts()).includes('5.959 cm'), 'capillary-rise: half the radius, twice the rise');
  await setR('.cr .cr-r', 0.5);
  await page.click('.cr .cr-liq [data-v="soapy"]'); await page.waitForTimeout(100);
  check((await facts()).includes('1.224 cm'), 'capillary-rise: soapy water rises less');
  await page.click('.cr .cr-liq [data-v="mercury"]'); await page.waitForTimeout(100);
  check((await pill()).startsWith('Pushed down') && (await facts()).includes('Depth it is pushed down1.104 cm'), 'capillary-rise: mercury falls 1.104 cm');
  await page.click('.cr .cr-liq [data-v="water"]'); await setR('.cr .cr-L', 2);
  check((await pill()).includes('too short') && (await facts()).includes('0.745 mm'), 'capillary-rise: short tube: no overflow, flatter meniscus');
  const ans = await page.$eval('.cr .sq-q', (e) => e.dataset.ans);
  await page.fill('.cr .sq-q .sq-in', ans); await page.click('.cr .sq-q .sq-check');
  check((await page.textContent('.cr .sq-q .sq-res')) === 'Right!' && (await page.$$('.cr .sq-q')).length === 4, 'capillary-rise: quiz');
};
