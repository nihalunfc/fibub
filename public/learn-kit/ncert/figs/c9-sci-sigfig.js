// Class 9 Science, Chapter 1: significant figures game. A measured number is shown digit by digit; tap the digits you
// think are significant, then Check. Rules: non-zero digits always count; zeros between non-zero digits count;
// leading zeros never count; trailing zeros count only when there is a decimal point.
import { canvas, text, title, row, button, readout } from '../../kit.js';

const NUMS = ['4005', '0.00450', '3.200', '1200', '1200.', '0.0807', '120.50', '0.0030', '60.0', '700', '2.005', '0.10', '5008.0', '90000'];
export const mask = (s) => {
  const hasDot = s.includes('.'), ch = [...s], m = ch.map(() => false);
  const first = ch.findIndex((c) => c >= '1' && c <= '9');
  const lastNon = ch.reduce((a, c, i) => (c >= '1' && c <= '9' ? i : a), -1);
  ch.forEach((c, i) => { if (c === '.') return; if (i < first) return; if (c !== '0') m[i] = true; else if (i < lastNon) m[i] = true; else m[i] = hasDot; });
  return m;
};

export default function (host) {
  let idx = 0, pick = [], shown = false, score = 0, tries = 0, rects = [];
  const cv = canvas(host, { aspect: 0.55, max: 440, min: 250, label: 'A number shown as tappable digits for a significant figures game' });
  const ctl = row(host);
  button(ctl, 'Check', () => { if (shown) return; shown = true; tries++; const m = mask(NUMS[idx]); const ok = m.every((v, i) => v === !!pick[i]); if (ok) score++; msg(ok); cv.redraw(); });
  button(ctl, 'Next number', () => { idx = (idx + 1) % NUMS.length; pick = []; shown = false; out.textContent = 'Tap the digits that are significant, then press Check.'; cv.redraw(); });
  const out = readout(host); out.textContent = 'Tap the digits that are significant, then press Check.';
  const why = (s) => {
    const h = s.includes('.');
    if (/^0\./.test(s)) return 'Zeros after the decimal point and before the first non-zero digit only show where the point is, so they do not count.';
    if (!h && /0$/.test(s)) return 'With no decimal point, trailing zeros are just place holders: they are not counted (1200 has 2 significant figures).';
    if (h && /0$/.test(s)) return 'A trailing zero after a decimal point was measured on purpose, so it counts.';
    return 'Zeros trapped between non-zero digits are always significant.';
  };
  function msg(ok) { const m = mask(NUMS[idx]); out.innerHTML = (ok ? '<b>Correct.</b> ' : '<b>Not quite.</b> ') + `${NUMS[idx]} has <b>${m.filter(Boolean).length}</b> significant figures. ${why(NUMS[idx])}`; }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `Which digits are significant? Score ${score}/${tries}`, col) + 10, s = NUMS[idx], m = mask(s);
    const n = s.length, bw = Math.min(46, (w - 24) / n), x0 = (w - bw * n) / 2; rects = [];
    [...s].forEach((c, i) => {
      const x = x0 + i * bw, y = top + 30, isDot = c === '.';
      const sel = !!pick[i];
      if (!isDot) { rects.push([x, y, bw - 4, 56, i]); ctx.fillStyle = shown ? (m[i] ? col.s[2] : col.line) : sel ? col.s[0] : col.soft; ctx.strokeStyle = shown && sel !== m[i] ? col.bad : col.line; ctx.lineWidth = shown && sel !== m[i] ? 3 : 1.5; ctx.globalAlpha = shown ? 0.55 : 1; ctx.beginPath(); ctx.roundRect(x, y, bw - 4, 56, 6); ctx.fill(); ctx.globalAlpha = 1; ctx.stroke(); }
      text(ctx, c, x + (bw - 4) / 2, y + 30, { color: !shown && sel ? '#fff' : col.ink, size: isDot ? 30 : 28, weight: 700, align: 'center' });
    });
    text(ctx, shown ? 'green = significant (counted); red outline = your tap was wrong' : 'tap a digit to select it', w / 2, top + 108, { color: col.muted, size: 11.5, align: 'center' });
    text(ctx, 'Think of measured digits as the ones the instrument really gave you.', w / 2, top + 130, { color: col.muted, size: 11, align: 'center' });
  };
  const hit = (e) => { if (shown) return; const r = cv.c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top; for (const [rx, ry, rw, rh, i] of rects) if (x >= rx && x <= rx + rw && y >= ry && y <= ry + rh) { pick[i] = !pick[i]; cv.redraw(); } };
  cv.c.addEventListener('pointerdown', hit); cv.c.style.touchAction = 'manipulation';
  cv.redraw();
}
