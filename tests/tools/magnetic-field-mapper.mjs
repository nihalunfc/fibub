// #1043 Magnetic field mapper
export const path = '/learn/magnetic-field-mapper/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/magnetic-field-mapper/`); await page.waitForTimeout(800);
  const R = '.mfm ', txt = (s) => page.textContent(R + s);
  check((await txt('.mfm-big')) === 'Needle points up (73°)' && (await txt('.mfm-rule')).includes('north pole (right end)'), `mag: bar magnet compass (${await txt('.mfm-big')})`);
  const inked = () => page.$eval(R + '.mfm-fig', (c) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 160) n++; return n; });
  check((await inked()) > 2000, 'mag: field lines drawn');
  check(await page.isHidden(R + '.mfm-ionly') && (await txt('.mfm-rev')) === 'Flip the magnet', 'mag: no current slider for the magnet');
  await page.click(R + '.mfm-rev'); await page.waitForTimeout(100);
  check((await txt('.mfm-big')) === 'Needle points down (253°)' && (await txt('.mfm-rule')).includes('(left end)'), `mag: flipped magnet (${await txt('.mfm-big')} ${await txt('.mfm-rule')})`);
  await page.click(R + '.mfm-level [data-v="12"]');
  check((await txt('.mfm-rule12')).includes('closed loop') && await page.isHidden(R + '.mfm-formula'), 'mag: Class 12 note for the magnet');
  await page.click(R + '.mfm-kind [data-v=wire]'); await page.waitForTimeout(300);
  check((await txt('.mfm-big')) === 'Needle points up and to the left (127°)' && (await txt('.mfm-facts')).includes('13.3 µT') && (await txt('.mfm-facts')).includes('7.5 cm from the wire'), `mag: wire field (${await txt('.mfm-facts')})`);
  check((await txt('.mfm-formula')) === 'B = μ₀ I / (2π r) = 4π × 10⁻⁷ × 5 / (2π × 0.0750 m) = 13.3 µT' && (await txt('.mfm-rule')).includes('anticlockwise'), `mag: wire formula (${await txt('.mfm-formula')})`);
  await page.click(R + '.mfm-rev'); await page.waitForTimeout(100);
  check((await txt('.mfm-big')) === 'Needle points down and to the right (307°)' && (await txt('.mfm-rule')).includes('clockwise round') && (await txt('.mfm-rev')) === 'Reverse the current', 'mag: reversed current');
  await page.$eval(R + '.mfm-i', (e) => { e.value = '10'; e.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(100);
  check((await txt('.mfm-iv')) === '10.0 A' && (await txt('.mfm-facts')).includes('26.7 µT'), 'mag: current slider doubles B');
  await page.click(R + '.mfm-kind [data-v=loop]'); await page.waitForTimeout(300);
  await page.$eval(R + '.mfm-i', (e) => { e.value = '5'; e.dispatchEvent(new Event('input', { bubbles: true })); });
  check((await txt('.mfm-formula')).includes('= 785 µT') && await page.isVisible(R + '.mfm-nonly') && (await txt('.mfm-rule')).includes('to the right'), `mag: loop centre (${await txt('.mfm-formula')})`);
  await page.selectOption(R + '.mfm-n', '100'); await page.waitForTimeout(100);
  check((await txt('.mfm-formula')).includes('= 7.85 mT'), 'mag: 100 turns');
  await page.click(R + '.mfm-kind [data-v=solenoid]'); await page.waitForTimeout(400);
  check((await txt('.mfm-formula')).includes('B ≈ 10.5 mT') && (await txt('.mfm-formula')).includes('is 9.67 mT'), `mag: solenoid (${await txt('.mfm-formula')})`);
  await page.locator(R + '.mfm-fig').scrollIntoViewIfNeeded();
  const bb = await page.locator(R + '.mfm-fig').boundingBox();
  await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2); await page.waitForTimeout(150);
  check((await txt('.mfm-big')) === 'Needle points right (0°)' && (await txt('.mfm-facts')).includes('9.67 mT'), `mag: tap moves the compass inside the solenoid (${await txt('.mfm-big')})`);
  await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await page.mouse.down(); await page.mouse.move(bb.x + bb.width * 0.5, bb.y + bb.height * 0.12, { steps: 5 }); await page.mouse.up(); await page.waitForTimeout(150);
  check((await txt('.mfm-big')).includes('left') && (await txt('.mfm-facts')).includes('cm, 6.3 cm'), `mag: dragged above the solenoid, the field runs back to the left (${await txt('.mfm-big')} ${await txt('.mfm-facts')})`);
  await page.focus(R + '.mfm-fig'); await page.keyboard.press('ArrowDown');
  check((await txt('.mfm-facts')).includes('cm, 5.8 cm'), `mag: arrow keys move the compass (${await txt('.mfm-facts')})`);
  await page.click(R + '.mfm-level [data-v="10"]');
  check(await page.isHidden(R + '.mfm-formula') && await page.isHidden(R + '.mfm-rule12'), 'mag: Class 10 hides formulas');
  check((await page.$$(R + '.eq-q')).length === 4, 'mag: four practice questions');
  const q1 = await page.textContent(R + '.eq-q:nth-child(1) p'), [I, r] = q1.match(/carries ([\d.]+) A\. How strong is its magnetic field ([\d.]+) cm/).slice(1).map(Number);
  await page.fill(R + '.eq-q:nth-child(1) .eq-in', String(+((2e-7 * I) / (r / 100) * 1e6).toFixed(3))); await page.click(R + '.eq-q:nth-child(1) .eq-go');
  check((await page.textContent(R + '.eq-q:nth-child(1) .eq-res')).startsWith('Right'), 'mag: right answer accepted');

  // ---- Solve my numbers (phys-e.ts) ----
  const PS = '.ps-host ';
  const psAns = () => page.textContent(PS + '.ps-ans'), psWork = () => page.textContent(PS + '.ps-work');
  const psSolve = async (prob, vals, units = {}) => {
    await page.selectOption(PS + '[data-k="prob"]', prob);
    await page.$$eval(PS + `label[data-p="${prob}"] select`, (ss, u) => ss.forEach((s) => { const k = s.dataset.k; const want = u[k]; s.value = want ?? s.options[0].value; }), Object.fromEntries(Object.entries(units).map(([k, v]) => [`${prob}-${k}-u`, v])));
    for (const [k, v] of Object.entries(vals)) await page.fill(PS + `[data-k="${prob}-${k}"]`, v);
    await page.waitForTimeout(80);
  };
  const psCase = async (name, prob, vals, ans, work, units) => {
    await psSolve(prob, vals, units);
    const a = await psAns(), w = await psWork();
    check(a === ans && (!work || w.includes(work)) && !/NaN|Infinity/.test(a + w), `solve ${name}: ${a}${work && !w.includes(work) ? ' / working: ' + w : ''}`);
  };
  check((await page.getAttribute(PS + '.ps-out', 'aria-live')) === 'polite', 'solve: answer is a polite live region');

  await psCase('wire', 'wire', { I: '10', r: '5' }, 'The field is 40 µT.', 'B = 4.00 × 10^-5 T = 40 µT');
  await psCase('wire in m and mA', 'wire', { I: '10000', r: '0.05' }, 'The field is 40 µT.', 'Convert to base units', { I: 'mA', r: 'm' });
  await psCase('loop', 'loop', { N: '1', I: '5', R: '10' }, 'The field at the centre is 31.4 µT.', 'B = 3.14 × 10^-5 T');
  await psCase('50 turns', 'loop', { N: '50', I: '5', R: '10' }, 'The field at the centre is 1.57 mT.', null);
  await psCase('solenoid', 'sol', { N: '500', L: '25', I: '2' }, 'The field inside is 5.03 mT.', 'n = N / L = 500 ÷ 0.25 = 2000 per m');
  await psCase('force', 'force', { B: '0.2', I: '5', L: '30', th: '90' }, 'The force is 0.3 N.', 'F = 0.3 N');
  await psCase('force at 30 degrees', 'force', { B: '0.2', I: '5', L: '30', th: '30' }, 'The force is 0.15 N.', null);
  await psCase('force along the field', 'force', { B: '0.2', I: '5', L: '30', th: '0' }, 'The force is 0 N: the wire runs along the field, so it feels no push.', null);
  await psCase('force with radians', 'force', { B: '0.2', I: '5', L: '30', th: 'pi/2' }, 'The force is 0.3 N.', null, { th: 'rad' });
  await psCase('parallel wires', 'par', { I1: '10', I2: '10', d: '10' }, 'The force is 2.00 × 10^-4 N on each metre of wire.', 'F/L = 2.00 × 10^-4 N/m');
  await psSolve('wire', { I: '10', r: '0' }); check((await psAns()).includes('must be more than 0') && !/NaN|Infinity/.test(await psAns()), 'solve: distance 0 gives a friendly message');
  await page.click(PS + '.ps-pre button:has-text("Solenoid")'); await page.waitForTimeout(80);
  check((await psAns()) === 'The field inside is 5.03 mT.' && (await page.textContent(PS + '.ps-tip')).includes('Common mistake'), 'solve: preset Solenoid and tip');
};
