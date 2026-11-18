// #T1037 EQ guide
export const path = '/everyday/eq-cheat-sheet/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/eq-cheat-sheet/`); await page.waitForTimeout(300);
  const R = '.ecs ';
  await page.fill(R + '.ecs-f', '440');
  let t = await page.textContent(R + '.ecs-note');
  check(t.includes('A4 (+0 cents)') && (await page.textContent(R + '.ecs-band')).includes('Low mids'), `eq guide: 440 Hz is A4 in the low mids (${t})`);
  await page.fill(R + '.ecs-f', '261.63');
  t = await page.textContent(R + '.ecs-note');
  check(t.includes('C4'), `eq guide: 261.63 Hz is C4 (${t})`);
  await page.fill(R + '.ecs-f', '50');
  check((await page.textContent(R + '.ecs-band')).includes('Sub') && (await page.textContent(R + '.ecs-moves')).includes('Cut below'), 'eq guide: 50 Hz is the sub band with advice');
  await page.fill(R + '.ecs-f', '8000');
  check((await page.textContent(R + '.ecs-band')).includes('Air') && (await page.textContent(R + '.ecs-moves')).includes('Hi-hats'), 'eq guide: 8 kHz is air and hi-hats live there');
  await page.click(R + '.ecs-play'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.ecs-play')) === 'Stop tone', 'eq guide: tone plays'); await page.click(R + '.ecs-play');
};
