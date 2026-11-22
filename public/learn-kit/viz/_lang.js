// Helpers for the language-test figures (lang-*): small DOM builders, a tap-to-sort game and a tap-to-order game.
// Plain DOM with the page's own colour variables; nothing is stored or sent. say() uses the browser's own voice if it has one.
import { put, button, row, readout, rng, canvas, text, title } from '../kit.js';

/** A styled block appended to `parent` (a figure host gets it before the caption). */
export function box(parent, css = '', txt = '', tag = 'div') {
  const d = document.createElement(tag);
  d.style.cssText = css;
  if (txt) d.textContent = txt;
  if (parent.matches && parent.matches('figure')) put(parent, d); else parent.appendChild(d);
  return d;
}
export const CARD = 'border:1px solid var(--line);border-radius:8px;padding:8px 10px;background:var(--bg);color:var(--ink);font-size:14px;line-height:1.45;margin:6px 0;';
export const CHIP = 'display:inline-block;border:1px solid var(--line);border-radius:999px;padding:4px 10px;margin:3px 4px 3px 0;font-size:14px;background:var(--bg);color:var(--ink);cursor:pointer;font-family:inherit;';
export const shuffle = (a, seed = 3) => { const r = rng(seed), b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
export const chip = (parent, txt, onclick, css = '') => { const b = box(parent, CHIP + css, txt, 'button'); b.type = 'button'; if (onclick) b.addEventListener('click', onclick); return b; };

/** Say text aloud with the device voice; returns false when the browser has none. */
export function say(txt, lang = 'en-GB', rate = 0.85) {
  if (!('speechSynthesis' in window)) return false;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(txt); u.lang = lang; u.rate = rate;
  const v = speechSynthesis.getVoices().find((x) => x.lang && x.lang.replace('_', '-').startsWith(lang.slice(0, 2)));
  if (v) u.voice = v;
  speechSynthesis.speak(u);
  return true;
}

/**
 * Sort game: one card at a time, tap the bucket it belongs to. items: [{ t, a (bucket index), why }].
 * Wrong taps say why and are counted; correct cards drop into the bucket's list.
 */
export function tapSort(host, { buckets, items, seed = 5, intro = 'Tap the right box for each card.', heading = 'Cards sorted into each box' }) {
  let queue, i, miss, done;
  const counts = buckets.map(() => 0), tot = buckets.map((_, k) => items.filter((x) => x.a === k).length);
  const cv = canvas(host, { aspect: 0.42, max: 190, min: 150, label: heading });
  const paint = () => { cv.redraw(); };
  cv.draw = (ctx, W, H, col) => {
    const t0 = title(ctx, heading + ` (wrong taps: ${miss || 0})`, col);
    const rh = (H - t0 - 6) / buckets.length;
    buckets.forEach((b, k) => {
      const y = t0 + 4 + k * rh + rh / 2, x0 = W * 0.34, bw = W - x0 - 12, f = tot[k] ? counts[k] / tot[k] : 0;
      text(ctx, b, 8, y, { color: col.ink, size: 11.5, weight: 600 });
      ctx.fillStyle = col.line; ctx.fillRect(x0, y - rh * 0.28, bw, rh * 0.56);
      ctx.fillStyle = col.s[k % 8]; ctx.fillRect(x0, y - rh * 0.28, bw * f, rh * 0.56);
      text(ctx, counts[k] + '/' + tot[k], x0 + bw / 2, y, { color: col.ink, size: 11, weight: 700, align: 'center', halo: col.panel });
    });
  };
  const card = box(host, CARD + 'font-size:15px;font-weight:600;text-align:center;min-height:2.6em;display:flex;align-items:center;justify-content:center;');
  const btns = box(host, 'display:flex;flex-wrap:wrap;gap:6px;justify-content:center;');
  const lists = box(host, 'display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:6px;margin-top:6px;');
  const out = readout(host);
  const cols = buckets.map((b) => { const c = box(lists, 'border:1px solid var(--line);border-radius:8px;padding:6px 8px;font-size:13px;min-height:44px;'); box(c, 'font-weight:700;margin-bottom:2px;', b); const l = box(c, 'color:var(--muted);'); return l; });
  const bb = buckets.map((b, k) => { const x = box(btns, CHIP + 'font-weight:600;', b, 'button'); x.type = 'button'; x.addEventListener('click', () => pick(k)); return x; });
  const again = row(host); button(again, 'Shuffle and restart', () => start(true));
  function start(re) { queue = shuffle(items, re ? Math.floor(Math.random() * 99) : seed); i = 0; miss = 0; done = 0; cols.forEach((c) => (c.textContent = '')); counts.fill(0); show(); paint(); out.textContent = intro; }
  function show() { if (i >= queue.length) { card.textContent = 'All sorted!'; bb.forEach((b) => (b.disabled = true)); out.textContent = `Finished with ${miss} wrong ${miss === 1 ? 'tap' : 'taps'}. Press restart to try again in a new order.`; return; } bb.forEach((b) => (b.disabled = false)); card.textContent = queue[i].t; }
  function pick(k) {
    const it = queue[i];
    if (it.a === k) { const d = box(cols[k], 'color:var(--ink);'); d.textContent = '✓ ' + it.t; counts[k]++; done++; i++; paint(); out.textContent = it.why ? 'Yes. ' + it.why : 'Yes.'; show(); }
    else { miss++; paint(); out.textContent = `Not "${buckets[k]}". ${it.why || 'Think again.'}`; }
  }
  start(false);
}

/**
 * Order game: tap the pieces in the right order. parts: pieces in correct order (shown shuffled); notes[k] optional hint
 * shown once the piece is right. Check marks the line; Undo and Reset are always there.
 */
export function tapOrder(host, { parts, notes = [], seed = 2, sep = ' ', intro = 'Tap the pieces in order.', block = false, onChange = () => {} }) {
  const order = shuffle(parts.map((_, k) => k), seed);
  let line = [];
  const lineEl = box(host, CARD + 'min-height:3em;' + (block ? '' : 'font-size:15px;'));
  const pool = box(host, 'margin:4px 0;');
  const out = readout(host);
  const ctl = row(host);
  button(ctl, 'Check', check, 'lk-primary'); button(ctl, 'Undo', () => { line.pop(); draw(); }); button(ctl, 'Reset', () => { line = []; draw(); out.textContent = intro; });
  function draw() {
    lineEl.innerHTML = '';
    if (!line.length) box(lineEl, 'color:var(--muted);', 'Your answer appears here.');
    line.forEach((k, p) => { const s = box(lineEl, block ? 'padding:3px 0;border-bottom:1px dashed var(--line);' : 'display:inline;margin-right:4px;', (p + 1) + '. ' + parts[k], 'span'); if (!block) s.textContent = parts[k] + sep; });
    onChange(line, false);
    pool.innerHTML = '';
    order.forEach((k) => { if (!line.includes(k)) chip(pool, parts[k], () => { line.push(k); draw(); }); });
  }
  function check() {
    if (line.length < parts.length) { out.textContent = `Place all ${parts.length} pieces first (${line.length} so far).`; return; }
    const right = line.filter((k, p) => k === p).length;
    if (right === parts.length) onChange(line, true);
    out.textContent = right === parts.length ? 'Correct order! ' : `${right} of ${parts.length} are in the right place. Undo and try again.`;
    if (right === parts.length && notes.length) { lineEl.innerHTML = ''; parts.forEach((p, k) => box(lineEl, 'padding:3px 0;border-bottom:1px dashed var(--line);', `${k + 1}. ${p}${notes[k] ? '  (' + notes[k] + ')' : ''}`)); }
  }
  out.textContent = intro; draw();
}
