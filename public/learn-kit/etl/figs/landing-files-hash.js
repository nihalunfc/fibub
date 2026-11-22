// 1.3 Watch it happen: a landing run over a shared folder. Files are listed, a half-written one is held back,
// each finished file is hashed, and the manifest decides: new content lands, a byte-identical re-send is
// skipped, a correction with the same name lands as a second version, and a rerun adds nothing.
import { canvas, text, title, calm, ease, loop } from '../../kit.js';
import { box } from './a-draw.js';

const FILES = [
  { name: 'pos_Q204.csv', hash: 'a3f91c2e', fate: 'new' },
  { name: 'pos_Q205.csv', hash: '7be04d19', fate: 'dup' },
  { name: 'pos_Q206.csv', hash: 'c18e55a0', fate: 'fix' },
  { name: 'pos_Q207.csv.partial', hash: '', fate: 'wait' },
];
// which files are resolved after each step, and the manifest rows shown
const AFTER = [[3], [3, 0], [3, 0, 1], [3, 0, 1, 2], [3, 0, 1, 2]];
const NOTE = [
  'List the folder. The .partial file is still being written: hold it back.',
  'pos_Q204: hash a3f91c2e is not in the manifest. Copy to raw, add a row.',
  'pos_Q205: hash 7be04d19 is already there (sent yesterday). Skip.',
  'pos_Q206: same name as yesterday, new hash. Land it as version 2.',
  'Run it again: every hash is known. Zero new rows. Idempotent.',
];
export default function (host) {
  const cv = canvas(host, { aspect: 0.56, max: 300, min: 240, label: 'Files in a shared folder being hashed and checked against a manifest' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt / 0.5); cv.redraw(); } }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, step === 4 ? 'Rerun: nothing new' : 'Landing run', col);
    const L = 8, mid = w * 0.5, T = 40, rh = 26;
    text(ctx, 'Shared folder (read-only)', L, T, { color: col.muted, size: 11, weight: 700 });
    text(ctx, 'Manifest (sha256 → raw path)', mid + 6, T, { color: col.muted, size: 11, weight: 700 });
    const done = AFTER[step];
    FILES.forEach((f, i) => {
      const y = T + 14 + i * (rh + 4), cur = done[done.length - 1] === i && step > 0 && step < 4;
      box(ctx, L, y, mid - L - 6, rh, { fill: cur ? col.soft : col.panel, stroke: cur ? col.s[0] : col.line, width: cur ? 2 : 1 });
      text(ctx, f.name, L + 8, y + rh / 2, { color: col.ink, size: 10.5, fit: false });
      if (done.includes(i)) {
        const tag = { new: ['landed', col.s[2]], dup: ['skip', col.muted], fix: ['v2', col.s[1]], wait: ['wait', col.s[3]] }[f.fate];
        text(ctx, tag[0], mid - 12, y + rh / 2, { color: tag[1], size: 10.5, weight: 700, align: 'right', fit: false });
      }
    });
    const rows = [['7be04d19', 'Q205 · old', true], ['5d20aa71', 'Q206 v1 · old', true]];
    if (step >= 1) rows.push(['a3f91c2e', 'Q204', false]);
    if (step >= 3) rows.push(['c18e55a0', 'Q206 v2', false]);
    rows.forEach(([hsh, what, old], i) => {
      const y = T + 14 + i * (rh + 4), fresh = !old && ((step === 1 && hsh === 'a3f91c2e') || (step === 3 && hsh === 'c18e55a0'));
      box(ctx, mid + 6, y, w - mid - 14, rh, { fill: fresh ? col.soft : col.panel, stroke: fresh ? col.s[2] : col.line, width: fresh ? 2 : 1, alpha: fresh ? 0.3 + 0.7 * ease(k) : 1 });
      text(ctx, hsh, mid + 14, y + rh / 2, { color: old ? col.muted : col.ink, size: 10.5, weight: 700, fit: false });
      text(ctx, what, w - 14, y + rh / 2, { color: col.muted, size: 10, align: 'right', fit: false });
    });
    text(ctx, NOTE[step], L, h - 18, { color: col.ink, size: 11.5, weight: 600 });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); k = calm() ? 1 : 0; cv.redraw(); anim.play(); } };
}
