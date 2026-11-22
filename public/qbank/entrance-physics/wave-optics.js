// Wave optics: Plus Two entrance bank (original fibub questions).
import { pick, int, choose, fmt, shuffleOpts, numOpts } from '../_entrance.js';

const r = String.raw;
const EXB = {
  1: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'],
  2: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'],
  3: ['jee-main', 'neet', 'keam', 'comedk'],
  4: ['jee-main', 'jee-adv', 'neet'],
  5: ['jee-adv'],
};
const exs = (level, type) => (type === 'mcq' && level <= 3 ? [...EXB[level], 'cuet'] : EXB[level]);
const R = (x, dp) => +x.toFixed(dp);
const PI = Math.PI; const D2R = PI / 180; const sind = (a) => Math.sin(a * D2R); const asind = (x) => Math.asin(x) / D2R;
const mirV = (u, f) => 1 / (1 / f - 1 / u); // mirror: 1/v + 1/u = 1/f
const lensV = (u, f) => 1 / (1 / f + 1 / u); // lens: 1/v - 1/u = 1/f
let k = 0; let c = 0;
const nid = () => `wo-${String(++k).padStart(3, '0')}`;
const base = (level, sub, o) => ({ id: nid(), level, sub, ...o, exams: exs(level, o.type) });
const mcq = (level, sub, q, correct, wrongs, sol, o = {}) => {
  const pos = (c++ * 3 + 1) % 4; const options = [...wrongs]; options.splice(pos, 0, correct);
  return base(level, sub, { type: 'mcq', format: 'single', q, options, answer: pos, sol, ...o });
};
const nat = (level, sub, q, fn, tol, dp, sol, o = {}) => {
  const answer = +fn().toFixed(dp);
  return base(level, sub, { type: 'nat', format: tol === 0 ? 'integer' : 'numeric', q, answer, tol, calc: () => answer, sol, ...o });
};
const msq = (level, sub, q, options, answer, sol, o = {}) =>
  base(level, sub, { type: 'msq', format: 'multi', q, options, answer, sol, ...o });
const AOPT = [
  'Both A and R are true and R is the correct explanation of A',
  'Both A and R are true but R is not the correct explanation of A',
  'A is true but R is false',
  'A is false but R is true',
];
const asrt = (level, sub, A, Rr, answer, sol, o = {}) =>
  base(level, sub, { type: 'mcq', format: 'assertion', q: `<b>Assertion (A):</b> ${A}<br><b>Reason (R):</b> ${Rr}`, options: AOPT, answer, sol, ...o });
const SOPT = [
  'Both Statement I and Statement II are true',
  'Both Statement I and Statement II are false',
  'Statement I is true but Statement II is false',
  'Statement I is false but Statement II is true',
];
const stm = (level, sub, I, II, answer, sol, o = {}) =>
  base(level, sub, { type: 'mcq', format: 'statements', q: `<b>Statement I:</b> ${I}<br><b>Statement II:</b> ${II}`, options: SOPT, answer, sol, ...o });
const MOPT = ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-r, B-q, C-p, D-s'];
const mat = (level, sub, group, q, answer, sol, o = {}) =>
  base(level, sub, { type: 'mcq', format: 'match', group, q, options: MOPT, answer, sol, ...o });
const pas = (level, sub, group, q, fn, tol, dp, sol, o = {}) => {
  const answer = +fn().toFixed(dp);
  return base(level, sub, { type: 'nat', format: 'passage', group, q, answer, tol, calc: () => answer, sol, ...o });
};
const items = [];
// ---------- Level 1 ----------
items.push(
  mcq(1, 'Huygens principle', r`According to Huygens' principle, every point on a wavefront acts as`, 'a source of secondary wavelets', ['a source of electrons', 'a perfect absorber of the wave', 'a point where the wave stops'],
    r`Each point of a wavefront sends out spherical secondary wavelets. The new wavefront, a moment later, is the common tangent (envelope) of these wavelets.`),
  mcq(1, 'wavefronts', r`The wavefront from a point source in a uniform medium is`, 'spherical', ['plane', 'cylindrical', 'parabolic'],
    r`The wave spreads equally in all directions, so points at equal distance from the source are in phase. These points lie on a sphere.`),
  mcq(1, 'wavefronts', r`Light from a very distant star arrives at the Earth as a nearly`, 'plane wavefront', ['spherical wavefront with a small radius', 'cylindrical wavefront', 'wavefront of zero area'],
    r`A small part of a very large sphere is almost flat, so the wavefront is plane to a very good approximation.`),
  mcq(1, 'interference', r`Two sources give a steady interference pattern only if they are`, 'coherent', ['of different frequencies', 'of different amplitudes only', 'of different colours'],
    r`Coherent sources keep a constant phase difference. Then the intensity pattern stays fixed in time. Two separate bulbs are incoherent, since their phases change randomly every $10^{-8}$ s or so.`),
  mcq(1, 'interference', r`Constructive interference of two waves of wavelength $\lambda$ occurs when their path difference is`, r`$n\lambda$ ($n=0,1,2,\ldots$)`, [r`$(n+\tfrac12)\lambda$`, r`$\dfrac{n\lambda}{4}$ for odd $n$ only`, r`$\dfrac{(2n+1)\lambda}{4}$`],
    r`A path difference of a whole number of wavelengths means a phase difference of $2n\pi$: the crests meet crests. A half-integer number gives destructive interference.`),
  nat(1, 'YDSE', r`In Young's double slit experiment $\lambda=600$ nm, $D=1$ m and $d=1$ mm. Find the fringe width (in mm).`, () => 600e-9 * 1 / 1e-3 * 1e3, 0.01, 2,
    r`$\beta=\dfrac{\lambda D}{d}=\dfrac{600\times10^{-9}\times1}{10^{-3}}=6\times10^{-4}$ m $=0.6$ mm.`, { unit: 'mm' }),
  mcq(1, 'polarisation', r`The phenomenon that shows light is a transverse wave is`, 'polarisation', ['interference', 'diffraction', 'refraction'],
    r`Interference, diffraction and refraction occur for longitudinal waves too (sound). Only transverse waves can be polarised.`),
  mcq(1, 'diffraction', r`Diffraction of light by a slit is most noticeable when the slit width is`, 'comparable to the wavelength of light', ['much larger than the wavelength', 'much smaller than the wavelength, with no light passing', 'exactly 1 m'],
    r`The spreading angle is about $\lambda/a$. It is large only when $a$ is of the order of $\lambda$. For a very wide slit light seems to travel in straight lines.`),
  nat(1, 'Brewster angle', r`Find the polarising (Brewster) angle for glass of refractive index $\sqrt3$ (in degrees).`, () => Math.atan(Math.sqrt(3)) / D2R, 0, 0,
    r`$\tan\theta_B=n=\sqrt3$, so $\theta_B=60°$.`, { unit: '°' }),
  mcq(1, 'polarisation', r`Unpolarised light of intensity $I_0$ passes through an ideal polaroid. The transmitted intensity is`, r`$I_0/2$`, [r`$I_0$`, r`$I_0/4$`, r`zero`],
    r`The light's vibrations are random in all directions. On average half the intensity lies along the polaroid's axis.`),
  nat(1, 'Malus law', r`Plane polarised light of intensity 80 $\mathrm{W\,m^{-2}}$ falls on a polaroid whose axis makes $60°$ with the plane of polarisation. Find the transmitted intensity (in $\mathrm{W\,m^{-2}}$).`, () => 80 * Math.cos(60 * D2R) ** 2, 0, 0,
    r`Malus's law: $I=I_0\cos^2\theta=80\times\cos^260°=80\times\dfrac14=20\ \mathrm{W\,m^{-2}}$.`, { unit: 'W/m²' }),
  mcq(1, 'YDSE', r`The whole Young's double slit apparatus is immersed in water. The fringe width`, 'decreases', ['increases', 'stays the same', 'becomes infinite'],
    r`In water the wavelength becomes $\lambda/n$, so $\beta=\dfrac{(\lambda/n)D}{d}$ is smaller by the factor $n$.`),
  mcq(1, 'YDSE', r`In Young's experiment with monochromatic light the fringe at the centre of the screen (equidistant from both slits) is`, 'bright', ['dark', 'coloured', 'half bright'],
    r`Both waves travel equal distances, so the path difference is zero and they arrive in phase: a bright fringe.`),
  mcq(1, 'refraction by Huygens', r`When a wave passes from air into glass, which quantity stays unchanged?`, 'frequency', ['wavelength', 'speed', 'direction of the wavefront in all cases'],
    r`The source fixes the frequency. The speed drops to $c/n$ and the wavelength to $\lambda/n$. (The direction changes except at normal incidence.)`),
  nat(1, 'path difference', r`Light of wavelength 500 nm undergoes destructive interference at a point with the smallest nonzero path difference. Find that path difference (in nm).`, () => 500 / 2, 0, 0,
    r`Destructive interference needs $\Delta=(n+\tfrac12)\lambda$. The smallest is $\lambda/2=250$ nm.`, { unit: 'nm' }),
  mcq(1, 'thin films', r`The colours seen on a soap bubble or an oil film on water are due to`, 'interference of light reflected from the two surfaces of the film', ['dispersion by the water', 'polarisation of light', 'diffraction by the bubble edges'],
    r`Light reflected from the top and bottom surfaces of the thin film interferes. Different wavelengths are strengthened at different thicknesses and viewing angles, giving colours.`),
  mcq(1, 'diffraction', r`In the single slit diffraction pattern, the central maximum is`, 'the brightest and widest', ['dark', 'as wide as the other maxima', 'the narrowest'],
    r`The central maximum has twice the width of the others, $2\lambda D/a$, and carries most of the light.`),
  nat(1, 'phase difference', r`A path difference of $\lambda/4$ corresponds to what phase difference (in degrees)?`, () => 360 / 4, 0, 0,
    r`$\phi=\dfrac{2\pi}{\lambda}\Delta=\dfrac{2\pi}{\lambda}\cdot\dfrac\lambda4=\dfrac\pi2=90°$.`, { unit: '°' }),
  mcq(1, 'polarisation', r`Which of these waves cannot be polarised?`, 'sound waves in air', ['light waves', 'radio waves', 'X-rays'],
    r`Sound in air is longitudinal, so the vibration is always along the direction of travel and there is no direction to restrict. Light, radio waves and X-rays are transverse electromagnetic waves.`),
  mcq(1, 'interference', r`Two independent sodium lamps do not show interference fringes because`, 'they are not coherent sources', ['their light has no wavelength', 'light never interferes', 'they emit different speeds of light'],
    r`Atoms emit light in short bursts with random phases, so the phase difference between two lamps varies randomly. The fringes shift too quickly to be seen.`),
);
// ---------- Level 2 ----------
const beta = (lam, D, d) => lam * D / d; // metres
items.push(
  nat(2, 'YDSE', r`In a double slit experiment the slits are 0.3 mm apart and the screen is 1.2 m away. The fringe width is found to be 2 mm. Find the wavelength of light (in nm).`, () => 2e-3 * 0.3e-3 / 1.2 * 1e9, 0, 0,
    r`$\lambda=\dfrac{\beta d}{D}=\dfrac{2\times10^{-3}\times0.3\times10^{-3}}{1.2}=5\times10^{-7}$ m $=500$ nm.`, { unit: 'nm' }),
  nat(2, 'YDSE', r`In Young's experiment $\lambda=600$ nm, $D=1.5$ m and $d=0.45$ mm. Find the distance of the third bright fringe from the central maximum (in mm).`, () => 3 * beta(600e-9, 1.5, 0.45e-3) * 1e3, 0, 0,
    r`$y_n=\dfrac{n\lambda D}{d}$. $y_3=3\times\dfrac{600\times10^{-9}\times1.5}{0.45\times10^{-3}}=3\times2\times10^{-3}=6\times10^{-3}$ m $=6$ mm.`, { unit: 'mm' }),
  nat(2, 'YDSE', r`With $\lambda=500$ nm, $D=1$ m and $d=0.5$ mm, find the distance of the second dark fringe from the centre (in mm, counting the first dark fringe as the one nearest the centre).`, () => 1.5 * beta(500e-9, 1, 0.5e-3) * 1e3, 0.01, 2,
    r`Dark fringes lie at $y=(n-\tfrac12)\beta$ for $n=1,2,\ldots$ (the first dark fringe is at $\beta/2$). Here $\beta=1$ mm, so the second is at $1.5$ mm.`, { unit: 'mm', trap: 'The first dark fringe is at half a fringe width, not at one.' }),
  nat(2, 'YDSE in a medium', r`A double slit experiment in air gives a fringe width of 1.2 mm. The whole set-up is then put in water ($n=4/3$). Find the new fringe width (in mm).`, () => 1.2 / (4 / 3), 0.01, 2,
    r`$\beta'=\beta/n=1.2\times\dfrac34=0.9$ mm.`, { unit: 'mm' }),
  nat(2, 'YDSE', r`Fringes in a double slit experiment appear 4 mm apart on a screen 2 m from the slits with light of wavelength 640 nm. Find the slit separation (in mm, 2 decimals).`, () => 640e-9 * 2 / 4e-3 * 1e3, 0.01, 2,
    r`$d=\dfrac{\lambda D}{\beta}=\dfrac{640\times10^{-9}\times2}{4\times10^{-3}}=3.2\times10^{-4}$ m $=0.32$ mm.`, { unit: 'mm' }),
  nat(2, 'YDSE', r`In a double slit experiment the screen is 1 m from the slits. A point on the screen is 2 mm from the central fringe and the slits are 0.5 mm apart. Find the path difference at that point (in nm).`, () => 0.5e-3 * 2e-3 / 1 * 1e9, 0, 0,
    r`$\Delta=\dfrac{yd}{D}=\dfrac{2\times10^{-3}\times0.5\times10^{-3}}{1}=10^{-6}$ m $=1000$ nm.`, { unit: 'nm' }),
  nat(2, 'intensity in interference', r`Two coherent waves, each of intensity $I_0$, interfere constructively at a point. Find the resultant intensity there (in units of $I_0$).`, () => 4, 0, 0,
    r`At a maximum the amplitudes add: $A=2a$, so $I\propto A^2=4a^2$. The resultant intensity is $4I_0$.`, { trap: 'Constructive interference of two equal waves gives four times, not twice, the single intensity.' }),
  nat(2, 'intensity in interference', r`Two coherent sources of equal intensity produce a maximum intensity $I_m$. Find the intensity (as a fraction of $I_m$, 2 decimals) at a point where the phase difference is $120°$.`, () => Math.cos(60 * D2R) ** 2, 0.01, 2,
    r`$I=I_m\cos^2(\phi/2)=I_m\cos^260°=\dfrac14I_m=0.25I_m$.`),
  nat(2, 'intensity ratio', r`Two coherent sources have intensity ratio $9:1$. Find $I_{max}/I_{min}$.`, () => ((3 + 1) / (3 - 1)) ** 2, 0, 0,
    r`Amplitude ratio $=\sqrt9:\sqrt1=3:1$. $\dfrac{I_{max}}{I_{min}}=\dfrac{(3+1)^2}{(3-1)^2}=\dfrac{16}4=4$.`),
  nat(2, 'thin films', r`A soap film ($n=1.5$) in air is viewed in reflected light of wavelength 600 nm. Find the smallest thickness (in nm) at which it appears bright.`, () => 600 / (4 * 1.5), 0, 0,
    r`Reflection at the top surface (air to film) gives a $\pi$ phase change; at the bottom (film to air) none. The condition for brightness is $2nt=(m+\tfrac12)\lambda$. For $m=0$: $t=\dfrac{\lambda}{4n}=\dfrac{600}{6}=100$ nm.`, { unit: 'nm', trap: 'The extra half-wavelength from the phase change turns the usual conditions round.' }),
  nat(2, 'single slit diffraction', r`Light of wavelength 500 nm falls on a slit 0.2 mm wide. Find the angle of the first minimum (in milliradians, 1 decimal).`, () => 500e-9 / 0.2e-3 * 1e3, 0.1, 1,
    r`$a\sin\theta=\lambda$, so $\theta\approx\dfrac\lambda a=\dfrac{500\times10^{-9}}{0.2\times10^{-3}}=2.5\times10^{-3}$ rad $=2.5$ mrad.`, { unit: 'mrad' }),
  nat(2, 'single slit diffraction', r`Light of wavelength 600 nm passes through a slit 0.3 mm wide. A screen is 2 m away. Find the width of the central maximum (in mm).`, () => 2 * 600e-9 * 2 / 0.3e-3 * 1e3, 0, 0,
    r`Width $=\dfrac{2\lambda D}{a}=\dfrac{2\times600\times10^{-9}\times2}{0.3\times10^{-3}}=8\times10^{-3}$ m $=8$ mm.`, { unit: 'mm' }),
  nat(2, 'resolving power', r`A telescope has an objective of diameter 10 cm. Find its limit of resolution for light of wavelength 550 nm (in microradians, 1 decimal).`, () => 1.22 * 550e-9 / 0.1 * 1e6, 0.1, 1,
    r`$\Delta\theta=\dfrac{1.22\lambda}{D}=\dfrac{1.22\times550\times10^{-9}}{0.1}=6.7\times10^{-6}$ rad $=6.7\ \mu$rad.`, { unit: 'μrad' }),
  nat(2, 'Malus law', r`Unpolarised light of intensity 100 units passes through two ideal polaroids whose axes make $45°$ with each other. Find the final intensity.`, () => 100 / 2 * Math.cos(45 * D2R) ** 2, 0, 0,
    r`After the first polaroid: $50$. After the second: $50\cos^245°=50\times\tfrac12=25$.`),
  nat(2, 'Brewster angle', r`Find the Brewster angle for glass of refractive index 1.5 (in degrees, 1 decimal).`, () => Math.atan(1.5) / D2R, 0.1, 1,
    r`$\tan\theta_B=n=1.5$, so $\theta_B=56.3°$.`, { unit: '°' }),
  nat(2, 'Brewster angle', r`Light is incident on glass at the Brewster angle. The reflected ray is completely polarised. Find the angle between the reflected ray and the refracted ray (in degrees).`, () => 90, 0, 0,
    r`At the polarising angle the reflected and refracted rays are perpendicular: $\theta_B+r=90°$, so the angle between the rays is $90°$.`, { unit: '°' }),
  nat(2, 'YDSE with a slab', r`A thin transparent sheet ($n=1.5$, thickness 10 $\mu$m) covers one slit of a double slit experiment ($D=1$ m, $d=1$ mm). Find the shift of the central fringe (in mm).`, () => (1.5 - 1) * 10e-6 * 1 / 1e-3 * 1e3, 0, 0,
    r`Shift $=\dfrac{(n-1)tD}{d}=\dfrac{0.5\times10\times10^{-6}\times1}{10^{-3}}=5\times10^{-3}$ m $=5$ mm, towards the covered slit.`, { unit: 'mm' }),
  nat(2, 'YDSE with a slab', r`In the experiment above ($\lambda=500$ nm), by how many fringe widths does the pattern shift when a sheet with $(n-1)t=5\ \mu$m covers one slit?`, () => 5e-6 / 500e-9, 0, 0,
    r`Number of fringes shifted $=\dfrac{(n-1)t}{\lambda}=\dfrac{5\times10^{-6}}{500\times10^{-9}}=10$.`),
  nat(2, 'Huygens principle', r`The speed of light in a liquid is $2.25\times10^8\ \mathrm{m\,s^{-1}}$. Find its refractive index (3 decimals; $c=3\times10^8\ \mathrm{m\,s^{-1}}$).`, () => 3 / 2.25, 0.001, 3,
    r`$n=\dfrac cv=\dfrac{3}{2.25}=1.333$.`),
  nat(2, 'Huygens principle', r`Light of wavelength 540 nm in vacuum enters glass of $n=1.5$. Find its wavelength in the glass (in nm).`, () => 540 / 1.5, 0, 0,
    r`The frequency is fixed. $\lambda'=\lambda/n=540/1.5=360$ nm.`, { unit: 'nm' }),
  mcq(2, 'YDSE', r`In a double slit experiment, if the distance between the slits is doubled while all else is unchanged, the fringe width`, 'is halved', ['is doubled', 'stays the same', 'becomes four times'],
    r`$\beta=\lambda D/d$, so $\beta\propto1/d$.`),
  mcq(2, 'YDSE', r`In Young's experiment with white light the central fringe is`, 'white, with coloured fringes on both sides', ['dark', 'red', 'blue'],
    r`At the centre all wavelengths have zero path difference and they add to white. Away from the centre each colour has its own fringe width ($\beta\propto\lambda$), so the fringes are coloured, with violet nearest the centre and red farthest.`),
  mcq(2, 'diffraction', r`When the slit width in a single slit diffraction experiment is made smaller, the central maximum becomes`, 'wider', ['narrower', 'unchanged', 'invisible'],
    r`The angular half-width is $\lambda/a$, so a narrower slit spreads the light through a larger angle.`),
  mcq(2, 'interference', r`If one of the two slits in Young's experiment is covered, the screen shows`, 'a single slit diffraction pattern with uniform-looking illumination near the centre and no fringes', ['no light at all', 'fringes of twice the width', 'dark fringes only'],
    r`Interference needs two beams. With one slit blocked there is no interference, only a single slit diffraction pattern.`),
  mcq(2, 'polarisation', r`Light reflected from a water surface at the Brewster angle is`, 'completely plane polarised, with the vibrations parallel to the surface', ['unpolarised', 'plane polarised with the vibrations in the plane of incidence', 'circularly polarised'],
    r`At $\theta_B$ no light with vibrations in the plane of incidence is reflected, so the reflected light has only the vibrations perpendicular to the plane of incidence, i.e. parallel to the surface (this is why polaroid sunglasses cut glare).`),
  mcq(2, 'thin films', r`A thin film of oil on water looks coloured in white light. If the film is made very much thicker than the wavelength of light (several hundred wavelengths), the colours`, 'disappear', ['become more vivid', 'turn to a single colour', 'stay unchanged'],
    r`For a thick film many wavelengths fulfil the condition at once, and the order of interference changes quickly with wavelength, so the colours blur out to white light.`),
  mcq(2, 'Huygens principle', r`According to Huygens' construction, the new position of a wavefront is`, 'the envelope of the secondary wavelets', ['the line joining the centres of the wavelets', 'the circle through the sources of the wavelets', 'the point where the wavelets end'],
    r`The common tangent to the secondary wavelets in the forward direction gives the new wavefront.`),
);
// ---------- Level 3 ----------
const countIn = (list, lo = 400, hi = 700) => list.filter((x) => x >= lo - 1e-9 && x <= hi + 1e-9).length;
items.push(
  nat(3, 'intensity ratio', r`The two slits of a double slit set-up produce waves of intensities $I_0$ and $4I_0$ at a point on the screen. Find $I_{max}/I_{min}$.`, () => ((1 + 2) / (2 - 1)) ** 2, 0, 0,
    r`Amplitudes are in the ratio $1:2$. $I_{max}\propto(1+2)^2=9$ and $I_{min}\propto(2-1)^2=1$. Ratio $=9$.`, { trap: 'Add amplitudes, not intensities, before squaring.' }),
  nat(3, 'YDSE', r`The slits of a double slit experiment are 2 $\mu$m apart and light of wavelength 500 nm is used. Find the total number of bright fringes (maxima, including the central one) that can be seen on a very wide screen.`, () => 2 * Math.floor(2000 / 500 - 1e-9) + 1, 0, 0,
    r`Maxima need $d\sin\theta=m\lambda$ with $\sin\theta<1$, so $m<d/\lambda=4$. The orders $m=0,\pm1,\pm2,\pm3$ are visible: $2\times3+1=7$. The fourth order would need $\theta=90°$ and is not seen.`, { trap: 'The order $m=d/\lambda$ exactly lies at $90°$ and cannot be observed on the screen.' }),
  nat(3, 'YDSE', r`In a double slit experiment with $\lambda=600$ nm and slit separation 0.3 mm, find the angular fringe width (in milliradians, 1 decimal).`, () => 600e-9 / 0.3e-3 * 1e3, 0.1, 1,
    r`$\dfrac\beta D=\dfrac\lambda d=\dfrac{600\times10^{-9}}{0.3\times10^{-3}}=2\times10^{-3}$ rad $=2.0$ mrad.`, { unit: 'mrad' }),
  nat(3, 'anti-reflection coating', r`A lens ($n=1.5$) carries a coating of magnesium fluoride ($n=1.38$) to reduce reflection of light of wavelength 550 nm at normal incidence. Find the smallest thickness of coating (in nm, 1 decimal).`, () => 550 / (4 * 1.38), 0.1, 1,
    r`Both reflections (air to coating, coating to glass) are from a lower to a higher index, so both have a $\pi$ phase change. Cancellation needs $2nt=\dfrac\lambda2$, so $t=\dfrac\lambda{4n}=\dfrac{550}{4\times1.38}=99.6$ nm.`, { unit: 'nm', trap: 'When both reflections shift by $\\pi$, the usual rule for dark and bright swaps back.' }),
  nat(3, 'wedge', r`Two glass plates form an air wedge of angle $2\times10^{-4}$ rad. They are lit from above by light of wavelength 600 nm. Find the distance between neighbouring dark fringes (in mm, 2 decimals).`, () => 600e-9 / (2 * 2e-4) * 1e3, 0.01, 2,
    r`Neighbouring dark fringes differ in air thickness by $\lambda/2$. Spacing $=\dfrac{\lambda/2}{\theta}=\dfrac{300\times10^{-9}}{2\times10^{-4}}=1.5\times10^{-3}$ m $=1.50$ mm.`, { unit: 'mm' }),
  nat(3, 'Newton rings', r`In a Newton's rings arrangement the lens has radius of curvature 90 cm and the light has wavelength 500 nm. Find the radius of the 4th dark ring seen in reflection (in mm, 2 decimals).`, () => Math.sqrt(4 * 500e-9 * 0.9) * 1e3, 0.01, 2,
    r`For dark rings in reflection $r_m^2=m\lambda R$. $r_4=\sqrt{4\times500\times10^{-9}\times0.9}=\sqrt{1.8\times10^{-6}}=1.34\times10^{-3}$ m $=1.34$ mm.`, { unit: 'mm' }),
  nat(3, 'polaroids', r`Unpolarised light of intensity 160 units falls on a polaroid. A second polaroid at $90°$ to the first has a third polaroid placed between them, with its axis at $45°$ to both. Find the final intensity.`, () => 160 / 2 * Math.cos(45 * D2R) ** 2 * Math.cos(45 * D2R) ** 2, 0, 0,
    r`After the first: $80$. After the middle one: $80\cos^245°=40$. After the last (at $45°$ to the middle): $40\cos^245°=20$. Without the middle one the answer would be zero.`),
  nat(3, 'Malus law', r`Plane polarised light of intensity 64 units passes through a polaroid at $30°$ to its plane of polarisation, then through a second polaroid turned a further $30°$. Find the final intensity.`, () => 64 * Math.cos(30 * D2R) ** 4, 0, 0,
    r`$I=64\cos^230°\cdot\cos^230°=64\times\dfrac34\times\dfrac34=36$.`),
  nat(3, 'refraction by Huygens', r`Light travels at $3\times10^8\ \mathrm{m\,s^{-1}}$ in medium 1 and $2\times10^8\ \mathrm{m\,s^{-1}}$ in medium 2. A plane wavefront meets the boundary at an angle of incidence $30°$. Find the angle of refraction (in degrees, 1 decimal).`, () => asind(sind(30) * 2 / 3), 0.1, 1,
    r`From Huygens' construction $\dfrac{\sin i}{\sin r}=\dfrac{v_1}{v_2}$. $\sin r=\sin30°\times\dfrac23=0.3333$, so $r=19.5°$.`, { unit: '°' }),
  nat(3, 'Brewster angle', r`Light is incident on a transparent plate at the polarising angle. The angle of refraction is $30°$. Find the refractive index of the plate (2 decimals).`, () => Math.tan(60 * D2R), 0.01, 2,
    r`At the polarising angle $\theta_B+r=90°$, so $\theta_B=60°$. $n=\tan\theta_B=\tan60°=1.73$.`),
  nat(3, 'single slit diffraction', r`A slit is 3 wavelengths wide. Find the angle of the first minimum (in degrees, 1 decimal).`, () => asind(1 / 3), 0.1, 1,
    r`$a\sin\theta=\lambda$, so $\sin\theta=\dfrac\lambda{3\lambda}=\dfrac13$ and $\theta=19.5°$. (The small-angle approximation is not good here.)`, { unit: '°' }),
  nat(3, 'single slit diffraction', r`A slit is 5 wavelengths wide. How many minima in all (both sides) appear in its diffraction pattern?`, () => 2 * 4, 0, 0,
    r`Minima need $a\sin\theta=m\lambda$, so $\sin\theta=m/5<1$ gives $m=1,2,3,4$ on each side. Total $=8$. ($m=5$ would be at $90°$.)`),
  nat(3, 'Fresnel distance', r`A beam passes through a slit of width 2 mm and light of wavelength 500 nm. Find the Fresnel distance $a^2/\lambda$ up to which the beam spreads little (in m).`, () => (2e-3) ** 2 / 500e-9, 0, 0,
    r`$z_F=\dfrac{a^2}{\lambda}=\dfrac{(2\times10^{-3})^2}{500\times10^{-9}}=\dfrac{4\times10^{-6}}{5\times10^{-7}}=8$ m.`, { unit: 'm' }),
  nat(3, 'intensity in interference', r`In a double slit experiment, light of wavelength 500 nm, slit separation 1 mm and screen distance 2 m are used. Find $I/I_{max}$ at a point 0.25 mm from the central fringe (2 decimals).`, () => Math.cos(Math.PI * (1e-3 * 0.25e-3 / 2) / 500e-9) ** 2, 0.01, 2,
    r`$\Delta=\dfrac{yd}{D}=\dfrac{0.25\times10^{-3}\times10^{-3}}{2}=1.25\times10^{-7}$ m $=125$ nm $=\lambda/4$. $\phi=90°$, $I/I_{max}=\cos^2(\phi/2)=\cos^245°=0.50$.`),
  nat(3, 'Lloyd mirror', r`In a Lloyd's mirror arrangement a narrow slit is 1 mm above the plane of the mirror, and the screen is 1 m away. Find the fringe width for light of 600 nm (in mm, 2 decimals).`, () => 600e-9 * 1 / (2 * 1e-3) * 1e3, 0.01, 2,
    r`The slit and its image in the mirror act as two sources $d=2h=2$ mm apart. $\beta=\dfrac{\lambda D}{d}=\dfrac{600\times10^{-9}\times1}{2\times10^{-3}}=3\times10^{-4}$ m $=0.30$ mm.`, { unit: 'mm' }),
  nat(3, 'polaroids', r`Unpolarised light passes through a polaroid, then through a second one. The final intensity is $1/8$ of the original. Find the angle between the two axes (in degrees).`, () => Math.acos(Math.sqrt(2 / 8)) / D2R, 0, 0,
    r`$I=\dfrac{I_0}2\cos^2\theta=\dfrac{I_0}8$, so $\cos^2\theta=\dfrac14$, $\cos\theta=\dfrac12$, $\theta=60°$.`, { unit: '°' }),
  nat(3, 'single slit diffraction', r`A single slit of unknown width is lit by light of wavelength 500 nm. On a screen 1 m away the central maximum is 2 mm wide. Find the slit width (in mm).`, () => 2 * 500e-9 * 1 / 2e-3 * 1e3, 0.01, 2,
    r`Width $=\dfrac{2\lambda D}{a}$, so $a=\dfrac{2\lambda D}{\text{width}}=\dfrac{2\times500\times10^{-9}\times1}{2\times10^{-3}}=5\times10^{-4}$ m $=0.5$ mm.`, { unit: 'mm' }),
  mcq(3, 'coherent sources', r`Coherent sources can be obtained from a single source by dividing the wavefront, as in Young's experiment, or by dividing the amplitude, as in`, 'a thin film', ['a single slit', 'a polaroid', 'a prism in minimum deviation'],
    r`In a thin film one beam is split into a reflected part from the top surface and a transmitted part that reflects from the bottom: the amplitude (intensity) is divided. Young's slits divide the wavefront.`),
  mcq(3, 'diffraction', r`The width of a slit in a single slit experiment is doubled. The intensity at the centre of the pattern and the width of the central maximum change to`, 'four times and half', ['two times and half', 'four times and double', 'the same and half'],
    r`The central amplitude is proportional to the slit width $a$, so $I\propto a^2$ becomes four times. The width of the central maximum $2\lambda D/a$ is halved. (Total power through the slit only doubles, being spread over a narrower pattern.)`, { trap: 'The central intensity grows as the square of the width.' }),
  mcq(3, 'YDSE', r`In a double slit experiment the source slit is moved a little upwards, keeping the other things fixed. The central bright fringe on the screen`, 'shifts downwards', ['shifts upwards', 'stays at the same place', 'disappears'],
    r`The central fringe is where the paths from the source through the two slits to the point are equal. If the source moves up, the point must move down to keep the paths equal.`),
  mcq(3, 'YDSE', r`In Young's experiment a red filter is replaced by a blue filter, keeping everything else the same. The fringe width`, 'decreases', ['increases', 'stays the same', 'first increases then decreases'],
    r`$\beta=\lambda D/d$ and $\lambda_{blue}<\lambda_{red}$.`),
  mcq(3, 'Lloyd mirror', r`In a Lloyd's mirror experiment, with the screen touching the edge of the mirror, the fringe at the edge of the mirror is`, 'dark', ['bright', 'coloured', 'not formed at all'],
    r`The beam reflected from the mirror suffers a phase change of $\pi$, but the direct beam does not. At zero geometric path difference there is a $\lambda/2$ difference: a dark fringe.`, { trap: 'In Young\'s experiment the centre is bright; in Lloyd\'s mirror it is dark.' }),
);
// ---------- Level 4 and 5 ----------
const midx = (lo, hi, f) => { const out = []; for (let m = 1; m < 200; m++) { const x = f(m); if (x >= lo && x <= hi) out.push(x); } return out; };
items.push(
  nat(4, 'white light YDSE', r`In a double slit experiment with white light (400 nm to 700 nm), a point on the screen has a path difference of 1500 nm. How many wavelengths in the visible range are missing (dark) at that point?`, () => midx(400, 700, (m) => 2 * 1500 / (2 * m - 1)).length, 0, 0,
    r`Darkness needs $\Delta=(m-\tfrac12)\lambda$, so $\lambda=\dfrac{2\Delta}{2m-1}=\dfrac{3000}{2m-1}$ nm. For $m=1,2,3,4,5$: 3000, 1000, 600, 428.6, 333. Only 600 nm and 428.6 nm lie in 400 to 700 nm. So 2 wavelengths are missing.`, { trap: 'List the wavelengths first and then keep only those inside the visible range.' }),
  nat(4, 'white light YDSE', r`At a point on the screen the path difference is 1800 nm. How many visible wavelengths (400 nm to 700 nm) are strongly bright there?`, () => midx(400, 700, (m) => 1800 / m).length, 0, 0,
    r`Brightness needs $\Delta=m\lambda$, so $\lambda=\dfrac{1800}m$ nm: $m=2$: 900, $m=3$: 600, $m=4$: 450, $m=5$: 360. Within 400 to 700 nm: 600 and 450. So 2.`),
  nat(4, 'YDSE with a slab', r`A thin glass plate of $n=1.5$ is placed over one slit of a double slit set-up, and the central bright fringe moves to the position of the 6th bright fringe of the earlier pattern ($\lambda=600$ nm). Find the thickness of the plate (in $\mu$m, 1 decimal).`, () => 6 * 0.6 / 0.5, 0.1, 1,
    r`Shift in fringes $=\dfrac{(n-1)t}{\lambda}=6$, so $t=\dfrac{6\lambda}{n-1}=\dfrac{6\times0.6\ \mu\mathrm m}{0.5}=7.2\ \mu$m.`, { unit: 'μm' }),
  nat(4, 'YDSE', r`In a double slit experiment the source slit is 0.5 m from the plane of the two slits and the screen is 2 m beyond it. The source slit is moved 0.2 mm upwards. Find the shift of the central fringe on the screen (in mm, taking downwards as positive).`, () => 0.2 * 2 / 0.5, 0.01, 2,
    r`If the source moves up by $s$, the central fringe moves down by $s\dfrac{D}{a}$, where $a$ is the source-to-slit distance. Shift $=0.2\times\dfrac{2}{0.5}=0.8$ mm downwards.`, { unit: 'mm' }),
  nat(4, 'YDSE', r`Light of wavelengths 500 nm and 600 nm is used together in a double slit experiment with $D=1$ m and $d=1$ mm. Find the distance from the centre of the nearest point (other than the centre) where a bright fringe of one colour falls exactly on a bright fringe of the other (in mm).`, () => 6 * 500e-9 * 1 / 1e-3 * 1e3, 0, 0,
    r`Coincidence needs $n_1\lambda_1=n_2\lambda_2$: $500n_1=600n_2$, so $n_1:n_2=6:5$. Smallest: $n_1=6$, $n_2=5$. $y=\dfrac{6\times500\times10^{-9}\times1}{10^{-3}}=3\times10^{-3}$ m $=3$ mm.`, { unit: 'mm' }),
  nat(4, 'thin films', r`A soap film ($n=1.33$) of thickness 500 nm in air is lit with white light at normal incidence. How many wavelengths in the visible range (400 nm to 700 nm) are strongly reflected?`, () => midx(400, 700, (m) => 2 * 1.33 * 500 / (m - 0.5)).length, 0, 0,
    r`Bright in reflection: $2nt=(m-\tfrac12)\lambda$, so $\lambda=\dfrac{2\times1.33\times500}{m-\frac12}=\dfrac{1330}{m-\frac12}$. $m=1$: 2660; $m=2$: 886.7; $m=3$: 532; $m=4$: 380. Only 532 nm is visible. So 1.`),
  nat(4, 'resolving power', r`The two components of a double star are $0.1$ arcsecond apart. Find the smallest diameter of the telescope objective (in m, 2 decimals) that can just resolve them in light of wavelength 550 nm ($1\ \text{arcsecond}=4.85\times10^{-6}$ rad).`, () => 1.22 * 550e-9 / (0.1 * 4.85e-6), 0.02, 2,
    r`$\Delta\theta=\dfrac{1.22\lambda}{D}$, so $D=\dfrac{1.22\times550\times10^{-9}}{0.1\times4.85\times10^{-6}}=1.38$ m.`, { unit: 'm' }),
  nat(4, 'resolving power', r`The pupil of an eye has diameter 3 mm. For light of wavelength 550 nm, find the smallest separation (in cm, 1 decimal) of two point sources 1 km away that the eye can just resolve.`, () => 1.22 * 550e-9 / 3e-3 * 1000 * 100, 0.1, 1,
    r`$\Delta\theta=\dfrac{1.22\times550\times10^{-9}}{3\times10^{-3}}=2.24\times10^{-4}$ rad. Separation $=\Delta\theta\times L=2.24\times10^{-4}\times1000=0.224$ m $=22.4$ cm.`, { unit: 'cm' }),
  nat(4, 'intensity ratio', r`The widths of the two slits in a double slit experiment are in the ratio $1:4$. Find $I_{max}/I_{min}$ (the intensity of light from a slit is proportional to its width).`, () => ((2 + 1) / (2 - 1)) ** 2, 0, 0,
    r`Intensity $\propto$ width, so $I_1:I_2=1:4$ and amplitudes are $1:2$. $\dfrac{I_{max}}{I_{min}}=\dfrac{(2+1)^2}{(2-1)^2}=9$.`),
  nat(4, 'YDSE', r`In a double slit experiment, light falls on the slits at a small angle $\alpha=0.001$ rad to the axis. With $d=1$ mm and $D=1$ m, find the shift of the central fringe from the axis on the screen (in mm).`, () => 0.001 * 1 * 1000, 0, 0,
    r`The extra path before the slits is $d\sin\alpha\approx d\alpha$. The central fringe is where the waves after the slits make up for it: $\dfrac{yd}D=d\alpha$, so $y=\alpha D=0.001\times1=1\times10^{-3}$ m $=1$ mm, on the side opposite to the tilt of the incoming beam.`, { unit: 'mm' }),
  nat(4, 'Brewster angle', r`A ray travelling in water ($n=4/3$) falls on a glass plate ($n=1.5$) at the polarising angle for this pair of media. Find the polarising angle (in degrees, 1 decimal).`, () => Math.atan(1.5 / (4 / 3)) / D2R, 0.1, 1,
    r`For two media, $\tan\theta_B=\dfrac{n_2}{n_1}=\dfrac{1.5}{4/3}=1.125$, so $\theta_B=48.4°$.`, { unit: '°', trap: 'The relation $\\tan\\theta_B=n$ assumes the first medium is air.' }),
  nat(4, 'polaroids', r`Plane polarised light of intensity $I_0$ falls on 3 polaroids in a row. Each is turned by $30°$ from the one before, the first being at $30°$ to the light's plane of polarisation. Find the final intensity as a fraction of $I_0$ (3 decimals).`, () => Math.cos(30 * D2R) ** 6, 0.001, 3,
    r`Each polaroid gives a factor $\cos^230°=\tfrac34$. After three: $\left(\tfrac34\right)^3=0.422$.`),
  nat(4, 'Newton rings', r`The 4th dark ring in Newton's rings has radius 1.34 mm in air. The space between lens and plate is now filled with a liquid of $n=1.33$. Find the radius of that ring (in mm, 2 decimals).`, () => 1.34 / Math.sqrt(1.33), 0.01, 2,
    r`$r_m^2=\dfrac{m\lambda R}{n}$, so $r\propto1/\sqrt n$. $r'=\dfrac{1.34}{\sqrt{1.33}}=1.16$ mm.`, { unit: 'mm' }),
  nat(4, 'resolving power', r`A microscope has a numerical aperture of 1.25. Find the smallest separation it can resolve using light of wavelength 500 nm, from $d=0.61\lambda/\mathrm{NA}$ (in nm, nearest whole number).`, () => 0.61 * 500 / 1.25, 1, 0,
    r`$d=\dfrac{0.61\times500}{1.25}=244$ nm.`, { unit: 'nm' }),
  nat(5, 'YDSE with two slabs', r`In a double slit experiment ($D=1$ m, $d=1$ mm) a sheet of $n=1.5$ and thickness 8 $\mu$m covers the upper slit, and a sheet of $n=1.6$ and thickness 6 $\mu$m covers the lower slit. Find the shift of the central fringe (in mm, magnitude).`, () => Math.abs((0.5 * 8 - 0.6 * 6) * 1e-6 * 1 / 1e-3 * 1e3), 0.01, 2,
    r`Extra optical path for the upper slit: $(1.5-1)\times8=4.0\ \mu$m. For the lower: $(1.6-1)\times6=3.6\ \mu$m. Net difference $=0.4\ \mu$m. Shift $=\dfrac{0.4\times10^{-6}\times1}{10^{-3}}=0.4\times10^{-3}$ m $=0.4$ mm, towards the slit with the larger extra path (the upper one).`, { unit: 'mm' }),
  nat(5, 'YDSE with a slab', r`Two coherent beams of equal intensity $I_0$ interfere at the centre of a double slit pattern. A sheet is placed over one slit so that it adds a path difference of $\lambda/4$ at the centre. Find the intensity at the centre as a fraction of the maximum possible ($4I_0$) (2 decimals).`, () => Math.cos(Math.PI / 4) ** 2, 0.01, 2,
    r`$\phi=\dfrac{2\pi}{\lambda}\cdot\dfrac\lambda4=\dfrac\pi2$. $I=4I_0\cos^2(\phi/2)=4I_0\cos^2\dfrac\pi4=2I_0$, which is $0.50$ of the maximum.`),
  nat(5, 'single slit diffraction', r`In single slit diffraction the intensity is $I=I_0\left(\dfrac{\sin\beta}{\beta}\right)^2$, with $\beta=\dfrac{\pi a\sin\theta}{\lambda}$. The first secondary maximum lies near $\beta=\dfrac{3\pi}2$. Find $I/I_0$ there (3 decimals).`, () => (Math.sin(1.5 * Math.PI) / (1.5 * Math.PI)) ** 2, 0.001, 3,
    r`$\sin\dfrac{3\pi}2=-1$ and $\beta=4.712$. $I/I_0=\left(\dfrac1{4.712}\right)^2=0.045$. About $4.5\%$ of the central maximum, so the secondary maxima are faint.`),
  nat(5, 'diffraction and interference', r`A double slit has slit separation $d=0.6$ mm and each slit is $a=0.1$ mm wide. How many bright fringes (counting the central one) lie inside the central diffraction maximum? ($m$th interference order coinciding with a diffraction minimum is missing.)`, () => 2 * 6 - 1, 0, 0,
    r`The central diffraction maximum ends at $a\sin\theta=\lambda$. The interference maxima satisfy $d\sin\theta=m\lambda$. At the edge $m=d/a=6$, but that order falls on a diffraction minimum and is missing. So orders $0,\pm1,\ldots,\pm5$ remain: $2\times5+1=11$.`, { trap: 'The order that coincides with the first diffraction minimum is not seen.' }),
  nat(5, 'thin films', r`A thin film of oil ($n=1.4$) lies on glass ($n=1.5$) and is lit by white light at normal incidence. Its thickness is 600 nm. How many wavelengths in 400 nm to 700 nm are strongly reflected?`, () => midx(400, 700, (m) => 2 * 1.4 * 600 / m).length, 0, 0,
    r`Both reflections (air to oil, oil to glass) go from lower to higher index, so both change phase by $\pi$ and the extra phase changes cancel. Brightness needs $2nt=m\lambda$, so $\lambda=\dfrac{1680}m$ nm: $m=3$: 560 nm; $m=4$: 420 nm; $m=2$: 840; $m=5$: 336. Two are visible (560 and 420 nm).`, { trap: 'Check the phase changes at both surfaces before choosing the condition.' }),
  nat(5, 'Huygens principle', r`A plane wavefront of light in air strikes a glass surface ($n=1.5$) with $\sin i=0.6$. Using Huygens' construction, find the angle between the wavefront in the glass and the boundary, that is the angle of refraction (in degrees, 1 decimal).`, () => asind(0.6 / 1.5), 0.1, 1,
    r`In the time the wavefront in air travels $BC=v_1t$ along the incident side, the secondary wavelet from the other end travels $v_2t$ in glass. $\sin i=\dfrac{v_1t}{AC}$ and $\sin r=\dfrac{v_2t}{AC}$, so $\sin r=\dfrac{v_2}{v_1}\sin i=\dfrac{0.6}{1.5}=0.4$ and $r=23.6°$.`, { unit: '°' })
);
items.push(
  nat(5, 'YDSE with a slab', r`In a double slit experiment with light of wavelength 600 nm, a thin transparent sheet of refractive index 1.5 covers one slit. Find the least thickness of the sheet (in $\mu$m, 1 decimal) that makes the central point of the screen dark. (Assume the two beams have equal intensity.)`, () => 0.6 / 2 / 0.5, 0.1, 1,
    r`Darkness needs the extra path $(n-1)t=\dfrac\lambda2$ (the least odd multiple of $\lambda/2$). $t=\dfrac{0.6\ \mu\mathrm m}{2\times0.5}=0.6\ \mu$m.`, { unit: 'μm' }),
  nat(5, 'single slit diffraction', r`A slit 2 $\mu$m wide is immersed in water ($n=4/3$) and lit by light of wavelength 600 nm in air. Find the angle of the first minimum (in degrees, 1 decimal).`, () => asind(600 / (4 / 3) / 2000), 0.1, 1,
    r`In water $\lambda'=\lambda/n=600/(4/3)=450$ nm. $\sin\theta=\dfrac{\lambda'}a=\dfrac{450}{2000}=0.225$, so $\theta=13.0°$.`, { unit: '°', trap: 'Use the wavelength in the medium, which is shorter.' }),
  nat(4, 'Brewster angle', r`Unpolarised light in air falls on a thick glass plate ($n=1.5$) at the polarising angle. The refracted ray reaches the lower (glass to air) surface. Find the angle of incidence at that surface (in degrees, 1 decimal), and note that it is also the polarising angle for the glass-to-air boundary.`, () => 90 - Math.atan(1.5) / D2R, 0.1, 1,
    r`At the top surface $\theta_B=\tan^{-1}1.5=56.3°$, so $r=33.7°$. The refracted ray meets the bottom surface at $33.7°$ (parallel faces). For glass to air $\tan\theta_B'=\dfrac1{1.5}=0.667$, i.e. $\theta_B'=33.7°$: the same value. So the light reflected from the lower face is also fully polarised.`, { unit: '°' }),
  nat(5, 'thin films', r`A film of refractive index 1.5 and thickness 400 nm in air is lit at an angle of incidence of $30°$ with white light. Find the longest visible wavelength (400 nm to 700 nm) that is strongly reflected, in nm (nearest whole number). (Use $2nt\cos r=(m+\tfrac12)\lambda$.)`, () => { const rr = asind(sind(30) / 1.5); const x = 2 * 1.5 * 400 * Math.cos(rr * D2R); const c = []; for (let m = 0; m < 20; m++) { const l = x / (m + 0.5); if (l >= 400 && l <= 700) c.push(l); } return Math.max(...c); }, 1, 0,
    r`$\sin r=\dfrac{\sin30°}{1.5}=0.3333$, $r=19.47°$, $\cos r=0.9428$. $2nt\cos r=2\times1.5\times400\times0.9428=1131.4$ nm. $\lambda=\dfrac{1131.4}{m+\frac12}$: $m=0$: 2263; $m=1$: 754; $m=2$: 452.6; $m=3$: 323. Only 452.6 nm is in the visible range, so the answer is 453 nm.`, { unit: 'nm' }),
  nat(4, 'intensity in interference', r`In an interference pattern with two coherent equal sources the intensity at a point is one quarter of the maximum. Find the path difference there as a fraction of $\lambda$ (the smallest positive value, 3 decimals).`, () => 1 / 3, 0.001, 3,
    r`$\dfrac I{I_{max}}=\cos^2\dfrac\phi2=\dfrac14$, so $\cos\dfrac\phi2=\dfrac12$, $\dfrac\phi2=60°$, $\phi=120°$. $\Delta=\dfrac{\phi}{360°}\lambda=\dfrac\lambda3=0.333\lambda$.`),
  nat(4, 'diffraction by a circular aperture', r`A laser beam of wavelength 632.8 nm passes through a circular hole 2 mm in diameter. On a screen 10 m away the central bright disc has radius $1.22\lambda L/D$. Find this radius (in mm, 2 decimals).`, () => 1.22 * 632.8e-9 * 10 / 2e-3 * 1e3, 0.02, 2,
    r`$r=\dfrac{1.22\lambda L}{D}=\dfrac{1.22\times632.8\times10^{-9}\times10}{2\times10^{-3}}=3.86\times10^{-3}$ m $=3.86$ mm.`, { unit: 'mm' }),
  nat(5, 'visibility', r`Two coherent beams have intensities in the ratio $9:1$. The visibility (contrast) of the fringes is $V=\dfrac{I_{max}-I_{min}}{I_{max}+I_{min}}$. Find $V$ (2 decimals).`, () => { const mx = (3 + 1) ** 2; const mn = (3 - 1) ** 2; return (mx - mn) / (mx + mn); }, 0.01, 2,
    r`Amplitudes $3:1$. $I_{max}\propto16$, $I_{min}\propto4$. $V=\dfrac{16-4}{16+4}=0.60$. (Equivalently $V=\dfrac{2\sqrt{I_1I_2}}{I_1+I_2}=\dfrac{6}{10}$.)`),
  nat(4, 'YDSE', r`Light of wavelengths 420 nm and 630 nm illuminates a double slit with $D=1$ m and $d=1$ mm. Find the distance from the centre (in mm, 2 decimals) of the nearest point (other than the centre) where bright fringes of the two colours coincide.`, () => 3 * 420e-9 / 1e-3 * 1e3, 0.01, 2,
    r`$420n_1=630n_2$ gives $n_1:n_2=3:2$. Nearest coincidence: $y=\dfrac{3\times420\times10^{-9}\times1}{10^{-3}}=1.26\times10^{-3}$ m $=1.26$ mm.`, { unit: 'mm' }),
  mcq(4, 'YDSE with a slab', r`In a double slit experiment identical thin glass sheets are placed over both slits. The fringe pattern on the screen`, 'is unchanged: the central fringe stays where it was', ['shifts towards one slit', 'disappears', 'has fringes of double the width'],
    r`Both beams gain the same extra optical path $(n-1)t$, so the path difference between them is unchanged. The pattern does not move. (The overall brightness falls slightly from reflection and absorption.)`, { trap: 'A shift needs a difference between the two sheets.' }),
  mcq(4, 'polarisation', r`The light from a clear blue sky, when viewed at $90°$ to the direction of the Sun, is`, 'partially to largely plane polarised', ['completely unpolarised', 'circularly polarised', 'plane polarised along the Sun-eye direction'],
    r`Molecules scatter sunlight as tiny dipoles. At $90°$ to the incident beam only vibrations perpendicular to the plane containing Sun, molecule and observer can be radiated, so the light is strongly (not perfectly, because of multiple scattering) plane polarised. Rotating a polaroid shows the intensity change.`),
);
// ---------- Assertion and Reason ----------
items.push(
  asrt(2, 'interference', r`Interference fringes are not seen when two separate sodium lamps are used in place of two slits lit by one lamp.`, r`Two independent lamps are not coherent sources.`, 0,
    r`Fringes need a constant phase difference. Atoms in two lamps emit with random, changing phases, so the pattern shifts too fast to be seen. R explains A.`),
  asrt(3, 'intensity ratio', r`If the two slits in Young's experiment give waves of different intensities, the dark fringes are not completely dark.`, r`The minimum intensity is $(\sqrt{I_1}-\sqrt{I_2})^2$, which is not zero if $I_1\ne I_2$.`, 0,
    r`At a minimum the amplitudes $a_1$ and $a_2$ subtract: $A=a_1-a_2\ne0$. So $I_{min}\propto(a_1-a_2)^2>0$. R gives the reason.`),
  asrt(3, 'white light YDSE', r`In Young's experiment with white light the central fringe is white.`, r`White light contains all the visible wavelengths.`, 1,
    r`A is true: at the centre the path difference is zero for every colour, so all colours are bright and add to white. R is true, but it is the zero path difference for all wavelengths that gives a white centre. By itself, containing all colours does not explain why the fringe is bright for all of them.`),
  asrt(3, 'thin films', r`A thin oil film on a road looks coloured in white light.`, r`The colours are produced by the dispersion of light in the oil.`, 2,
    r`A is true. R is false: the colours come from interference between light reflected from the top and bottom surfaces of the film. Different wavelengths are strengthened for different thicknesses.`),
  asrt(3, 'Lloyd mirror', r`In a Lloyd's mirror experiment the fringe at the point where the screen meets the mirror is dark.`, r`Light reflected from a mirror (a denser medium) undergoes a phase change of $\pi$.`, 0,
    r`At the edge of the mirror the direct and reflected paths are equal, but the reflected wave has an extra $\pi$. They cancel: a dark fringe. R is the reason.`),
  asrt(4, 'diffraction', r`The diffraction of light is not noticed in daily life.`, r`The wavelength of visible light is very small compared with the sizes of ordinary objects.`, 0,
    r`Bending is appreciable only if the obstacle is comparable with $\lambda$ ($\sim5\times10^{-7}$ m). For everyday objects the bending angle $\lambda/a$ is tiny.`),
  asrt(3, 'YDSE in a medium', r`The fringe width in Young's experiment increases when the whole apparatus is put in water.`, r`The wavelength of light is smaller in water than in air.`, 3,
    r`A is false: $\beta=\lambda D/d$ is proportional to $\lambda$, so it decreases (by the factor $n$). R is true.`),
  asrt(4, 'coherence', r`Two light waves of slightly different frequencies cannot produce a stationary interference pattern.`, r`The phase difference between two such waves changes with time.`, 0,
    r`With frequencies $f_1\ne f_2$ the phase difference changes at the rate $2\pi(f_1-f_2)$, so bright and dark positions change place continually (these are beats in time, not fixed fringes).`),
  asrt(4, 'diffraction', r`In single slit diffraction the central maximum becomes wider when red light is replaced by blue light.`, r`The width of the central maximum is proportional to the wavelength.`, 3,
    r`A is false: the width $2\lambda D/a$ is proportional to $\lambda$, and blue has the shorter wavelength, so it becomes narrower. R is true.`),
  asrt(3, 'Brewster angle', r`At the Brewster angle the reflected ray is perpendicular to the refracted ray.`, r`At the polarising angle $\tan\theta_B=n$.`, 1,
    r`Both are true. But $\tan\theta_B=n$ is the result of the perpendicularity condition ($\theta_B+r=90°$ with Snell's law), not the cause of it, so R is not an explanation of A.`),
);

// ---------- Statement I / Statement II ----------
items.push(
  stm(2, 'Huygens principle', r`Huygens' principle can explain the laws of reflection and refraction.`, r`Huygens' principle can explain the formation of images only by lenses.`, 2,
    r`I is true: reflection and refraction follow from constructing wavefronts. II is false: the construction is general and applies to any wave problem.`),
  stm(3, 'interference', r`When two waves interfere, the average intensity over the whole pattern equals the sum of the two separate intensities.`, r`Interference redistributes the energy, and it does not create or destroy it.`, 0,
    r`$I=I_1+I_2+2\sqrt{I_1I_2}\cos\phi$ and the cosine term averages to zero. So both statements are true, and II explains I.`),
  stm(3, 'polarisation', r`Light can be polarised by reflection.`, r`Sound waves in air can be polarised by reflection.`, 2,
    r`I is true (Brewster). II is false: sound in air is longitudinal and cannot be polarised.`),
  stm(3, 'YDSE', r`In Young's double slit experiment the fringes near the centre are closer together than those far from the centre.`, r`The fringe width $\beta=\lambda D/d$ is the same for every fringe (for small angles).`, 3,
    r`I is false: the fringes are equally spaced. II is true under the usual small-angle approximation.`),
  stm(4, 'diffraction', r`The central maximum of a single slit pattern is narrower than the fringes in a double slit pattern from the same light and slits.`, r`Diffraction by the individual slits does not affect a double slit pattern.`, 1,
    r`I is false: the central diffraction maximum is much wider than the interference fringes inside it. II is false: the pattern is the interference fringes multiplied by the single slit diffraction envelope.`),
  stm(3, 'Brewster angle', r`The Brewster angle of glass is slightly smaller for red light than for violet light.`, r`The Brewster angle depends on the intensity of the incident light.`, 2,
    r`I is true: $\tan\theta_B=n$, and $n_{red}<n_{violet}$. II is false: it depends only on the refractive index (and so on the wavelength), not on the intensity.`),
  stm(4, 'resolving power', r`Using a smaller aperture improves the angular resolution of a telescope.`, r`The limit of resolution of a circular aperture is $1.22\lambda/D$.`, 3,
    r`I is false: the limit $1.22\lambda/D$ gets worse (larger) when $D$ decreases. II is true.`),
  stm(3, 'polaroids', r`Unpolarised light passed through two crossed polaroids gives no transmitted light.`, r`Unpolarised light passing through a polaroid becomes plane polarised.`, 0,
    r`The first polaroid makes the light plane polarised, along its axis. The second, at $90°$ to it, passes $I\cos^290°=0$. II explains why.`),
);

// ---------- One or more correct ----------
items.push(
  msq(3, 'interference', r`Which are needed for a steady, clear interference pattern from two sources?`,
    [r`The sources have the same frequency`, r`The phase difference between them stays constant`, r`Their amplitudes are nearly equal`, r`Their intensities are far apart`], [0, 1, 2],
    r`Equal frequency and constant phase make the sources coherent. Nearly equal amplitudes give $I_{min}\approx0$ and good contrast. Very unequal intensities wash out the dark fringes (D false).`),
  msq(4, 'Brewster angle', r`Light is incident on glass at the Brewster angle. Which statements are correct?`,
    [r`The reflected light is plane polarised, with vibrations perpendicular to the plane of incidence`, r`The reflected and refracted rays are at $90°$ to each other`, r`The angle depends on the pair of media`, r`All the incident light is reflected`], [0, 1, 2],
    r`Only a small part of the light (about $15\%$ of the perpendicular component for glass) is reflected, so D is false. The rest, including all the parallel component, is refracted.`),
  msq(3, 'wave nature', r`Which phenomena support the wave nature of light?`,
    [r`Interference of light from two slits`, r`Diffraction by a narrow slit`, r`Polarisation (showing that light waves are transverse)`, r`Straight-line shadows of large objects`], [0, 1, 2],
    r`Interference and diffraction need a wave. Polarisation shows it is also transverse. Straight shadows are explained by the very small wavelength compared with the object, not by wave behaviour (D is not evidence for waves).`),
  msq(4, 'YDSE', r`In Young's double slit experiment which statements are correct?`,
    [r`The fringe width decreases if the slit separation is increased`, r`The fringes disappear if the source slit is made too wide`, r`The fringe width increases if the screen is moved farther from the slits`, r`A thin plate in front of one slit shifts the central fringe`], [0, 1, 2, 3],
    r`$\beta=\lambda D/d$ gives A and C. A wide source acts as many sources with fringe patterns shifted relative to each other, so the pattern washes out (B). A plate adds an optical path $(n-1)t$ and shifts the pattern (D).`),
  msq(4, 'thin films', r`Which statements about thin films in air at normal incidence are correct?`,
    [r`For a soap film the condition for brightness in reflection is $2nt=(m+\tfrac12)\lambda$`, r`A very thick film does not show colours`, r`The thickness of an anti-reflection coating ($n_c<n_g$) is $\lambda/4n_c$ for the least thickness`, r`Light reflected from a rarer medium changes phase by $\pi$`], [0, 1, 2],
    r`A phase change of $\pi$ occurs on reflection from a denser medium (D is the wrong way round). B: for a thick film many wavelengths satisfy the conditions and the colours blur.`),
  msq(4, 'diffraction', r`Which statements about single slit diffraction are correct?`,
    [r`A narrower slit gives a wider central maximum`, r`The central maximum is twice as wide as each secondary maximum`, r`The secondary maxima are as bright as the central maximum`, r`The beam spreads little up to about $a^2/\lambda$`], [0, 1, 3],
    r`The secondary maxima are only a few per cent as bright as the central one (C false). The angular half-width is $\lambda/a$ (A). The central maximum has width $2\lambda D/a$ against $\lambda D/a$ for the others (B). Up to the Fresnel distance $a^2/\lambda$ rays travel almost straight (D).`),
  msq(5, 'polarisation', r`Which statements are correct?`,
    [r`An ideal polaroid transmits half of the intensity of unpolarised light`, r`Light scattered by the sky at $90°$ to the direction of the Sun is plane polarised`, r`Light reflected at normal incidence from glass is plane polarised`, r`Placing a third polaroid at $45°$ between two crossed polaroids lets some light through`], [0, 1, 3],
    r`At normal incidence there is no preferred direction, so the reflected light is not polarised (C false). Scattering gives light polarised perpendicular to the plane of the Sun, the observer and the scattering molecule (B). With the middle polaroid, $I=\dfrac{I_0}2\cos^245°\cos^245°=\dfrac{I_0}8$ (D).`),
  msq(5, 'resolving power', r`Which of these improve the resolution of a telescope?`,
    [r`A larger objective diameter`, r`Using light of a shorter wavelength`, r`Using a more powerful eyepiece (greater magnification) only`, r`Observing from above the atmosphere`], [0, 1, 3],
    r`The limit $1.22\lambda/D$ drops with larger $D$ or smaller $\lambda$. More magnification only enlarges the blur (C false). Above the atmosphere the blurring by air turbulence is gone, so the diffraction limit can be reached.`),
  msq(4, 'Huygens principle', r`Which statements can be explained by Huygens' principle?`,
    [r`The law of reflection`, r`The law of refraction with $\sin i/\sin r=v_1/v_2$`, r`The frequency of light changes when light enters glass`, r`The wavelength of light is smaller in glass than in air`], [0, 1, 3],
    r`The construction explains the laws of reflection and refraction and shows that $\lambda$ falls in proportion to the speed. The frequency stays the same, set by the source (C false).`),
);
// ---------- Match the following and passages ----------
const mat2 = (level, sub, group, q, correct, wrongs, sol, o = {}) => {
  const pos = (c++ * 3 + 2) % 4; const options = [...wrongs]; options.splice(pos, 0, correct);
  return base(level, sub, { type: 'mcq', format: 'match', group, q, options, answer: pos, sol, ...o });
};
const groups = {
  m1: { title: 'Phenomena and their cause',
    list1: ['A. Colours of a soap bubble', 'B. Light bending around the edge of a slit', 'C. Glare cut by sunglasses', 'D. Spreading of white light into colours by a prism'],
    list2: ['p. interference in a thin film', 'q. diffraction', 'r. polarisation', 's. dispersion'] },
  m2: { title: 'Formulae of wave optics',
    list1: ['A. Fringe width in Young\'s double slit experiment', 'B. Width of the central maximum of a single slit pattern (screen at $D$)', 'C. Intensity through an analyser', 'D. Polarising angle'],
    list2: [r`p. $\lambda D/d$`, r`q. $2\lambda D/a$`, r`r. $I_0\cos^2\theta$`, r`s. $\tan\theta_B=n$`] },
  m3: { title: 'Soap film in air: thicknesses in reflected light',
    list1: ['A. First bright film (least nonzero thickness)', 'B. First dark film (least nonzero thickness)', 'C. Second bright film', 'D. Second dark film'],
    list2: [r`p. $\lambda/4n$`, r`q. $\lambda/2n$`, r`r. $3\lambda/4n$`, r`s. $\lambda/n$`] },
  m4: { title: 'Polaroids',
    list1: ['A. Unpolarised light $I_0$ through one polaroid', 'B. Unpolarised $I_0$ through two polaroids at $60°$', 'C. Plane polarised $I_0$ through a polaroid at $30°$ to its plane', 'D. Plane polarised light through a crossed polaroid'],
    list2: ['p. $I_0/2$', 'q. $I_0/8$', 'r. $3I_0/4$', 's. zero'] },
  p1: { title: 'A double slit experiment',
    passage: r`<p>Light of wavelength 600 nm falls on two slits 0.3 mm apart. The screen is 1.5 m from the slits.</p>` },
  p2: { title: 'A single slit and a lens',
    passage: r`<p>Light of wavelength 500 nm falls normally on a slit 0.2 mm wide. A lens of focal length 1.0 m, placed close behind the slit, focuses the pattern on a screen at its focal plane.</p>` },
  p3: { title: 'Reflection at the Brewster angle',
    passage: r`<p>Unpolarised light travelling in air strikes the plane surface of glass ($n=1.5$) at the polarising angle. The reflected beam has an intensity of $8\ \mathrm{W\,m^{-2}}$ and is plane polarised.</p>` },
};
items.push(
  mat2(2, 'wave phenomena', 'm1', r`Match each observation with the wave phenomenon behind it.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-', 'A-s, B-q, C-r, D-p'],
    r`Soap bubble colours: interference between the two film surfaces (p). Bending at a slit: diffraction (q). Sunglasses cut reflected light, which is partly polarised: polarisation (r). A prism separates colours since $n$ depends on $\lambda$: dispersion (s).`),
  mat2(3, 'formulae', 'm2', r`Match each quantity with its formula.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-', 'A-r, B-q, C-p, D-s'],
    r`Fringe width $\beta=\lambda D/d$ (p). Central maximum width $2\lambda D/a$ (q). Malus's law $I=I_0\cos^2\theta$ (r). Brewster's law $\tan\theta_B=n$ (s).`),
  mat2(3, 'thin films', 'm3', r`For a soap film of refractive index $n$ in air at normal incidence in reflected light, match each condition with the film thickness.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-', 'A-s, B-q, C-r, D-p'],
    r`Bright: $2nt=(m+\tfrac12)\lambda$, so $t=\dfrac\lambda{4n},\ \dfrac{3\lambda}{4n}$ for $m=0,1$ (A: p, C: r). Dark: $2nt=m\lambda$, so $t=\dfrac\lambda{2n},\ \dfrac\lambda n$ for $m=1,2$ (B: q, D: s).`),
  mat2(4, 'polarisation', 'm4', r`Match each arrangement with the transmitted intensity.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-', 'A-p, B-r, C-q, D-s'],
    r`A: $I_0/2$ (p). B: after the first, $I_0/2$; after the second, $\dfrac{I_0}2\cos^260°=\dfrac{I_0}8$ (q). C: $I_0\cos^230°=\dfrac34I_0$ (r). D: $\cos^290°=0$ (s).`),
);
items.push(
  pas(2, 'YDSE', 'p1', r`Find the fringe width (in mm).`, () => 600e-9 * 1.5 / 0.3e-3 * 1e3, 0, 0,
    r`$\beta=\dfrac{\lambda D}d=\dfrac{600\times10^{-9}\times1.5}{0.3\times10^{-3}}=3\times10^{-3}$ m $=3$ mm.`, { unit: 'mm' }),
  pas(3, 'YDSE', 'p1', r`Find the distance of the 4th dark fringe from the central maximum (in mm, 1 decimal; the dark fringe nearest the centre is the 1st).`, () => 3.5 * 3, 0.1, 1,
    r`Dark fringes at $(n-\tfrac12)\beta$. For $n=4$: $3.5\times3=10.5$ mm.`, { unit: 'mm' }),
  pas(4, 'YDSE with a slab', 'p1', r`A thin sheet ($n=1.5$) placed over one slit shifts the central maximum to where the 5th bright fringe of the original pattern was. Find the thickness of the sheet (in $\mu$m).`, () => 5 * 0.6 / 0.5, 0, 0,
    r`$\dfrac{(n-1)t}{\lambda}=5$, so $t=\dfrac{5\times0.6\ \mu\mathrm m}{0.5}=6\ \mu$m.`, { unit: 'μm' }),
  pas(2, 'single slit diffraction', 'p2', r`Find the width of the central maximum (in mm).`, () => 2 * 500e-9 * 1 / 0.2e-3 * 1e3, 0, 0,
    r`Width $=\dfrac{2\lambda f}{a}=\dfrac{2\times500\times10^{-9}\times1}{0.2\times10^{-3}}=5\times10^{-3}$ m $=5$ mm.`, { unit: 'mm' }),
  pas(2, 'single slit diffraction', 'p2', r`Find the distance of the first minimum from the centre (in mm, 1 decimal).`, () => 500e-9 * 1 / 0.2e-3 * 1e3, 0.1, 1,
    r`$y_1=\dfrac{\lambda f}a=2.5\times10^{-3}$ m $=2.5$ mm.`, { unit: 'mm' }),
  pas(3, 'single slit diffraction', 'p2', r`The slit is now made 0.4 mm wide. Find the new width of the central maximum (in mm, 1 decimal).`, () => 2 * 500e-9 * 1 / 0.4e-3 * 1e3, 0.1, 1,
    r`Width $\propto1/a$: it halves to $2.5$ mm.`, { unit: 'mm' }),
  pas(2, 'Brewster angle', 'p3', r`Find the angle of incidence (in degrees, 1 decimal).`, () => Math.atan(1.5) / D2R, 0.1, 1,
    r`$\tan\theta_B=1.5$, so $\theta_B=56.3°$.`, { unit: '°' }),
  pas(3, 'Brewster angle', 'p3', r`Find the angle of refraction in the glass (in degrees, 1 decimal).`, () => 90 - Math.atan(1.5) / D2R, 0.1, 1,
    r`$r=90°-\theta_B=90°-56.3°=33.7°$. Check with Snell's law: $\sin56.3°=1.5\sin33.7°$, which holds.`, { unit: '°' }),
  pas(3, 'Malus law', 'p3', r`The reflected beam falls on a polaroid whose axis is at $60°$ to its plane of polarisation. Find the transmitted intensity (in $\mathrm{W\,m^{-2}}$).`, () => 8 * Math.cos(60 * D2R) ** 2, 0, 0,
    r`$I=I_0\cos^2\theta=8\times\cos^260°=8\times\dfrac14=2\ \mathrm{W\,m^{-2}}$.`, { unit: 'W/m²' }),
);
// ---------- Number templates ----------
const out = (x, dp, exact = false) => ({ answer: R(x, dp), tol: exact ? 0 : +(10 ** -dp).toFixed(dp + 1) });
const T = (id, level, sub, type, make, verify) => ({ id, type, level, exams: exs(level, type), sub, make, verify });
const LAM = [450, 500, 550, 600, 650, 700]; const DD = [1, 1.2, 1.5, 2]; const SEP = [0.2, 0.25, 0.3, 0.4, 0.5, 0.6];
const cnt = (lo, hi, f) => { let n = 0; for (let m = 1; m < 300; m++) { const x = f(m); if (x >= lo && x <= hi) n++; } return n; };
const gens = [
  T('wo-g01', 2, 'YDSE', 'nat', (rng) => {
    const v = int(rng, 0, 3); const lam = choose(rng, LAM); const D = choose(rng, DD); const d = choose(rng, SEP); const b = lam * 1e-9 * D / (d * 1e-3) * 1e3;
    if (v === 0) return { v, lam, D, d, q: r`In Young's experiment $\lambda=${lam}$ nm, the slits are ${d} mm apart and the screen is ${D} m away. Find the fringe width (in mm, 3 decimals).`, ...out(b, 3), unit: 'mm', sol: r`$\beta=\dfrac{\lambda D}d=\dfrac{${lam}\times10^{-9}\times${D}}{${d}\times10^{-3}}=${R(b, 4)}\times10^{-3}$ m $=${R(b, 3)}$ mm.` };
    if (v === 1) return { v, b, D, d, q: r`In a double slit experiment the slits are ${d} mm apart, the screen is ${D} m away and the fringe width is ${R(b, 3)} mm. Find the wavelength (in nm, nearest whole number).`, ...out(R(b, 3) * 1e-3 * d * 1e-3 / D * 1e9, 0), unit: 'nm', sol: r`$\lambda=\dfrac{\beta d}{D}=\dfrac{${R(b, 3)}\times10^{-3}\times${d}\times10^{-3}}{${D}}=${R(R(b, 3) * 1e-3 * d * 1e-3 / D * 1e9, 1)}\times10^{-9}$ m.` };
    if (v === 2) return { v, lam, D, b, q: r`Fringes ${R(b, 3)} mm wide are seen on a screen ${D} m from two slits lit by light of wavelength ${lam} nm. Find the slit separation (in mm, 3 decimals).`, ...out(lam * 1e-9 * D / (R(b, 3) * 1e-3) * 1e3, 3), unit: 'mm', sol: r`$d=\dfrac{\lambda D}{\beta}=\dfrac{${lam}\times10^{-9}\times${D}}{${R(b, 3)}\times10^{-3}}=${R(lam * 1e-9 * D / (R(b, 3) * 1e-3) * 1e3, 4)}$ mm.` };
    return { v, lam, d, b, q: r`In a double slit experiment with light of wavelength ${lam} nm and slit separation ${d} mm the fringe width is ${R(b, 3)} mm. Find the distance from the slits to the screen (in m, 2 decimals).`, ...out(R(b, 3) * 1e-3 * d * 1e-3 / (lam * 1e-9), 2), unit: 'm', sol: r`$D=\dfrac{\beta d}{\lambda}=\dfrac{${R(b, 3)}\times10^{-3}\times${d}\times10^{-3}}{${lam}\times10^{-9}}=${R(R(b, 3) * 1e-3 * d * 1e-3 / (lam * 1e-9), 3)}$ m.` };
  }, (p) => (p.v === 0 ? p.lam * 1e-9 * p.D / (p.d * 1e-3) * 1e3 : p.v === 1 ? R(p.b, 3) * 1e-3 * p.d * 1e-3 / p.D * 1e9 : p.v === 2 ? p.lam * 1e-9 * p.D / (R(p.b, 3) * 1e-3) * 1e3 : R(p.b, 3) * 1e-3 * p.d * 1e-3 / (p.lam * 1e-9))),

  T('wo-g02', 2, 'YDSE', 'nat', (rng) => {
    const v = int(rng, 0, 3); const lam = choose(rng, LAM); const D = choose(rng, DD); const d = choose(rng, SEP); const b = lam * 1e-9 * D / (d * 1e-3) * 1e3; const m = int(rng, 2, 6);
    const base0 = { lam, D, d, m, v };
    if (v === 0) return { ...base0, q: r`In a double slit experiment ($\lambda=${lam}$ nm, $d=${d}$ mm, $D=${D}$ m) find the distance of the ${m}th bright fringe from the central maximum (in mm, 2 decimals).`, ...out(m * b, 2), unit: 'mm', sol: r`$\beta=\dfrac{\lambda D}d=${R(b, 4)}$ mm. $y_${m}=${m}\beta=${R(m * b, 3)}$ mm.` };
    if (v === 1) return { ...base0, q: r`In a double slit experiment ($\lambda=${lam}$ nm, $d=${d}$ mm, $D=${D}$ m) find the distance of the ${m}th dark fringe from the centre (in mm, 2 decimals; the dark fringe nearest the centre is the 1st).`, ...out((m - 0.5) * b, 2), unit: 'mm', sol: r`$\beta=${R(b, 4)}$ mm. The ${m}th dark fringe is at $(${m}-\tfrac12)\beta=${R((m - 0.5) * b, 3)}$ mm.`, trap: 'Dark fringes sit half a fringe width away from the bright ones.' };
    if (v === 2) { const k = int(rng, 1, 4); return { ...base0, k, q: r`In a double slit experiment ($\lambda=${lam}$ nm, $d=${d}$ mm, $D=${D}$ m) find the distance between the ${m}th bright fringe on one side and the ${k}th bright fringe on the other side of the centre (in mm, 2 decimals).`, ...out((m + k) * b, 2), unit: 'mm', sol: r`$\beta=${R(b, 4)}$ mm. Distance $=(${m}+${k})\beta=${R((m + k) * b, 3)}$ mm.` }; }
    const W = pick(rng, 8, 20, 2); return { ...base0, W, q: r`The fringe width in a double slit experiment ($\lambda=${lam}$ nm, $d=${d}$ mm, $D=${D}$ m) is found. How many full fringe widths fit in a strip of the screen ${W} mm wide (round down to a whole number)?`, ...out(Math.floor(W / b), 0, true), sol: r`$\beta=${R(b, 4)}$ mm. $\dfrac{${W}}{${R(b, 4)}}=${R(W / b, 2)}$, so ${Math.floor(W / b)} whole fringe widths fit.` };
  }, (p) => { const b = p.lam * 1e-9 * p.D / (p.d * 1e-3) * 1e3; return p.v === 0 ? p.m * b : p.v === 1 ? (p.m - 0.5) * b : p.v === 2 ? (p.m + p.k) * b : Math.floor(p.W / b); }),

  T('wo-g03', 3, 'YDSE in a medium', 'nat', (rng) => {
    const v = int(rng, 0, 2); const n = choose(rng, [1.33, 1.5, 1.2, 1.6]); const b0 = pick(rng, 0.6, 2.4, 0.2);
    if (v === 0) return { v, n, b0, q: r`The fringe width in air is ${b0} mm. The whole set-up is placed in a liquid of refractive index ${n}. Find the new fringe width (in mm, 3 decimals).`, ...out(b0 / n, 3), unit: 'mm', sol: r`$\beta'=\dfrac\beta n=\dfrac{${b0}}{${n}}=${R(b0 / n, 4)}$ mm.` };
    if (v === 1) { const lam = choose(rng, LAM); return { v, n, lam, q: r`Light of wavelength ${lam} nm in vacuum is used in a double slit experiment performed in a liquid of refractive index ${n}. By what factor does the fringe width change compared with air? Give $\beta_{liquid}/\beta_{air}$ (3 decimals).`, ...out(1 / n, 3), sol: r`The wavelength in the liquid is $\lambda/n$, so $\beta\propto\lambda$ gives $\beta_{liquid}/\beta_{air}=1/n=${R(1 / n, 4)}$.` }; }
    const b1 = R(b0 / n, 3); return { v, n, b1, q: r`A double slit experiment in a liquid gives fringes ${b1} mm wide. In air the same set-up gives fringes ${b0} mm wide. Find the refractive index of the liquid (2 decimals).`, b0, ...out(b0 / b1, 2), sol: r`$n=\dfrac{\beta_{air}}{\beta_{liquid}}=\dfrac{${b0}}{${b1}}=${R(b0 / b1, 3)}$.` };
  }, (p) => (p.v === 0 ? p.b0 / p.n : p.v === 1 ? 1 / p.n : p.b0 / p.b1)),

  T('wo-g04', 3, 'YDSE with a slab', 'nat', (rng) => {
    const v = int(rng, 0, 3); const n = choose(rng, [1.5, 1.6, 1.4, 1.33]); const t = pick(rng, 4, 20, 2); const lam = choose(rng, [500, 600, 400]); const D = choose(rng, [1, 1.5, 2]); const d = choose(rng, [0.5, 1, 2]);
    if (v === 0) return { v, n, t, D, d, q: r`A thin sheet of refractive index ${n} and thickness ${t} $\mu$m covers one slit of a double slit set-up with $D=${D}$ m and $d=${d}$ mm. Find the shift of the central fringe (in mm, 2 decimals).`, ...out((n - 1) * t * 1e-6 * D / (d * 1e-3) * 1e3, 2), unit: 'mm', sol: r`Shift $=\dfrac{(n-1)tD}{d}=\dfrac{${R(n - 1, 2)}\times${t}\times10^{-6}\times${D}}{${d}\times10^{-3}}=${R((n - 1) * t * 1e-6 * D / (d * 1e-3) * 1e3, 3)}$ mm.` };
    if (v === 1) return { v, n, t, lam, q: r`A thin sheet of refractive index ${n} and thickness ${t} $\mu$m covers one slit of a double slit set-up lit by light of wavelength ${lam} nm. By how many fringe widths does the pattern shift (1 decimal)?`, ...out((n - 1) * t * 1000 / lam, 1), sol: r`Number of fringes shifted $=\dfrac{(n-1)t}{\lambda}=\dfrac{${R(n - 1, 2)}\times${t * 1000}\text{ nm}}{${lam}\text{ nm}}=${R((n - 1) * t * 1000 / lam, 2)}$.` };
    if (v === 2) { const N = int(rng, 3, 10); return { v, n, N, lam, q: r`A thin sheet of refractive index ${n} over one slit shifts the central fringe by ${N} fringe widths (light of wavelength ${lam} nm). Find the thickness of the sheet (in $\mu$m, 2 decimals).`, ...out(N * lam / 1000 / (n - 1), 2), unit: 'μm', sol: r`$t=\dfrac{N\lambda}{n-1}=\dfrac{${N}\times${lam}\ \mathrm{nm}}{${R(n - 1, 2)}}=${R(N * lam / 1000 / (n - 1), 3)}\ \mu$m.` }; }
    const s = pick(rng, 2, 8, 1); return { v, n, t, D, d, s, q: r`A sheet of thickness ${t} $\mu$m over one slit shifts the central fringe by ${R((n - 1) * t * 1e-6 * D / (d * 1e-3) * 1e3, 2)} mm ($D=${D}$ m, $d=${d}$ mm). Find the refractive index of the sheet (2 decimals).`, ...out(1 + R((n - 1) * t * 1e-6 * D / (d * 1e-3) * 1e3, 2) * 1e-3 * d * 1e-3 / (D * t * 1e-6), 2), sol: r`$n-1=\dfrac{\text{shift}\times d}{tD}=\dfrac{${R((n - 1) * t * 1e-6 * D / (d * 1e-3) * 1e3, 2)}\times10^{-3}\times${d}\times10^{-3}}{${t}\times10^{-6}\times${D}}=${R(R((n - 1) * t * 1e-6 * D / (d * 1e-3) * 1e3, 2) * 1e-3 * d * 1e-3 / (D * t * 1e-6), 3)}$. So $n=${R(1 + R((n - 1) * t * 1e-6 * D / (d * 1e-3) * 1e3, 2) * 1e-3 * d * 1e-3 / (D * t * 1e-6), 3)}$.` };
  }, (p) => { const sh = R((p.n - 1) * p.t * 1e-6 * p.D / (p.d * 1e-3) * 1e3, 2); return p.v === 0 ? (p.n - 1) * p.t * 1e-6 * p.D / (p.d * 1e-3) * 1e3 : p.v === 1 ? (p.n - 1) * p.t * 1000 / p.lam : p.v === 2 ? p.N * p.lam / 1000 / (p.n - 1) : 1 + sh * 1e-3 * p.d * 1e-3 / (p.D * p.t * 1e-6); }),

  T('wo-g05', 3, 'intensity in interference', 'nat', (rng) => {
    const v = int(rng, 0, 2); const lam = choose(rng, [400, 500, 600, 480, 720]); const f = choose(rng, [[1, 6], [1, 4], [1, 3], [1, 12], [2, 3], [1, 8]]); const dl = lam * f[0] / f[1]; const phi = 360 * f[0] / f[1];
    if (v === 0) return { v, lam, f, q: r`Two coherent sources of equal intensity are used with light of wavelength ${lam} nm. At a point the path difference is ${R(dl, 1)} nm. Find the phase difference there (in degrees, nearest whole number).`, ...out(phi, 0), unit: '°', sol: r`$\phi=\dfrac{360°}\lambda\Delta=360°\times\dfrac{${R(dl, 1)}}{${lam}}=${R(phi, 1)}°$.` };
    if (v === 1) return { v, lam, f, q: r`Two coherent sources of equal intensity are used with light of wavelength ${lam} nm. At a point the path difference is ${R(dl, 1)} nm. Find $I/I_{max}$ at that point (3 decimals).`, ...out(Math.cos(phi / 2 * D2R) ** 2, 3), sol: r`$\phi=${R(phi, 1)}°$. $\dfrac I{I_{max}}=\cos^2\dfrac\phi2=\cos^2${R(phi / 2, 1)}°=${R(Math.cos(phi / 2 * D2R) ** 2, 4)}$.` };
    const y = pick(rng, 0.1, 0.5, 0.1); const d = 0.5; const D = 1; const del = d * 1e-3 * y * 1e-3 / D * 1e9; return { v, y, d, D, lam, del, q: r`In a double slit set-up ($d=0.5$ mm, $D=1$ m) a point is ${y} mm from the central fringe. Light of wavelength ${lam} nm is used. How many wavelengths long is the path difference there (1 decimal)?`, ...out(del / lam, 1), sol: r`$\Delta=\dfrac{yd}D=\dfrac{${y}\times10^{-3}\times0.5\times10^{-3}}{1}=${R(del, 1)}$ nm. $\dfrac\Delta\lambda=\dfrac{${R(del, 1)}}{${lam}}=${R(del / lam, 2)}$.` };
  }, (p) => (p.v === 0 ? 360 * p.f[0] / p.f[1] : p.v === 1 ? (1 + Math.cos(2 * Math.PI * p.f[0] / p.f[1])) / 2 : p.d * 1e-3 * p.y * 1e-3 / p.D * 1e9 / p.lam)),
  T('wo-g06', 3, 'intensity ratio', 'nat', (rng) => {
    const v = int(rng, 0, 3); const a = choose(rng, [1, 4, 9, 16, 25]); const b = choose(rng, [1, 4, 9]);
    const A = Math.sqrt(a); const B = Math.sqrt(b);
    if (v === 0) { if (a === b) return { v, a: 4, b: 1, q: r`Two coherent sources have intensities in the ratio $4:1$. Find $I_{max}/I_{min}$.`, ...out(9, 0, true), sol: r`Amplitude ratio $2:1$. $\dfrac{(2+1)^2}{(2-1)^2}=9$.` }; const rat = Math.abs(A + B) ** 2 / Math.abs(A - B) ** 2; return { v, a, b, q: r`Two coherent sources have intensities in the ratio $${a}:${b}$. Find $I_{max}/I_{min}$ (2 decimals).`, ...out(rat, 2), sol: r`Amplitude ratio $=\sqrt{${a}}:\sqrt{${b}}=${A}:${B}$. $\dfrac{I_{max}}{I_{min}}=\dfrac{(${A}+${B})^2}{(${A}-${B})^2}=${R(rat, 3)}$.` }; }
    if (v === 1) { const I1 = pick(rng, 1, 9, 1); const I2 = choose(rng, [1, 4, 9, 16]); return { v, I1, I2, q: r`Two coherent waves of intensities ${I1} and ${I2} (arbitrary units) interfere. Find the maximum intensity (2 decimals).`, ...out((Math.sqrt(I1) + Math.sqrt(I2)) ** 2, 2), sol: r`$I_{max}=(\sqrt{I_1}+\sqrt{I_2})^2=(\sqrt{${I1}}+\sqrt{${I2}})^2=${R((Math.sqrt(I1) + Math.sqrt(I2)) ** 2, 3)}$.` }; }
    if (v === 2) { const I1 = pick(rng, 1, 9, 1); const I2 = choose(rng, [1, 4, 9, 16]); return { v, I1, I2, q: r`Two coherent waves of intensities ${I1} and ${I2} (arbitrary units) interfere. Find the minimum intensity (2 decimals).`, ...out((Math.sqrt(I1) - Math.sqrt(I2)) ** 2, 2), sol: r`$I_{min}=(\sqrt{I_1}-\sqrt{I_2})^2=(\sqrt{${I1}}-\sqrt{${I2}})^2=${R((Math.sqrt(I1) - Math.sqrt(I2)) ** 2, 3)}$.` }; }
    const w = choose(rng, [[1, 4], [1, 9], [4, 9], [1, 16]]); const rat = (Math.sqrt(w[0]) + Math.sqrt(w[1])) ** 2 / (Math.sqrt(w[0]) - Math.sqrt(w[1])) ** 2; return { v, w, q: r`The two slits in a double slit set-up have widths in the ratio $${w[0]}:${w[1]}$. Take the intensity from each slit as proportional to its width. Find $I_{max}/I_{min}$ (2 decimals).`, ...out(rat, 2), sol: r`$I_1:I_2=${w[0]}:${w[1]}$, so the amplitudes are $\sqrt{${w[0]}}:\sqrt{${w[1]}}=${Math.sqrt(w[0])}:${Math.sqrt(w[1])}$. $\dfrac{I_{max}}{I_{min}}=\dfrac{(${Math.sqrt(w[0])}+${Math.sqrt(w[1])})^2}{(${Math.sqrt(w[0])}-${Math.sqrt(w[1])})^2}=${R(rat, 3)}$.` };
  }, (p) => { if (p.v === 0) return ((Math.sqrt(p.a) + Math.sqrt(p.b)) / (Math.sqrt(p.a) - Math.sqrt(p.b))) ** 2 || 9; if (p.v === 1) return p.I1 + p.I2 + 2 * Math.sqrt(p.I1 * p.I2); if (p.v === 2) return p.I1 + p.I2 - 2 * Math.sqrt(p.I1 * p.I2); return ((1 + Math.sqrt(p.w[1] / p.w[0])) / (Math.sqrt(p.w[1] / p.w[0]) - 1)) ** 2; }),

  T('wo-g07', 3, 'thin films', 'nat', (rng) => {
    const v = int(rng, 0, 3); const lam = choose(rng, [500, 550, 600, 480, 640]); const n = choose(rng, [1.33, 1.4, 1.5, 1.25, 1.38]);
    if (v === 0) return { v, lam, n, q: r`A soap film of refractive index ${n} in air is lit by light of wavelength ${lam} nm at normal incidence. Find the least thickness at which it looks bright in reflection (in nm, 1 decimal).`, ...out(lam / (4 * n), 1), unit: 'nm', sol: r`Bright: $2nt=(m+\tfrac12)\lambda$ (one $\pi$ phase change). For $m=0$: $t=\dfrac\lambda{4n}=\dfrac{${lam}}{4\times${n}}=${R(lam / (4 * n), 2)}$ nm.` };
    if (v === 1) return { v, lam, n, q: r`A soap film of refractive index ${n} in air is lit by light of wavelength ${lam} nm at normal incidence. Find the least nonzero thickness at which it looks dark in reflection (in nm, 1 decimal).`, ...out(lam / (2 * n), 1), unit: 'nm', sol: r`Dark: $2nt=m\lambda$. For $m=1$: $t=\dfrac\lambda{2n}=\dfrac{${lam}}{2\times${n}}=${R(lam / (2 * n), 2)}$ nm.` };
    if (v === 2) { const nc = choose(rng, [1.25, 1.3, 1.38]); return { v, lam, nc, q: r`A glass lens ($n=1.5$) is coated with a film of refractive index ${nc} to cut reflection of light of wavelength ${lam} nm at normal incidence. Find the least thickness of the film (in nm, 1 decimal).`, ...out(lam / (4 * nc), 1), unit: 'nm', sol: r`Both reflections are from a lower to a higher index ($\pi$ shift each), so darkness needs $2n_ct=\dfrac\lambda2$. $t=\dfrac\lambda{4n_c}=\dfrac{${lam}}{4\times${nc}}=${R(lam / (4 * nc), 2)}$ nm.` }; }
    const th = choose(rng, [1e-4, 2e-4, 2.5e-4, 4e-4]); return { v, lam, th, q: r`An air wedge of angle ${R(th * 1e4, 2)}$\times10^{-4}$ rad is lit from above by light of wavelength ${lam} nm. Find the spacing of neighbouring dark fringes (in mm, 2 decimals).`, ...out(lam * 1e-9 / (2 * th) * 1e3, 2), unit: 'mm', sol: r`Spacing $=\dfrac{\lambda}{2\theta}=\dfrac{${lam}\times10^{-9}}{2\times${th}}=${R(lam * 1e-9 / (2 * th) * 1e3, 3)}\times10^{-3}$ m.` };
  }, (p) => (p.v === 0 ? p.lam / 4 / p.n : p.v === 1 ? p.lam / 2 / p.n : p.v === 2 ? p.lam / 4 / p.nc : p.lam * 1e-9 / 2 / p.th * 1e3)),

  T('wo-g08', 2, 'single slit diffraction', 'nat', (rng) => {
    const v = int(rng, 0, 3); const lam = choose(rng, [500, 550, 600, 650]); const a = choose(rng, [0.1, 0.2, 0.25, 0.4, 0.5]); const D = choose(rng, [1, 1.5, 2]);
    if (v === 0) return { v, lam, a, q: r`A slit ${a} mm wide is lit by light of wavelength ${lam} nm. Find the angle of the first minimum (in milliradians, 2 decimals).`, ...out(lam * 1e-9 / (a * 1e-3) * 1e3, 2), unit: 'mrad', sol: r`$\theta\approx\dfrac\lambda a=\dfrac{${lam}\times10^{-9}}{${a}\times10^{-3}}=${R(lam * 1e-9 / (a * 1e-3) * 1e3, 3)}\times10^{-3}$ rad.` };
    if (v === 1) return { v, lam, a, D, q: r`Light of wavelength ${lam} nm falls on a slit ${a} mm wide. A screen is ${D} m away. Find the width of the central maximum (in mm, 2 decimals).`, ...out(2 * lam * 1e-9 * D / (a * 1e-3) * 1e3, 2), unit: 'mm', sol: r`Width $=\dfrac{2\lambda D}a=\dfrac{2\times${lam}\times10^{-9}\times${D}}{${a}\times10^{-3}}=${R(2 * lam * 1e-9 * D / (a * 1e-3) * 1e3, 3)}\times10^{-3}$ m.` };
    if (v === 2) { const W = R(2 * lam * 1e-9 * D / (a * 1e-3) * 1e3, 2); return { v, lam, D, a, W, q: r`The central maximum of a single slit pattern is ${W} mm wide on a screen ${D} m away (light of wavelength ${lam} nm). Find the slit width (in mm, 3 decimals).`, ...out(2 * lam * 1e-9 * D / (W * 1e-3) * 1e3, 3), unit: 'mm', sol: r`$a=\dfrac{2\lambda D}{\text{width}}=\dfrac{2\times${lam}\times10^{-9}\times${D}}{${W}\times10^{-3}}=${R(2 * lam * 1e-9 * D / (W * 1e-3) * 1e3, 4)}$ mm.` }; }
    const m = int(rng, 2, 4); return { v, lam, a, D, m, q: r`Light of wavelength ${lam} nm falls on a slit ${a} mm wide; the screen is ${D} m away. Find the distance of the ${m}th minimum from the centre of the pattern (in mm, 2 decimals).`, ...out(m * lam * 1e-9 * D / (a * 1e-3) * 1e3, 2), unit: 'mm', sol: r`$y_m=\dfrac{m\lambda D}a=\dfrac{${m}\times${lam}\times10^{-9}\times${D}}{${a}\times10^{-3}}=${R(m * lam * 1e-9 * D / (a * 1e-3) * 1e3, 3)}$ mm.` };
  }, (p) => (p.v === 0 ? p.lam * 1e-9 / (p.a * 1e-3) * 1e3 : p.v === 1 ? 2 * p.lam * 1e-9 * p.D / (p.a * 1e-3) * 1e3 : p.v === 2 ? 2 * p.lam * 1e-9 * p.D / (p.W * 1e-3) * 1e3 : p.m * p.lam * 1e-9 * p.D / (p.a * 1e-3) * 1e3)),

  T('wo-g09', 3, 'resolving power', 'nat', (rng) => {
    const v = int(rng, 0, 3); const lam = choose(rng, [500, 550, 600]); const Dm = choose(rng, [0.05, 0.1, 0.2, 0.5, 1]);
    const th = 1.22 * lam * 1e-9 / Dm;
    if (v === 0) return { v, lam, Dm, q: r`A telescope objective has diameter ${Dm * 100} cm. Find its limit of angular resolution for light of wavelength ${lam} nm (in microradians, 2 decimals).`, ...out(th * 1e6, 2), unit: 'μrad', sol: r`$\Delta\theta=\dfrac{1.22\lambda}D=\dfrac{1.22\times${lam}\times10^{-9}}{${Dm}}=${R(th * 1e6, 3)}\times10^{-6}$ rad.` };
    if (v === 1) { const L = choose(rng, [10, 100, 1000]); return { v, lam, Dm, L, q: r`The aperture of a lens is ${Dm * 100} cm in diameter and light of wavelength ${lam} nm is used. What is the smallest separation (in mm, 3 decimals) of two point objects ${L} m away that can just be resolved?`, ...out(th * L * 1e3, 3), unit: 'mm', sol: r`$\Delta\theta=\dfrac{1.22\lambda}D=${R(th * 1e6, 3)}\times10^{-6}$ rad. Separation $=\Delta\theta\times L=${R(th * 1e6, 3)}\times10^{-6}\times${L}=${R(th * L * 1e3, 4)}$ mm.` }; }
    if (v === 2) { const thv = choose(rng, [1, 2, 5, 10]) * 1e-6; return { v, lam, thv, q: r`A telescope must resolve two stars $${thv * 1e6}\ \mu$rad apart using light of wavelength ${lam} nm. Find the smallest objective diameter (in cm, 1 decimal).`, ...out(1.22 * lam * 1e-9 / thv * 100, 1), unit: 'cm', sol: r`$D=\dfrac{1.22\lambda}{\Delta\theta}=\dfrac{1.22\times${lam}\times10^{-9}}{${thv * 1e6}\times10^{-6}}=${R(1.22 * lam * 1e-9 / thv, 4)}$ m $=${R(1.22 * lam * 1e-9 / thv * 100, 2)}$ cm.` }; }
    const f = choose(rng, [2, 3, 4]); return { v, lam, Dm, f, q: r`A telescope of aperture ${Dm * 100} cm can just resolve two stars. If its aperture is made ${f} times larger, by what factor (3 decimals) does the smallest resolvable angle become? Give the new angle divided by the old.`, ...out(1 / f, 3), sol: r`$\Delta\theta\propto1/D$, so the new angle is $1/${f}=${R(1 / f, 4)}$ of the old one.` };
  }, (p) => (p.v === 0 ? 1.22 * p.lam * 1e-9 / p.Dm * 1e6 : p.v === 1 ? 1.22 * p.lam * 1e-9 / p.Dm * p.L * 1e3 : p.v === 2 ? 1.22 * p.lam * 1e-9 / p.thv * 100 : 1 / p.f)),

  T('wo-g10', 2, 'Malus law', 'nat', (rng) => {
    const v = int(rng, 0, 3); const I0 = pick(rng, 40, 200, 20); const th = choose(rng, [30, 45, 60]);
    if (v === 0) return { v, I0, q: r`Unpolarised light of intensity ${I0} $\mathrm{W\,m^{-2}}$ passes through an ideal polaroid. Find the transmitted intensity (in $\mathrm{W\,m^{-2}}$).`, ...out(I0 / 2, 1), unit: 'W/m²', sol: r`$I=I_0/2=${I0 / 2}\ \mathrm{W\,m^{-2}}$.` };
    if (v === 1) return { v, I0, th, q: r`Plane polarised light of intensity ${I0} $\mathrm{W\,m^{-2}}$ passes through a polaroid whose axis makes $${th}°$ with the plane of polarisation. Find the transmitted intensity (in $\mathrm{W\,m^{-2}}$, 1 decimal).`, ...out(I0 * Math.cos(th * D2R) ** 2, 1), unit: 'W/m²', sol: r`$I=I_0\cos^2\theta=${I0}\times\cos^2${th}°=${R(I0 * Math.cos(th * D2R) ** 2, 2)}\ \mathrm{W\,m^{-2}}$.` };
    if (v === 2) return { v, I0, th, q: r`Unpolarised light of intensity ${I0} $\mathrm{W\,m^{-2}}$ passes through a polaroid and then a second polaroid at $${th}°$ to the first. Find the final intensity (in $\mathrm{W\,m^{-2}}$, 1 decimal).`, ...out(I0 / 2 * Math.cos(th * D2R) ** 2, 1), unit: 'W/m²', sol: r`After the first: $${I0 / 2}$. After the second: $${I0 / 2}\times\cos^2${th}°=${R(I0 / 2 * Math.cos(th * D2R) ** 2, 2)}\ \mathrm{W\,m^{-2}}$.` };
    const fr = choose(rng, [[1, 4, 60], [3, 4, 30], [1, 2, 45]]); return { v, I0, fr, q: r`Plane polarised light of intensity ${I0} units passes through a polaroid and emerges with intensity ${I0 * fr[0] / fr[1]} units. Find the angle between the plane of polarisation and the polaroid's axis (in degrees, taken between $0°$ and $90°$).`, ...out(fr[2], 0, true), unit: '°', sol: r`$\cos^2\theta=\dfrac{I}{I_0}=\dfrac{${fr[0]}}{${fr[1]}}$, so $\cos\theta=${R(Math.sqrt(fr[0] / fr[1]), 4)}$ and $\theta=${fr[2]}°$.` };
  }, (p) => (p.v === 0 ? p.I0 / 2 : p.v === 1 ? p.I0 * (1 + Math.cos(2 * p.th * D2R)) / 2 : p.v === 2 ? p.I0 / 2 * (1 + Math.cos(2 * p.th * D2R)) / 2 : Math.acos(Math.sqrt(p.fr[0] / p.fr[1])) / D2R)),

  T('wo-g11', 2, 'Brewster angle', 'nat', (rng) => {
    const v = int(rng, 0, 3); const n = choose(rng, [1.33, 1.5, 1.6, 1.73, 2]);
    if (v === 0) return { v, n, q: r`Find the Brewster angle for a medium of refractive index ${n} in air (in degrees, 1 decimal).`, ...out(Math.atan(n) / D2R, 1), unit: '°', sol: r`$\tan\theta_B=n=${n}$, so $\theta_B=${R(Math.atan(n) / D2R, 2)}°$.` };
    if (v === 1) { const tb = choose(rng, [45, 53, 56, 60, 63]); return { v, tb, q: r`Light reflected from a transparent surface in air is completely polarised at an angle of incidence of $${tb}°$. Find the refractive index (3 decimals).`, ...out(Math.tan(tb * D2R), 3), sol: r`$n=\tan\theta_B=\tan${tb}°=${R(Math.tan(tb * D2R), 4)}$.` }; }
    if (v === 2) return { v, n, q: r`Light is incident on a medium of refractive index ${n} at the polarising angle. Find the angle of refraction (in degrees, 1 decimal).`, ...out(90 - Math.atan(n) / D2R, 1), unit: '°', sol: r`$\theta_B=\tan^{-1}${n}=${R(Math.atan(n) / D2R, 2)}°$. At this angle $r=90°-\theta_B=${R(90 - Math.atan(n) / D2R, 2)}°$.` };
    const n1 = choose(rng, [1.33, 1.5]); const n2 = choose(rng, [1.6, 1.7, 2]); return { v, n1, n2, q: r`Light travels in a medium of refractive index ${n1} and meets a plane boundary with a medium of refractive index ${n2}. Find the polarising angle for reflection (in degrees, 1 decimal).`, ...out(Math.atan(n2 / n1) / D2R, 1), unit: '°', sol: r`$\tan\theta_B=\dfrac{n_2}{n_1}=\dfrac{${n2}}{${n1}}=${R(n2 / n1, 4)}$, so $\theta_B=${R(Math.atan(n2 / n1) / D2R, 2)}°$.` };
  }, (p) => (p.v === 0 ? Math.atan(p.n) * 180 / Math.PI : p.v === 1 ? Math.tan(p.tb * Math.PI / 180) : p.v === 2 ? 90 - Math.atan(p.n) * 180 / Math.PI : Math.atan(p.n2 / p.n1) * 180 / Math.PI)),

  T('wo-g12', 4, 'polaroids', 'nat', (rng) => {
    const v = int(rng, 0, 2); const I0 = pick(rng, 64, 320, 32);
    if (v === 0) { const th = choose(rng, [30, 45, 60]); return { v, I0, th, q: r`Unpolarised light of intensity ${I0} units falls on two crossed polaroids ($90°$ apart). A third polaroid is placed between them with its axis at $${th}°$ to the first. Find the final intensity (1 decimal).`, ...out(I0 / 2 * Math.cos(th * D2R) ** 2 * Math.cos((90 - th) * D2R) ** 2, 1), sol: r`After the first: $${I0 / 2}$. After the middle: $${I0 / 2}\cos^2${th}°$. After the last (at $${90 - th}°$ to the middle): $\times\cos^2${90 - th}°$. Final $=${R(I0 / 2 * Math.cos(th * D2R) ** 2 * Math.cos((90 - th) * D2R) ** 2, 3)}$.` }; }
    if (v === 1) { const N = int(rng, 2, 4); const stepA = 90 / N; const fin = I0 * Math.cos(stepA * D2R) ** (2 * N); return { v, I0, N, q: r`Plane polarised light of intensity ${I0} units falls on a stack of ${N} polaroids in a row. The first axis is along the plane of polarisation, and each next polaroid is turned by $${stepA}°$ from the one before. Find the final intensity (2 decimals). (Note that the first polaroid is aligned, so it passes everything.)`, ...out(I0 * Math.cos(stepA * D2R) ** (2 * (N - 1)), 2), sol: r`The first polaroid passes all of it (aligned). The remaining ${N - 1} polaroids each multiply the intensity by $\cos^2${stepA}°=${R(Math.cos(stepA * D2R) ** 2, 4)}$. Final $=${I0}\times${R(Math.cos(stepA * D2R) ** 2, 4)}^{${N - 1}}=${R(I0 * Math.cos(stepA * D2R) ** (2 * (N - 1)), 3)}$.` }; }
    const th = choose(rng, [30, 45, 60]); return { v, I0, th, q: r`Unpolarised light of intensity ${I0} units passes through a polaroid, then an analyser at $${th}°$, then a third polaroid at a further $${th}°$. Find the final intensity (2 decimals).`, ...out(I0 / 2 * Math.cos(th * D2R) ** 4, 2), sol: r`After the first: $${I0 / 2}$. Then two factors of $\cos^2${th}°=${R(Math.cos(th * D2R) ** 2, 4)}$. Final $=${I0 / 2}\times${R(Math.cos(th * D2R) ** 4, 4)}=${R(I0 / 2 * Math.cos(th * D2R) ** 4, 3)}$.` };
  }, (p) => (p.v === 0 ? p.I0 / 2 * Math.cos(p.th * Math.PI / 180) ** 2 * Math.sin(p.th * Math.PI / 180) ** 2 : p.v === 1 ? p.I0 * Math.pow(Math.cos(90 / p.N * Math.PI / 180), 2) ** (p.N - 1) : p.I0 / 2 * Math.pow(Math.cos(p.th * Math.PI / 180) ** 2, 2))),

  T('wo-g13', 4, 'white light YDSE', 'nat', (rng) => {
    const v = int(rng, 0, 1); const del = pick(rng, 1200, 2400, 100);
    if (v === 0) return { v, del, q: r`At a point on the screen of a double slit experiment with white light (400 nm to 700 nm) the path difference is ${del} nm. How many wavelengths in the visible range are missing (dark) there?`, ...out(cnt(400, 700, (m) => 2 * del / (2 * m - 1)), 0, true), sol: r`Dark: $\Delta=(m-\tfrac12)\lambda$, so $\lambda=\dfrac{2\times${del}}{2m-1}=\dfrac{${2 * del}}{2m-1}$ nm. List the values for $m=1,2,3,\ldots$ and count those between 400 and 700 nm: there are ${cnt(400, 700, (m) => 2 * del / (2 * m - 1))}.`, trap: 'List the wavelengths first, then keep those in the visible range.' };
    return { v, del, q: r`At a point on the screen of a double slit experiment with white light (400 nm to 700 nm) the path difference is ${del} nm. How many visible wavelengths are strongly bright there?`, ...out(cnt(400, 700, (m) => del / m), 0, true), sol: r`Bright: $\Delta=m\lambda$, so $\lambda=\dfrac{${del}}m$ nm. Taking $m=1,2,3,\ldots$ and keeping those from 400 to 700 nm gives ${cnt(400, 700, (m) => del / m)} wavelengths.` };
  }, (p) => { let n = 0; for (let m = 1; m < 200; m++) { const x = p.v === 0 ? 2 * p.del / (2 * m - 1) : p.del / m; if (x >= 400 && x <= 700) n++; } return n; }),

  T('wo-g14', 4, 'Newton rings', 'nat', (rng) => {
    const v = int(rng, 0, 2); const lam = choose(rng, [500, 550, 600]); const Rc = choose(rng, [0.5, 0.9, 1, 1.5, 2]); const m = int(rng, 2, 10);
    const rm = Math.sqrt(m * lam * 1e-9 * Rc) * 1e3;
    if (v === 0) return { v, lam, Rc, m, q: r`In a Newton's rings experiment the lens has radius of curvature ${Rc} m and the light has wavelength ${lam} nm. Find the radius of the ${m}th dark ring in reflected light (in mm, 3 decimals).`, ...out(rm, 3), unit: 'mm', sol: r`$r_m^2=m\lambda R$, so $r=\sqrt{${m}\times${lam}\times10^{-9}\times${Rc}}=${R(rm, 4)}\times10^{-3}$ m.` };
    if (v === 1) { const r1 = R(rm, 3); return { v, lam, m, r1, q: r`In a Newton's rings experiment with light of wavelength ${lam} nm the ${m}th dark ring has radius ${r1} mm. Find the radius of curvature of the lens (in m, 2 decimals).`, ...out((r1 * 1e-3) ** 2 / (m * lam * 1e-9), 2), unit: 'm', sol: r`$R=\dfrac{r_m^2}{m\lambda}=\dfrac{(${r1}\times10^{-3})^2}{${m}\times${lam}\times10^{-9}}=${R((r1 * 1e-3) ** 2 / (m * lam * 1e-9), 3)}$ m.` }; }
    const n = choose(rng, [1.33, 1.5]); return { v, lam, Rc, m, n, q: r`In Newton's rings the ${m}th dark ring has radius ${R(rm, 3)} mm in air. The gap is then filled with a liquid of refractive index ${n}. Find the radius of this ring now (in mm, 3 decimals).`, rm: R(rm, 3), ...out(R(rm, 3) / Math.sqrt(n), 3), unit: 'mm', sol: r`$r_m^2=\dfrac{m\lambda R}n$, so $r\propto\dfrac1{\sqrt n}$. $r'=\dfrac{${R(rm, 3)}}{\sqrt{${n}}}=${R(R(rm, 3) / Math.sqrt(n), 4)}$ mm.` };
  }, (p) => (p.v === 0 ? Math.sqrt(p.m * p.lam * 1e-9 * p.Rc) * 1e3 : p.v === 1 ? (p.r1 * 1e-3) ** 2 / (p.m * p.lam * 1e-9) : p.rm / Math.sqrt(p.n))),
  T('wo-g15', 3, 'refraction by Huygens', 'nat', (rng) => {
    const v = int(rng, 0, 3); const n = choose(rng, [1.33, 1.5, 1.6, 2]); const i = choose(rng, [30, 45, 60]);
    if (v === 0) return { v, n, i, q: r`A plane wavefront of light in air strikes a transparent surface of refractive index ${n} at an angle of incidence $${i}°$. Find the angle between the refracted wavefront and the surface (the angle of refraction, in degrees, 1 decimal).`, ...out(asind(sind(i) / n), 1), unit: '°', sol: r`Huygens' construction gives $\dfrac{\sin i}{\sin r}=\dfrac{v_1}{v_2}=n$. $\sin r=\dfrac{\sin${i}°}{${n}}=${R(sind(i) / n, 4)}$, so $r=${R(asind(sind(i) / n), 2)}°$.` };
    if (v === 1) { const rr = choose(rng, [30, 35, 40]); const i2 = choose(rng, [45, 60]); const nn = sind(i2) / sind(rr); return { v, i2, rr, q: r`A plane wavefront in air meets a surface at $${i2}°$ and the refracted wavefront makes $${rr}°$ with the surface (angle of refraction). Find the refractive index (3 decimals).`, ...out(nn, 3), sol: r`$n=\dfrac{\sin i}{\sin r}=\dfrac{\sin${i2}°}{\sin${rr}°}=${R(nn, 4)}$.` }; }
    if (v === 2) { const lam = choose(rng, [480, 540, 600, 660]); return { v, n, lam, q: r`Light of wavelength ${lam} nm in air passes into a medium of refractive index ${n}. Find its wavelength in the medium (in nm, 1 decimal).`, ...out(lam / n, 1), unit: 'nm', sol: r`$\lambda'=\lambda/n=\dfrac{${lam}}{${n}}=${R(lam / n, 2)}$ nm; the frequency does not change.` }; }
    const lam = choose(rng, [480, 540, 600]); const lam2 = R(lam / n, 1); return { v, n, lam, lam2, q: r`Light has wavelength ${lam} nm in air and ${lam2} nm in a medium. Find the speed of light in the medium (in units of $10^8\ \mathrm{m\,s^{-1}}$, 2 decimals; $c=3\times10^8$).`, ...out(3 * lam2 / lam, 2), unit: '×10⁸ m/s', sol: r`$v=\dfrac{\lambda'}{\lambda}c=\dfrac{${lam2}}{${lam}}\times3\times10^8=${R(3 * lam2 / lam, 3)}\times10^8\ \mathrm{m\,s^{-1}}$ (frequency is the same, so speeds scale like wavelengths).` };
  }, (p) => (p.v === 0 ? Math.asin(Math.sin(p.i * D2R) / p.n) / D2R : p.v === 1 ? Math.sin(p.i2 * D2R) / Math.sin(p.rr * D2R) : p.v === 2 ? p.lam / p.n : 3 * p.lam2 / p.lam)),

  T('wo-g16', 3, 'YDSE', 'nat', (rng) => {
    const v = int(rng, 0, 2); const d = choose(rng, [1.2, 1.5, 2, 2.5, 3, 3.5]); const lam = choose(rng, [500, 600]); const ratio = Math.round(d * 1000 / lam * 1e6) / 1e6; const mMax = Math.ceil(ratio) - 1;
    if (v === 0) return { v, d, lam, q: r`In a double slit experiment the slits are ${d} $\mu$m apart and the light has wavelength ${lam} nm. How many bright fringes (counting the central one) can be formed on a very wide screen?`, ...out(2 * mMax + 1, 0, true), sol: r`$d\sin\theta=m\lambda$ needs $m<\dfrac d\lambda=\dfrac{${d * 1000}}{${lam}}=${R(ratio, 3)}$ (strictly, since $\theta=90°$ cannot be reached on the screen). So $m_{max}=${mMax}$ and the total is $2\times${mMax}+1=${2 * mMax + 1}$.`, trap: 'If $d/\\lambda$ is a whole number, that order lies at $90°$ and does not count.' };
    if (v === 1) { const m = int(rng, 1, Math.max(1, mMax)); return { v, d, lam, m, q: r`In a double slit experiment the slits are ${d} $\mu$m apart and the wavelength is ${lam} nm. Find the angle of the ${m}th bright fringe from the central line (in degrees, 1 decimal).`, ...out(asind(m * lam / (d * 1000)), 1), unit: '°', sol: r`$\sin\theta=\dfrac{m\lambda}d=\dfrac{${m}\times${lam}}{${d * 1000}}=${R(m * lam / (d * 1000), 4)}$, so $\theta=${R(asind(m * lam / (d * 1000)), 2)}°$.` }; }
    return { v, d, lam, q: r`In a double slit experiment the slits are ${d} $\mu$m apart and the wavelength is ${lam} nm. What is the highest order of bright fringe that can be seen on the screen?`, ...out(mMax, 0, true), sol: r`Highest order $m<\dfrac d\lambda=${R(ratio, 3)}$, so $m_{max}=${mMax}$.` };
  }, (p) => { const ratio = Math.round(p.d * 1000 / p.lam * 1e6) / 1e6; const mm = Math.ceil(ratio) - 1; return p.v === 0 ? 2 * mm + 1 : p.v === 1 ? Math.asin(p.m * p.lam / (p.d * 1000)) / D2R : mm; }),

  T('wo-g17', 3, 'Lloyd mirror', 'nat', (rng) => {
    const v = int(rng, 0, 2); const h = choose(rng, [0.5, 1, 1.5, 2]); const lam = choose(rng, LAM); const D = choose(rng, [1, 1.5, 2]); const b = lam * 1e-9 * D / (2 * h * 1e-3) * 1e3;
    if (v === 0) return { v, h, lam, D, q: r`In a Lloyd's mirror arrangement the slit is ${h} mm above the plane of the mirror and the screen is ${D} m away. Find the fringe width for light of wavelength ${lam} nm (in mm, 3 decimals).`, ...out(b, 3), unit: 'mm', sol: r`The slit and its image are $d=2h=${2 * h}$ mm apart. $\beta=\dfrac{\lambda D}{d}=\dfrac{${lam}\times10^{-9}\times${D}}{${2 * h}\times10^{-3}}=${R(b, 4)}$ mm.` };
    if (v === 1) return { v, h, lam, D, q: r`In a Lloyd's mirror experiment the slit is ${h} mm above the mirror's plane, the screen ${D} m away and the wavelength ${lam} nm. The edge of the mirror touches the screen. Find the distance of the first bright fringe from the edge of the mirror (in mm, 3 decimals).`, ...out(b / 2, 3), unit: 'mm', sol: r`At the mirror's edge the fringe is dark (extra $\pi$ phase on reflection). The first bright fringe is half a fringe width away: $\dfrac\beta2$ with $\beta=\dfrac{\lambda D}{2h}=${R(b, 4)}$ mm. So $${R(b / 2, 4)}$ mm.`, trap: 'The reflected ray gains a half-wave, so the first fringe at the mirror edge is dark.' };
    const bb = R(b, 3); return { v, h, lam, D, bb, q: r`A Lloyd's mirror set-up with light of wavelength ${lam} nm and a screen ${D} m away gives fringes ${bb} mm wide. Find the height of the slit above the mirror's plane (in mm, 2 decimals).`, ...out(lam * 1e-9 * D / (2 * bb * 1e-3) * 1e3, 2), unit: 'mm', sol: r`$\beta=\dfrac{\lambda D}{2h}$, so $h=\dfrac{\lambda D}{2\beta}=\dfrac{${lam}\times10^{-9}\times${D}}{2\times${bb}\times10^{-3}}=${R(lam * 1e-9 * D / (2 * bb * 1e-3) * 1e3, 3)}$ mm.` };
  }, (p) => (p.v === 0 ? p.lam * 1e-9 * p.D / (2 * p.h * 1e-3) * 1e3 : p.v === 1 ? p.lam * 1e-9 * p.D / (4 * p.h * 1e-3) * 1e3 : p.lam * 1e-9 * p.D / (2 * p.bb * 1e-3) * 1e3)),

  T('wo-g18', 3, 'Fresnel distance', 'nat', (rng) => {
    const v = int(rng, 0, 2); const a = choose(rng, [1, 2, 3, 4, 5]); const lam = choose(rng, [500, 600, 400]);
    if (v === 0) return { v, a, lam, q: r`A beam of light of wavelength ${lam} nm passes through a slit ${a} mm wide. Find the Fresnel distance $a^2/\lambda$ up to which the beam hardly spreads (in m, 1 decimal).`, ...out(a * a * 1e-6 / (lam * 1e-9), 1), unit: 'm', sol: r`$z_F=\dfrac{a^2}\lambda=\dfrac{(${a}\times10^{-3})^2}{${lam}\times10^{-9}}=${R(a * a * 1e-6 / (lam * 1e-9), 2)}$ m.` };
    if (v === 1) return { v, a, lam, q: r`Light of wavelength ${lam} nm passes through a slit ${a} mm wide. Find the angular half-width $\lambda/a$ of the central diffraction maximum (in milliradians, 3 decimals).`, ...out(lam * 1e-9 / (a * 1e-3) * 1e3, 3), unit: 'mrad', sol: r`$\theta=\dfrac\lambda a=\dfrac{${lam}\times10^{-9}}{${a}\times10^{-3}}=${R(lam * 1e-9 / (a * 1e-3) * 1e3, 4)}\times10^{-3}$ rad.` };
    const z = choose(rng, [2, 4, 8, 16]); return { v, z, lam, q: r`A beam of light of wavelength ${lam} nm should spread little up to ${z} m. Find the slit width $a$ for which the Fresnel distance $a^2/\lambda$ equals ${z} m (in mm, 2 decimals).`, ...out(Math.sqrt(lam * 1e-9 * z) * 1e3, 2), unit: 'mm', sol: r`$a=\sqrt{\lambda z}=\sqrt{${lam}\times10^{-9}\times${z}}=${R(Math.sqrt(lam * 1e-9 * z), 5)}$ m $=${R(Math.sqrt(lam * 1e-9 * z) * 1e3, 3)}$ mm.` };
  }, (p) => (p.v === 0 ? p.a * p.a * 1e-6 / (p.lam * 1e-9) : p.v === 1 ? p.lam * 1e-9 / (p.a * 1e-3) * 1e3 : Math.sqrt(p.lam * 1e-9 * p.z) * 1e3)),

  T('wo-g19', 3, 'intensity in interference', 'nat', (rng) => {
    const I1 = choose(rng, [1, 4, 9, 16]); const I2 = choose(rng, [1, 4, 9, 16]); const phi = choose(rng, [0, 60, 90, 120, 180]); const I = I1 + I2 + 2 * Math.sqrt(I1 * I2) * Math.cos(phi * D2R);
    return { I1, I2, phi, q: r`Two coherent waves of intensities ${I1} and ${I2} (arbitrary units) meet at a point with a phase difference of $${phi}°$. Find the resultant intensity there (1 decimal).`, ...out(I, 1), sol: r`$I=I_1+I_2+2\sqrt{I_1I_2}\cos\phi=${I1}+${I2}+2\sqrt{${I1 * I2}}\cos${phi}°=${R(I, 2)}$.` };
  }, (p) => p.I1 + p.I2 + 2 * Math.sqrt(p.I1) * Math.sqrt(p.I2) * Math.cos(p.phi * Math.PI / 180)),

  T('wo-g20', 3, 'YDSE', 'mcq', (rng) => {
    const b0 = choose(rng, [0.4, 0.5, 0.6, 0.8, 1, 1.2]); const a = choose(rng, [1, 2, 0.5, 1.5]); const bb = choose(rng, [1, 2, 0.5]); const cc = choose(rng, [1, 2, 4]);
    const nb = b0 * a * bb / cc;
    const o = numOpts(rng, nb, [b0 * a * cc / bb, b0 * a * bb * cc, b0 * bb / (a * cc)], 'mm', 3);
    const ch = [];
    if (a !== 1) ch.push(`the wavelength is multiplied by ${a}`); if (bb !== 1) ch.push(`the screen distance is multiplied by ${bb}`); if (cc !== 1) ch.push(`the slit separation is multiplied by ${cc}`);
    const chText = ch.length ? ch.join(', ') : 'nothing is changed';
    return { b0, a, bb, cc, q: r`The fringe width in a double slit experiment is ${b0} mm. Then ${chText}. The new fringe width is`, options: o.options, answer: o.answer, sol: r`$\beta=\dfrac{\lambda D}d$, so $\beta'=\beta\times\dfrac{${a}\times${bb}}{${cc}}=${b0}\times${R(a * bb / cc, 4)}=${R(nb, 4)}$ mm.`, trap: 'Wavelength and screen distance are in the numerator, slit separation in the denominator.' };
  }, (p) => p.options.indexOf(`${fmt(p.b0 * p.a * p.bb / p.cc, 3)} mm`)),

  T('wo-g21', 2, 'Malus law', 'mcq', (rng) => {
    const I0 = choose(rng, [20, 40, 80, 100, 160]); const th = choose(rng, [30, 60]);
    const right = I0 * Math.cos(th * D2R) ** 2;
    const o = numOpts(rng, right, [I0 * Math.cos(th * D2R), I0 * Math.sin(th * D2R) ** 2 === right ? I0 * Math.sin(th * D2R) ** 2 + 1 : I0 * Math.sin(th * D2R) ** 2, I0 / 2 * Math.cos(th * D2R) ** 2], 'units', 3);
    return { I0, th, q: r`Plane polarised light of intensity ${I0} units falls on a polaroid whose axis makes $${th}°$ with the plane of polarisation. The transmitted intensity is`, options: o.options, answer: o.answer, sol: r`Malus's law: $I=I_0\cos^2\theta=${I0}\times\cos^2${th}°=${R(right, 3)}$. Using $\cos\theta$ instead of $\cos^2\theta$ is the usual slip, and the factor $\tfrac12$ is only for unpolarised light.`, trap: 'The square of the cosine, and no factor of 1/2 for already polarised light.' };
  }, (p) => p.options.indexOf(`${fmt(p.I0 * Math.cos(p.th * Math.PI / 180) ** 2, 3)} units`)),

  T('wo-g22', 2, 'YDSE', 'nat', (rng) => {
    const v = int(rng, 0, 1); const n = int(rng, 4, 12); const L = pick(rng, 8, 24, 2); const d = choose(rng, [0.3, 0.4, 0.5]); const D = choose(rng, [1, 1.5, 2]);
    const b = L / n;
    if (v === 0) return { v, n, L, q: r`${n} consecutive bright fringes in a double slit pattern span ${L} mm from the first to the last, so there are ${n - 1} fringe widths between them. Find the fringe width (in mm, 3 decimals).`, ...out(L / (n - 1), 3), unit: 'mm', sol: r`${n} bright fringes have ${n - 1} gaps. $\beta=\dfrac{${L}}{${n - 1}}=${R(L / (n - 1), 4)}$ mm.`, trap: 'Count the gaps, not the fringes.' };
    return { v, n, L, d, D, q: r`${n} consecutive bright fringes span ${L} mm on a screen ${D} m from slits ${d} mm apart. Find the wavelength of the light (in nm, nearest whole number).`, ...out(L / (n - 1) * 1e-3 * d * 1e-3 / D * 1e9, 0), unit: 'nm', sol: r`$\beta=\dfrac{${L}}{${n - 1}}=${R(L / (n - 1), 4)}$ mm. $\lambda=\dfrac{\beta d}D=\dfrac{${R(L / (n - 1), 4)}\times10^{-3}\times${d}\times10^{-3}}{${D}}=${R(L / (n - 1) * 1e-3 * d * 1e-3 / D * 1e9, 1)}$ nm.` };
  }, (p) => (p.v === 0 ? p.L / (p.n - 1) : p.L / (p.n - 1) * 1e-3 * p.d * 1e-3 / p.D * 1e9)),

  T('wo-g23', 3, 'optical path', 'nat', (rng) => {
    const v = int(rng, 0, 2); const n = choose(rng, [1.5, 1.6, 1.4]); const t = choose(rng, [1, 1.5, 2, 2.5, 3]); const lam = choose(rng, [500, 600]);
    if (v === 0) return { v, n, t, q: r`Light passes through a transparent plate of refractive index ${n} and thickness ${t} $\mu$m. Find the optical path length through it (in $\mu$m, 2 decimals).`, ...out(n * t, 2), unit: 'μm', sol: r`Optical path $=nt=${n}\times${t}=${R(n * t, 3)}\ \mu$m.` };
    if (v === 1) return { v, n, t, lam, q: r`How many wavelengths of light (vacuum wavelength ${lam} nm) fit inside a plate of refractive index ${n} and thickness ${t} $\mu$m? (2 decimals)`, ...out(n * t * 1000 / lam, 2), sol: r`Number $=\dfrac{nt}{\lambda}=\dfrac{${n}\times${t * 1000}}{${lam}}=${R(n * t * 1000 / lam, 3)}$.` };
    return { v, n, t, lam, q: r`A plate of refractive index ${n} and thickness ${t} $\mu$m is put in one beam of an interference arrangement (wavelength ${lam} nm). Find the extra phase difference it introduces in units of $\pi$ radians (2 decimals).`, ...out(2 * (n - 1) * t * 1000 / lam, 2), sol: r`Extra path $=(n-1)t=${R((n - 1) * t, 3)}\ \mu$m. $\phi=\dfrac{2\pi}\lambda(n-1)t=2\pi\times${R((n - 1) * t * 1000 / lam, 3)}=${R(2 * (n - 1) * t * 1000 / lam, 3)}\pi$.` };
  }, (p) => (p.v === 0 ? p.n * p.t : p.v === 1 ? p.n * p.t * 1000 / p.lam : 2 * (p.n - 1) * p.t * 1000 / p.lam)),

  T('wo-g24', 5, 'diffraction and interference', 'nat', (rng) => {
    const v = int(rng, 0, 1); const d = choose(rng, [400, 500, 600, 750, 900]); const a = choose(rng, [100, 200, 150]);
    const k = Math.round(d / a * 1e6) / 1e6;
    if (v === 0) return { v, d, a, q: r`A double slit has slit separation ${d} $\mu$m and each slit is ${a} $\mu$m wide. How many bright interference fringes (counting the central one) lie within the central diffraction maximum? (An interference order that falls exactly on a diffraction minimum is missing.)`, ...out(2 * Math.ceil(k) - 1, 0, true), sol: r`The central diffraction maximum extends to $\sin\theta=\lambda/a$, i.e. interference order $m<\dfrac da=${R(k, 3)}$ (if $d/a$ is a whole number, that order is missing). Orders $0,\pm1,\ldots,\pm${Math.ceil(k) - 1}$ remain: $2\times${Math.ceil(k) - 1}+1=${2 * Math.ceil(k) - 1}$.` , trap: 'An order coinciding with a diffraction minimum is not seen.' };
    return { v, d, a, q: r`A double slit has slit separation ${d} $\mu$m and slit width ${a} $\mu$m. Find the ratio of the width of the central diffraction maximum to the width of one interference fringe on the screen (2 decimals).`, ...out(2 * d / a, 2), sol: r`Central maximum width $=\dfrac{2\lambda D}a$; fringe width $=\dfrac{\lambda D}d$. Ratio $=\dfrac{2d}a=\dfrac{2\times${d}}{${a}}=${R(2 * d / a, 3)}$.` };
  }, (p) => { const k = Math.round(p.d / p.a * 1e6) / 1e6; return p.v === 0 ? 2 * Math.ceil(k) - 1 : 2 * p.d / p.a; }),
];

export default { topic: 'wave-optics', groups, items, gens };
