// Round 4 extras for potentials-gauges: original questions, written 2026-11-22.
import { int, choose, round, C } from '../_util.js';
const R = String.raw;

export default {
  items: [
    { id: 'pgx-r4-01', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'vector potential',
      q: R`A circular loop carries a steady current. In the Coulomb gauge, its vector potential at points on the loop's axis is`,
      options: [R`zero`, R`directed along the axis`, R`azimuthal (around the axis) and non-zero`, R`directed radially outward from the axis`], answer: 0,
      sol: R`Every current element $I\,d\vec l$ is matched by an element on the opposite side of the loop flowing the other way, at the same distance from any axis point; their contributions $\frac{\mu_0}{4\pi}\frac{I\,d\vec l}{r}$ cancel. So $\vec A = 0$ on the axis. Off the axis $\vec A$ is azimuthal, $A_\phi(s, z)$, and it must go to zero as $s\to0$ to be single-valued. ($\vec B$ on the axis is not zero: it depends on how $A_\phi$ grows away from the axis.)`,
      trap: R`Thinking $\vec A = 0$ forces $\vec B = 0$; $\vec B$ depends on the derivatives of $\vec A$.` },
    { id: 'pgx-r4-02', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'fields from potentials',
      q: R`A static vector potential is $\vec A = A_0\sin(kx)\,\hat z$. The magnetic field is`,
      options: [R`$A_0k\cos(kx)\,\hat y$`, R`$-A_0k\cos(kx)\,\hat y$`, R`$-A_0k\cos(kx)\,\hat x$`, R`$A_0k\cos(kx)\,\hat z$`], answer: 1,
      sol: R`$\vec B = \nabla\times\vec A$. With only $A_z(x)$: $B_x = \partial_yA_z = 0$, $B_y = -\partial_xA_z = -A_0k\cos kx$, $B_z = 0$. So $\vec B = -A_0k\cos(kx)\,\hat y$.`,
      trap: R`Losing the minus sign in the $y$ component of the curl.` },
    { id: 'pgx-r4-03', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'gauges',
      q: R`Which gauge condition keeps the same form in every inertial frame?`,
      options: [R`the Coulomb gauge, $\nabla\cdot\vec A = 0$`, R`the temporal gauge, $V = 0$`, R`the Lorenz gauge, $\nabla\cdot\vec A + \frac{1}{c^2}\partial_tV = 0$`, R`the axial gauge, $A_z = 0$`], answer: 2,
      sol: R`With the four-potential $A^\mu = (V/c, \vec A)$, the Lorenz condition is $\partial_\mu A^\mu = 0$, a Lorentz scalar: if it holds in one frame it holds in all. The Coulomb condition involves only space derivatives, and the temporal and axial conditions single out the time direction or one space direction, so a boost mixes them up.`,
      trap: R`Choosing the Coulomb gauge because it is the most common in statics.` },
    { id: 'pgx-r4-04', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'coulomb gauge',
      q: R`In the Coulomb gauge the scalar potential is the instantaneous Coulomb potential of the present charges. Why can this not be used to send signals faster than light?`,
      options: [R`Because the Coulomb gauge is valid only for static fields`, R`Because charges can never be moved fast enough`, R`Because $V$ obeys the wave equation in this gauge`, R`Because only $\vec E = -\nabla V - \partial_t\vec A$ is measurable, and part of $\partial_t\vec A$ exactly cancels the instantaneous part of $-\nabla V$, leaving retarded fields`], answer: 3,
      sol: R`Potentials are not observable; fields are. In the Coulomb gauge $\vec A$ is sourced by the transverse current, which is spread over all space and includes a term that cancels the instantaneous Coulomb field from changes in the charges. The resulting $\vec E$ and $\vec B$ are the same retarded fields found in any gauge (Jefimenko's equations), so nothing physical outruns light.`,
      trap: R`Treating a potential as a physical signal.` },
    { id: 'pgx-r4-05', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'gauge transformations',
      q: R`A vector potential in the Coulomb gauge is changed by the gauge function $\lambda = k(x^2 + y^2)$, $k$ a non-zero constant. The new $\vec A$`,
      options: [R`is still in the Coulomb gauge`, R`gives the same $\vec B$ but is no longer in the Coulomb gauge`, R`gives a different $\vec B$`, R`is automatically in the Lorenz gauge`], answer: 1,
      sol: R`$\vec A' = \vec A + \nabla\lambda$, so $\nabla\times\vec A' = \nabla\times\vec A$ (the curl of a gradient is zero): same $\vec B$. But $\nabla\cdot\vec A' = 0 + \nabla^2\lambda = 4k\ne0$. A gauge function keeps the Coulomb gauge only if it is harmonic.`,
      trap: R`Thinking any gauge change keeps the gauge condition; only $\nabla^2\lambda = 0$ preserves the Coulomb gauge.` },
    { id: 'pgx-r4-06', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'gauge transformations',
      q: R`In vacuum, the potentials are $\vec A = A_0\cos(kz - \omega t)\,\hat z$ and $V = cA_0\cos(kz - \omega t)$, with $\omega = ck$. They describe`,
      options: [R`a longitudinal electromagnetic wave travelling along $z$`, R`a transverse wave polarised along $x$`, R`no electric or magnetic field at all`, R`a static field along $z$`], answer: 2,
      sol: R`$\vec B = \nabla\times\vec A = 0$ because $A_z$ depends only on $z$. $\vec E = -\nabla V - \partial_t\vec A = \left[ckA_0\sin u - \omega A_0\sin u\right]\hat z = 0$ with $u = kz - \omega t$ and $\omega = ck$. The pair is pure gauge: it equals $\vec A = \nabla\lambda$, $V = -\partial_t\lambda$ with $\lambda = \frac{A_0}{k}\sin(kz - \omega t)$. It even satisfies the Lorenz condition, showing that "longitudinal" and "scalar" potential waves carry no fields.`,
      trap: R`Seeing a wave in the potentials and assuming a physical wave exists.` },
    { id: 'pgx-r4-07', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'gauge transformations',
      q: R`Which of these pairs of potentials give zero electric and magnetic fields everywhere (SI units, $x, y, z$ in m, $t$ in s)?`,
      options: [R`$V = 5$ V, $\vec A = 0$`, R`$V = -x$, $\vec A = t\,\hat x$`, R`$V = 0$, $\vec A = t\,\hat x$`, R`$V = 0$, $\vec A = yz\,\hat x + xz\,\hat y + xy\,\hat z$`],
      answer: [0, 1, 3],
      sol: R`A constant $V$ has no gradient. $V = -x$, $\vec A = t\hat x$ is the gauge transform of zero with $\lambda = xt$: $\vec E = \hat x - \hat x = 0$, $\vec B = 0$. The last $\vec A$ is $\nabla(xyz)$, whose curl is zero, and it is static. But $V = 0$, $\vec A = t\hat x$ gives $\vec E = -\partial_t\vec A = -\hat x$ V/m, a real uniform field.`,
      trap: R`Assuming a time-dependent $\vec A$ always means an electric field; only when it is not cancelled by $-\nabla V$.` },
    { id: 'pgx-r4-08', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'aharonov-bohm',
      q: R`Outside a long ideal solenoid carrying flux $\Phi$, $\vec B = 0$. Which statements are true?`,
      options: [R`$\vec A$ cannot be zero everywhere outside`, R`$\oint\vec A\cdot d\vec l = \Phi$ for every loop going once around the solenoid`, R`A gauge choice can make $\vec A = 0$ in the whole region outside`, R`In the Coulomb gauge, $\vec A = \dfrac{\Phi}{2\pi s}\hat\phi$ outside`],
      answer: [0, 1, 3],
      sol: R`By Stokes, the line integral of $\vec A$ around the solenoid is the flux inside, which is gauge invariant; so $\vec A$ cannot vanish all round the loop in any gauge. Locally $\vec A = \nabla\left(\frac{\Phi\phi}{2\pi}\right)$, but that function is multi-valued, so it cannot remove $\vec A$ from the whole (multiply connected) outside region. The symmetric choice is $\frac{\Phi}{2\pi s}\hat\phi$. This unremovable $\vec A$ is what electrons feel in the Aharonov-Bohm effect.`,
      trap: R`Concluding "$\vec B = 0$, so a gauge with $\vec A = 0$ exists"; that works only in a simply connected region.` },
    { id: 'pgx-r4-09', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'vector potential',
      q: R`A long solenoid has $2000$ turns per metre carrying $1.0$ A. In the Coulomb gauge, the magnitude of its vector potential inside, $0.50$ cm from the axis, is ______ $\times10^{-6}$ T m (two decimal places).`,
      answer: 6.28, tol: 0.03, unit: '×10⁻⁶ T m', calc: () => C.mu0 * 2000 * 1 * 0.005 / 2 * 1e6,
      sol: R`Inside, $B = \mu_0nI$ is uniform. Taking a circle of radius $s$ about the axis, $\oint\vec A\cdot d\vec l = 2\pi sA = B\pi s^2$, so $A = \frac{Bs}{2} = \frac{\mu_0nIs}{2} = \frac{1.257\times10^{-6}\times2000\times1.0\times0.0050}{2} = 6.28\times10^{-6}$ T m, azimuthal.`,
      trap: R`Using the outside formula $\Phi/(2\pi s)$ inside; inside, only the flux within radius $s$ counts.` },
    { id: 'pgx-r4-10', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'canonical momentum',
      q: R`An electron moves at $1.0\times10^6$ m/s in the $+\hat\phi$ direction at $1.0$ mm from the $z$ axis, in a uniform field $B = 1.0$ T along $+z$ described by $\vec A = \frac12\vec B\times\vec r$. Its canonical momentum component $p_\phi = mv_\phi + qA_\phi$ is ______ $\times10^{-23}$ kg m/s (two decimal places).`,
      answer: -7.92, tol: 0.02, unit: '×10⁻²³ kg m/s', calc: () => (C.me * 1e6 - C.e * 1 * 1e-3 / 2) * 1e23,
      sol: R`$A_\phi = \frac{Bs}{2} = \frac{1.0\times1.0\times10^{-3}}{2} = 5.0\times10^{-4}$ T m. With $q = -e$: $qA_\phi = -8.01\times10^{-23}$ kg m/s. The kinetic part is $mv = 9.11\times10^{-31}\times10^6 = 9.11\times10^{-25}$ kg m/s. Sum: $p_\phi = -7.92\times10^{-23}$ kg m/s: here the field term dominates, and it even has the opposite sign to the velocity. (Only $mv$ is gauge invariant.)`,
      trap: R`Using $+e$ for the electron's charge, or treating canonical and kinetic momentum as the same.` },
    { id: 'pgx-r4-11', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'gauge transformations',
      q: R`Potentials are changed by the gauge function $\lambda = 0.5\,xyt$ (SI units). At the point $(2, 3, 0)$ m and time $t = 4$ s, the magnitude of the change in $\vec A$ is ______ T m (two decimal places).`,
      answer: 7.21, tol: 0.02, unit: 'T m', calc: () => Math.hypot(0.5 * 3 * 4, 0.5 * 2 * 4),
      sol: R`$\Delta\vec A = \nabla\lambda = 0.5t\,(y\,\hat x + x\,\hat y)$. At $t = 4$, $x = 2$, $y = 3$: $\Delta\vec A = 2(3\hat x + 2\hat y) = 6\hat x + 4\hat y$, of size $\sqrt{36 + 16} = 7.21$ T m. (The scalar potential changes by $-\partial_t\lambda = -0.5xy = -3$ V there; the fields are unchanged.)`,
      trap: R`Differentiating with respect to $t$ for $\Delta\vec A$; that gives the change in $V$, not in $\vec A$.` },
    { id: 'pgx-r4-12', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'vector potential',
      q: R`A spherical shell of radius $10$ cm with uniform surface charge $1.0\ \mu$C/m² spins at $100$ rad/s about the $z$ axis. Inside, $\vec A = \frac{\mu_0R\sigma}{3}\vec\omega\times\vec r$. At a point in the equatorial plane $5.0$ cm from the centre, $|\vec A|$ is ______ $\times10^{-13}$ T m (two decimal places).`,
      answer: 2.09, tol: 0.02, unit: '×10⁻¹³ T m', calc: () => C.mu0 * 0.1 * 1e-6 / 3 * 100 * 0.05 * 1e13,
      sol: R`In the equatorial plane $\vec\omega\perp\vec r$, so $|\vec\omega\times\vec r| = \omega r = 100\times0.050 = 5.0$ m/s. Then $A = \frac{1.257\times10^{-6}\times0.10\times10^{-6}}{3}\times5.0 = 2.09\times10^{-13}$ T m. Its curl gives the uniform field inside, $\vec B = \frac23\mu_0\sigma R\vec\omega$.`,
      trap: R`Using the shell radius $R$ in $\vec\omega\times\vec r$ instead of the point's distance $r$.` },
  ],
  gens: [
    { id: 'pgx-r4g1', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'vector potential',
      make(r) {
        const n = int(r, 5, 40) * 100, I = choose(r, [0.5, 1, 2, 3, 5]), Rcm = int(r, 1, 4), f = choose(r, [0.25, 0.5, 2, 3]);
        const s = f * Rcm / 100, Rm = Rcm / 100, B = C.mu0 * n * I;
        const A = (s <= Rm ? B * s / 2 : B * Rm * Rm / (2 * s)) * 1e6;
        return { q: `A long solenoid of radius $${Rcm}$ cm has $${n}$ turns per metre carrying $${I}$ A. In the Coulomb gauge, the magnitude of its vector potential at $${round(s * 100, 2)}$ cm from the axis is ______ $\\times10^{-6}$ T m (three significant figures).`,
          answer: +A.toPrecision(3), tol: +(A * 0.006).toPrecision(2), unit: '×10⁻⁶ T m', n, I, Rcm, f,
          sol: `$B = \\mu_0nI = ${+(B).toPrecision(4)}$ T inside. Around a circle of radius $s$: $2\\pi sA = $ flux enclosed. ${s <= Rm ? `Inside ($s < R$): $A = Bs/2$` : `Outside ($s > R$): all the flux $B\\pi R^2$ is enclosed, so $A = BR^2/(2s)$`} $= ${+A.toPrecision(3)}\\times10^{-6}$ T m.`,
          trap: 'Inside, only the flux within radius $s$ counts; outside, the whole flux counts.' };
      },
      verify: (p) => { const s = p.f * p.Rcm / 100, Rm = p.Rcm / 100, B = C.mu0 * p.n * p.I; return (s <= Rm ? B * s / 2 : B * Rm * Rm / (2 * s)) * 1e6; } },
    { id: 'pgx-r4g2', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'gauge transformations',
      make(r) {
        const a = choose(r, [0.5, 1, 2, 3]), x = int(r, 1, 4), y = int(r, 1, 4), t = int(r, 1, 5), ask = r() < 0.5 ? 'A' : 'V';
        const val = ask === 'A' ? a * t * Math.hypot(y, x) : -a * x * y;
        return { q: `Potentials are changed by the gauge function $\\lambda = ${a}\\,xyt$ (SI units). At $(${x}, ${y}, 0)$ m and $t = ${t}$ s, ${ask === 'A' ? 'the magnitude of the change in $\\vec A$ is ______ T m' : 'the change in the scalar potential $V$ is ______ V'} (two decimal places).`,
          answer: round(val, 2), tol: 0.01, unit: ask === 'A' ? 'T m' : 'V', a, x, y, t, ask,
          sol: ask === 'A'
            ? `$\\Delta\\vec A = \\nabla\\lambda = ${a}t(y\\hat x + x\\hat y) = ${round(a * t * y, 3)}\\hat x + ${round(a * t * x, 3)}\\hat y$, of size $${round(val, 2)}$ T m.`
            : `$\\Delta V = -\\partial_t\\lambda = -${a}xy = ${round(val, 2)}$ V (it does not depend on $t$ here).`,
          trap: ask === 'A' ? 'The change in $\\vec A$ is the gradient of $\\lambda$.' : 'The scalar potential changes by MINUS the time derivative of $\\lambda$.' };
      },
      verify: (p) => (p.ask === 'A' ? p.a * p.t * Math.hypot(p.y, p.x) : -p.a * p.x * p.y) },
    { id: 'pgx-r4g3', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'canonical momentum',
      make(r) {
        const B = choose(r, [0.1, 0.5, 1, 2]), smm = choose(r, [0.1, 0.5, 1, 2]), v = choose(r, [1e5, 5e5, 1e6, 2e6]), sign = choose(r, [1, -1]);
        const p = (C.me * v * sign - C.e * B * smm * 1e-3 / 2) * 1e24;
        return { q: `An electron moves at $${v / 1e5}\\times10^5$ m/s in the ${sign > 0 ? '$+\\hat\\phi$' : '$-\\hat\\phi$'} direction, $${smm}$ mm from the $z$ axis, in a uniform field of $${B}$ T along $+z$ described by $\\vec A = \\frac12\\vec B\\times\\vec r$. Its canonical momentum $p_\\phi = mv_\\phi + qA_\\phi$ is ______ $\\times10^{-24}$ kg m/s (three significant figures).`,
          answer: +p.toPrecision(3), tol: Math.max(0.01, +Math.abs(p * 0.005).toPrecision(2)), unit: '×10⁻²⁴ kg m/s', B, smm, v, sign,
          sol: `$A_\\phi = Bs/2 = ${+(B * smm * 1e-3 / 2).toPrecision(3)}$ T m, so $qA_\\phi = -eA_\\phi = ${+(-C.e * B * smm * 1e-3 / 2 * 1e24).toPrecision(4)}\\times10^{-24}$; $mv_\\phi = ${+(C.me * v * sign * 1e24).toPrecision(4)}\\times10^{-24}$. Sum: $${+p.toPrecision(3)}\\times10^{-24}$ kg m/s.`,
          trap: 'The electron\'s charge is $-e$; canonical momentum includes $qA$.' };
      },
      verify: (p) => (C.me * p.v * p.sign - C.e * p.B * p.smm * 1e-3 / 2) * 1e24 },
  ],
};
