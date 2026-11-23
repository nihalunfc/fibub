// Class 8 Geometric Themes: rotational symmetry. Turn a shape about its centre; every turn (less than a full one) that
// brings it exactly back onto itself counts. Order = number of such fits in a full turn; smallest angle = 360 / order.
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';
import { SHAPES, NAMES, turn, same, turns, poly } from './c8-geo-lib.js';

export default function (host) {
  let sh = 'square', ang = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 290, label: 'A shape turned about its centre, with a check for when it fits again' });
  const ctl = row(host);
  choice(ctl, 'Shape', ['square', 'rectangle', 'triangle', 'parallelogram', 'hexagon', 'pinwheel', 'isosceles'].map((k) => [k, NAMES[k]]), sh, (v) => { sh = v; ang = 0; s1.set(0); sync(); });
  const s1 = slider(ctl, { label: 'Turn', min: 0, max: 360, step: 1, value: ang, fmt: (v) => Math.round(v) + '°', oninput: (v) => { ang = Math.round(v); sync(); } });
  const out = readout(host);
  function sync() {
    const pts = SHAPES[sh], T = turns(pts), order = T.length, fit = ang > 0 && ang < 360 && same(pts, turn(pts, ang));
    out.innerHTML = `${NAMES[sh]}: turned by ${ang}°. ${fit ? '<b>It fits again.</b>' : ang === 0 || ang === 360 ? 'Back at the start (a full turn always fits).' : 'It does not fit.'} Order of rotational symmetry = <b>${order}</b>${order > 1 ? `, smallest turn = 360° ÷ ${order} = <b>${360 / order}°</b>` : ' (only the full turn: no rotational symmetry)'}.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Turn it: when does it fit again?', col), cx = w / 2, cy = (top + h) / 2 + 4, s = Math.min(w / 2 - 24, (h - top - 20) / 2.2) * 0.8, pts = SHAPES[sh];
    const fit = ang > 0 && ang < 360 && same(pts, turn(pts, ang));
    poly(ctx, pts, cx, cy, s, null, col.muted, 0, [5, 4]);
    poly(ctx, turn(pts, ang), cx, cy, s, fit ? col.s[2] : col.s[0], fit ? col.s[2] : col.s[0], 0.35);
    ctx.fillStyle = col.ink; ctx.beginPath(); ctx.arc(cx, cy, 4, 0, 7); ctx.fill();
    text(ctx, 'centre', cx + 8, cy - 9, { color: col.muted, size: 10 });
    if (fit) text(ctx, 'Fits!', 10, h - 14, { color: col.s[2], size: 13, weight: 700 });
  };
  sync();
}
