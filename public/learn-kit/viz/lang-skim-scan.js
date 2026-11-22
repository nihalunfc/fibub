// Three ways of looking at a passage (made-up layout): read every word, skim (the first line of each paragraph and the last
// line), or scan (sweep for one keyword, 1998). Press Play and watch how many words the eye lands on and how long it takes.
import { canvas, text, title, row, choice, readout, loop, rng } from '../kit.js';

const R = rng(11);
const PARAS = 4, LINES = 4, WORDS = 9, KEY = [2, 1, 5];
const widths = Array.from({ length: PARAS * LINES * WORDS }, () => 10 + Math.floor(R() * 22));
export default function (host) {
  let mode = 'scan', n = 0, seq = [];
  const cv = canvas(host, { aspect: 0.8, max: 330, min: 260, label: 'A passage drawn as word blocks with a highlighter moving across it' });
  const ctl = row(host);
  const idx = (p, l, w) => (p * LINES + l) * WORDS + w;
  const build = () => {
    seq = [];
    const key = idx(...KEY);
    if (mode === 'read') for (let i = 0; i < widths.length; i++) seq.push(i);
    else if (mode === 'skim') { for (let p = 0; p < PARAS; p++) for (let w = 0; w < WORDS; w++) seq.push(idx(p, 0, w)); for (let w = 0; w < WORDS; w++) seq.push(idx(PARAS - 1, LINES - 1, w)); }
    else for (let p = 0; p < PARAS; p++) for (let l = 0; l < LINES; l++) { const w = Math.floor(WORDS / 2); const i = idx(p, l, w); seq.push(i); if (p === KEY[0] && l === KEY[1]) { seq.push(key); p = PARAS; break; } }
    n = 0; out.textContent = say[mode];
  };
  const say = { read: 'Reading every word: slow, and most of it is not needed to find one fact.', skim: 'Skimming: the first line of each paragraph gives the topic. Good for the main idea and for matching headings.', scan: 'Scanning: the eye sweeps the middle of each line looking only for the shape of the keyword. Good for names, dates and numbers.' };
  choice(ctl, 'Way of reading', [['read', 'Read all'], ['skim', 'Skim'], ['scan', 'Scan for 1998']], mode, (v) => { mode = v; build(); anim.play(); });
  const anim = loop(host, (dt) => { if (n < seq.length) { n = Math.min(seq.length, n + dt * (mode === 'read' ? 14 : 14)); } cv.redraw(); status(); });
  anim.button(ctl);
  const out = readout(host);
  const status = () => { const k = Math.floor(n); out.textContent = `${say[mode]} Words looked at: ${k}. About ${(k / 4).toFixed(0)} s at a steady pace.`; };
  cv.draw = (ctx, W, H, col) => {
    const y0 = title(ctx, 'The passage, drawn as words', col) + 8, lh = (H - y0 - 12) / (PARAS * LINES + 3), seen = new Set(seq.slice(0, Math.floor(n)));
    for (let p = 0; p < PARAS; p++) for (let l = 0; l < LINES; l++) {
      let x = 12; const y = y0 + (p * LINES + l + p * 0.75) * lh;
      for (let w = 0; w < WORDS; w++) {
        const i = idx(p, l, w), wd = widths[i] * (W - 24) / 290, isKey = p === KEY[0] && l === KEY[1] && w === KEY[2];
        ctx.fillStyle = seen.has(i) ? col.s[mode === 'read' ? 7 : mode === 'skim' ? 2 : 0] : col.line; ctx.globalAlpha = seen.has(i) ? 0.85 : 1;
        if (isKey) { ctx.fillStyle = seen.has(i) ? col.s[5] : col.muted; }
        ctx.fillRect(x, y, wd - 3, lh * 0.6); ctx.globalAlpha = 1;
        if (isKey) text(ctx, '1998', x + wd / 2, y - 3, { color: col.ink, size: 10, weight: 700, align: 'center', base: 'bottom', fit: false });
        x += wd;
      }
    }
  };
  build(); cv.redraw();
}
