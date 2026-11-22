// Live problems for Body fluids and circulation.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

export default {
  'circ-cardiac-output': {
    title: 'stroke volume and cardiac output',
    make(r) {
      const edv = pick(r, 110, 150, 5), esv = pick(r, 40, 70, 5), hr = pick(r, 60, 100, 2);
      const sv = edv - esv, answer = (sv * hr) / 1000;
      return { edv, esv, hr,
        q: `<p>The left ventricle holds ${edv} mL of blood at the end of diastole and ${esv} mL at the end of systole. The heart rate is ${hr} beats per minute. What is the cardiac output in litres per minute?</p>`,
        answer, unit: 'L/min', tol: 0.005,
        hint: 'Stroke volume = blood at the end of diastole − blood left at the end of systole. Cardiac output = stroke volume × heart rate.',
        solution: steps(`Stroke volume = ${edv} − ${esv} = ${sv} mL.`, `Cardiac output = ${sv} × ${hr} = ${sv * hr} mL per minute.`, `= <b>${n(answer, 4)} L per minute</b> (a resting adult pumps about 5 L).`) };
    },
    verify: (x) => (x.edv * x.hr - x.esv * x.hr) / 1000,
  },
  'circ-ecg-rate': {
    title: 'heart rate from an ECG strip',
    make(r) {
      const sq = pick(r, 15, 30), answer = 60 / (sq * 0.04);
      return { sq,
        q: `<p>On standard ECG paper each small square is 0.04 s. Two successive R waves are ${sq} small squares apart. What is the heart rate in beats per minute? Is it within the usual resting range of 60 to 100?</p>`,
        answer, unit: 'beats/min', tol: 0.01,
        hint: 'R–R interval (one cardiac cycle) = squares × 0.04 s. Beats per minute = 60 ÷ that interval.',
        solution: steps(`R–R interval = ${sq} × 0.04 = ${n(sq * 0.04)} s.`, `Rate = 60 ÷ ${n(sq * 0.04)} = <b>${n(answer)} beats per minute</b>.`, answer > 100 ? 'Above 100: faster than the usual resting range.' : answer < 60 ? 'Below 60: slower than the usual resting range.' : 'Within the usual resting range.') };
    },
    verify: (x) => 1500 / x.sq,
  },
};
