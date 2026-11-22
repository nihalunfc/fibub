// Planets as seen from Earth: look down on the Sun, Earth and one planet. The planet's elongation (its angle from the Sun
// in our sky) sets the name of its configuration and how much of it is lit. Pick Mercury, Venus, Mars or Jupiter, play
// time, and see why inner planets stay near the Sun while outer ones can stand opposite it. Synodic period = 1/|1/P₁ − 1/P₂|.
import { canvas, text, row, choice, readout, loop, title, dot, button, slider } from '../kit.js';

const PL = { mercury: ['Mercury', 0.387, 0.2408, 4], venus: ['Venus', 0.723, 0.6152, 6], mars: ['Mars', 1.524, 1.8808, 5], jupiter: ['Jupiter', 5.203, 11.862, 9] };
const D = Math.PI / 180;
export default function (host) {
  let id = 'venus', day = 0;
  const cv = canvas(host, { aspect: 0.92, max: 440, min: 310, label: 'Sun, Earth and a planet seen from above, with the planet elongation in Earth sky' });
  const c1 = row(host), c2 = row(host);
  choice(c1, 'Planet', Object.entries(PL).map(([k, v]) => [k, v[0]]), id, (v) => { id = v; day = 0; slid.set(0); show(); });
  const slid = slider(c2, { label: 'Days', min: 0, max: 800, step: 1, value: 0, fmt: (v) => `${Math.round(v)}`, oninput: (v) => { day = v; show(); } });
  const anim = loop(host, (dt) => { day = (day + dt * 40) % 800; slid.set(day); show(); }, { autoplay: false });
  anim.button(c2);
  const out = readout(host);
  const st = () => {
    const [, a, P] = PL[id], th = (day / 365.256) * 2 * Math.PI, tp = (day / (P * 365.256)) * 2 * Math.PI + 1.2;
    const E = [Math.cos(th), Math.sin(th)], Q = [a * Math.cos(tp), a * Math.sin(tp)];
    const dx = Q[0] - E[0], dy = Q[1] - E[1], d = Math.hypot(dx, dy);
    const toS = Math.atan2(-E[1], -E[0]), toP = Math.atan2(dy, dx);
    let el = ((toP - toS) / D + 540) % 360 - 180; // + = east of the Sun (counter-clockwise seen from above)
    const ph = (a < 1) ? (1 + Math.cos(Math.acos(((a * a) - 1 - d * d) / (-2 * d)) )) / 2 : null; // not used for label; compute lit fraction properly below
    const r = a, cosPh = (r * r + d * d - 1) / (2 * r * d), lit = (1 + cosPh) / 2;
    return { E, Q, d, el, lit };
  };
  const config = (s) => {
    const e = s.el, ae = Math.abs(e), inner = PL[id][1] < 1;
    if (inner) return ae < 6 ? (s.Q[0] * s.E[0] + s.Q[1] * s.E[1] > 0 && s.d < 1 + 0.01 ? 'near inferior conjunction (between us and the Sun)' : 'near superior conjunction (behind the Sun)') : e > 0 ? 'evening star, east of the Sun' : 'morning star, west of the Sun';
    return ae > 172 ? 'opposition (opposite the Sun: up all night, closest and brightest)' : ae < 8 ? 'near conjunction (behind the Sun, hard to see)' : Math.abs(ae - 90) < 8 ? 'quadrature (a quarter of the sky from the Sun)' : e > 0 ? 'east of the Sun (an evening object)' : 'west of the Sun (a morning object)';
  };
  function show() {
    const s = st(), [name, a, P] = PL[id], S = 1 / Math.abs(1 / 1 - 1 / P);
    out.innerHTML = `<b>${name}</b>: ${Math.abs(s.el).toFixed(0)}° ${s.el >= 0 ? 'east' : 'west'} of the Sun, ${s.d.toFixed(2)} AU away, ${Math.round(s.lit * 100)}% lit as we see it. Now: ${config(s)}. Synodic period (conjunction to conjunction) = <b>${(S * 365.256).toFixed(0)} days</b>. ${a < 1 ? 'An inner planet never gets far from the Sun: its largest elongation is about ' + (Math.asin(a) / D).toFixed(0) + '°.' : 'An outer planet can be anywhere, including opposite the Sun.'}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const s = st(), [name, a] = PL[id], big = Math.max(1.2, a * 1.1), cx = w / 2, cy = h * 0.5 + 4, R = Math.min(w, h) * 0.42 / big;
    title(ctx, `Sun, Earth and ${name} from above`, col);
    [1, a].forEach((r, i) => { ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, r * R, 0, 7); ctx.stroke(); });
    const X = (p) => cx + p[0] * R, Y = (p) => cy - p[1] * R;
    dot(ctx, cx, cy, 8, col.s[1]); text(ctx, 'Sun', cx + 10, cy + 12, { color: col.muted, size: 10.5 });
    dot(ctx, X(s.E), Y(s.E), 5.5, col.s[0]); text(ctx, 'Earth', X(s.E) + 8, Y(s.E) - 8, { color: col.s[0], size: 11, weight: 700 });
    dot(ctx, X(s.Q), Y(s.Q), 5, col.s[5]); text(ctx, name, X(s.Q) + 8, Y(s.Q) - 8, { color: col.s[5], size: 11, weight: 700 });
    ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(X(s.E), Y(s.E)); ctx.lineTo(X(s.Q), Y(s.Q)); ctx.stroke(); ctx.restore();
    // elongation strip: Sun in the middle, east to the right
    const bx0 = 20, bx1 = w - 20, by = h - 24, mid = (bx0 + bx1) / 2;
    ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(bx0, by); ctx.lineTo(bx1, by); ctx.stroke();
    text(ctx, 'west', bx0, by + 12, { color: col.muted, size: 10 }); text(ctx, 'east', bx1, by + 12, { color: col.muted, size: 10, align: 'right' });
    dot(ctx, mid, by, 6, col.s[1]); const px = mid - (s.el / 180) * (bx1 - bx0) / 2;
    // east is to the right in the strip, but the angle is counter-clockwise from above, so east elongation moves the planet to the right
    const pxe = mid + (s.el / 180) * (bx1 - bx0) / 2; dot(ctx, pxe, by, 5, col.s[5]);
    text(ctx, 'where it is in the sky relative to the Sun', mid, by - 14, { color: col.muted, size: 10, align: 'center' });
  };
  show();
}
