// #214 galaxy morphology practice
import { quizItem, broad } from '../../src/lib/sci/galaxy.ts';
export const path = '/science/galaxy-morphology-practice/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/galaxy-morphology-practice/`); await page.waitForTimeout(600);
  const R = '.gmp ';
  check(await page.isVisible(R + '.gm-quiz') && await page.isHidden(R + '.gm-exp') && /^Round \d+, galaxy 1$/.test(await page.textContent(R + '.gm-qn')), 'galaxy: quiz first, with a random round');
  await page.fill(R + '.gm-round', '1234'); await page.press(R + '.gm-round', 'Enter'); await page.waitForTimeout(300);
  check((await page.textContent(R + '.gm-qn')) === 'Round 1234, galaxy 1' && (await page.$$(R + '.gm-ans button')).length === 5, 'galaxy: typed round, five main-type answers');
  const lit = () => page.evaluate(() => { const c = document.querySelector('.gmp .gm-qimg'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] > 120) n++; return { n, w: c.width }; });
  { const l = await lit(); check(l.w === 320 && l.n > 300 && l.n < 320 * 320 / 2, `galaxy: the picture is drawn (${l.n} bright pixels)`); }
  const tap = async (sel) => { await page.locator(sel).scrollIntoViewIfNeeded(); await page.click(sel); await page.waitForTimeout(150); };
  // Galaxy 1: answer right.
  const g1 = quizItem(1234, 1);
  await tap(`${R}.gm-ans button[data-c="${broad(g1.cls)}"]`);
  check((await page.textContent(R + '.gm-verdict')).startsWith('Right:') && (await page.textContent(R + '.gm-score')) === '1 of 1 right (100 %)' && (await page.$$(R + '.gm-qcues li')).length >= 2, `galaxy: right answer (${g1.cls}) with cues`);
  check(await page.$eval(R + '.gm-ans button', (b) => b.disabled) && (await page.$$(R + '.gm-ans .gm-right')).length === 1, 'galaxy: answers lock and the right one is marked');
  // Galaxy 2: answer wrong.
  await tap(R + '.gm-next');
  const g2 = quizItem(1234, 2), wrong = ['E', 'S0', 'S', 'SB', 'Irr'].find((c) => c !== broad(g2.cls));
  await tap(`${R}.gm-ans button[data-c="${wrong}"]`);
  check((await page.textContent(R + '.gm-verdict')).startsWith('Not quite: you said') && (await page.textContent(R + '.gm-score')) === '1 of 2 right (50 %)' && (await page.$$(R + '.gm-ans .gm-wrong')).length === 1, `galaxy: wrong answer marked (${g2.cls}, said ${wrong})`);
  { const t = await page.textContent(R + '.gm-conf'); check(t.includes('True type') && t.includes(`said ${wrong}`) && t.includes(broad(g1.cls) === broad(g2.cls) ? '1 of 2' : '1 of 1'), 'galaxy: confusion table'); }
  // Downloads: answers CSV, the picture, a report.
  { const [d] = await Promise.all([page.waitForEvent('download'), tap(R + '.gm-qcsv')]); const f = OUT + 'gx.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 3 && rows[0] === 'galaxy,true_type,detailed_type,your_answer,right' && rows[1].endsWith(',yes') && rows[2].endsWith(',no') && rows[1].includes(g1.cls), 'galaxy: answers CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), tap(R + '.gm-qpng')]); const f = OUT + 'gx.png'; await d.saveAs(f); const b = readFileSync(f); check(d.suggestedFilename() === `galaxy-round-1234-2-${g2.cls}.png` && b[1] === 0x50 && b[2] === 0x4e && b.length > 5000, 'galaxy: picture PNG'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), tap(R + '.gm-qdl [data-f="pdf"]')]); check(d.suggestedFilename().endsWith('.pdf'), 'galaxy: score report PDF'); }
  // An elliptical shows the ellipticity sum; find the round's first one.
  let kE = 3; while (quizItem(1234, kE).cls[0] !== 'E') kE++;
  for (let k = 3; k <= kE; k++) await tap(R + '.gm-next');
  await tap(`${R}.gm-ans button[data-c="E"]`);
  check((await page.textContent(R + '.gm-qn')) === `Round 1234, galaxy ${kE}` && (await page.textContent(R + '.gm-qcues')).includes('10 × (1 −') && (await page.textContent(R + '.gm-verdict')).includes(`(in detail ${quizItem(1234, kE).cls})`), 'galaxy: elliptical cue with 10 × (1 − b/a)');
  // Detailed answers.
  await page.selectOption(R + '.gm-level', 'detail'); await page.waitForTimeout(300);
  check((await page.$$(R + '.gm-ans button')).length === 16 && (await page.textContent(R + '.gm-score')) === 'No answers yet' && (await page.textContent(R + '.gm-qn')) === 'Round 1234, galaxy 1', 'galaxy: detailed answers start again');
  await tap(`${R}.gm-ans button[data-c="${g1.cls}"]`);
  check((await page.textContent(R + '.gm-verdict')) === `Right: ${g1.cls}.`, 'galaxy: detailed right answer');
  await tap(R + '.gm-reset');
  check((await page.textContent(R + '.gm-score')) === 'No answers yet', 'galaxy: score starts again');
  await page.fill(R + '.gm-round', '0'); await page.press(R + '.gm-round', 'Enter'); await page.waitForTimeout(200);
  check((await page.inputValue(R + '.gm-round')) === '1234', 'galaxy: a bad round number keeps the old round');
  // Explore.
  await tap(R + '.gm-mode button[data-m="explore"]'); await page.waitForTimeout(300);
  const facts = () => page.textContent(R + '.gm-efacts');
  check((await page.textContent(R + '.gm-ecls')) === 'Looks like Sb' && await page.isHidden(R + '.gm-quiz'), 'galaxy: explore starts from Sb');
  { const f = await facts(); check(f.includes('0.25 set, 0.25 in the picture') && f.includes('45 %') && f.includes('b/a 0.87 at 30° tilt') && f.includes('4.671'), `galaxy: Sb facts (${f})`); }
  const slide = (k, v) => page.$eval(`${R}input[data-k="${k}"]`, (el, v) => { el.value = String(v); el.dispatchEvent(new Event('input', { bubbles: true })); }, v).then(() => page.waitForTimeout(300));
  await slide('bar', 0.5);
  check((await page.textContent(R + '.gm-ecls')) === 'Looks like SBb' && (await page.textContent(R + '.gm-ecues')).includes('straight bar') && (await page.textContent(R + '.gm-o-bar')) === '0.50', 'galaxy: a bar makes it SBb');
  await slide('bar', 0); await slide('bt', 0.4);
  check((await page.textContent(R + '.gm-ecls')) === 'Looks like Sab', 'galaxy: a bigger bulge reads Sab');
  await slide('pitch', 6);
  check((await page.textContent(R + '.gm-ecls')) === 'Looks like Sa' && (await page.textContent(R + '.gm-ecues')).includes('tightly wound'), 'galaxy: tight arms make it Sa');
  await page.selectOption(R + '.gm-pre', 'E4'); await page.waitForTimeout(300);
  { const f = await facts(); check((await page.textContent(R + '.gm-ecls')) === 'Looks like E4' && f.includes('10 × (1 − 0.60) = 4.0 → E4') && f.includes('0.60 at 20°') && f.includes('7.669') && f.includes('94.4 %'), `galaxy: E4 facts (${f})`); }
  check(await page.isHidden(`${R}label.gm-s:has(input[data-k="bt"])`) && await page.isVisible(`${R}label.gm-s:has(input[data-k="q"])`), 'galaxy: only the elliptical sliders show');
  await slide('q', 0.3);
  check((await page.textContent(R + '.gm-ecls')) === 'Looks like E7', 'galaxy: flattest elliptical E7');
  await page.selectOption(R + '.gm-fam', 'Irr'); await page.waitForTimeout(300);
  check((await page.textContent(R + '.gm-ecls')) === 'Looks like Irr' && (await facts()).includes('Light in knots'), 'galaxy: irregular');
  await page.selectOption(R + '.gm-pre', 'S0'); await page.waitForTimeout(300);
  check((await page.textContent(R + '.gm-ecls')) === 'Looks like S0' && (await page.textContent(R + '.gm-ecues')).includes('lenticular'), 'galaxy: lenticular');
  { const before = await page.$eval(R + '.gm-eimg', (c) => c.toDataURL()); await tap(R + '.gm-newseed'); const after = await page.$eval(R + '.gm-eimg', (c) => c.toDataURL()); check(before !== after && (await page.textContent(R + '.gm-ecls')) === 'Looks like S0', 'galaxy: new seed redraws, same type'); }
  await page.fill(R + '.gm-seed', '0'); await page.press(R + '.gm-seed', 'Enter'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.gm-err')).includes('whole number from 1') && await page.isVisible(R + '.gm-err'), 'galaxy: bad seed message');
  await page.fill(R + '.gm-seed', '7'); await page.press(R + '.gm-seed', 'Enter'); await page.waitForTimeout(200);
  check(await page.isHidden(R + '.gm-err'), 'galaxy: good seed clears the message');
  { const [d] = await Promise.all([page.waitForEvent('download'), tap(R + '.gm-epng')]); check(d.suggestedFilename() === 'galaxy-S0-seed-7.png', 'galaxy: explore picture PNG'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), tap(R + '.gm-edl [data-f="docx"]')]); check(d.suggestedFilename().endsWith('.docx'), 'galaxy: explore report Word'); }
  await tap(R + '.gm-mode button[data-m="quiz"]');
};
