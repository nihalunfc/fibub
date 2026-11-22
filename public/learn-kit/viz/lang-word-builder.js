// Word-building machine: pick a root word, then add a prefix and/or a suffix. The blocks click together and the result shows
// the new word and its job (noun, verb, adjective, adverb). Notice how the ending changes the word class, and that only some
// combinations are real words.
import { canvas, text, title, row, choice, readout } from '../kit.js';

// root: [pos, {affix: [word, pos]}]
const R = {
  create: ['verb', { '-ion': ['creation', 'noun'], '-ive': ['creative', 'adjective'], '-or': ['creator', 'noun'], 're-': ['recreate', 'verb'], '-ive+-ly': ['creatively', 'adverb'] }],
  act: ['verb', { '-ion': ['action', 'noun'], '-ive': ['active', 'adjective'], '-or': ['actor', 'noun'], 're-': ['react', 'verb'], '-ive+-ly': ['actively', 'adverb'] }],
  happy: ['adjective', { '-ness': ['happiness', 'noun'], 'un-': ['unhappy', 'adjective'], '-ly': ['happily', 'adverb'], 'un-+-ness': ['unhappiness', 'noun'] }],
  use: ['verb', { '-ful': ['useful', 'adjective'], '-er': ['user', 'noun'], 'mis-': ['misuse', 'verb'], '-able': ['usable', 'adjective'], 'un-+-ful': ['unuseful', null] }],
  agree: ['verb', { '-ment': ['agreement', 'noun'], '-able': ['agreeable', 'adjective'], 'dis-': ['disagree', 'verb'], 'dis-+-ment': ['disagreement', 'noun'] }],
};
const AFF = ['re-', 'un-', 'dis-', 'mis-', '-ion', '-ive', '-or', '-ness', '-ly', '-ful', '-er', '-able', '-ment'];
export default function (host) {
  let root = 'create', pre = '', suf = '';
  const cv = canvas(host, { aspect: 0.5, max: 210, min: 180, label: 'A root word with a prefix and suffix clicking together' });
  const c1 = row(host), c2 = row(host), c3 = row(host), out = readout(host);
  choice(c1, 'Root', Object.keys(R).map((x) => [x, x]), root, (v) => { root = v; pre = ''; suf = ''; upd(); });
  choice(c2, 'Prefix', [['', 'none'], ['re-', 're-'], ['un-', 'un-'], ['dis-', 'dis-'], ['mis-', 'mis-']], pre, (v) => { pre = v; upd(); });
  choice(c3, 'Suffix', [['', 'none'], ['-ion', '-ion'], ['-ive', '-ive'], ['-or', '-or'], ['-ness', '-ness'], ['-ly', '-ly'], ['-ful', '-ful'], ['-er', '-er'], ['-able', '-able'], ['-ment', '-ment']], suf, (v) => { suf = v; upd(); });
  const find = () => {
    if (!pre && !suf) return [root, R[root][0]];
    const d = R[root][1], keys = [pre && suf ? pre + '+' + suf : null, suf === '-ly' && d['-ive+-ly'] && !pre ? null : null, pre || suf].filter(Boolean);
    for (const k of keys) if (d[k]) return d[k];
    if (suf === '-ly' && d['-ive'] ) return null;
    return null;
  };
  const upd = () => {
    const r = find();
    out.textContent = r && r[1] ? `${r[0]}: a ${r[1]}. ${!pre && !suf ? 'The root on its own is a ' + R[root][0] + '.' : 'The ' + (suf ? 'suffix ' + suf + ' sets' : 'prefix ' + pre + ' changes') + ' the ' + (suf ? 'word class.' : 'meaning but keeps the word class.')}` : 'That combination is not a word in this machine (try another). In real English, not every ending fits every root.';
    cv.redraw();
  };
  cv.draw = (ctx, W, H, col) => {
    title(ctx, 'Build a word', col);
    const parts = [[pre.replace('-', ''), col.s[1], !!pre], [root, col.s[0], true], [suf.replace('-', ''), col.s[2], !!suf]].filter((p) => p[2]);
    ctx.font = '700 22px system-ui'; const ws = parts.map((p) => ctx.measureText(p[0]).width + 24), tot = ws.reduce((a, b) => a + b, 0) + 4 * (parts.length - 1);
    let x = (W - tot) / 2; parts.forEach((p, i) => { ctx.fillStyle = p[1]; ctx.globalAlpha = 0.28; ctx.fillRect(x, 54, ws[i], 46); ctx.globalAlpha = 1; ctx.strokeStyle = p[1]; ctx.lineWidth = 2.5; ctx.strokeRect(x, 54, ws[i], 46); text(ctx, p[0], x + ws[i] / 2, 77, { color: col.ink, size: 22, weight: 700, align: 'center', fit: false }); x += ws[i] + 4; });
    const r = find();
    text(ctx, r && r[1] ? '→ ' + r[0] + '  (' + r[1] + ')' : 'not a word here', W / 2, 140, { color: r && r[1] ? col.good : col.bad, size: 18, weight: 700, align: 'center' });
  };
  upd();
}
