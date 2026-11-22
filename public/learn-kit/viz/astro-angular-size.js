// How big is that in the sky? Angles are measured in degrees; your own hand held at arm's length is a ruler. Pick an object and see
// its size against your pinky (about 1°), three fingers (5°), fist (10°) and open hand (20°). Change your arm length and hand width
// to see that the hand ruler is only approximate (angle = 2 arctan(width ÷ 2 ÷ arm)).
import { canvas, text, row, slider, choice, readout, title } from '../kit.js';

const OBJ = { moon: ['Full Moon', 0.52], sun: ['Sun', 0.53], pleiades: ['Pleiades cluster', 2], belt: ['Orion’s Belt', 2.7], m31: ['Andromeda Galaxy (long way)', 3.0], orion: ['Orion (head to foot)', 20], dipper: ['Big Dipper', 25], jupiter: ['Jupiter', 0.0125], crux: ['Southern Cross', 6] };
const D = Math.PI / 180;
export default function (host) {
  let id = 'moon', arm = 62, hand = { pinky: 1.5, three: 5.5, fist: 9.5, span: 18 }, who = 'fist';
  const cv = canvas(host, { aspect: 0.62, max: 320, min: 230, label: 'An object drawn to scale next to the angular width of a pinky, three fingers, fist or open hand' });
  const c1 = row(host), c2 = row(host);
  choice(c1, 'Object', Object.entries(OBJ).map(([k, v]) => [k, v[0]]), id, (v) => { id = v; show(); });
  choice(c2, 'Measure with', [['pinky', 'Pinky'], ['three', 'Three fingers'], ['fist', 'Fist'], ['span', 'Open hand']], who, (v) => { who = v; show(); });
  slider(c2, { label: 'Arm length', min: 45, max: 80, step: 1, value: arm, fmt: (v) => `${v} cm`, oninput: (v) => { arm = v; show(); } });
  const out = readout(host);
  const ang = (wcm) => 2 * Math.atan(wcm / 2 / arm) / D;
  function show() {
    const [name, a] = OBJ[id], m = ang(hand[who]), lab = { pinky: 'pinky', three: 'three fingers', fist: 'fist', span: 'open hand' }[who];
    out.innerHTML = `${name} is <b>${a < 0.1 ? (a * 3600).toFixed(0) + '″' : a < 1 ? (a * 60).toFixed(0) + '′ (' + a.toFixed(2) + '°)' : a + '°'}</b> across. At your arm length (${arm} cm) your ${lab} covers about <b>${m.toFixed(1)}°</b>, so it is ${a / m >= 1 ? (a / m).toFixed(1) + ' × your ' + lab : 'about ' + (a / m * 100).toFixed(a / m < 0.1 ? 1 : 0) + '% of your ' + lab}. ${a < 0.1 ? 'Planets are too small for the hand to show: you need a telescope (resolution lessons).' : ''} Short arms mean fatter angles: always calibrate your hand once on a known pair of stars.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Sky ruler: the object and your hand, to scale', col);
    const a = OBJ[id][1], m = ang(hand[who]), span = Math.max(a, m, 1) * 1.25, k = (w - 40) / span, y = h * 0.52;
    ctx.fillStyle = '#05060a'; ctx.fillRect(10, y - 46, w - 20, 92);
    // degree ticks
    ctx.strokeStyle = '#778'; ctx.lineWidth = 1; for (let d = 0; d <= span; d += span > 40 ? 5 : span > 8 ? 1 : 0.5) { const x = 20 + d * k; ctx.beginPath(); ctx.moveTo(x, y + 46); ctx.lineTo(x, y + 36); ctx.stroke(); }
    text(ctx, `0° to ${span.toFixed(span > 10 ? 0 : 1)}°`, w - 14, y + 30, { color: '#99a', size: 9.5, align: 'right' });
    ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.75; ctx.fillRect(20, y - 36, Math.max(2, a * k), 26); ctx.globalAlpha = 1;
    text(ctx, OBJ[id][0], 22, y - 23, { color: '#000', size: 11, weight: 700, fit: false });
    ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.8; ctx.fillRect(20, y + 2, m * k, 26); ctx.globalAlpha = 1;
    text(ctx, 'your hand', 22, y + 15, { color: '#000', size: 11, weight: 700, fit: false });
  };
  show();
}
