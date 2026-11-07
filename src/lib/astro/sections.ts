// Report sections for the observing session page: each astronomy tool's result without its page,
// so several can be shown and downloaded together.
import { night, planets, bestObjects, observer, track, altAz, riseSet, airmass, monthEvents, findTarget, toJNow, lst, GEAR, type Gear, type Target } from './sky';
import { fmtTime, fmtDay, noonOf, zoned, localDate, sexa, type Place } from './place';
import { altitudeFigure, moonFigure } from './charts';
import { scope, eyepiece, camera } from './optics';
import type { Figure, Section } from '../report';

const dur = (a: Date, b: Date) => { const m = Math.round((b.getTime() - a.getTime()) / 60000); return `${Math.floor(m / 60)} h ${m % 60} min`; };

export function tonightSections(place: Place, date: string, gear: Gear): Section[] {
  const tz = place.tz, n = night(place, date), obs = observer(place);
  const facts: [string, string][] = [
    ['Sunset', fmtTime(n.sunset, tz)], ['Properly dark', n.dark ? `${fmtTime(n.dark[0], tz)} to ${fmtTime(n.dark[1], tz)} (${dur(n.dark[0], n.dark[1])})` : 'Not tonight'],
    ['Sunrise', fmtTime(n.sunrise, tz)], ['Moon', `${n.moonName}, ${Math.round(n.moonIllum * 100)}% lit`], ['Moonrise', fmtTime(n.moonrise, tz)], ['Moonset', fmtTime(n.moonset, tz)],
  ];
  const pl = planets(place, n);
  const from = n.sunset ?? n.window[0], to = n.sunrise ?? n.window[1];
  const lines = [{ label: 'Moon', pts: track({ kind: 'body', body: 'Moon', label: 'Moon' }, obs, from, to, 10).pts }, ...pl.filter((p) => p.visible).map((p) => ({ label: p.name, pts: track({ kind: 'body', body: p.name, label: p.name }, obs, from, to, 10).pts }))];
  const picks = bestObjects(place, n, gear, 30, 15);
  return [
    { title: 'The night', facts, figure: moonFigure(n.moonPhase, 120) },
    { title: 'Planets', table: { head: ['Planet', 'Rises', 'Highest', 'Sets', 'Mag', 'Tonight'], rows: pl.map((p) => [p.name, fmtTime(p.rise, tz), `${fmtTime(p.transit, tz)} (${Math.round(p.transitAlt)}°)`, fmtTime(p.set, tz), p.mag.toFixed(1), p.visible ? `Best ${fmtTime(p.bestTime, tz)}, ${Math.round(p.bestAlt)}°` : 'Not well placed']), align: ['l', 'r', 'r', 'r', 'r', 'l'] }, figure: altitudeFigure({ place, night: n, lines, from, to, h: 320 }) },
    { title: `Best deep-sky objects (${GEAR[gear].label.toLowerCase()})`, table: { head: ['Object', 'Type', 'Mag', 'Highest while dark', 'From Moon'], rows: picks.map((o) => [o.id.split(' / ')[0] + (o.name ? ` ${o.name}` : ''), o.type, o.mag!.toFixed(1), `${fmtTime(o.bestTime, tz)} (${Math.round(o.bestAlt)}°)`, `${Math.round(o.moonSep)}°`]) } },
  ];
}

export function targetSections(place: Place, date: string, names: string[], min = 30): { sections: Section[]; missing: string[] } {
  const tz = place.tz, n = night(place, date), obs = observer(place);
  const missing: string[] = [];
  const targets = names.map((x) => { const t = findTarget(x); if (!t) missing.push(x); return t; }).filter(Boolean) as Target[];
  if (!targets.length) return { sections: [], missing };
  const from = new Date((n.sunset ?? n.window[0]).getTime() - 30 * 60e3), to = new Date((n.sunrise ?? n.window[1]).getTime() + 30 * 60e3);
  const tracks = targets.map((t) => ({ t, ...track(t, obs, from, to, 5) }));
  const rows = tracks.map(({ t, pts }) => {
    const ok = pts.filter((p) => p.time >= n.window[0] && p.time <= n.window[1] && p.alt >= min);
    const rs = riseSet(t, place, n);
    const best = ok.reduce((a, b) => (b.alt > a.alt ? b : a), ok[0]);
    return [t.label, ok.length ? `${fmtTime(ok[0].time, tz)} to ${fmtTime(ok[ok.length - 1].time, tz)}` : 'Not tonight', `${fmtTime(rs.transit, tz)} (${Math.round(altAz(t, rs.transit, obs).alt)}°)`, best ? airmass(best.alt).toFixed(2) : '-'];
  });
  return {
    missing,
    sections: [{ title: 'Target heights', figure: altitudeFigure({ place, night: n, from, to, minAlt: min, lines: tracks.map((x) => ({ label: x.t.label, pts: x.pts })), h: 340 }), table: { head: ['Target', `Above ${min}° while dark`, 'Meridian (pier flip)', 'Lowest airmass'], rows } }],
  };
}

export function polarSections(place: Place, date: string, time: string): Section[] {
  const [y, m, d] = date.split('-').map(Number), [h, mi] = time.split(':').map(Number);
  let at = zoned(y, m, d, h, mi, place.tz);
  if (h < 12) at = new Date(at.getTime() + 864e5); // early-morning times belong to the next calendar day
  const south = place.lat < 0;
  const star = south ? { name: 'Sigma Octantis', ra: (21 + 8 / 60 + 46.86 / 3600) * 15, dec: -(88 + 57 / 60 + 23.4 / 3600) } : { name: 'Polaris', ra: (2 + 31 / 60 + 49.09 / 3600) * 15, dec: 89 + 15 / 60 + 50.8 / 3600 };
  const now = toJNow(star.ra, star.dec, at);
  const ha = (((lst(at, place.lon) - now.ra / 15) % 24) + 24) % 24;
  const clock = (pa: number) => { const c = (((pa / 30) % 12) + 12) % 12; return `${Math.floor(c) === 0 ? 12 : Math.floor(c)}:${String(Math.round((c % 1) * 60) % 60).padStart(2, '0')}`; };
  const sky = south ? ha * 15 : -ha * 15;
  const fig: Figure = {
    w: 360, h: 360, alt: `${star.name} in the polar scope`,
    draw(ctx, w, h2) {
      const cx = w / 2, cy = h2 / 2, r = w * 0.3;
      ctx.fillStyle = '#0a0f1c'; ctx.fillRect(0, 0, w, h2);
      ctx.strokeStyle = '#e9edf5'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke();
      ctx.fillStyle = '#e9edf5'; ctx.font = '12px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      for (let k = 0; k < 12; k++) { const a = (k * Math.PI) / 6; ctx.fillText(String(k || 12), cx + Math.sin(a) * (r + 18), cy - Math.cos(a) * (r + 18)); }
      const a = ((sky + 180) * Math.PI) / 180;
      ctx.fillStyle = '#f5a83a'; ctx.beginPath(); ctx.arc(cx + Math.sin(a) * r, cy - Math.cos(a) * r, 6, 0, 7); ctx.fill();
      ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.fillText('Polar scope view (upside down)', 8, 8);
    },
  };
  return [{ title: `Polar alignment at ${time}`, facts: [[`${star.name} hour angle`, sexa(ha, 'h', 0)], ['Polar scope (upside down)', clock(sky + 180)], ['Naked-eye view', clock(sky)], ['Distance from the pole', `${((90 - Math.abs(now.dec)) * 60).toFixed(1)}′`]], figure: fig }];
}

export function gearSections(ap: number, fl: number, eps: number[], cam: { w: number; h: number; px: number } | null, seeing: number): Section[] {
  const s = scope(ap, fl);
  const out: Section[] = [{
    title: `Telescope: ${ap} mm, f/${s.f.toFixed(1)}`,
    facts: [['Faintest stars', `mag ${s.limit.toFixed(1)}`], ['Resolution', `${s.dawes.toFixed(2)}″`], ['Highest useful power', `${Math.round(s.maxMag)}×`]],
    table: { head: ['Eyepiece', 'Power', 'True field', 'Exit pupil', 'Good for'], rows: eps.map((e) => { const r = eyepiece(s, e, 52); return [`${e} mm`, `${Math.round(r.mag)}×`, `${(r.tfov * 60).toFixed(0)}′`, `${r.exit.toFixed(1)} mm`, r.use]; }), align: ['l', 'r', 'r', 'r', 'l'] },
    note: 'True field assumes 52° eyepieces (Plössl). Use the telescope calculator for your exact eyepieces.',
  }];
  if (cam) { const c = camera(s, cam.w, cam.h, cam.px, seeing); out[0].facts!.push(['Camera image scale', `${c.scale.toFixed(2)}″/px`], ['Camera field', `${(c.fovW / 60).toFixed(2)}° × ${(c.fovH / 60).toFixed(2)}°`], ['Sampling', c.verdict]); }
  return out;
}

export function eventSections(place: Place, date: string): Section[] {
  const [y, m] = date.split('-').map(Number), tz = place.tz;
  const ev = monthEvents(place, y, m).filter((e) => localDate(e.date, tz).startsWith(date.slice(0, 7)));
  return [{ title: `Sky events: ${fmtDay(noonOf(date, tz), tz, { month: 'long', year: 'numeric' })}`, table: { head: ['Date', 'Event', 'Details'], rows: ev.map((e) => [fmtDay(e.date, tz, { month: 'short', day: 'numeric' }) + (e.kind === 'meteor' ? '' : ` ${fmtTime(e.date, tz)}`), e.title, e.detail]) } }];
}

export function logSheet(place: Place, date: string, rows = 12): Section[] {
  return [{ title: 'Observing log sheet', text: [`Night of ${date}, ${place.name}. Seeing and transparency 1 (poor) to 5 (excellent).`], table: { head: ['Time', 'Object', 'Eyepiece / camera', 'Seeing', 'Transp.', 'Notes'], rows: Array.from({ length: rows }, () => ['', '', '', '', '', '                                        ']) } }];
}
