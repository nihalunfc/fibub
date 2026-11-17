// #1044 Fleming's left-hand rule and DC motor
export const path = '/learn/fleming-rule/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/fleming-rule/`); await page.waitForTimeout(700);
  const R = '.flr ', txt = (s) => page.textContent(R + s);
  const setR = (s, v) => page.$eval(R + s, (e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  check((await txt('.flr-big')) === 'F = 0.150 N, downwards', `fleming: example force (${await txt('.flr-big')})`);
  check((await txt('.flr-formula')) === 'F = B I L sin θ = 0.50 T × 3.0 A × 0.10 m × sin 90° = 0.150 N', `fleming: formula (${await txt('.flr-formula')})`);
  await page.click(R + '.flr-swap'); check((await txt('.flr-big')) === 'F = 0.150 N, upwards', 'fleming: swapping the poles flips the force');
  await page.click(R + '.flr-rev'); check((await txt('.flr-big')) === 'F = 0.150 N, downwards', 'fleming: and reversing the current flips it back');
  await page.click(R + '.flr-swap'); await page.click(R + '.flr-rev');
  await setR('.flr-t', 30); check((await txt('.flr-big')) === 'F = 0.0750 N, downwards' && (await txt('.flr-tv')) === '30°', 'fleming: 30° halves the force');
  await setR('.flr-t', 0); check((await txt('.flr-big')) === 'F = 0 N: no force', 'fleming: wire along the field');
  await setR('.flr-t', 90); await setR('.flr-b', 1); await setR('.flr-i', 10); await setR('.flr-l', 50);
  check((await txt('.flr-big')) === 'F = 5 N, downwards' && (await txt('.flr-lv')) === '50 cm' && (await txt('.flr-bv')) === '1.00 T' && (await txt('.flr-iv')) === '10.0 A', `fleming: sliders (${await txt('.flr-big')})`);
  await setR('.flr-b', 0.5); await setR('.flr-i', 3); await setR('.flr-l', 10);
  const snap = () => page.$eval(R + '.flr-fig', (c) => c.toDataURL());
  const before = await snap();
  await page.locator(R + '.flr-fig').scrollIntoViewIfNeeded();
  const bb = await page.locator(R + '.flr-fig').boundingBox();
  await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await page.mouse.down(); await page.mouse.move(bb.x + bb.width / 2 + 80, bb.y + bb.height / 2 + 20, { steps: 5 }); await page.mouse.up(); await page.waitForTimeout(100);
  check((await snap()) !== before && (await txt('.flr-big')) === 'F = 0.150 N, downwards', 'fleming: dragging turns the 3D view');
  check(await page.isHidden(R + '.flr-vec'), 'fleming: vector note hidden at Class 10');
  await setR('.flr-a', 0); await page.waitForTimeout(100);
  check((await txt('.flr-play')) === 'Play' && (await txt('.flr-mtext')).startsWith('Turning effect now: 100% of the largest.') && (await txt('.flr-mtext')).includes('split ring swaps'), `fleming: coil flat along the field (${await txt('.flr-mtext')})`);
  await page.click(R + '.flr-level [data-v="12"]');
  check(await page.isVisible(R + '.flr-vec') && (await txt('.flr-mtext')).startsWith('τ = N B I A sin φ = 50 × 0.50 × 3.0 × 0.0025 × sin 90° = 0.188 N m'), `fleming: Class 12 torque (${await txt('.flr-mtext')})`);
  await setR('.flr-a', 90); await page.waitForTimeout(100);
  check((await txt('.flr-mtext')).includes('sin 180° = 0 N m') && (await txt('.flr-av')) === '90°', `fleming: upright coil has no turning effect (${await txt('.flr-mtext')})`);
  await page.uncheck(R + '.flr-ring'); await page.waitForTimeout(100);
  check((await txt('.flr-mtext')).includes('just rocks'), 'fleming: without the split ring');
  await page.check(R + '.flr-ring');
  await page.click(R + '.flr-play'); await page.waitForTimeout(500);
  check((await txt('.flr-play')) === 'Pause' && (await page.inputValue(R + '.flr-a')) !== '90', 'fleming: play turns the coil');
  await page.click(R + '.flr-play'); await page.click(R + '.flr-level [data-v="10"]');
  check((await page.$$(R + '.eq-q')).length === 4, 'fleming: four practice questions');
  const q1 = await page.textContent(R + '.eq-q:nth-child(1) p'), [L, I, B] = q1.match(/wire ([\d.]+) cm long carries ([\d.]+) A at right angles to a magnetic field of ([\d.]+) T/).slice(1).map(Number);
  await page.fill(R + '.eq-q:nth-child(1) .eq-in', String((B * I * L) / 100)); await page.click(R + '.eq-q:nth-child(1) .eq-go');
  check((await page.textContent(R + '.eq-q:nth-child(1) .eq-res')).startsWith('Right'), 'fleming: right answer accepted');

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

  await psCase('force', 'force', { B: '0.2', I: '5', L: '30', th: '90' }, 'The force is 0.3 N.', 'F = 0.2 T × 5 A × 0.3 m × sin 90°');
  await psCase('emf', 'emf', { B: '0.5', L: '40', v: '3', th: '90' }, 'The induced emf is 0.6 V.', 'ε = 0.6 V');
  await psCase('emf with km/h', 'emf', { B: '0.5', L: '40', v: '10.8', th: '90' }, 'The induced emf is 0.6 V.', 'Convert to base units', { v: 'km/h' });
  await psCase('emf along the field', 'emf', { B: '0.5', L: '40', v: '3', th: '0' }, 'The emf is 0 V: the rod moves along the field, so it cuts no field lines.', null);
  await psCase('induced current', 'cur', { B: '0.5', L: '40', v: '3', R: '2' }, 'The induced current is 0.3 A, and the magnetic force opposing the motion is 0.06 N.', 'Power you put in = F v = 0.06 × 3 = 0.18 W');
  await psCase('torque', 'torque', { N: '100', B: '0.5', I: '2', A: '200', th: '90' }, 'The torque is 2 N m.', 'τ = 100 × 0.5 T × 2 A × 0.02 m²');
  await psCase('torque face-on', 'torque', { N: '100', B: '0.5', I: '2', A: '200', th: '0' }, 'The torque is 0 N m: the coil is face-on to the field.', null);
  await psCase('charge', 'charge', { q: '1', v: '1e6', B: '0.01', th: '90' }, 'The force is 1.60 × 10^-15 N.', null);
  await psCase('proton circle', 'radius', { m: '1.67e-27', q: '1', v: '1e6', B: '0.5' }, 'The radius of the circle is 2.08 cm.', 'r = 0.0208 m');
  await psSolve('radius', { m: '1.67e-27', q: '1', v: '1e6', B: '0' }); check((await psAns()).includes('must be more than 0') && !/NaN|Infinity/.test(await psAns()), 'solve: zero field gives a friendly message');
  await page.click(PS + '.ps-pre button:has-text("Rod generator")'); await page.waitForTimeout(80);
  check((await psAns()) === 'The induced emf is 0.6 V.' && (await page.textContent(PS + '.ps-tip')).includes('Common mistake'), 'solve: preset Rod generator and tip');
};
