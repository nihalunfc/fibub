// 12.8 A timeline of India in cosmology and astrophysics (selected; sources in the lesson). Tap a year (or use the
// slider) to read what happened. Dates: Saha's ionisation equation 1920 (Phil. Mag. 40, 472); Chandrasekhar's limit
// 1930 (published 1931, ApJ 74, 81), Nobel Prize 1983; Raychaudhuri equation 1955 (Phys. Rev. 98, 1123);
// Hoyle-Narlikar theory 1964 (Proc. R. Soc. A 282, 191); Vishveshwara's black hole ringing 1970 (Nature 227, 936);
// IUCAA founded 1988; GMRT working by the late 1990s (opened to astronomers worldwide in 2002); AstroSat launched
// 28 September 2015; first gravitational-wave detection announced 2016 with Indian co-authors; SARAS 3 result 2022;
// LIGO-India approved April 2023; InPTA with EPTA, June 2023; Narlikar died May 2025; LIGO-India planned ~2030s.
import { canvas, text, title, line, dot, row, slider, readout } from '../../kit.js';

const E = [
  [1920, 'Saha equation', 'Meghnad Saha works out how hot gas shares itself between atoms and ions. Astronomers use it to read star temperatures; cosmologists use the same physics for recombination, when the CMB was set free (<a href="/learn/courses/cosmology/recombination/">Lesson 6.9</a>).'],
  [1930, 'Chandrasekhar limit', 'Aged 19, on the ship to England, S. Chandrasekhar finds that a white dwarf heavier than about 1.4 Suns must collapse. That limit is why Type Ia supernovae are such good candles (<a href="/learn/courses/cosmology/type-ia-supernovae/">Lesson 2.4</a>). Nobel Prize, 1983.'],
  [1955, 'Raychaudhuri equation', 'Amal Kumar Raychaudhuri, in Kolkata, shows how gravity makes streams of matter focus. It became the key step in the Penrose and Hawking theorems that a Big Bang singularity is hard to avoid in general relativity.'],
  [1964, 'Hoyle-Narlikar gravity', 'Jayant Narlikar and Fred Hoyle propose a theory of gravity built on Mach\'s idea that inertia comes from distant matter. Narlikar remained a friendly critic of the Big Bang for decades, which kept everyone honest.'],
  [1970, 'Black holes ring', 'C. V. Vishveshwara shows that a disturbed black hole rings with its own "notes" (quasi-normal modes). LIGO hears exactly that ring-down after every merger.'],
  [1988, 'IUCAA founded', 'The Inter-University Centre for Astronomy and Astrophysics opens in Pune, with Narlikar as founding director, so that university students anywhere in India can do astronomy research.'],
  [1999, 'GMRT', 'The Giant Metrewave Radio Telescope near Pune (30 dishes, 45 m each, spread over 25 km), conceived by Govind Swarup, is working by the late 1990s; upgraded (uGMRT) by 2019.'],
  [2015, 'AstroSat', 'India\'s first space observatory, launched on 28 September 2015, looks at the sky in ultraviolet and X-rays at the same time.'],
  [2016, 'Gravitational waves', 'Scientists at Indian institutes, including IUCAA and ICTS, are among the authors of the first detection of gravitational waves.'],
  [2022, 'SARAS 3', 'A radio experiment from the Raman Research Institute, floated on lakes in Karnataka, finds no sign of the EDGES 21 cm dip (<a href="/learn/courses/cosmology/dark-ages-21cm/">Lesson 12.7</a>).'],
  [2023, 'Nanohertz waves; LIGO-India', 'The Indian Pulsar Timing Array, timing pulsars with the uGMRT, joins the European array in reporting evidence for a background of very slow gravitational waves. In April, the government approves LIGO-India.'],
  [2025, 'Narlikar (1938-2025)', 'Jayant Narlikar dies in Pune in May 2025, remembered as much for his science stories in Marathi and English as for his research.'],
  [2031, 'LIGO-India (planned)', 'A third LIGO detector being built near Aundha in Hingoli district, Maharashtra, planned for the 2030s. It will help pin down where in the sky signals come from (see the problem below).'],
];

const yr = (y) => (y === 2031 ? '2030s' : y === 1999 ? '1990s' : String(y));

export default function (host) {
  const cv = canvas(host, { aspect: 1.25, max: 560, min: 470, label: 'Timeline of India\'s contributions to cosmology and astrophysics' });
  let k = 0, ys = [];
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Event', min: 0, max: E.length - 1, step: 1, value: 0, fmt: (v) => yr(E[Math.round(v)][0]), oninput: (v) => { k = Math.round(v); upd(); } });
  const out = readout(host);
  cv.c.addEventListener('click', (e) => {
    const b = cv.c.getBoundingClientRect(), y = e.clientY - b.top;
    let best = -1, d = 1e9; ys.forEach((yy, i) => { if (Math.abs(yy - y) < d) { d = Math.abs(yy - y); best = i; } });
    if (best >= 0 && d < 20) { k = best; sl.set(k); upd(); }
  });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'India in cosmology: a timeline', col) + 10;
    const x0 = 58, T = top + 6, B = h - 14;
    ys = E.map((_, i) => T + (i * (B - T)) / (E.length - 1));
    line(ctx, [[x0, T], [x0, B]], col.line, 3);
    E.forEach(([y, name], i) => {
      const s = i === k, c = y > 2026 ? col.s[3] : col.s[0];
      if (s) { ctx.fillStyle = col.soft; ctx.fillRect(4, ys[i] - 13, w - 8, 26); }
      dot(ctx, x0, ys[i], s ? 7 : 5, c, col.panel);
      text(ctx, yr(y), x0 - 12, ys[i], { color: s ? col.ink : col.muted, size: 11.5, weight: 700, align: 'right' });
      text(ctx, name, x0 + 14, ys[i], { color: col.ink, size: 12, weight: s ? 700 : 400 });
    });
  };
  const upd = () => { const [y, name, t] = E[k]; out.innerHTML = `<b>${yr(y)}: ${name}.</b> ${t}`; cv.redraw(); };
  upd();
}
