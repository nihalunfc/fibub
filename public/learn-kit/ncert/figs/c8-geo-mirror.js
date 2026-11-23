// Class 8 Geometric Themes: line symmetry. A shape has a line of symmetry when the mirror image falls exactly on the shape.
// Turn the mirror line; when the dashed image matches the shape, the line is a line of symmetry.
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';
import { SHAPES, NAMES, flip, same, lines, poly } from './c8-geo-lib.js';

export default function (host) {
  let sh = 'square', ang = 30;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 290, label: 'A shape and its mirror image across a line you can turn' });
  const ctl = row(host);
  choice(ctl, 'Shape', Object.keys(NAMES).filter((k) => k !== 'pinwheel').map((k) => [k, NAMES[k]]), sh, (v) => { sh = v; ang = 30; s1.set(ang); sync(); });
  const s1 = slider(ctl, { label: 'Mirror angle', min: 0, max: 179, step: 1, value: ang, fmt: (v) => Math.round(v) + '°', oninput: (v) => { ang = Math.round(v); sync(); } });
  const out = readout(host);
  function sync() {
    const pts = SHAPES[sh], ok = same(pts, flip(pts, ang)), L = lines(pts);
    out.innerHTML = `${NAMES[sh]}: ${ok ? '<b>the image fits exactly: this mirror line is a line of symmetry.</b>' : 'the image does not fit.'} This shape has <b>${L.length}</b> line${L.length === 1 ? '' : 's'} of symmetry${L.length ? ' (at ' + L.join('°, ') + '°)' : ''}.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Does the mirror image fit?', col), cx = w / 2, cy = (top + h) / 2 + 4, s = Math.min(w / 2 - 24, (h - top - 20) / 2.2) * 0.8, pts = SHAPES[sh], ok = same(pts, flip(pts, ang));
    const a = (ang * Math.PI) / 180, R = Math.min(w, h) * 0.5;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx - R * Math.cos(a), cy + R * Math.sin(a)); ctx.lineTo(cx + R * Math.cos(a), cy - R * Math.sin(a)); ctx.stroke();
    poly(ctx, flip(pts, ang), cx, cy, s, col.s[3], col.s[3], 0.1, [5, 4]);
    poly(ctx, pts, cx, cy, s, col.s[0], col.s[0], 0.3);
    text(ctx, ok ? 'Fits: line of symmetry' : 'No match', 10, h - 14, { color: ok ? col.s[2] : col.muted, size: 12, weight: 700 });
  };
  sync();
}
