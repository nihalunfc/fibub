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

  // "Solve my numbers" card helpers
  const sv = (ns, root = '') => ({
    ans: () => page.textContent(`${root}[data-k="${ns}-answer"]`),
    work: () => page.textContent(`${root}[data-k="${ns}-working"]`),
    find: (v) => page.selectOption(`${root}[data-k="${ns}-find"]`, v),
    ex: (i) => page.selectOption(`${root}[data-k="${ns}-example"]`, String(i)),
    ch: (k, v) => page.selectOption(`${root}[data-k="${ns}-${k}"]`, v),
    set: async (k, v, u) => { await page.fill(`${root}[data-k="${ns}-${k}"]`, v); if (u) await page.selectOption(`${root}[data-k="${ns}-${k}-unit"]`, u); },
    clear: () => page.click(`${root}.sv-clear`),
  });
  {
    const s = sv('br');
    await page.locator('[data-k="br-answer"]').scrollIntoViewIfNeeded();
    check((await s.ans()) === 'The unknown resistance is X = 6.67 Ω.', `bridge solve: metre bridge (${await s.ans()})`);
    check((await s.work()).includes('X = R l ÷ (L − l) = 10 × 40 ÷ (100 − 40) = 6.67 Ω'), 'bridge solve: working');
    await s.ex(1); check((await s.ans()) === 'The unknown resistance is X = 3.33 Ω.', `bridge solve: X in the right gap (${await s.ans()})`);
    await s.ex(2); check((await s.ans()) === 'The jockey balances at l = 60 cm from the left end.', `bridge solve: balance length (${await s.ans()})`);
    await s.ex(3); check((await s.ans()) === 'For balance, S must be 25 Ω.', `bridge solve: fourth arm (${await s.ans()})`);
    await s.ex(4); check((await s.ans()).startsWith('Balanced'), `bridge solve: balanced (${await s.ans()})`);
    await s.set('wS', '40'); check((await s.ans()).startsWith('Not balanced'), `bridge solve: not balanced (${await s.ans()})`);
    await s.ch('arm', 'P'); await s.clear(); await s.set('wQ', '10'); await s.set('wR', '250'); await s.set('wS', '25');
    check((await s.ans()) === 'For balance, P must be 100 Ω.', `bridge solve: find P (${await s.ans()})`);
    // Units and the wire length
    await s.find('mb'); await s.ch('side', 'left'); await s.clear(); await s.set('Rk', '10', 'Ω'); await s.set('l', '0.4', 'm');
    check((await s.ans()) === 'The unknown resistance is X = 6.67 Ω.', `bridge solve: metres accepted (${await s.ans()})`);
    await s.set('l', '100', 'cm'); await s.set('L', '200', 'cm'); check((await s.ans()) === 'The unknown resistance is X = 10 Ω.', `bridge solve: 200 cm wire (${await s.ans()})`);
    await s.set('L', '', 'cm'); check((await s.ans()).includes('less than the whole wire'), `bridge solve: l at the end (${await s.ans()})`);
    await s.set('l', '0'); check((await s.ans()).includes('A balance length of 0 cm'), 'bridge solve: l = 0');
    await s.clear(); check((await s.ans()).startsWith('Fill in'), 'bridge solve: blank asks for numbers');
    check(!/NaN|Infinity/.test(await page.textContent('.wsb-solve')), 'bridge solve: never NaN or Infinity');
  }
};
