// #1246 Map scale and recipe scaler
export const path = '/learn/map-scale/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/map-scale/`); await page.waitForSelector('.ms .ms-fig .ms-pin');
  const R = '.ms ', txt = (s) => page.textContent(R + s);
  check((await txt('.ms-big')) === '8.1 cm on the map = 4.05 km' && (await txt('.ms-steps')).includes('8.1 × 50 000 = 405 000 cm'), 'ms: Home to School 8.1 cm = 4.05 km');
  await page.click(R + '.ms-sc button[data-n="100000"]'); await page.waitForTimeout(80);
  check((await txt('.ms-big')) === '8.1 cm on the map = 8.1 km', 'ms: 1 : 100 000 doubles it');
  await page.click(R + '.ms-sc button[data-n="10000"]'); await page.waitForTimeout(80);
  check((await txt('.ms-big')) === '8.1 cm on the map = 810 m' && (await txt('.ms-bart')) === '250 m', 'ms: 1 : 10 000 in metres, scale bar 250 m');
  await page.selectOption(R + '.ms-to', 'Market'); await page.waitForTimeout(80);
  check((await txt('.ms-big')).startsWith('4.5 cm'), 'ms: Home to Market 4.5 cm');
  // Drag pin B onto Station (289, 255).
  const el = await page.$(R + '.ms-fig'); await el.scrollIntoViewIfNeeded(); const box = await el.boundingBox(), k = box.width / 340;
  await page.mouse.move(box.x + 187 * k, box.y + 187 * k); await page.mouse.down();
  await page.mouse.move(box.x + 240 * k, box.y + 220 * k); await page.mouse.move(box.x + 289 * k, box.y + 255 * k); await page.mouse.up(); await page.waitForTimeout(80);
  check((await txt('.ms-big')) === '7 cm on the map = 700 m' && (await page.inputValue(R + '.ms-to')) === '', 'ms: drag pin to 7 cm');
  await page.click(R + '.ms-sc button[data-n="50000"]'); await page.waitForTimeout(80);
  check((await txt('.ms-back')).includes('300 000 ÷ 50 000 = 6 cm'), 'ms: 3 km at 1 : 50 000 = 6 cm');
  await page.fill(R + '.ms-km', '-1'); await page.waitForTimeout(80);
  check(await page.isVisible(R + '.ms-err'), 'ms: bad distance message');
  await page.fill(R + '.ms-km', '12'); await page.waitForTimeout(80);
  check(await page.isHidden(R + '.ms-err') && (await txt('.ms-back')).includes('= 24 cm'), 'ms: 12 km = 24 cm');
  check((await txt('.ms-factor')).includes('6 ÷ 4 = 1.5') && (await txt('.ms-tab')).includes('6 cups') && (await txt('.ms-tab')).includes('90 g'), 'ms: recipe for 6');
  await page.fill(R + '.ms-p', '10'); await page.waitForTimeout(80);
  check((await txt('.ms-tab')).includes('10 cups') && (await txt('.ms-tab')).includes('30 leaves'), 'ms: recipe for 10');
  check((await page.$$(R + '.sm-q')).length === 4, 'ms: four questions');
  const get = [/gives ([\d.]+) km\.$/, /gives ([\d.]+) cm\.$/, /scale is 1 : ([\d ]+)\.$/, /= ([\d.]+) g\.$/];
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`), m = get[i - 1].exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1].replace(/ /g, '') : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `ms: quiz question ${i} (${w})`);
  }
  // Solve your own numbers (shared card, src/lib/learn/solvecard-b.ts)
  await page.goto(`${BASE}/learn/map-scale/`); await page.waitForTimeout(600);
  {
  const S = '.ms-solve ', ans = () => page.textContent(S + '.sv-answer'), work = () => page.textContent(S + '.sv-work');
  const pre = async (n) => { await page.selectOption(S + '[data-k="sv-example"]', ''); await page.selectOption(S + '[data-k="sv-example"]', String(n)); await page.waitForTimeout(60); };
  const fill = async (k, v) => { await page.fill(S + `[data-k="sv-${k}"]`, v); await page.waitForTimeout(40); };
  const sel = async (k, v) => { await page.selectOption(S + `[data-k="sv-${k}"]`, v); await page.waitForTimeout(40); };
  const is = async (want, label) => check((await ans()) === want, `mapscale solve: ${label} (${await ans()})`);
  const has = async (want, label) => check((await ans()).includes(want), `mapscale solve: ${label} (${await ans()})`);
  const wk = async (want, label) => check((await work()).includes(want), `mapscale solve working: ${label}`);
  await pre(0); await is('The real distance is 3.75 km (about 2.33 miles).', '7.5 cm at 1 : 50 000'); await wk('7.5 × 50 000 = 375 000 cm', 'real distance working');
  await pre(1); await is('On the map it is 4.8 cm (48 mm).', '12 km at 1 : 250 000'); await wk('1 200 000 ÷ 250 000 = 4.8 cm', 'map distance working');
  await pre(2); await is('The scale is 1 : 50 000.', 'scale from 4 cm and 2 km'); await wk('real 2 km = 200 000 cm', 'unit change');
  await pre(3); await is('1 cm on the map = 2 km in real life, so the scale is 1 : 200 000.', 'statement to ratio');
  await pre(4); await is('The real area is 500 000 m² = 50 hectares = 0.5 km².', 'area'); await wk('8 × 625 000 000', 'area uses N squared');
  await pre(0); await sel('mlen-unit', 'in'); await fill('mlen', '3'); await is('The real distance is 3.81 km (about 2.37 miles).', 'inches');
  await fill('N', '0'); await has('more than 0', 'scale 0');
  await sel('mlen-unit', 'cm'); await fill('N', '0.5'); await fill('mlen', '2'); await has('The real distance is 1 cm.', 'enlargement scale'); check((await page.textContent(S + '.sv-tip')).includes('enlargement'), 'mapscale solve: enlargement tip');
  await fill('N', '50000'); await fill('mlen', '-1'); await has('cannot be negative', 'negative distance');
  await pre(2); await fill('rlen', '0'); await has('more than 0', 'zero real distance');
  await pre(3); await sel('su-unit', 'in'); await sel('sr-unit', 'mi'); await fill('su', '1'); await fill('sr', '1'); await is('1 in on the map = 1 mi in real life, so the scale is 1 : 63 360.', 'inch to mile');
  await pre(4); await sel('mar-unit', 'mm²'); await fill('mar', '5'); await has('3125 m²', 'area in mm²');
  }
};
