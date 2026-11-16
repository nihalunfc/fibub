// #L350 Plate boundaries
export const path = '/learn/plate-boundaries/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/plate-boundaries/`); await page.waitForTimeout(300);
  await page.click('.pb .pb-play'); // pause the animation so the sliders stay put
  await page.selectOption('.pb .pb-type', 'ridge');
  await page.fill('.pb .pb-rate', '2.5'); await page.dispatchEvent('.pb .pb-rate', 'input');
  await page.fill('.pb .pb-time', '100'); await page.dispatchEvent('.pb .pb-time', 'input');
  const o = page.locator('.pb .pb-out');
  check((await o.getAttribute('data-dist')) === '2500', 'plate-boundaries: 2.5 cm/year for 100 Myr is 2500 km');
  check((await o.getAttribute('data-depthmax')) === '15', 'plate-boundaries: ridge quakes are shallow');
  await page.selectOption('.pb .pb-type', 'subduction');
  check((await o.getAttribute('data-depthmax')) === '700' && (await o.getAttribute('data-family')) === 'Convergent', 'plate-boundaries: subduction quakes reach 700 km');
  await page.fill('.pb .pb-rate', '5'); await page.dispatchEvent('.pb .pb-rate', 'input');
  check((await o.getAttribute('data-dist')) === '5000', 'plate-boundaries: speed slider changes the distance');
  { const a = await page.getAttribute('.pb .lq-item', 'data-ans'); await page.fill('.pb .lq-in', a); await page.click('.pb .lq-check');
    check((await page.textContent('.pb .lq-fb')) === 'Right.', 'plate-boundaries: quiz accepts the right answer'); }
};
