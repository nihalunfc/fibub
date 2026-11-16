// #1769 Case converter
export const path = '/documents/case-converter/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/documents/case-converter/`); await page.waitForTimeout(400);
  const out = () => page.textContent('.cvc .cvc-out');
  await page.fill('.cvc .cvc-in', 'the lord of the rings: a tale');
  const go = async (k) => { await page.click(`.cvc .cvc-b[data-k=${k}]`); await page.waitForTimeout(80); return out(); };
  check((await go('title')) === 'The Lord of the Rings: A Tale', 'cvc: title case');
  check((await go('upper')) === 'THE LORD OF THE RINGS: A TALE', 'cvc: upper');
  check((await go('snake')) === 'the_lord_of_the_rings_a_tale', 'cvc: snake');
  check((await go('camel')) === 'theLordOfTheRingsATale', 'cvc: camel');
  check((await go('kebab')) === 'the-lord-of-the-rings-a-tale', 'cvc: kebab');
  await page.fill('.cvc .cvc-in', 'hello there. i am here! ok');
  check((await go('sentence')) === 'Hello there. I am here! Ok', 'cvc: sentence');
  check((await go('alternate')) === 'hElLo ThErE. i Am HeRe! Ok', `cvc: alternate (${await out()})`);
  await page.fill('.cvc .cvc-in', 'a tale of the lord of up and over the road');
  await go('title');
  check(await page.isVisible('.cvc .cvc-style'), 'cvc: style choice shows for title case');
  await page.selectOption('.cvc .cvc-style', 'title-ap'); await page.waitForTimeout(80);
  check((await out()) === 'A Tale of the Lord of up and Over the Road', `cvc: AP capitalises 4-letter words (${await out()})`);
  await page.selectOption('.cvc .cvc-style', 'title-chicago'); await page.waitForTimeout(80);
  check((await out()) === 'A Tale of the Lord of up and over the Road', `cvc: Chicago keeps all prepositions small (${await out()})`);
  check((await go('dot')) === 'a.tale.of.the.lord.of.up.and.over.the.road', 'cvc: dot.case');
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await page.waitForTimeout(100);
  check((await page.locator('.cvc .cvc-list li').count()) === 11, 'cvc: every case listed with a copy button');
  check(await page.isVisible('.kit-bar'), 'cvc: copy link bar present');
};
