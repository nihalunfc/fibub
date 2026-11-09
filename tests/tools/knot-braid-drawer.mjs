// #546 knot and braid diagram drawer
export const path = '/science/knot-braid-drawer/';
export default async ({ page, check, BASE }) => {
  const P = '.kbd ';
  const facts = async () => Object.fromEntries(await page.$$eval(P + '.kbd-facts div', (ds) => ds.map((d) => [d.querySelector('dt').textContent, d.querySelector('dd').textContent])));
  const word = async (w) => { await page.fill(P + '.kbd-w', w); await page.waitForTimeout(450); };
  const size = () => page.$eval(P + '.kbd-fig', (c) => [c.width, c.height]);

  await page.goto(`${BASE}/science/knot-braid-drawer/`); await page.waitForTimeout(600);
  check((await page.textContent(P + '.kbd-big')) === 'Closure: a knot (1 component)', 'braids: example closes to a knot');
  { const f = await facts(); check(f['Crossings'] === '4' && f['Writhe (exponent sum)'] === '0' && f['Permutation'] === '(1 2 3)' && f['Alexander polynomial Δ(t)'] === '−t + 3 − t^-1' && f['Determinant |Δ(−1)|'] === '5' && f['Genus at least'].startsWith('1') && f['Same Δ as'].startsWith('Figure-eight knot'), 'braids: figure-eight invariants'); }
  check(await page.isVisible(P + '.kbd-fig') && (await page.$$(P + '.kbd-tab tbody tr')).length === 13, 'braids: diagram and named table');
  const s1 = await size();
  await page.click(P + '.kbd-close'); await page.waitForTimeout(150);
  const s2 = await size(); check(s2[0] < s1[0] && s2[1] < s1[1], 'braids: closure off makes the drawing smaller');
  await page.click(P + '.kbd-col'); await page.waitForTimeout(150);
  check(await page.isVisible(P + '.kbd-fig'), 'braids: colour off');
  await page.click(P + '.kbd-close'); await page.click(P + '.kbd-col'); await page.waitForTimeout(150);

  await page.selectOption(P + '.kbd-named', '3_1'); await page.waitForTimeout(200);
  { const f = await facts(); check((await page.inputValue(P + '.kbd-w')) === 'σ1^3' && f['Alexander polynomial Δ(t)'] === 't − 1 + t^-1' && f['Determinant |Δ(−1)|'] === '3' && f['Writhe (exponent sum)'] === '3', 'braids: trefoil from the list'); }
  await page.locator(P + '.kbd-tab tbody tr[data-id="L6a4"]').scrollIntoViewIfNeeded(); await page.click(P + '.kbd-tab tbody tr[data-id="L6a4"]'); await page.waitForTimeout(250);
  { const f = await facts(); check((await page.textContent(P + '.kbd-big')) === 'Closure: a link of 3 components' && f['Linking numbers'] === '1–2: 0, 1–3: 0, 2–3: 0' && f['Alexander polynomial Δ(t)'].startsWith('t^4 − 4t^3 + 6t^2 − 4t + 1'), 'braids: Borromean rings from the table'); }
  await word('a a');
  { const f = await facts(); check(f['Linking numbers'] === '1–2: 1' && f['Alexander polynomial Δ(t)'].startsWith('t − 1') && f['Same Δ as'].startsWith('Hopf link') && (await page.inputValue(P + '.kbd-named')) === '', 'braids: Hopf link typed with letters'); }
  await word('s1 s2 s1 s2 s1 s2 s1 s2');
  check((await facts())['Same Δ as'].startsWith('Torus knot T(3,4)'), 'braids: T(3,4) recognised by Δ');
  await word('σ₁σ₂⁻¹σ₂σ₁⁻¹');
  { const f = await facts(); check(f['After cancelling σi σi⁻¹'].includes('trivial braid') && f['Components'] === '3', 'braids: cancelling to the trivial braid'); }
  await word('σ1^3'); await page.fill(P + '.kbd-n', '3'); await page.waitForTimeout(450);
  { const f = await facts(); check(f['Strands'] === '3' && f['Components'] === '2', 'braids: extra strand adds an unknot'); }
  await page.fill(P + '.kbd-n', ''); await word('(σ1 σ2');
  check((await page.textContent(P + '.kbd-err')).includes('bracket') && await page.isHidden(P + '.kbd-out'), 'braids: bad word message');
  await word('σ11');
  check((await page.textContent(P + '.kbd-err')).includes('10 strands'), 'braids: too many strands message');
  await word('(σ1 σ2^-1 σ3)^30');
  check((await facts())['Crossings'] === '90' && await page.isVisible(P + '.kbd-fig'), 'braids: long braid drawn smaller');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.dl [data-f="png"]')]); check((await d.suggestedFilename()).endsWith('.png'), 'braids: image download'); }
};
