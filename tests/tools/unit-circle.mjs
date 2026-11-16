// #1183 unit circle to wave (maths checked against sympy in tests/sci-tools/unit-circle.mjs)
export const path = '/learn/unit-circle/';
export default async ({ page, check, BASE }) => {
  const R = '.ucl ';
  const t = (s) => page.textContent(R + s);
  const slide = (s, v) => page.$eval(R + s, (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v));
  await page.goto(`${BASE}/learn/unit-circle/`); await page.waitForTimeout(500);
  check((await t('.uc-title')) === '30° = π/6 rad', `circle: start at 30° (${await t('.uc-title')})`);
  { const f = await t('.uc-facts'); check(f.includes('sin θ1/2') && f.includes('cos θ√3/2') && f.includes('1/√3') && f.includes('Quadrant1All'), `circle: exact values at 30° (${f})`); }
  await slide('.uc-th', 150);
  { const f = await t('.uc-facts'); check(f.includes('sin θ1/2') && f.includes('cos θ−√3/2') && f.includes('Quadrant2Sin only') && f.includes('5π/6'), `circle: 150° (${f})`); }
  check((await page.inputValue(R + '.uc-deg')) === '150', 'circle: slider fills the angle box');
  await page.click(R + '.uc-unit button[data-u="rad"]');
  check((await page.inputValue(R + '.uc-deg')) === '2.618', 'circle: radians box');
  await page.fill(R + '.uc-deg', '3pi/2'); await page.waitForTimeout(50);
  { const f = await t('.uc-facts'); check((await t('.uc-title')).startsWith('270°') && f.includes('tan θ = sin θ / cos θundefined'), `circle: typed 3π/2 (${f})`); }
  await page.fill(R + '.uc-deg', 'abc'); await page.waitForTimeout(50);
  check((await t('.uc-err')).includes('radians'), 'circle: bad angle message');
  await page.click(R + '.uc-unit button[data-u="deg"]');
  await page.fill(R + '.uc-deg', '800'); await page.waitForTimeout(50);
  check(await page.isHidden(R + '.uc-err') && (await t('.uc-note')).includes('800° is the same position on the circle as 440°'), `circle: 800° reduces to 440° (${await t('.uc-note')})`);
  await page.fill(R + '.uc-deg', '20'); await page.waitForTimeout(50);
  check(await page.isHidden(R + '.uc-err') && (await t('.uc-facts')).includes('0.342'), 'circle: 20° decimal values');
  // Drag the point to the left of the circle (180°).
  await page.$eval(R + '.uc-cfig', (e) => e.scrollIntoView({ block: 'center' }));
  const b = await (await page.$(R + '.uc-cfig')).boundingBox();
  const cx = b.x + b.width * ((10 + (1.6 / 3.5) * 360) / 380), cy = b.y + b.height / 2;
  await page.mouse.move(cx + 40, cy - 40); await page.mouse.down(); await page.mouse.move(cx - 80, cy + 2, { steps: 4 }); await page.mouse.up();
  check((await page.inputValue(R + '.uc-th')) === '180', `circle: drag to 180° (${await page.inputValue(R + '.uc-th')})`);
  const px = await page.evaluate(() => { const c = document.querySelector('.uc-wfig'); const g = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < g.length; i += 4) if (g[i + 2] > g[i] + 60) n++; return n; });
  check(px > 300, `circle: sine traced (${px} px)`);
  await page.check(R + '.uc-st'); await page.uncheck(R + '.uc-ss');
  check(await page.isChecked(R + '.uc-st'), 'circle: wave toggles');
  // Transform.
  await page.click(R + '.uc-mode button[data-m="wave"]');
  check(await page.isHidden(R + '.uc-circle') && (await t('.uc-wtitle')) === 'y = 2sin(2x)', `wave: title (${await t('.uc-wtitle')})`);
  { const f = await t('.uc-wfacts'); check(f.includes('Amplitude |a|2') && f.includes('Period 2π/b1π') && f.includes('[−2, 2]'), `wave: facts (${f})`); }
  await slide('.uc-a', -1); await slide('.uc-b', 3); await slide('.uc-c', 3); await slide('.uc-d', 1);
  { const f = await t('.uc-wfacts'); check((await t('.uc-wtitle')) === 'y = −sin(3x + π/2) + 1' && f.includes('flips') && f.includes('left by 0.167π') && f.includes('[0, 2]'), `wave: −sin(3x + π/2) + 1 (${f})`); }
  await page.click(R + '.uc-base button[data-b="cos"]');
  check((await t('.uc-wtitle')).includes('cos(3x'), 'wave: cos base');
  // Inverse.
  await page.click(R + '.uc-mode button[data-m="inv"]');
  { const f = await t('.uc-ifacts'); check(f.includes('sin⁻¹(0.5)30°') && f.includes('[−π/2, π/2]') && f.includes('sin⁻¹(sin 150°)30°'), `inverse: sin⁻¹ (${f})`); }
  await page.click(R + '.uc-ik button[data-k="acos"]'); await slide('.uc-x', -0.5);
  { const f = await t('.uc-ifacts'); check(f.includes('cos⁻¹(−0.5)120°') && f.includes('[0, π]') && f.includes('already in the principal range'), `inverse: cos⁻¹ (${f})`); }
  await page.click(R + '.uc-ik button[data-k="atan"]'); await slide('.uc-x', 3); await slide('.uc-any', 90);
  { const f = await t('.uc-ifacts'); check(f.includes('tan⁻¹(3)71.57°') && f.includes('all real numbers') && f.includes('tan 90° is undefined'), `inverse: tan⁻¹ (${f})`); }
  // Quiz.
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'circle: five quiz questions');
  const q2 = await t('.smq-q:nth-child(2) .smq-text'); const d2 = +q2.match(/Write (\d+)°/)[1];
  await page.fill(R + '.smq-q:nth-child(2) .smq-in', `${d2}*pi/180`); await page.click(R + '.smq-q:nth-child(2) .smq-check');
  check((await t('.smq-q:nth-child(2) .smq-out')) === 'Right!', 'circle: radians answer as an expression');
  // Solve-my-numbers additions (2026-11-16).
  await page.click(R + '.uc-mode button[data-m="circle"]'); await page.click(R + '.uc-unit button[data-u="deg"]');
  await page.fill(R + '.uc-deg', '150'); await page.waitForTimeout(50);
  check((await t('.uc-ans')) === 'sin 150° = 1/2,  cos 150° = −√3/2,  tan 150° = −1/√3.', `circle: one-line answer (${await t('.uc-ans')})`);
  await page.click(R + '.uc-pre button[data-d="-45"]'); await page.waitForTimeout(50);
  check((await t('.uc-note')).includes('315°') && (await t('.uc-ans')).includes('sin −45° = −1/√2'), `circle: negative angle (${await t('.uc-ans')})`);
  await page.click(R + '.uc-pre button[data-d="210"]'); await page.waitForTimeout(50);
  await page.evaluate(() => document.querySelectorAll('.ucl details').forEach((d) => { d.open = true; }));
  { const w = await t('.uc-wl'); check(w.includes('quadrant 3') && w.includes('Reference angle = 210° − 180° = 30°') && w.includes('So sin 210° = −1/2 ≈ −0.5.'), `circle: working for sin 210° (${w})`); }
  await page.click(R + '.uc-wf button[data-f="tan"]');
  check((await t('.uc-wl')).includes('So tan 210° = 1/√3'), `circle: working switches to tan (${await t('.uc-wl')})`);
  await page.fill(R + '.uc-fv', '1/2');
  check((await t('.uc-fans')).includes('30° (π/6 rad) and 150° (5π/6 rad)'), `circle: find sin θ = 1/2 (${await t('.uc-fans')})`);
  await page.click(R + '.uc-ff button[data-f="cos"]'); await page.fill(R + '.uc-fv', '-0.5');
  check((await t('.uc-fans')).includes('120° (2π/3 rad) and 240° (4π/3 rad)'), `circle: find cos θ = −0.5 (${await t('.uc-fans')})`);
  await page.fill(R + '.uc-fv', '2');
  check((await t('.uc-fans')).includes('No angle has cos'), 'circle: impossible value message');
  await page.click(R + '.uc-ff button[data-f="tan"]'); await page.fill(R + '.uc-fv', '1');
  check((await t('.uc-fans')).includes('45° (π/4 rad) and 225° (5π/4 rad)'), 'circle: find tan θ = 1');
  check((await page.$$eval(R + '.uc-table tbody tr', (e) => e.length)) === 11, 'circle: special angle table');
};
