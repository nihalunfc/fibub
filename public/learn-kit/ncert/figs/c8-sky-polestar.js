// Class 8 Time and the skies: star trails around the pole star. The Earth turns, so stars seem to circle the sky once a day, 15 degrees
// every hour, around the point above Earth's north pole. The pole star (Polaris, Dhruva Tara) lies almost exactly there, so it hardly
// moves. In a long-exposure photograph every star leaves an arc. Stars close to the pole make small circles.
import { canvas, text, title, dot, row, slider, readout, loop, rng } from '../../kit.js';

export default function (host) {
  let hrs = 4;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 290, label: 'Stars turning in arcs around the pole star' });
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Hours of exposure', min: 0, max: 12, step: 0.25, value: hrs, fmt: (v) => `${v} h`, oninput: (v) => { hrs = v; say(); } });
  const an = loop(host, (dt) => { hrs += dt * 1.2; if (hrs > 12) hrs = 0; sl.set(hrs); say(); }, { autoplay: false }); an.button(ctl);
  const out = readout(host);
  const R = rng(21), S = []; for (let i = 0; i < 46; i++) S.push({ r: 0.1 + 0.9 * Math.sqrt(R()), a: R() * 6.283, m: 1 + R() * 1.6 });
  function say() { out.innerHTML = `${hrs} h of exposure: each star has turned <b>${(hrs * 15).toFixed(hrs * 15 % 1 ? 1 : 0)}°</b> (15° per hour). The pole star at the centre barely moves, so sailors and travellers have used it to find north.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Star trails turning about the pole star', col);
    const cx = w / 2, cy = h * 0.55, M = Math.min(w * 0.46, h * 0.4), a = hrs * 15 * Math.PI / 180;
    ctx.save(); ctx.strokeStyle = col.line; ctx.setLineDash([2, 4]); [0.33, 0.66, 1].forEach((k) => { ctx.beginPath(); ctx.arc(cx, cy, M * k, 0, 7); ctx.stroke(); }); ctx.restore();
    S.forEach((s) => {
      const r = s.r * M; ctx.save(); ctx.strokeStyle = col.s[3]; ctx.globalAlpha = 0.55; ctx.lineWidth = s.m; ctx.beginPath(); ctx.arc(cx, cy, r, -s.a, -s.a - a, true); ctx.stroke(); ctx.restore();
      dot(ctx, cx + r * Math.cos(s.a + a), cy - r * Math.sin(s.a + a), s.m + 0.6, col.ink);
    });
    dot(ctx, cx, cy, 5, col.warn, col.ink); text(ctx, 'Pole star (Dhruva Tara)', cx + 9, cy + 4, { color: col.warn, size: 10.5, weight: 700, halo: col.panel });
    text(ctx, 'stars circle anticlockwise', w / 2, h - 10, { color: col.muted, size: 10, align: 'center' });
  };
  say();
}
