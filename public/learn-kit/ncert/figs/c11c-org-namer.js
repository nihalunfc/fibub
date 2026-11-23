// Class 11 Chemistry, Organic Chemistry basics: an IUPAC name builder. Choose the length of the main chain, one functional group and one substituent.
// Rules shown: (1) longest chain with the principal group = parent (meth, eth, prop, but, pent, hex, hept, oct); (2) number from the end that gives the principal
// group (or double/triple bond) the LOWEST number; (3) if that ties, give substituents the lowest numbers; (4) name = substituent locant + substituent + parent + suffix.
import { canvas, text, title, slider, choice, readout, row } from '../../kit.js';

const STEM = ['meth', 'eth', 'prop', 'but', 'pent', 'hex', 'hept', 'oct'];
const G = { ane: 'alkane (no group)', ene: 'double bond', yne: 'triple bond', ol: 'alcohol –OH', one: 'ketone C=O', al: 'aldehyde –CHO', oic: 'acid –COOH' };
export default function (host) {
  let n = 5, g = 'ol', p = 2, sub = 'CH₃', sp = 3;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 280, label: 'A zigzag carbon chain with a functional group and a substituent and its IUPAC name' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'chain length (carbons)', min: 3, max: 8, step: 1, value: n, fmt: (v) => String(v), oninput: (v) => { n = v; go(); } });
  choice(ctl, 'main group', Object.keys(G).map((k) => [k, { ane: 'none', ene: 'C=C', yne: 'C≡C', ol: '–OH', one: 'C=O (ketone)', al: '–CHO', oic: '–COOH' }[k]]), g, (v) => { g = v; go(); });
  slider(ctl, { label: 'group on carbon no.', min: 1, max: 8, step: 1, value: p, fmt: (v) => String(v), oninput: (v) => { p = v; go(); } });
  choice(ctl, 'substituent', [['', 'none'], ['CH₃', 'methyl'], ['Cl', 'chloro']], sub === '' ? '' : sub, (v) => { sub = v; go(); });
  slider(ctl, { label: 'substituent on carbon no.', min: 2, max: 7, step: 1, value: sp, fmt: (v) => String(v), oninput: (v) => { sp = v; go(); } });
  const fixed = () => { let pp = p, ss = sp;
    if (g === 'al' || g === 'oic') pp = 1; else if (g === 'ane') pp = 0; else if (g === 'one') pp = Math.min(Math.max(2, pp), n - 1); else if (g === 'ol') pp = Math.min(pp, n); else pp = Math.min(pp, n - 1);
    ss = Math.min(Math.max(2, ss), n - 1); if (!sub) ss = 0;
    // numbering from the other end if that is lower
    if (g !== 'al' && g !== 'oic') {
      const pr = g === 'ene' || g === 'yne' ? n - pp : n + 1 - pp, sr = ss ? n + 1 - ss : 0;
      if (g !== 'ane' ? (pr < pp || (pr === pp && sr && sr < ss)) : (sr && sr < ss)) return { pp: g === 'ane' ? 0 : pr, ss: sr, flip: true };
    }
    return { pp, ss, flip: false };
  };
  const name = () => {
    const { pp, ss } = fixed(), st = STEM[n - 1], pre = sub ? `${ss}-${sub === 'CH₃' ? 'methyl' : 'chloro'}` : '';
    const loc = (x) => (n <= 2 ? '' : `-${x}-`);
    let body = { ane: st + 'ane', ene: st + loc(pp) + 'ene', yne: st + loc(pp) + 'yne', ol: st + 'an' + (n === 1 ? '' : `-${pp}-`) + 'ol', one: st + `an-${pp}-one`, al: st + 'anal', oic: st + 'anoic acid' }[g];
    body = body.replace('-ene', '-ene').replace(/^(.*?)--/, '$1-');
    return (pre ? pre : '') + body;
  };
  const go = () => { const f = fixed(); ro.textContent = `Name: ${name()}.` + (f.flip ? ' The chain was numbered from the right-hand end, because that gives the main group (or substituent) a lower number.' : ' Numbered from the left; the other end would not give lower numbers.'); cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, name(), col) + 24, dx = (w - 50) / (n - 1 || 1), y0 = top + 70, amp = 20, f = fixed(), X = (i) => 25 + i * dx, Y = (i) => y0 + (i % 2 ? -amp : amp);
    const num = (i) => (f.flip ? n - i : i + 1);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2.2; ctx.beginPath(); for (let i = 0; i < n; i++) { i ? ctx.lineTo(X(i), Y(i)) : ctx.moveTo(X(i), Y(i)); } ctx.stroke();
    const mid = (i, j) => [(X(i) + X(j)) / 2, (Y(i) + Y(j)) / 2];
    const idx = (k) => (f.flip ? n - k : k - 1); // carbon number k (final numbering) -> index
    const dir = (i) => (i % 2 ? -1 : 1) * -1; // substituent points away from the zigzag
    if (g === 'ene' || g === 'yne') { const a = idx(f.pp), b = idx(f.pp + 1), i = Math.min(a, b), j = Math.max(a, b); const [mx, my] = mid(i, j); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(X(i) + 3, Y(i) + 5); ctx.lineTo(X(j) + 3, Y(j) + 5); ctx.stroke(); if (g === 'yne') { ctx.beginPath(); ctx.moveTo(X(i) - 3, Y(i) - 5); ctx.lineTo(X(j) - 3, Y(j) - 5); ctx.stroke(); } }
    const grp = (k, lab) => { const i = idx(k), d = Y(i) > y0 ? 1 : -1; ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(i), Y(i)); ctx.lineTo(X(i), Y(i) + d * 26); ctx.stroke(); text(ctx, lab, X(i), Y(i) + d * 38, { color: col.s[3], size: 13, weight: 700, align: 'center' }); };
    if (g === 'ol') grp(f.pp, 'OH'); if (g === 'one') grp(f.pp, 'O'); 
    if (g === 'al') { const i = idx(1), d = Y(i) > y0 ? 1 : -1; text(ctx, 'O', X(i), Y(i) + d * 38, { color: col.s[3], size: 13, weight: 700, align: 'center' }); ctx.strokeStyle = col.s[3]; ctx.beginPath(); ctx.moveTo(X(i) - 2, Y(i)); ctx.lineTo(X(i) - 2, Y(i) + d * 26); ctx.moveTo(X(i) + 3, Y(i)); ctx.lineTo(X(i) + 3, Y(i) + d * 26); ctx.stroke(); }
    if (g === 'oic') { const i = idx(1), d = Y(i) > y0 ? 1 : -1; text(ctx, 'OH', X(i) + 12, Y(i) + d * 38, { color: col.s[3], size: 13, weight: 700, align: 'center' }); text(ctx, 'O', X(i) - 12, Y(i) + d * 38, { color: col.s[3], size: 13, weight: 700, align: 'center' }); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(i), Y(i)); ctx.lineTo(X(i) + 10, Y(i) + d * 26); ctx.moveTo(X(i) - 3, Y(i)); ctx.lineTo(X(i) - 10, Y(i) + d * 26); ctx.stroke(); }
    if (sub && f.ss) { const i = idx(f.ss), d = Y(i) > y0 ? 1 : -1; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(i), Y(i)); ctx.lineTo(X(i), Y(i) + d * 26); ctx.stroke(); text(ctx, sub, X(i), Y(i) + d * 38, { color: col.s[0], size: 13, weight: 700, align: 'center' }); }
    for (let i = 0; i < n; i++) { const d = Y(i) > y0 ? -1 : 1; ctx.beginPath(); ctx.arc(X(i), Y(i) + d * 0, 0, 0, 7); text(ctx, String(num(i)), X(i), Y(i) - (Y(i) > y0 ? -14 : 14) * 0 + (Y(i) > y0 ? -14 : 14) * 1, { color: col.muted, size: 10, align: 'center' }); }
    text(ctx, f.flip ? 'numbered from the right' : 'numbered from the left', w / 2, h - 36, { color: col.muted, size: 10.5, align: 'center' });
    text(ctx, 'parent: ' + STEM[n - 1] + ' (' + n + ' C)  •  main group: ' + G[g], w / 2, h - 16, { color: col.ink, size: 11, weight: 700, align: 'center' });
  };
  go();
}
