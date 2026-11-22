// The celestial sphere in 3D from your own horizon: drag to turn the view, set your latitude, and press Play to let the
// sky turn. The celestial pole stands as high above the north (or south) horizon as your latitude; stars inside the
// highlighted polar cap never set, stars in the opposite cap never rise. Switch the grid between RA/Dec and the horizon.
import { canvas, text, row, choice, slider, readout, loop, button, title } from '../kit.js';
import { orbit, shapes, wire } from './_3d.js';
import { STARS, LINES, eq, smallCircle, tiltX } from './_astro.js';

const D = Math.PI / 180;
export default function (host) {
  let lat = 40, lst = 0, grid = 'eq';
  const cv = canvas(host, { aspect: 0.95, max: 460, min: 320, label: 'Celestial sphere around an observer with horizon, equator, poles and bright stars' });
  const cam = orbit(cv, { yaw: 0.35, pitch: 0.3 });
  const c1 = row(host), c2 = row(host);
  slider(c1, { label: 'Latitude', min: -90, max: 90, step: 1, value: lat, fmt: (v) => `${Math.abs(v)}° ${v < 0 ? 'S' : 'N'}`, oninput: (v) => { lat = v; show(); cv.redraw(); } });
  choice(c2, 'Grid', [['eq', 'RA and Dec'], ['hor', 'Altitude and azimuth']], grid, (v) => { grid = v; cv.redraw(); });
  const anim = loop(host, (dt) => { lst = (lst + dt * 1.5) % 24; cv.redraw(); show(); }, { autoplay: false });
  anim.button(c2);
  const out = readout(host);
  // equatorial unit vector -> horizon frame (x east, y up, z south) for latitude lat and sidereal time lst
  const toH = (v) => {
    const dec = Math.asin(v[1]), ra = Math.atan2(-v[2], v[0]), H = lst * 15 * D - ra, f = lat * D;
    const sa = Math.sin(dec) * Math.sin(f) + Math.cos(dec) * Math.cos(f) * Math.cos(H);
    const alt = Math.asin(sa), az = Math.atan2(-Math.cos(dec) * Math.sin(H), Math.sin(dec) * Math.cos(f) - Math.cos(dec) * Math.sin(f) * Math.cos(H));
    return [Math.cos(alt) * Math.sin(az), sa, -Math.cos(alt) * Math.cos(az)];
  };
  const cls = (dec) => { const lim = 90 - Math.abs(lat); const nearPole = lat >= 0 ? dec : -dec; return nearPole > lim ? 'circ' : nearPole < -lim ? 'never' : 'rise'; };
  function show() {
    const n = { circ: 0, never: 0, rise: 0 }; STARS.forEach((s) => n[cls(s[2])]++);
    const lim = 90 - Math.abs(lat);
    out.innerHTML = `At ${Math.abs(lat)}° ${lat < 0 ? 'S' : 'N'} the ${lat < 0 ? 'south' : 'north'} celestial pole is <b>${Math.abs(lat)}°</b> above the horizon. Stars within <b>${lim}°</b> of it (declination beyond ${lat < 0 ? '−' : '+'}${lim}°) never set. Of the ${STARS.length} bright stars shown: <b>${n.circ}</b> never set, <b>${n.never}</b> never rise, <b>${n.rise}</b> rise and set.`;
  }
  cv.draw = (ctx, w, h, col) => {
    const P = cam.proj(w, h, Math.min(w, h) * 0.38, w / 2, h / 2 + 8);
    title(ctx, 'The sky as a sphere around you', col);
    const T = (poly) => poly.map(toH);
    // horizon ring + cardinal letters
    wire(ctx, P, shapes.ring(1), col.ink, 2);
    [['N', [0, 0, -1.12]], ['E', [1.12, 0, 0]], ['S', [0, 0, 1.12]], ['W', [-1.12, 0, 0]]].forEach(([s, p]) => { const q = P(p); text(ctx, s, q[0], q[1], { color: col.ink, size: 12, weight: 700, align: 'center' }); });
    const zq = P([0, 1.06, 0]); text(ctx, 'zenith', zq[0], zq[1] - 4, { color: col.ink, size: 10, align: 'center' });
    if (grid === 'eq') {
      const g = [smallCircle([0, 1, 0], Math.PI / 2), smallCircle([0, 1, 0], 60 * D), smallCircle([0, 1, 0], 120 * D)];
      for (let h2 = 0; h2 < 24; h2 += 3) g.push(Array.from({ length: 37 }, (_, i) => eq(h2, -90 + i * 5)));
      wire(ctx, P, g.map(T), col.line, 1);
      wire(ctx, P, [smallCircle([0, 1, 0], Math.PI / 2).map((p) => tiltX(p, 23.44 * D))].map(T), col.s[1], 1.5);
      wire(ctx, P, [smallCircle([0, 1, 0], Math.PI / 2)].map(T), col.s[0], 2);
    } else {
      const g = [30, 60].map((a) => smallCircle([0, 1, 0], (90 - a) * D));
      for (let k = 0; k < 12; k++) { const az = k * 30 * D; g.push(Array.from({ length: 19 }, (_, i) => { const a = i * 5 * D; return [Math.cos(a) * Math.sin(az), Math.sin(a), -Math.cos(a) * Math.cos(az)]; })); }
      wire(ctx, P, g, col.line, 1);
    }
    // polar caps (limits of circumpolar and never-rising stars)
    const lim = (90 - Math.abs(lat)) * D, ps = lat >= 0 ? 1 : -1;
    wire(ctx, P, [smallCircle([0, ps, 0], lim)].map(T), col.s[2], 2);
    wire(ctx, P, [smallCircle([0, -ps, 0], lim)].map(T), col.s[5], 2);
    [['pole', [0, ps, 0], col.s[2]], ['other pole', [0, -ps, 0], col.s[5]]].forEach(([s, p, c]) => { const q = P(toH(p)); ctx.beginPath(); ctx.arc(q[0], q[1], 3.5, 0, 7); ctx.fillStyle = c; ctx.fill(); text(ctx, s, q[0] + 6, q[1] - 6, { color: c, size: 10, weight: 700 }); });
    // stars and constellation lines
    const sv = STARS.map((s) => toH(eq(s[1], s[2])));
    ctx.save(); ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.globalAlpha = 0.6;
    LINES.forEach(([a, b]) => { const p = P(sv[a]), q = P(sv[b]); ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); });
    ctx.restore();
    STARS.map((s, i) => ({ s, q: P(sv[i]), up: sv[i][1] >= 0 })).sort((a, b) => a.q[2] - b.q[2]).forEach(({ s, q, up }) => {
      const c = { circ: col.s[2], never: col.s[5], rise: col.ink }[cls(s[2])];
      ctx.globalAlpha = up ? 1 : 0.45; ctx.beginPath(); ctx.arc(q[0], q[1], Math.max(1.6, 4.2 - s[3] * 0.9), 0, 7); ctx.fillStyle = c; ctx.fill();
      if (s[3] < 0.9 && up) text(ctx, s[0], q[0] + 5, q[1] - 5, { color: col.muted, size: 9.5 });
    });
    ctx.globalAlpha = 1;
    const k = h - 14; text(ctx, 'green: never sets   orange: never rises   black: rises and sets   faded: below horizon', 10, k, { color: col.muted, size: 10 });
  };
  show();
}
