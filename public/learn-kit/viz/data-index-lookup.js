// Why an index is fast: look up one id in a table of N rows. Without an index the database reads rows one by one
// (a full scan, about N/2 on average); with a B-tree it reads one page per level, roughly log100(N) pages.
// Try: drag the table size from 1,000 to 100 million rows and compare the two page counts, then press Look up.
import { canvas, text, row, slider, button, readout, loop, title, ease } from '../kit.js';

export default function (host) {
  let lg = 5, tgt = 0.62, p = 1;
  const cv = canvas(host, { aspect: 0.95, max: 460, min: 340, label: 'A full scan of table rows beside a B-tree lookup path' });
  const ctl = row(host);
  slider(ctl, { label: 'Rows in table', min: 3, max: 8, step: 0.1, value: lg, fmt: (v) => Math.round(10 ** v).toLocaleString('en-CA'), oninput: (v) => { lg = v; draw(); } });
  button(ctl, 'Look up a new id', () => { tgt = 0.05 + Math.random() * 0.9; p = 0; anim.play(); });
  const anim = loop(host, (dt) => { p = Math.min(1, p + dt * 0.5); if (p >= 1) anim.pause(); draw(); }, { autoplay: false });
  const out = readout(host);
  const N = () => Math.round(10 ** lg), H = () => Math.max(1, Math.ceil(Math.log(N()) / Math.log(100)));
  function draw() {
    const n = N(), scan = Math.round(tgt * n);
    out.innerHTML = `<b>${n.toLocaleString('en-CA')} rows.</b> Full scan: reads ${scan.toLocaleString('en-CA')} rows to reach this id (${Math.round(n / 2).toLocaleString('en-CA')} on average). B-tree index (100 keys per page): <b>${H()}</b> page reads, always. That is ${Math.max(1, Math.round(scan / H())).toLocaleString('en-CA')} times fewer.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Find one row: scan versus index', col);
    const n = N(), cells = 60, hit = Math.floor(tgt * cells), reach = ease(p) * (hit + 1);
    text(ctx, 'Full scan: row after row', 10, 40, { color: col.muted, size: 11 });
    const cw = (w - 20) / cells;
    for (let i = 0; i < cells; i++) { ctx.fillStyle = i === hit ? col.s[1] : i < reach ? col.s[0] : col.line; ctx.globalAlpha = i < reach || i === hit ? 1 : 0.6; ctx.fillRect(10 + i * cw, 48, cw - 1.5, 22); }
    ctx.globalAlpha = 1;
    text(ctx, `${Math.min(Math.round(tgt * n * Math.min(1, reach / (hit + 1))), Math.round(tgt * n)).toLocaleString('en-CA')} rows read`, 10, 84, { color: col.ink, size: 12, weight: 600 });
    text(ctx, 'B-tree index: one page per level', 10, 112, { color: col.muted, size: 11 });
    const levels = Math.min(H(), 4), ly = (i) => 128 + i * 36, hl = Math.floor(ease(p) * levels + 1e-6);
    let px = w / 2;
    for (let i = 0; i < levels; i++) {
      const cnt = Math.min(5, 1 + i * 2), bw2 = (w - 40) / 5, pick = Math.floor(((tgt * 7919 * (i + 1)) % 1) * cnt);
      for (let j = 0; j < cnt; j++) {
        const x = w / 2 + (j - (cnt - 1) / 2) * bw2, on = j === pick && i < hl;
        ctx.fillStyle = on ? col.s[2] : col.line; ctx.fillRect(x - bw2 / 2 + 3, ly(i), bw2 - 6, 22);
        if (on) { ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px, ly(i) - 10); ctx.lineTo(x, ly(i)); ctx.stroke(); px = x; }
      }
      text(ctx, i === 0 ? 'root' : i === levels - 1 ? 'leaf' : 'branch', 8, ly(i) + 11, { color: col.muted, size: 10, fit: false });
    }
    const by = ly(levels) + 4, mx = Math.log10(n / 2 + 1) + 0.2, L = 10;
    text(ctx, 'Pages read (log scale bars)', 10, by + 8, { color: col.muted, size: 11 });
    [['scan', Math.max(1, n / 2), col.s[1]], ['index', H(), col.s[2]]].forEach(([nm, v, c], i) => {
      const bw3 = Math.max(4, (Math.log10(v + 1) / mx) * (w - 90)); ctx.fillStyle = c; ctx.fillRect(L + 44, by + 20 + i * 20, bw3, 14);
      text(ctx, nm, L, by + 27 + i * 20, { color: col.ink, size: 11, fit: false }); text(ctx, Math.round(v).toLocaleString('en-CA'), L + 48 + bw3, by + 27 + i * 20, { color: col.ink, size: 11, fit: false });
    });
  };
  draw();
}
