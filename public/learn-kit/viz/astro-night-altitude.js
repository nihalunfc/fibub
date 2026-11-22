// Plan a night: pick a target, your latitude and the date and see its altitude through the night, with the Sun's twilight bands
// behind it. The target is best when it is high (low airmass) in the dark part of the night. Dark blue: astronomical night; lighter
// bands: nautical, civil twilight; white: day. Local sidereal time comes from the date: at local midnight it is 0 h on 21 September.
import { canvas, text, row, slider, choice, readout, axes, line, dot, title } from '../kit.js';
import { altaz } from './_astro.js';

const OBJ = { m31: ['Andromeda Galaxy', 0.712, 41.27], m42: ['Orion Nebula', 5.588, -5.39], m45: ['Pleiades', 3.79, 24.1], m13: ['Hercules cluster', 16.695, 36.46], ant: ['Antares', 16.49, -26.43], pol: ['Polaris', 2.53, 89.26], gc: ['Galactic centre', 17.76, -29.0], ome: ['Omega Centauri', 13.45, -47.5] };
const MON = ['1 Jan', '1 Feb', '1 Mar', '1 Apr', '1 May', '1 Jun', '1 Jul', '1 Aug', '1 Sep', '1 Oct', '1 Nov', '1 Dec'], DS = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
const dlab = (n) => { let i = 11; while (DS[i] > n) i--; return `${n - DS[i] + 1 === 1 ? '' : (n - DS[i] + 1) + ' '}${n - DS[i] + 1 === 1 ? MON[i] : MON[i].split(' ')[1]}`; };
export default function (host) {
  let id = 'm31', lat = 45, n = 264;
  const cv = canvas(host, { aspect: 0.72, max: 380, min: 280, label: 'Altitude of a chosen target through one night with twilight bands' });
  const c1 = row(host);
  choice(c1, 'Target', Object.entries(OBJ).map(([k, v]) => [k, v[0]]), id, (v) => { id = v; show(); });
  const c2 = row(host);
  slider(c2, { label: 'Latitude', min: -60, max: 70, step: 1, value: lat, fmt: (v) => `${Math.abs(v)}° ${v < 0 ? 'S' : 'N'}`, oninput: (v) => { lat = v; show(); } });
  slider(c2, { label: 'Date', min: 0, max: 364, step: 1, value: n, fmt: dlab, oninput: (v) => { n = v; show(); } });
  const out = readout(host);
  const D = Math.PI / 180, lstMid = () => (((n - 264) * 24) / 365.25 + 24) % 24;
  const sunAlt = (t) => { const dec = Math.asin(Math.sin(23.44 * D) * Math.sin(((n - 79) / 365.25) * 2 * Math.PI)); return Math.asin(Math.sin(lat * D) * Math.sin(dec) + Math.cos(lat * D) * Math.cos(dec) * Math.cos((t - 12) * 15 * D)) / D; };
  const tgt = (t) => altaz(OBJ[id][1], OBJ[id][2], lat, (lstMid() + (t - 24) * 1.00274 + 48) % 24)[0];
  function show() {
    let best = -99, bt = 0, dark = 0, up = 0;
    for (let t = 18; t <= 30; t += 0.1) { const a = tgt(t), s = sunAlt(t % 24); if (s < -18) { dark += 0.1; if (a > 30) up += 0.1; if (a > best) { best = a; bt = t; } } }
    const hh = (t) => { const x = t % 24; return `${String(Math.floor(x)).padStart(2, '0')}:${String(Math.round((x % 1) * 60)).padStart(2, '0')}`; };
    out.innerHTML = dark < 0.1 ? 'At this latitude and date the Sun never gets 18° below the horizon: there is no fully dark sky (summer twilight at high latitudes).' : `Dark sky lasts <b>${dark.toFixed(1)} h</b>. ${OBJ[id][0]} is above 30° (airmass under 2) for <b>${up.toFixed(1)} h</b> of that. Best moment in the dark: about <b>${hh(bt)}</b> local solar time at ${best.toFixed(0)}° altitude${best < 20 ? ' (low: poor target tonight)' : ''}. Altitude ${Math.round(best)}° means airmass about ${(1 / Math.sin(Math.max(1, best) * D)).toFixed(2)}.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, `${OBJ[id][0]} tonight`, col);
    const A = axes(ctx, w, h, col, { x: [18, 30], y: [0, 90], t: 40, l: 40, b: 34, xlabel: 'time', ylabel: 'altitude (°)', xt: [18, 20, 22, 24, 26, 28, 30], fx: (v) => String(v % 24).padStart(2, '0') + 'h', yt: [0, 30, 60, 90], fy: (v) => v, grid: false });
    for (let t = 18; t < 30; t += 0.1) { const s = sunAlt(t % 24); const c = s > 0 ? null : s > -6 ? 0.18 : s > -12 ? 0.35 : s > -18 ? 0.55 : 0.8; if (c !== null) { ctx.fillStyle = `rgba(20,40,110,${c})`; ctx.fillRect(A.X(t), A.T, A.X(t + 0.1) - A.X(t) + 0.5, A.B - A.T); } }
    ctx.strokeStyle = col.muted; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(A.L, A.Y(30)); ctx.lineTo(A.R, A.Y(30)); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, '30°: airmass 2', A.R - 4, A.Y(30) - 8, { color: col.ink, size: 10, align: 'right', halo: col.panel });
    const pts = []; for (let t = 18; t <= 30; t += 0.1) pts.push([A.X(t), A.Y(Math.max(0, tgt(t)))]);
    ctx.save(); A.clip(); line(ctx, pts, col.s[1], 3); ctx.restore();
  };
  show();
}
