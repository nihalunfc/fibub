// #T857 Colour converter
export const path = '/everyday/colour-converter/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/colour-converter/`); await page.waitForTimeout(300);
  const f = (k) => page.textContent(`.cc [data-f="${k}"]`);
  check((await f('rgb')) === 'rgb(30, 144, 255)', `colour: #1e90ff -> rgb (${await f('rgb')})`);
  check((await f('hsl')) === 'hsl(210, 100%, 56%)', `colour: #1e90ff -> hsl (${await f('hsl')})`);
  check((await f('name')) === 'dodgerblue', `colour: name dodgerblue (${await f('name')})`);
  const w = await page.textContent('.cc .cc-box[data-bg="white"] b');
  check(w === '3.23:1', `colour: contrast on white 3.23:1 (${w})`);
  await page.fill('.cc .cc-in', 'tomato'); await page.waitForTimeout(100);
  check((await f('hex')) === '#ff6347', 'colour: name tomato -> #ff6347');
  await page.fill('.cc .cc-in', 'hsl(0, 100%, 50%)'); await page.waitForTimeout(100);
  check((await f('hex')) === '#ff0000', 'colour: hsl red -> #ff0000');
  await page.fill('.cc .cc-in', 'not a colour'); await page.waitForTimeout(100);
  check(await page.isVisible('.cc .cc-err'), 'colour: bad input shows an error');
};
