// #T940 Tyre size
export const path = '/vehicles/tyre-size/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/vehicles/tyre-size/`); await page.waitForTimeout(300);
  const line = (k) => page.textContent(`.ts .ts-r[data-p="${k}"]`);
  const o = (k) => page.textContent(`.ts [data-o="${k}"]`);
  const type = async (k, v) => { await page.fill(`.ts [data-k="${k}"]`, v); await page.waitForTimeout(80); };
  // 205/55R16 91V: sidewall 205 x 0.55 = 112.75 mm; diameter 16 x 25.4 + 2 x 112.75 = 631.9 mm; LI 91 = 615 kg; V = 240 km/h
  await type('code', '205/55R16 91V');
  check((await line('width')).includes('205 mm wide'), `tyre-size: 205 mm wide (${await line('width')})`);
  check((await o('sw')) === '112.75 mm' && (await o('dia')) === '631.9 mm', `tyre-size: sidewall 112.75, diameter 631.9 (${await o('sw')}, ${await o('dia')})`);
  check((await line('load')).includes('615 kg'), `tyre-size: load 91 = 615 kg (${await line('load')})`);
  check((await line('speed')).includes('240 km/h'), `tyre-size: V = 240 km/h (${await line('speed')})`);
  check((await page.$$('.ts-side tspan[data-p]')).length >= 5, 'tyre-size: code drawn on the sidewall in parts');
  await page.click('.ts .ts-r[data-p="rim"]');
  check(await page.$eval('.ts-side tspan[data-p="rim"]', (e) => e.classList.contains('on')), 'tyre-size: tapping a line highlights its part');
  // compare 225/45R17: 634.3 mm, +0.4%
  await page.click('.ts [data-o="cmpbox"] summary');
  await type('code2', '225/45R17');
  check((await o('d2')) === '634.3 mm' && (await o('pct')).startsWith('+0.4%'), `tyre-size: 225/45R17 is 634.3 mm, +0.4% (${await o('d2')}, ${await o('pct')})`);
  check((await o('speedo')).includes('100.4 km/h') && (await o('verdict')).includes('Within 3%'), `tyre-size: speedometer 100 -> 100.4 (${await o('speedo')})`);
  // bike bias 90/90-12 54J: 212 kg, 100 km/h
  await type('code', '90/90-12 54J');
  check((await line('construction')).includes('Bias') && (await line('load')).includes('212 kg') && (await line('speed')).includes('100 km/h'), `tyre-size: 90/90-12 54J bias, 212 kg, 100 km/h (${await line('load')})`);
  await type('code', 'lt245/75r16 120/116s');
  const ld = await line('load');
  check(ld.includes('1,400 kg') && ld.includes('1,250 kg') && ld.includes('120/116'), `tyre-size: LT dual load 120/116 (${ld})`);
  await type('code', '10.00-20 16PR');
  check((await line('ply')).includes('16'), 'tyre-size: ply rating read');
  await type('code', 'hello');
  check((await page.textContent('.ts .ts-err')).includes('Could not read'), 'tyre-size: unreadable code explained');
  // vehicle buttons swap the example
  await page.click('.ts .ts-veh [data-v="bike"]');
  check((await page.inputValue('.ts [data-k="code"]')) === 'hello', 'tyre-size: own typing is kept when picking a vehicle');
  await type('code', '');
  await page.click('.ts .ts-veh [data-v="bike"]');
  check((await page.inputValue('.ts [data-k="code"]')).includes('120/70'), 'tyre-size: bike example loads');
  // ?c=usa: mph and lb
  await page.goto(`${BASE}/vehicles/tyre-size/?c=usa`); await page.waitForTimeout(300);
  check((await line('speed')).includes('149 mph') && (await line('load')).includes('lb'), `tyre-size: ?c=usa shows mph (${await line('speed')})`);
};
