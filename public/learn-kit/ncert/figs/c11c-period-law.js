// Class 11 Chemistry, Classification of Elements: the modern periodic law. Properties repeat with atomic number.
// First ionisation enthalpy (kJ/mol, NIST/CRC) and covalent radius (pm, Cordero 2008) of Z = 1 to 36: peaks at the noble gases, troughs at the alkali metals.
import { canvas, text, title, row, slider, choice, readout, dot } from '../../kit.js';

const SYM = 'H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr'.split(' ');
const IE = [1312, 2372, 520, 900, 801, 1086, 1402, 1314, 1681, 2081, 496, 738, 578, 787, 1012, 1000, 1251, 1521, 419, 590, 633, 659, 651, 653, 717, 763, 760, 737, 745, 906, 579, 762, 947, 941, 1140, 1351];
const RAD = [31, 28, 128, 96, 84, 76, 71, 66, 57, 58, 166, 141, 121, 111, 107, 105, 102, 106, 203, 176, 170, 160, 153, 139, 139, 132, 126, 124, 132, 122, 122, 120, 119, 120, 120, 116];
export default function (host) {
  let Z = 11, prop = 'ie';
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 300, label: 'A graph of a property against atomic number showing repeating peaks' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'property', [['ie', 'ionisation enthalpy'], ['r', 'atomic radius']], prop, (v) => { prop = v; go(); });
  slider(ctl, { label: 'atomic number Z', min: 1, max: 36, step: 1, value: Z, fmt: (v) => v.toFixed(0), oninput: (v) => { Z = v; go(); } });
  const D = () => (prop === 'ie' ? IE : RAD);
  const go = () => { ro.textContent = `Z = ${Z} (${SYM[Z - 1]}): ${prop === 'ie' ? `first ionisation enthalpy ${IE[Z - 1]} kJ/mol` : `covalent radius ${RAD[Z - 1]} pm`}. ` + (prop === 'ie' ? 'Peaks are the noble gases, the lowest points the alkali metals; the pattern repeats every period.' : 'Radius drops across a period and jumps at each alkali metal.'); cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, `${prop === 'ie' ? 'first ionisation enthalpy' : 'covalent radius'} against Z`, col) + 10, L = 38, B = h - 40, T = t0 + 6, W = w - L - 10, d = D(), mx = Math.max(...d) * 1.05, X = (z) => L + W * (z - 1) / 35, Y = (v) => B - (B - T) * v / mx;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(L, B); ctx.lineTo(L + W, B); ctx.stroke();
    [2, 10, 18, 36].forEach((z) => { ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(X(z), T); ctx.lineTo(X(z), B); ctx.stroke(); ctx.setLineDash([]); });
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.beginPath(); d.forEach((v, i) => (i ? ctx.lineTo(X(i + 1), Y(v)) : ctx.moveTo(X(1), Y(v)))); ctx.stroke();
    d.forEach((v, i) => { const z = i + 1, ng = [2, 10, 18, 36].includes(z), al = [3, 11, 19].includes(z); dot(ctx, X(z), Y(v), z === Z ? 6 : 3, z === Z ? col.s[3] : ng ? col.s[2] : al ? col.s[1] : col.s[0]); });
    text(ctx, SYM[Z - 1], X(Z), Y(d[Z - 1]) - 12, { color: col.s[3], size: 12, weight: 700, align: 'center' });
    [['He', 2], ['Ne', 10], ['Ar', 18], ['Kr', 36]].forEach(([s, z]) => text(ctx, s, X(z), B + 12, { color: col.s[2], size: 10, weight: 700, align: 'center' })); [['Li', 3], ['Na', 11], ['K', 19]].forEach(([s, z]) => text(ctx, s, X(z), B + 26, { color: col.s[1], size: 10, weight: 700, align: 'center' }));
    text(ctx, prop === 'ie' ? 'kJ/mol' : 'pm', 6, T + 4, { color: col.muted, size: 10.5 });
  };
  go();
}
