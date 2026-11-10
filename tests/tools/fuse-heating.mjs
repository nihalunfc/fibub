// #1216 fuse-heating
export const path = '/learn/fuse-heating/';
export default async ({ page, check, BASE }) => {
  const R = '.fzh ';
  const t = (s) => page.textContent(R + s);
  const setI = (v) => page.$eval(R + '.fz-I', (e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  await page.goto(BASE + path); await page.waitForTimeout(400);
  check((await t('.fz-big')) === '58 °C, no glow', 'fuse: fuse wire at 2 A is 58 °C');
  await setI(5);
  check((await t('.fz-big')) === '230 °C, no glow', 'fuse: 5 A just holds');
  await setI(5.5);
  check((await t('.fz-big')).startsWith('Melted at 5 A'), 'fuse: melts above 5 A');
  await setI(2);
  check((await t('.fz-big')).startsWith('Melted'), 'fuse: stays melted until replaced');
  await page.click(R + '.fz-new');
  check((await t('.fz-big')) === '58 °C, no glow', 'fuse: new wire fitted');
  await page.click(R + '.fz-wire button[data-w="nichrome"]');
  await setI(4); check((await t('.fz-big')) === '505 °C, dull red', 'fuse: nichrome 4 A dull red');
  await setI(6); check((await t('.fz-big')) === '1105 °C, yellow', 'fuse: nichrome 6 A yellow');
  const glow = await page.$eval(R + '.fz-cv', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] > 200 && d[i + 1] > 150 && d[i + 2] < 120) n++; return n; });
  check(glow > 100, `fuse: wire drawn glowing (${glow})`);
  await page.click(R + '.fz-wire button[data-w="copper"]');
  await setI(10); check((await t('.fz-big')) === '160 °C, no glow', 'fuse: copper 10 A only 160 °C');
  check(await page.isHidden(R + '.fz-eq'), 'fuse: Class 8 hides H = I²Rt');
  await page.click(R + 'button[data-level="10"]');
  check((await t('.fz-eq')).includes('10² × 0.5 = 50 J every second'), 'fuse: Class 10 heat per second');
  check((await t('.fz-hbig')) === 'Switch on some appliances.', 'fuse: home starts empty');
  await page.click(R + '.fz-app[data-a="kettle"]');
  check((await t('.fz-hbig')) === '6.52 A of 10 A: the fuse holds.' && (await t('.fz-heq')) === 'I = P ÷ V = 1500 W ÷ 230 V = 6.52 A', 'fuse: kettle 6.52 A');
  await page.click(R + '.fz-app[data-a="heater"]');
  check((await t('.fz-hbig')).startsWith('The fuse has blown: 15.2 A is more than 10 A'), 'fuse: kettle + heater blows 10 A');
  await page.click(R + '.fz-fix');
  await page.selectOption(R + '.fz-rate', '15'); await page.click(R + '.fz-app[data-a="iron"]');
  check((await t('.fz-hbig')) === '4.35 A of 15 A: the fuse holds.', 'fuse: 15 A fuse, iron');
  await page.click(R + '.fz-short');
  check((await t('.fz-hbig')).includes('a short circuit'), 'fuse: short circuit blows it');
  const items = await page.$$(R + '.lq-item');
  check(items.length === 5, 'fuse: five questions');
  for (const i of [0, 1, 2, 3]) { const ans = await items[i].getAttribute('data-ans'); await (await items[i].$('.lq-in')).fill(String(+(+ans).toPrecision(4))); await (await items[i].$('.lq-check')).click(); }
  { const a = +(await items[4].getAttribute('data-ans')); await (await items[4].$$('.lq-choice'))[a].click(); }
  check((await t('.lq-score')).startsWith('5 of 5'), 'fuse: all five answered right');
};
