// Shared Hodgkin–Huxley stepping for the medicine explainers (maths: src/lib/sci/hhsim.ts, the Action
// potential tool's engine), with an optional light-gated channel: conductance gChR·O·(V − E), where the open
// fraction O follows light with an opening and a closing time.
import { DEFAULTS, deriv, steady, phi, type State } from '../../../lib/sci/hhsim';

export type Opsin = { tauOn: number; tauOff: number; E: number }; // ms, ms, mV
export const CHR2: Opsin = { tauOn: 1.5, tauOff: 10, E: 0 };     // channelrhodopsin-2: cation channel, reversal near 0 mV
export const NPHR: Opsin = { tauOn: 2, tauOff: 4, E: -400 };     // halorhodopsin is a chloride pump: modelled as a steady outward current source

export function neuron() {
  const g = steady(-65), f = phi(DEFAULTS.tempC);
  const st = { s: [-65, g.m, g.h, g.n] as State, O: 0, t: 0 };
  /** Advance by dt ms with injected current I (µA/cm²), light on/off, opsin and its peak conductance (mS/cm²). */
  const step = (dt: number, I: number, light: boolean, op: Opsin | null, gmax: number) => {
    if (op) st.O += dt * (light ? (1 - st.O) / op.tauOn : 0) - dt * (st.O / op.tauOff) * (light ? 0.15 : 1);
    const Iop = op ? (op === NPHR ? -gmax * st.O * 30 : -gmax * st.O * (st.s[0] - op.E)) : 0;
    const k1 = deriv(st.s, I + Iop, DEFAULTS, f);
    const k2 = deriv(st.s.map((v, i) => v + (dt / 2) * k1[i]) as State, I + Iop, DEFAULTS, f);
    const k3 = deriv(st.s.map((v, i) => v + (dt / 2) * k2[i]) as State, I + Iop, DEFAULTS, f);
    const k4 = deriv(st.s.map((v, i) => v + dt * k3[i]) as State, I + Iop, DEFAULTS, f);
    st.s = st.s.map((v, i) => v + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i])) as State;
    st.t += dt;
    return st.s[0];
  };
  return { st, step };
}
