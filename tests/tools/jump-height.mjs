// #489 jump height from flight time, frames and video
export const path = '/science/jump-height/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/jump-height/`); await page.waitForTimeout(500);
  const R = '.jmp ';
  check((await page.textContent(R + '.jmp-med')).includes('not medical advice'), 'jump: medical line');
  { const t = await page.textContent(R + '.jmp-fres'); check(t.includes('15 frames = 500 ms') && t.includes('30.7 cm') && t.includes('26.7 to 34.9 cm'), 'jump: example frames 100 -> 115 at 30 fps'); }
  check((await page.textContent(R + '.jmp-big')) === 'Best jump 33.2 cm (CMJ 2)', 'jump: example best jump');
  { const f = await page.textContent(R + '.jmp-facts'); check(f.includes('Mean height27.7 cm') && f.includes('SD4.5 cm') && f.includes('Best RSI1.19 m/s (Drop jump 2)') && f.includes('2.55 m/s'), 'jump: mean, SD, RSI, take-off speed'); }
  { const t = await page.textContent(R + '.jmp-tab'); check(t.includes('22.7') && t.includes('1.13') && t.includes('26.7–34.9'), 'jump: table with RSI and ± 1 frame range'); }
  check(await page.isVisible(R + '.jmp-fig'), 'jump: chart drawn');
  // frames: 240 fps, with contact
  await page.selectOption(R + '.jmp-fps', '240'); await page.fill(R + '.jmp-fc', '40'); await page.fill(R + '.jmp-ft', '100'); await page.fill(R + '.jmp-fl', '220'); await page.waitForTimeout(350);
  { const t = await page.textContent(R + '.jmp-fres'); check(t.includes('120 frames = 500 ms') && t.includes('30.1 to 31.2 cm') && t.includes('Contact 60 frames = 250 ms'), `jump: 240 fps with contact (${t})`); }
  await page.click(R + '.jmp-add'); await page.waitForTimeout(150);
  check((await page.inputValue(R + '.jmp-in')).trim().endsWith('500, 250, Video jump 6') && (await page.textContent(R + '.jmp-tab')).includes('Video jump 6'), 'jump: frames added to the list');
  check((await page.textContent(R + '.jmp-tab')).includes('1.23'), 'jump: RSI of added jump (0.3066 / 0.25 = 1.23)');
  await page.selectOption(R + '.jmp-fps', 'custom'); await page.fill(R + '.jmp-fpsc', '100'); await page.waitForTimeout(350);
  check((await page.textContent(R + '.jmp-fres')).includes('120 frames = 1200 ms'), 'jump: custom frame rate');
  // seconds and gravity
  await page.selectOption(R + '.jmp-unit', 's'); await page.fill(R + '.jmp-in', '0.6\n0.5, 0.2, Hop'); await page.waitForTimeout(350);
  check((await page.textContent(R + '.jmp-big')) === 'Best jump 44.1 cm (Jump 1)', 'jump: seconds unit, 0.6 s = 44.1 cm');
  await page.fill(R + '.jmp-g', '1.62'); await page.waitForTimeout(350);
  check((await page.textContent(R + '.jmp-big')) === 'Best jump 7.3 cm (Jump 1)', 'jump: Moon gravity');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.jmp-csv')]); const f = OUT + 'jump.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 3 && rows[0].startsWith('jump,flight_s,contact_s,height_m') && rows[2].startsWith('Hop,0.5,0.2,0.0506'), `jump: CSV (${rows[2]})`); }
  for (const f of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R}.dl button[data-f=${f}]`)]); check(d.suggestedFilename().endsWith('.' + f), `jump: ${f} download`); }
  // bad input
  await page.fill(R + '.jmp-g', '9.81'); await page.fill(R + '.jmp-in', '500'); await page.waitForTimeout(350);
  check((await page.textContent(R + '.jmp-err')).includes('unit') && await page.isHidden(R + '.jmp-out'), 'jump: wrong unit message');
  await page.fill(R + '.jmp-in', '0.5\nfast'); await page.waitForTimeout(350);
  check((await page.textContent(R + '.jmp-err')).includes('Line 2'), 'jump: bad line message');
  await page.fill(R + '.jmp-fl', '90'); await page.waitForTimeout(350);
  check((await page.textContent(R + '.jmp-ferr')).includes('after take-off'), 'jump: landing before take-off message');
  await page.fill(R + '.jmp-fl', '220'); await page.fill(R + '.jmp-fc', '150'); await page.waitForTimeout(350);
  check((await page.textContent(R + '.jmp-ferr')).includes('before take-off'), 'jump: contact after take-off message');

  // Video marking. The site's CSP has no media-src yet, so blob: videos are blocked there; this part runs in a
  // second browser context without the CSP header to check the frame stepping itself.
  const ctx2 = await page.context().browser().newContext();
  const v = await ctx2.newPage();
  const verr = []; v.on('pageerror', (e) => verr.push(String(e)));
  await v.goto(`${BASE}/science/jump-height/`); await v.waitForTimeout(400);
  const b64 = await v.evaluate(async () => {
    const c = document.createElement('canvas'); c.width = 160; c.height = 120; const x = c.getContext('2d');
    const rec = new MediaRecorder(c.captureStream(30), { mimeType: 'video/webm' }); const parts = [];
    rec.ondataavailable = (e) => parts.push(e.data);
    const done = new Promise((r) => (rec.onstop = r));
    rec.start();
    for (let i = 0; i < 45; i++) { x.fillStyle = i % 2 ? '#fff' : '#000'; x.fillRect(0, 0, 160, 120); x.fillStyle = '#f00'; x.fillRect(10, 100 - (i % 30) * 3, 20, 20); await new Promise((r) => setTimeout(r, 33)); }
    rec.stop(); await done;
    const buf = new Uint8Array(await new Blob(parts, { type: 'video/webm' }).arrayBuffer());
    let s = ''; for (const b of buf) s += String.fromCharCode(b); return btoa(s);
  });
  writeFileSync(OUT + 'jump.webm', Buffer.from(b64, 'base64'));
  await v.setInputFiles(R + '.jmp-file', OUT + 'jump.webm'); await v.waitForTimeout(1200);
  check(await v.isVisible(R + '.jmp-vbox') && (await v.textContent(R + '.jmp-vname')) === 'jump.webm', 'jump: synthetic video opens');
  const step = async (sel, n) => { for (let i = 0; i < n; i++) { await v.locator(R + sel).scrollIntoViewIfNeeded(); await v.click(R + sel); await v.waitForTimeout(250); } };
  await step('.jmp-fwd', 3);
  { const p = await v.textContent(R + '.jmp-pos'); check(p.startsWith('Frame 3'), `jump: stepped to frame 3 (${p})`); }
  await v.click(R + '.jmp-mt'); await step('.jmp-fwd', 9); await step('.jmp-back', 1); await v.click(R + '.jmp-ml'); await v.waitForTimeout(300);
  check((await v.inputValue(R + '.jmp-ft')) === '3' && (await v.inputValue(R + '.jmp-fl')) === '11' && (await v.textContent(R + '.jmp-fres')).includes('8 frames = 267 ms'), `jump: take-off and landing marked on the video (${await v.inputValue(R + '.jmp-fl')})`);
  await v.click(R + '.jmp-add'); await v.waitForTimeout(200);
  check((await v.inputValue(R + '.jmp-in')).trim().endsWith('267, , Video jump 6'), 'jump: video jump added');
  check(verr.length === 0, `jump: no errors on the video page ${verr.join(' | ')}`);
  await ctx2.close();
};
