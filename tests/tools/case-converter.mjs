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
};
