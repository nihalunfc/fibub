// #1278 Earth's energy budget. Checked against Python (α = 0.3: Tₑ = 254.5781 K; ε = 0.78: Tₛ = 288.0638 K;
// α = 0.6, ε = 0.78: −22.6953 °C) and by energy balance at the ground, in the air and at the top for random α, ε.
import { budget, toC, albedoFor } from '../../src/lib/sci/earth-energy.ts';

export default async (check) => {
  const near = (a, b, t = 1e-4) => Math.abs(a - b) <= t;
  const b = budget(0.3, 0.78);
  check('energy: today matches Python', near(b.Te, 254.5781401, 1e-6) && near(b.Ts, 288.0637769, 1e-6) && near(b.incoming, 340.25) && near(b.reflected, 102.075));
  check('energy: snowball matches Python', near(toC(budget(0.6, 0.78).Ts), -22.6953275, 1e-6));
  check('energy: no greenhouse gives Tₛ = Tₑ', near(budget(0.3, 0).Ts, budget(0.3, 0).Te, 1e-9) && budget(0.3, 0).airDown === 0);
  let ok = true;
  for (let i = 0; i < 1000; i++) {
    const a = Math.random() * 0.9, e = Math.random(), x = budget(a, e);
    const ground = x.absorbed + x.airDown - x.surfaceIR, air = x.airAbsorbs - x.airDown - x.airUp, top = x.absorbed - x.windowIR - x.airUp;
    if (Math.abs(ground) > 1e-8 || Math.abs(air) > 1e-8 || Math.abs(top) > 1e-8) ok = false;
  }
  check('energy: ground, air and top balance for 1,000 random α, ε', ok);
  check('energy: more greenhouse, warmer; more albedo, colder', budget(0.3, 0.84).Ts > b.Ts && budget(0.35, 0.78).Ts < b.Ts);
  check('energy: albedo for 15 °C at ε = 0.84 is a bit above 0.3', near(budget(albedoFor(288.15, 0.84), 0.84).Ts, 288.15, 1e-9) && albedoFor(288.15, 0.84) > 0.3 && albedoFor(288.15, 0.84) < 0.36);
};
