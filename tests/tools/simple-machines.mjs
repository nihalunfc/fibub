// #1026 simple machines lab
export const path = '/learn/simple-machines/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/simple-machines/`); await page.waitForTimeout(700);
  const facts = () => page.textContent('.sm .sm-facts'), eq = () => page.textContent('.sm .sm-eq');
  const setR = async (sel, v) => { await page.$eval(sel, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v)); await page.waitForTimeout(120); };
  { const f = await facts(); check(f.includes('Effort needed196 N') && f.includes('Mechanical advantage3') && f.includes('Velocity ratio3') && f.includes('Efficiency100 %') && (await eq()).includes('588 × 0.5 ÷ 1.5 = 196 N'), 'simple-machines: class 1 lever, 588 N at 0.5 m, effort at 1.5 m: 196 N'); }
  check((await page.textContent('.sm .sm-leffv')) === '100 %', 'simple-machines: whole-number labels keep their zeros (100 %)');
  check(await page.$eval('.sm .sm-c', (c) => { const x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < x.length; i += 4) if (x[i] < 100) n++; return n > 300; }), 'simple-machines: picture drawn');
  { const f = await facts(), wi = parseFloat(f.split('Work in')[1]), wo = parseFloat(f.split('Work out')[1]); check(Math.abs(wi - wo) < 0.2 && wi > 0, `simple-machines: ideal lever: work in = work out (${wi} J, ${wo} J)`); }
  await setR('.sm .sm-leff', 0.8);
  check((await facts()).includes('Effort needed245 N') && (await facts()).includes('Efficiency80 %'), 'simple-machines: 80 % efficient pivot needs 245 N');
  await setR('.sm .sm-leff', 1);
  await page.click('.sm .sm-class [data-c="2"]'); await page.waitForTimeout(120);
  check((await facts()).includes('Mechanical advantage4') && (await eq()).includes('wheelbarrow'), 'simple-machines: class 2, load 0.5 m, effort 2 m: MA 4');
  await page.click('.sm .sm-class [data-c="3"]'); await page.waitForTimeout(120);
  check((await facts()).includes('Mechanical advantage0.25') && (await facts()).includes('Effort needed2352 N') && (await eq()).includes('tweezers'), 'simple-machines: class 3: MA 0.25, effort 2352 N');
  // pulleys
  await page.click('.sm .sm-mode [data-m="pulley"]'); await page.waitForTimeout(120);
  { const f = await facts(); check(f.includes('Effort needed319.8 N') && f.includes('Mechanical advantage1.84') && f.includes('Velocity ratio2') && f.includes('Efficiency91.9 %'), 'simple-machines: 2 strands with 2 kg pulleys and 5 % friction: 319.8 N, 91.9 %'); }
  await page.click('.sm .sm-n [data-n="4"]'); await setR('.sm .sm-bm', 0); await setR('.sm .sm-pf', 0);
  check((await facts()).includes('Effort needed147 N') && (await facts()).includes('Velocity ratio4'), 'simple-machines: 4 strands, ideal: 147 N');
  await page.click('.sm .sm-n [data-n="1"]');
  check((await facts()).includes('Effort needed588 N') && (await eq()).includes('changes the direction'), 'simple-machines: single fixed pulley MA 1');
  // ramp
  await page.click('.sm .sm-mode [data-m="ramp"]'); await page.waitForTimeout(120);
  check((await facts()).includes('Effort needed175.2 N') && (await facts()).includes('Efficiency67.1 %') && (await facts()).includes('Velocity ratio5'), 'simple-machines: ramp 5 m by 1 m, μ 0.1: 175.2 N, 67.1 %');
  await setR('.sm .sm-rmu', 0); await setR('.sm .sm-rl', 10);
  check((await facts()).includes('Effort needed58.8 N'), 'simple-machines: smooth 10 m ramp: 58.8 N');
  // wheel and axle
  await page.click('.sm .sm-mode [data-m="wheel"]'); await page.waitForTimeout(120);
  check((await facts()).includes('Velocity ratio6') && (await facts()).includes('Effort needed108.9 N') && (await facts()).includes('Efficiency90 %'), 'simple-machines: wheel 30 cm, axle 5 cm, 90 %: VR 6, 108.9 N');
  // drag across the picture to pull
  await setR('.sm .sm-pull', 0);
  { const b = await page.$eval('.sm .sm-c', (c) => { c.scrollIntoView({ block: 'center' }); const r = c.getBoundingClientRect(); return { x: r.left, y: r.top }; });
    await page.mouse.move(b.x + 40, b.y + 120); await page.mouse.down(); await page.mouse.move(b.x + 140, b.y + 120, { steps: 5 }); await page.mouse.up(); await page.waitForTimeout(120);
    check(await page.inputValue('.sm .sm-pull') === '0.5', `simple-machines: drag sideways pulls (${await page.inputValue('.sm .sm-pull')})`); }
  // quiz
  check((await page.$$('.sm .sq-q')).length === 4, 'simple-machines: four questions');
  const ans = await page.$eval('.sm .sq-q:nth-child(3)', (e) => e.dataset.ans);
  await page.fill('.sm .sq-q:nth-child(3) .sq-in', ans); await page.click('.sm .sq-q:nth-child(3) .sq-check');
  check((await page.textContent('.sm .sq-q:nth-child(3) .sq-res')) === 'Right!', 'simple-machines: quiz');
};
