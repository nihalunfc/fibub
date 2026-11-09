// #1048 Wheatstone and metre bridge
export const path = '/learn/wheatstone-bridge/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/wheatstone-bridge/`); await page.waitForTimeout(600);
  const R = '.wsb ', txt = (s) => page.textContent(R + s);
  check((await txt('.wsb-big')) === 'Galvanometer: −5.05 mA (needle left: move the jockey right)' && await page.isHidden(R + '.wsb-answer'), `bridge: start off balance (${await txt('.wsb-big')})`);
  // Drag the jockey to about 37 cm, then fine-tune with the buttons.
  await page.locator(R + '.wsb-fig').scrollIntoViewIfNeeded();
  const bb = await page.locator(R + '.wsb-fig').boundingBox(), P = (cm) => bb.x + ((30 + cm * 3) / 360) * bb.width, y = bb.y + (170 / 250) * bb.height;
  await page.mouse.move(P(20), y); await page.mouse.down(); await page.mouse.move(P(30), y, { steps: 3 }); await page.mouse.move(P(37), y, { steps: 3 }); await page.mouse.up(); await page.waitForTimeout(100);
  const l1 = Number((await txt('.wsb-facts')).match(/Jockey at l([\d.]+) cm/)[1]);
  check(Math.abs(l1 - 37) <= 0.3, `bridge: dragged the jockey (${l1})`);
  for (let k = 0; k < 20 && !(await txt('.wsb-big')).startsWith('Balanced'); k++) await page.click(R + ((await txt('.wsb-big')).includes('move the jockey right') ? '.wsb-r1' : '.wsb-l1'));
  check((await txt('.wsb-big')) === 'Balanced: no deflection at l = 37.5 cm' && (await txt('.wsb-formula')) === 'X / R = l / (100 − l), so X = 10 × 37.5 / 62.5 = 6 Ω', `bridge: balanced (${await txt('.wsb-big')})`);
  const tab = await txt('.wsb-tab');
  check(tab.includes('Galvanometer50 Ω0 µA'), `bridge: no galvanometer current at balance (${tab})`);
  check((await txt('.wsb-k')).includes('At balance I_G = 0') && /= −?0 V\./.test(await txt('.wsb-k')), `bridge: Kirchhoff rules (${await txt('.wsb-k')})`);
  await page.click(R + '.wsb-r10'); check((await txt('.wsb-big')).includes('needle right: move the jockey left'), 'bridge: past the balance point');
  await page.click(R + '.wsb-l10'); check((await txt('.wsb-big')).startsWith('Balanced'), 'bridge: 1 cm buttons');
  await page.selectOption(R + '.wsb-rk', '5'); await page.waitForTimeout(100);
  check(!(await txt('.wsb-big')).startsWith('Balanced'), 'bridge: new R unbalances');
  await page.click(R + '.wsb-show');
  check(await page.isVisible(R + '.wsb-answer') && (await txt('.wsb-answer')) === 'The mystery resistor is 6 Ω. With R = 5 Ω it balances at l = 100 × 6 / 11 = 54.5 cm.', `bridge: show the answer (${await txt('.wsb-answer')})`);
  await page.click(R + '.wsb-new');
  check(await page.isHidden(R + '.wsb-answer') && (await txt('.wsb-facts')).includes('Jockey at l20.0 cm'), 'bridge: new mystery resistor');
  check((await page.$$(R + '.eq-q')).length === 4, 'bridge: four practice questions');
  const q1 = await page.textContent(R + '.eq-q:nth-child(1) p'), [Rk, l] = q1.match(/a ([\d.]+) Ω resistor in the right gap, the balance point is ([\d.]+) cm/).slice(1).map(Number);
  await page.fill(R + '.eq-q:nth-child(1) .eq-in', String((Rk * l) / (100 - l))); await page.click(R + '.eq-q:nth-child(1) .eq-go');
  check((await page.textContent(R + '.eq-q:nth-child(1) .eq-res')).startsWith('Right'), 'bridge: right answer accepted');
};
