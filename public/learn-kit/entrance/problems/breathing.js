// Live problems for Breathing and exchange of gases.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const CAPS = {
  IC: ['inspiratory capacity', ['TV', 'IRV']],
  EC: ['expiratory capacity', ['TV', 'ERV']],
  FRC: ['functional residual capacity', ['ERV', 'RV']],
  VC: ['vital capacity', ['ERV', 'TV', 'IRV']],
  TLC: ['total lung capacity', ['RV', 'ERV', 'TV', 'IRV']],
};

export default {
  'brth-capacity': {
    title: 'a lung capacity from the four volumes',
    make(r) {
      const v = { TV: pick(r, 400, 600, 50), IRV: pick(r, 2500, 3000, 50), ERV: pick(r, 1000, 1100, 25), RV: pick(r, 1100, 1200, 25) };
      const keys = Object.keys(CAPS), k = keys[Math.floor(r() * keys.length)], [name, parts] = CAPS[k];
      const answer = parts.reduce((s, p) => s + v[p], 0);
      return { ...v, k,
        q: `<p>A student has TV = ${v.TV} mL, IRV = ${v.IRV} mL, ERV = ${v.ERV} mL and RV = ${v.RV} mL. What is the ${name} (${k})?</p>`,
        answer, unit: 'mL', tol: 0,
        hint: 'IC = TV + IRV; EC = TV + ERV; FRC = ERV + RV; VC = ERV + TV + IRV; TLC = VC + RV.',
        solution: steps(`${k} = ${parts.join(' + ')}.`, `= ${parts.map((p) => v[p]).join(' + ')} = <b>${answer} mL</b>.`) };
    },
    // the other way: total lung capacity minus the volumes that are left out
    verify: (x) => x.TV + x.IRV + x.ERV + x.RV - ['TV', 'IRV', 'ERV', 'RV'].filter((p) => !CAPS[x.k][1].includes(p)).reduce((s, p) => s + x[p], 0),
  },
  'brth-o2-delivery': {
    title: 'oxygen delivered to the tissues per minute',
    make(r) {
      const hr = pick(r, 60, 90, 2), sv = pick(r, 60, 90, 5), per = pick(r, 4, 6, 0.5);
      const flow = hr * sv, answer = (flow * per) / 100;
      return { hr, sv, per,
        q: `<p>A person's heart beats ${hr} times a minute with a stroke volume of ${sv} mL. Every 100 mL of oxygenated blood gives ${per} mL of O<sub>2</sub> to the tissues. How much O<sub>2</sub> reaches the tissues each minute?</p>`,
        answer, unit: 'mL/min', tol: 0.005,
        hint: 'Blood pumped per minute (cardiac output) = heart rate × stroke volume. Then scale the oxygen given per 100 mL.',
        solution: steps(`Blood per minute = ${hr} × ${sv} = ${flow} mL.`, `O<sub>2</sub> = ${flow} × ${per} / 100 = <b>${n(answer, 4)} mL per minute</b>.`) };
    },
    verify: (x) => (x.per / 100) * x.sv * x.hr,
  },
};
