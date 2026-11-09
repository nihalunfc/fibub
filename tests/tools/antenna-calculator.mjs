// #632 Antenna calculator
export const path = '/science/antenna-calculator/';
export default async ({ page, check, BASE }) => {
  const R = '.anc ';
  const big = () => page.textContent(R + '.an-big');
  const facts = () => page.textContent(R + '.an-facts');
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(600);
  check((await big()) === 'Total length 98.21 cm, each side 49.1 cm', 'antenna: example 145 MHz dipole');
  check((await facts()).includes('Wavelength λ2.0675 m') && (await facts()).includes('1.0338 m') && (await page.textContent(R + '.an-form')).includes('λ = c / f'), 'antenna: dipole facts and formulas');
  await page.fill(R + '.an-k', '1'); await page.waitForTimeout(60);
  check((await big()).startsWith('Total length 1.0338 m'), 'antenna: shortening factor 1');
  await page.fill(R + '.an-k', '1.5'); await page.waitForTimeout(60);
  check((await page.textContent(R + '.an-err')).includes('shortening factor') && await page.isHidden(R + '.an-out'), 'antenna: bad shortening factor message');
  await page.fill(R + '.an-k', '0.95');
  await page.selectOption(R + '.an-lu', 'imp'); await page.waitForTimeout(60);
  check((await big()) === 'Total length 3 ft 2.66 in, each side 19.33 in', `antenna: imperial lengths (${await big()})`);
  await page.selectOption(R + '.an-lu', 'si');
  await page.click(R + '[data-k=monopole]'); await page.waitForTimeout(80);
  check((await big()) === 'Element length 49.1 cm' && (await facts()).includes('about 37 Ω'), 'antenna: monopole');
  await page.click(R + '[data-k=patch]'); await page.waitForTimeout(80);
  check((await page.inputValue(R + '.an-f')) === '2.45' && (await big()) === 'Patch 3.723 cm wide × 2.881 cm long', 'antenna: patch example 2.45 GHz on 1.6 mm, εr 4.4');
  { const f = await facts(); check(f.includes('4.081') && f.includes('0.7386 mm') && f.includes('321.4 Ω') && f.includes('1.069 cm') && f.includes('4.683 cm × 3.841 cm'), 'antenna: patch facts'); }
  // Balanis example 14.1 to 14.3.
  await page.fill(R + '.an-f', '10'); await page.fill(R + '.an-er', '2.2'); await page.fill(R + '.an-h', '1.588'); await page.waitForTimeout(80);
  { const f = await facts(); check((await big()) === 'Patch 1.185 cm wide × 9.053 mm long' && f.includes('1.972') && f.includes('228.4 Ω') && f.includes('3.124 mm'), `antenna: Balanis 10 GHz example (${await big()})`); }
  await page.fill(R + '.an-z0', '300'); await page.waitForTimeout(60);
  check((await facts()).includes('not needed'), 'antenna: no inset when Z0 is above the edge resistance');
  await page.fill(R + '.an-z0', '50'); await page.fill(R + '.an-h', '5'); await page.waitForTimeout(60);
  check((await page.textContent(R + '.an-err')).includes('too thick'), 'antenna: thick substrate message');
  await page.fill(R + '.an-h', '1.588'); await page.fill(R + '.an-er', '0.5'); await page.waitForTimeout(60);
  check((await page.textContent(R + '.an-err')).includes('permittivity'), 'antenna: bad permittivity message');
  await page.fill(R + '.an-er', '2.2');
  await page.click(R + '[data-k=yagi]'); await page.fill(R + '.an-f', '144'); await page.selectOption(R + '.an-fu', '1e6'); await page.waitForTimeout(80);
  check((await big()) === '5 elements on a 1.9778 m boom' && (await page.$$(R + '.an-tab tr')).length === 6, `antenna: Yagi 144 MHz, 3 directors (${await big()})`);
  await page.selectOption(R + '.an-nd', '6'); await page.waitForTimeout(60);
  check((await big()).startsWith('8 elements'), 'antenna: 6 directors');
  await page.fill(R + '.an-yt', '0.1'); await page.waitForTimeout(60);
  check((await page.textContent(R + '.an-err')).includes('too short'), 'antenna: directors too short message');
  await page.fill(R + '.an-yt', '0.005'); await page.fill(R + '.an-ysd', 'x'); await page.waitForTimeout(60);
  check((await page.textContent(R + '.an-err')).includes('fraction of a wavelength'), 'antenna: bad ratio message');
  await page.fill(R + '.an-ysd', '0.25'); await page.fill(R + '.an-f', ''); await page.waitForTimeout(60);
  check((await page.textContent(R + '.an-err')).includes('Give the frequency'), 'antenna: missing frequency message');
  await page.fill(R + '.an-f', '144'); await page.waitForTimeout(60);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=pdf]')]); check(d.suggestedFilename().startsWith('antenna-yagi') && /\.pdf$/.test(d.suggestedFilename()), 'antenna: PDF download'); }
};
