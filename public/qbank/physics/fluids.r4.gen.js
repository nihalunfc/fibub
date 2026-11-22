// Round 4 extras for fluids: original questions, written 2026-11-22.
import { pick, int, choose, round } from '../_util.js';
const R = String.raw;
const g = 9.8;

export default {
  items: [
    { id: 'fld-r4-01', type: 'mcq', level: 1, exams: ['jam'], sub: 'pressure',
      q: R`In a hydraulic jack the small piston has area 10 cm² and the large one 500 cm². Pushing the small piston with 200 N (pistons at the same level, friction ignored) can hold up a load of`,
      options: ['4 N', '10 kN', '200 N', '100 kN'], answer: 1,
      sol: R`Pascal's principle: the extra pressure $200/(10\times10^{-4}) = 2\times10^5$ Pa is passed on undiminished to the large piston, which feels $2\times10^5\times500\times10^{-4} = 10^4$ N $= 10$ kN, 50 times the push. The price: the small piston must move 50 times as far as the load rises.`,
      trap: R`4 N divides by the area ratio instead of multiplying; the force grows on the large side.` },
    { id: 'fld-r4-02', type: 'mcq', level: 2, exams: ['jam'], sub: 'pressure',
      q: R`Three open vessels have flat bases of the same area: one is a straight cylinder, one widens towards the top and one narrows towards the top. Each holds water to the same depth. The force of the water on the base is`,
      options: ['largest for the vessel that widens upwards, which holds the most water', 'largest for the straight cylinder', 'largest for the vessel that narrows upwards', 'the same for all three'], answer: 3,
      sol: R`The pressure at the base is $p_0 + \rho gh$, set only by the depth, and the force on the base is that pressure times the base area: the same for all three. The weights of water differ; the sloping walls make up the difference (in the widening vessel they carry part of the water's weight, in the narrowing one the water pushes up on them).`,
      trap: R`The force on the base equals the water's weight only for straight vertical walls.` },
    { id: 'fld-r4-03', type: 'nat', level: 2, exams: ['jam'], sub: 'viscosity',
      q: R`A flat plate of area 0.5 m² slides at a steady 0.2 m/s over a 1.0 mm layer of oil (viscosity 0.8 Pa s) resting on a fixed flat floor. The flow in the layer is smooth, with a linear velocity profile. The force needed to keep the plate moving is ______ N.`,
      answer: 80, tol: 0.5, unit: 'N', calc: () => (0.8 * 0.5 * 0.2) / 1e-3,
      sol: R`Newton's law of viscosity: $F = \eta A\dfrac{dv}{dy}$. With a linear profile, $dv/dy = 0.2/0.001 = 200$ s⁻¹. $F = 0.8\times0.5\times200 = 80$ N.`,
      trap: R`Leaving the thickness in mm gives a force 1000 times too small.` },
    { id: 'fld-r4-04', type: 'nat', level: 3, exams: ['jam'], sub: 'pressure',
      q: R`A vertical dam wall 20 m wide holds back water 10 m deep. The total horizontal force of the water on the wall (ignoring atmospheric pressure, which acts on both sides) is ______ MN ($g = 9.8$ m/s²).`,
      answer: 9.8, tol: 0.05, unit: 'MN', calc: () => (0.5 * 1000 * 9.8 * 20 * 10 ** 2) / 1e6,
      sol: R`The pressure grows linearly with depth, $p = \rho gy$, so a strip of height $dy$ feels $\rho gy\,w\,dy$. Total $F = \int_0^H\rho gwy\,dy = \tfrac12\rho gwH^2 = 0.5\times1000\times9.8\times20\times100 = 9.8\times10^6$ N $= 9.8$ MN. Equivalently, the average pressure (at half the depth) times the area.`,
      trap: R`Using the pressure at the bottom for the whole wall doubles the answer.` },
    { id: 'fld-r4-05', type: 'mcq', level: 3, exams: ['jam'], sub: 'pressure',
      q: R`Water stands to depth $H$ against a vertical rectangular wall. The total water force on the wall acts along a line at what depth below the water surface?`,
      options: [R`$2H/3$`, R`$H/2$`, R`$H/3$`, R`$H$ (at the base)`], answer: 0,
      sol: R`The force per unit depth grows as $y$, so the force is centred where the "pressure triangle" has its centroid. Taking moments about the surface: $\bar y = \dfrac{\int_0^Hy\cdot y\,dy}{\int_0^Hy\,dy} = \dfrac{H^3/3}{H^2/2} = \dfrac{2H}{3}$. This is why dams are thickest at the bottom: the push acts low and is largest there.`,
      trap: R`$H/2$ is the centre of the wall, but the pressure is not uniform.` },
    { id: 'fld-r4-06', type: 'msq', level: 3, exams: ['jam'], sub: 'buoyancy', format: 'statements',
      q: R`A beaker of water stands in a lift. A wooden block floats in it, and a stone hangs from a spring balance, fully under water. The lift now accelerates upwards at $a$. Which statements are correct?`,
      options: ['The fraction of the block that is under water stays the same', 'The buoyant force on the block increases', 'The pressure at a fixed depth below the water surface stays the same', 'The spring balance reading increases'], answer: [0, 1, 3],
      sol: R`In the lift's frame the effective gravity is $g + a$. All pressures scale with it: $p = \rho(g + a)h$, so the pressure at a fixed depth rises. Floating: $\rho_wV_{\rm sub}(g + a) = m(g + a)$, so the submerged volume, and fraction, are unchanged while the buoyant force $m(g + a)$ grows. The stone's balance reads $(m_s - \rho_wV_s)(g + a)$, larger than before.`,
      trap: R`The floating fraction is unchanged because weight and buoyancy scale together; the pressure itself does not stay the same.` },
    { id: 'fld-r4-07', type: 'nat', level: 3, exams: ['jam'], sub: 'bernoulli',
      q: R`A Pitot-static tube faces into an air stream (air density 1.2 kg/m³). Its two openings are connected to a water manometer, which shows a level difference of 1.5 cm. The air speed is ______ m/s ($g = 9.8$ m/s², one decimal place).`,
      answer: 15.6, tol: 0.1, unit: 'm/s', calc: () => Math.sqrt((2 * 1000 * 9.8 * 0.015) / 1.2),
      sol: R`At the front opening the air is brought to rest, so its pressure is the stagnation pressure $p + \tfrac12\rho_av^2$; the side openings feel the static pressure $p$. The difference $\tfrac12\rho_av^2$ is read by the manometer as $\rho_wgh$: $v = \sqrt{\dfrac{2\rho_wgh}{\rho_a}} = \sqrt{\dfrac{2\times1000\times9.8\times0.015}{1.2}} = \sqrt{245} = 15.6$ m/s.`,
      trap: R`The density in $\tfrac12\rho v^2$ is the air's; the water's density belongs to the manometer reading.` },
    { id: 'fld-r4-08', type: 'mcq', level: 4, exams: ['jam'], sub: 'poiseuille',
      q: R`Oil is pumped in steady laminar flow through a long pipe at a fixed volume flow rate. If the pipe is replaced by one of the same length but half the radius, the pumping power needed (for the same flow rate) becomes`,
      options: ['2 times as large', '4 times as large', '16 times as large', '8 times as large'], answer: 2,
      sol: R`Poiseuille: $Q = \dfrac{\pi r^4\Delta p}{8\eta L}$, so for fixed $Q$, $\Delta p = \dfrac{8\eta LQ}{\pi r^4}\propto r^{-4}$. The power is $Q\Delta p$, which also goes as $r^{-4}$: halving $r$ multiplies it by 16.`,
      trap: R`Thinking of the cross-section area ($r^2$) gives 4; the flow resistance goes as $r^{-4}$.` },
    { id: 'fld-r4-09', type: 'msq', level: 4, exams: ['jam'], sub: 'bernoulli', format: 'statements',
      q: R`Water flows steadily from a large open tank through a horizontal pipe that leaves the tank a depth $h$ below the surface. The pipe has wider and narrower sections and is open to the air at its end. Treat the flow as ideal (no viscosity). Which statements are correct?`,
      options: [R`The water leaves the end at speed $\sqrt{2gh}$, whatever the shape of the pipe`, 'In sections wider than the outlet, the pressure is above atmospheric', 'In sections narrower than the outlet, the pressure is below atmospheric', 'The volume flow rate is set by the area of the narrowest section'], answer: [0, 1, 2],
      sol: R`Bernoulli from the tank surface (at rest, atmospheric) to the outlet (atmospheric): $\tfrac12v_e^2 = gh$. The flow rate is $Q = a_ev_e$, set by the outlet area. Inside the pipe at the same height, $p - p_0 = \tfrac12\rho(v_e^2 - v^2)$ with $v = Q/a$: wider than the outlet means slower and pressure above atmospheric; narrower means faster and below atmospheric (it can even fall to the vapour pressure, when the water boils or air is sucked in).`,
      trap: R`A narrow section upstream does not limit the flow in ideal flow; it only lowers the pressure there.` },
    { id: 'fld-r4-10', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'draining tanks',
      q: R`A conical funnel-shaped tank stands with its apex down (half-angle $45^\circ$) and holds water to a height of 1.0 m above the apex. It drains through a small hole of area 1.0 cm² at the apex, with Torricelli's law for the outflow speed. It empties in ______ minutes ($g = 9.8$ m/s², one decimal place).`,
      answer: 47.3, tol: 0.3, unit: 'min', calc: () => (2 * Math.PI * 1 ** 2.5) / (5 * 1e-4 * Math.sqrt(2 * 9.8)) / 60,
      sol: R`At height $h$ the surface has radius $h\tan45^\circ = h$ and area $\pi h^2$. Volume balance: $-\pi h^2\,dh = a\sqrt{2gh}\,dt$, so $dt = -\dfrac{\pi h^{3/2}}{a\sqrt{2g}}dh$. Integrating from $H$ to 0: $t = \dfrac{2\pi H^{5/2}}{5a\sqrt{2g}} = \dfrac{2\pi}{5\times10^{-4}\times4.427} = 2838$ s $= 47.3$ min.`,
      trap: R`A straight-sided tank gives $t\propto H^{1/2}$; here the surface area shrinks as it drains, giving $H^{5/2}$.` },
  ],
  gens: [
    { id: 'fld-r4g1', type: 'nat', level: 3, exams: ['jam'], sub: 'bernoulli',
      make(r) {
        const [liq, rm] = choose(r, [['water', 1000], ['alcohol (density 800 kg/m³)', 800], ['light oil (density 850 kg/m³)', 850]]), h = pick(r, 0.5, 6, 0.5), ra = choose(r, [1.2, 1.25, 1.3]);
        const answer = round(Math.sqrt((2 * (rm - ra) * g * h) / 100 / ra), 2);
        return { q: R`A Pitot-static tube faces into an air stream of density ${ra} kg/m³. A manometer filled with ${liq} joined to its openings shows a level difference of ${h} cm. Find the air speed in m/s ($g = 9.8$ m/s²).`,
          answer, tol: Math.max(0.05, answer * 0.01), unit: 'm/s', rm, h, ra,
          sol: R`$\tfrac12\rho_av^2 = (\rho_m - \rho_a)gh$, so $v = \sqrt{\dfrac{2(${rm} - ${ra})\times9.8\times${round(h / 100, 4)}}{${ra}}} = ${answer}$ m/s.`,
          trap: 'Use the air density on the kinetic side and the manometer liquid on the gauge side.' };
      },
      verify: (p) => Math.sqrt((2 * (p.rm - p.ra) * g * p.h) / 100 / p.ra) },
    { id: 'fld-r4g2', type: 'nat', level: 3, exams: ['jam'], sub: 'pressure',
      make(r) {
        const w = pick(r, 1, 5, 0.5), d1 = pick(r, 1, 6, 1), hgt = pick(r, 1, 4, 0.5), d2 = d1 + hgt;
        const answer = round((1000 * g * w * (d2 ** 2 - d1 ** 2)) / 2 / 1000, 1);
        return { q: R`A vertical rectangular sluice gate ${w} m wide is set in the wall of a reservoir. Its top edge is ${d1} m and its bottom edge ${d2} m below the water surface. Find the total force of the water on it in kN (ignore atmospheric pressure; $g = 9.8$ m/s²).`,
          answer, tol: Math.max(0.5, answer * 0.01), unit: 'kN', w, d1, d2,
          sol: R`$F = \int_{d_1}^{d_2}\rho gy\,w\,dy = \tfrac12\rho gw(d_2^2 - d_1^2) = \tfrac12\times1000\times9.8\times${w}\times(${d2}^2 - ${d1}^2) = ${answer}$ kN. (The same as the pressure at the gate's centre times its area.)`,
          trap: 'Pressure grows with depth, so use the average over the gate, not the value at its top or bottom.' };
      },
      verify: (p) => (1000 * g * p.w * (p.d2 ** 2 - p.d1 ** 2)) / 2 / 1000 },
    { id: 'fld-r4g3', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'draining tanks',
      make(r) {
        const al = choose(r, [30, 45, 60]), H = pick(r, 0.4, 1.6, 0.2), a = choose(r, [0.5, 1, 2, 4]);
        const t2 = Math.tan((al * Math.PI) / 180) ** 2, answer = round((2 * Math.PI * t2 * H ** 2.5) / (5 * a * 1e-4 * Math.sqrt(2 * g)) / 60, 2);
        return { q: R`A conical tank stands apex down (half-angle $${al}^\circ$) and holds water to a height of ${H} m above the apex. It drains through a small hole of area ${a} cm² at the apex (Torricelli outflow). How many minutes does it take to empty? ($g = 9.8$ m/s²)`,
          answer, tol: Math.max(0.05, answer * 0.01), unit: 'min', al, H, a,
          sol: R`Surface area at height $h$: $\pi h^2\tan^2(${al}^\circ)$. $-\pi h^2\tan^2\alpha\,dh = a\sqrt{2gh}\,dt$ gives $t = \dfrac{2\pi\tan^2\alpha\,H^{5/2}}{5a\sqrt{2g}} = ${answer}$ min.`,
          trap: 'The surface shrinks as the level falls, so the time goes as $H^{5/2}$.' };
      },
      verify: (p) => (2 * Math.PI * Math.tan((p.al * Math.PI) / 180) ** 2 * p.H ** 2.5) / (5 * p.a * 1e-4 * Math.sqrt(2 * g)) / 60 },
  ],
};
