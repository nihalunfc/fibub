// #L384 Bearings and friction (How machines work): maths, idea cards, flywheel sim, ball bearing labels, quiz.
import { BEARINGS, frictionTorque, discInertia, spinDown, speedAt, angleAt } from '../../src/lib/sci/millwright.ts';
export const path = '/learn/bearings-and-friction/';
const near = (a, b, tol = 1e-3) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
export default async ({ page, check, BASE }) => {
  // Hand-worked: 20 kg disc, R 0.2 m, 25 mm shaft, 1000 rpm, dry bush μ 0.15.
  // F = 196 N; T = 0.15 × 196 × 0.0125 = 0.3675 N·m; I = 0.4; α = 0.91875; ω0 = 104.72; t = 113.98 s; E = 2193.2 J; P0 = 38.48 W.
  check(near(frictionTorque(0.15, 196, 0.0125), 0.3675) && near(discInertia(20, 0.2), 0.4), 'bearings-and-friction: T = μFr = 0.3675 N·m, I = ½mR² = 0.4');
  const s = spinDown(BEARINGS.dry.mu, 20, 0.2, 0.0125, 1000);
  check(near(s.time, 113.98) && near(s.energy, 2193.2) && near(s.heatStart, 38.485), 'bearings-and-friction: dry bush coasts 114 s, 2193 J, 38.5 W');
  check(near(spinDown(BEARINGS.ball.mu, 20, 0.2, 0.0125, 1000).time / s.time, 100), 'bearings-and-friction: ball bearing coasts 100× longer than the dry bush');
  check(near(speedAt(s, s.time / 2), 500) && speedAt(s, s.time + 5) === 0 && near(angleAt(s, s.time) / (2 * Math.PI), s.turns), 'bearings-and-friction: half speed at half time, stops, turns add up');
  check(near(spinDown(0.15, 20, 0.2, 0.0125, 1000, 196).time, s.time / 2), 'bearings-and-friction: doubling the load halves the coast');
  await page.goto(`${BASE}/learn/bearings-and-friction/`); await page.waitForTimeout(300);
  const R = '.bnf';
  check((await page.locator(`${R} .sk-step`).count()) === 6, 'bearings-and-friction: 6 idea cards');
  await page.click(`${R} .sk-step:nth-child(3) .sk-done input`);
  check((await page.textContent(`${R} .sk-progress`)) === '1 of 6 steps done', 'bearings-and-friction: ticks count');
  const ds = async (k) => +(await page.getAttribute(`${R} .bnf-out`, `data-${k}`));
  check(near(await ds('time'), 113.98) && near(await ds('heat'), 38.485), 'bearings-and-friction: sim dry bush 114 s, 38.5 W');
  await page.click(`${R} .bnf-type button[data-b=roller]`);
  check(near(await ds('time'), 113.98 * 0.15 / 0.0011) && (await page.textContent(`${R} .bnf-out`)).includes('Roller'), 'bearings-and-friction: sim roller bearing');
  check((await page.locator(`${R} .bnf-rows tr`).count()) === 4, 'bearings-and-friction: comparison table has all four bearings');
  await page.click(`${R} .bnf-type button[data-b=dry]`);
  await page.click(`${R} .bnf-spin`); await page.waitForTimeout(600);
  check(/Coasting|Stopped/.test(await page.textContent(`${R} .bnf-clock`)), 'bearings-and-friction: spin starts the coast');
  const tap = (id) => page.$eval(`${R} [data-part=${id}]`, (g) => g.dispatchEvent(new MouseEvent('click', { bubbles: true })));
  await tap('cage');
  check((await page.textContent(`${R} .sk-label-out`)).startsWith('Cage'), 'bearings-and-friction: tap a part shows its name');
  await page.click(`${R} .sk-mode button:nth-child(2)`);
  { const t = await page.textContent(`${R} .sk-label-out strong`); const id = await page.evaluate((n) => [...document.querySelectorAll('.bnf [data-part]')].find((g) => g.dataset.name === n).dataset.part, t);
    await tap(id); check((await page.textContent(`${R} .sk-label-out`)).startsWith('Yes'), 'bearings-and-friction: test mode accepts the right part'); }
  check((await page.locator(`${R} .lq-item`).count()) === 6, 'bearings-and-friction: quiz has 6 questions');
  { const a = await page.getAttribute(`${R} .lq-item`, 'data-ans'); await page.click(`${R} .lq-item:first-child .lq-choice:nth-child(${+a + 1})`);
    check((await page.textContent(`${R} .lq-item:first-child .lq-fb`)) === 'Right.', 'bearings-and-friction: quiz accepts the right choice'); }
  { const a = await page.getAttribute(`${R} .lq-item:last-child`, 'data-ans'); await page.fill(`${R} .lq-item:last-child .lq-in`, String(a)); await page.click(`${R} .lq-item:last-child .lq-check`);
    check((await page.textContent(`${R} .lq-item:last-child .lq-fb`)) === 'Right.', 'bearings-and-friction: quiz accepts the right number'); }
};
