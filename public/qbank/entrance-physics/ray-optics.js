// Ray optics: Plus Two entrance bank (original fibub questions).
import { pick, int, choose, fmt, shuffleOpts, numOpts } from '../_entrance.js';
import { tidyGens } from '../_util.js';

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
const nid = () => `ro-${String(++k).padStart(3, '0')}`;
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
  mcq(1, 'plane mirror', r`The image formed by a plane mirror of a real object is`, 'virtual, erect and the same size as the object', ['real, erect and the same size', 'virtual, inverted and the same size', 'real, inverted and smaller'],
    r`Reflected rays diverge and only appear to meet behind the mirror, so the image is virtual. It is erect (up is still up), laterally inverted (left and right swap) and of magnification $+1$.`),
  nat(1, 'plane mirror', r`A candle is 3 m in front of a plane mirror. Find the distance between the candle and its image (in m).`, () => 3 + 3, 0, 0,
    r`The image is as far behind the mirror as the object is in front: 3 m. Distance between object and image $=3+3=6$ m.`, { unit: 'm' }),
  mcq(1, 'reflection', r`A ray strikes a plane mirror with an angle of incidence of $30°$. The angle between the incident ray and the reflected ray is`, r`$60°$`, [r`$30°$`, r`$120°$`, r`$150°$`],
    r`Angles are measured from the normal. Angle of reflection $=30°$. The angle between the two rays is $30°+30°=60°$.`, { trap: 'Angle of incidence is from the normal, not from the mirror surface.' }),
  nat(1, 'spherical mirrors', r`A spherical mirror has radius of curvature 40 cm. Find the magnitude of its focal length (in cm).`, () => 40 / 2, 0, 0,
    r`$f = R/2 = 40/2 = 20$ cm.`, { unit: 'cm' }),
  mcq(1, 'spherical mirrors', r`A mirror suitable for a car's headlight reflector is`, 'concave, with the bulb at its focus', ['convex, with the bulb at its focus', 'plane, with the bulb in front', 'convex, with the bulb at its centre of curvature'],
    r`A source at the focus of a concave mirror gives a parallel beam after reflection. Convex and plane mirrors cannot do this.`),
  mcq(1, 'lenses', r`The SI unit of power of a lens is`, 'dioptre ($\\mathrm{m^{-1}}$)', ['metre', 'watt', 'dioptre per metre'],
    r`Power $P=1/f$ with $f$ in metres. One dioptre is $1\ \mathrm{m^{-1}}$. (It has nothing to do with watts.)`),
  nat(1, 'lenses', r`A convex lens has focal length 25 cm. Find its power (in dioptre).`, () => 100 / 25, 0, 0,
    r`$P=1/f = 1/0.25 = 4$ D.`, { unit: 'D' }),
  mcq(1, 'refraction', r`The refractive index of a medium is defined as`, r`$c/v$, the speed of light in vacuum divided by the speed in the medium`, [r`$v/c$`, r`$c\times v$`, r`$c-v$`],
    r`$n=c/v$. Since $v<c$ in any material, $n>1$. It has no unit.`),
  mcq(1, 'refraction', r`When light passes from air into glass, which quantity does NOT change?`, 'frequency', ['speed', 'wavelength', 'both speed and wavelength'],
    r`The frequency is set by the source. Speed falls to $c/n$ and wavelength to $\lambda/n$, but frequency stays the same.`),
  nat(1, 'refraction', r`The refractive index of glass is 1.5. Find the speed of light in it (in units of $10^8\ \mathrm{m\,s^{-1}}$; $c=3\times10^8\ \mathrm{m\,s^{-1}}$).`, () => 3 / 1.5, 0.01, 2,
    r`$v=c/n=3\times10^8/1.5=2.0\times10^8\ \mathrm{m\,s^{-1}}$.`, { unit: '×10⁸ m/s' }),
  mcq(1, 'total internal reflection', r`Total internal reflection can occur when light goes`, 'from a denser to a rarer medium at an angle of incidence larger than the critical angle', ['from a rarer to a denser medium at any angle', 'from a denser to a rarer medium at normal incidence', 'from a rarer to a denser medium at a large angle'],
    r`Both conditions are needed: denser to rarer, and angle of incidence above the critical angle. Going from rarer to denser, the ray always bends towards the normal and can never be totally reflected.`),
  mcq(1, 'lenses', r`An object is placed beyond $2F$ of a convex lens. The image is`, 'real, inverted and diminished, between $F$ and $2F$', ['real, inverted and magnified, beyond $2F$', 'virtual, erect and magnified', 'real, erect and diminished'],
    r`For $u>2f$ the image lies between $f$ and $2f$ on the other side, real, inverted and smaller. This is how a camera works.`),
  nat(1, 'total internal reflection', r`A glass of refractive index 2 is surrounded by air. Find the critical angle (in degrees).`, () => asind(1 / 2), 0, 0,
    r`$\sin C=1/n=1/2$, so $C=30°$.`, { unit: '°' }),
  mcq(1, 'spherical mirrors', r`A shaving mirror gives an enlarged, erect image. It is`, 'concave, with the face inside the focal length', ['convex, with the face anywhere', 'plane', 'concave, with the face beyond the centre of curvature'],
    r`Only a concave mirror, with the object between pole and focus, gives a virtual, erect, magnified image.`),
  mcq(1, 'dispersion', r`When white light passes through a prism, the colour that is deviated the most is`, 'violet', ['red', 'green', 'yellow'],
    r`The refractive index is largest for violet (shortest wavelength), so it bends most. Red bends least.`),
  mcq(1, 'optical instruments', r`Short sight (myopia) is corrected using a`, 'concave lens', ['convex lens', 'cylindrical lens', 'plane glass plate'],
    r`A myopic eye focuses too soon, in front of the retina. A diverging (concave) lens moves the image back onto the retina.`),
  nat(1, 'spherical mirrors', r`An object is 30 cm in front of a concave mirror of focal length 15 cm. Find the image distance from the pole (take the sign by the Cartesian rule; answer in cm).`, () => mirV(-30, -15), 0, 0,
    r`$u=-30$, $f=-15$. $\dfrac1v=\dfrac1f-\dfrac1u=-\dfrac1{15}+\dfrac1{30}=-\dfrac1{30}$, so $v=-30$ cm. The object is at the centre of curvature, so the image is real (in front of the mirror) at the same place, of the same size.`, { unit: 'cm' }),
  nat(1, 'spherical mirrors', r`A mirror forms a real image at $v=-40$ cm of an object at $u=-20$ cm. Find the magnification $m=-v/u$.`, () => -(-40) / (-20), 0, 0,
    r`$m=-\dfrac vu=-\dfrac{-40}{-20}=-2$. The negative sign means the image is inverted; its size is twice the object's.`),
  mcq(1, 'lenses', r`The power of a concave lens is`, 'negative', ['positive', 'zero', 'positive only for thick lenses'],
    r`A concave lens has a negative focal length, so $P=1/f<0$.`),
);
// ---------- Level 2 ----------
items.push(
  nat(2, 'reflection', r`A plane mirror is turned through $15°$ about an axis in its surface while the incident ray stays fixed. Through what angle (in degrees) does the reflected ray turn?`, () => 2 * 15, 0, 0,
    r`Turning the mirror by $\theta$ turns the normal by $\theta$, so the angle of incidence changes by $\theta$ and the reflected ray turns by $2\theta=30°$.`, { unit: '°', trap: 'The ray turns twice as much as the mirror.' }),
  mcq(2, 'plane mirror', r`Two plane mirrors are inclined at $90°$. A small object is placed between them (not on the bisector line). The number of images formed is`, '3', ['2', '4', '1'],
    r`$n=\dfrac{360°}{\theta}-1=\dfrac{360}{90}-1=3$. This holds when $360°/\theta$ is an even number for any position of the object.`),
  nat(2, 'plane mirror', r`Two plane mirrors are inclined at $60°$ with an object on the bisector. How many images are seen?`, () => 360 / 60 - 1, 0, 0,
    r`$n=360/60-1=5$ (with $360/\theta$ even, this is valid for any position).`),
  nat(2, 'plane mirror', r`A man 1.8 m tall wants to see his full image in a vertical plane mirror. Find the minimum length of the mirror (in m).`, () => 1.8 / 2, 0.01, 2,
    r`The mirror needs to span from the midpoint between eyes and head to the midpoint between eyes and feet. That is half of his height: $1.8/2=0.9$ m, whatever his distance from the mirror.`, { unit: 'm', trap: 'The result does not depend on how far he stands.' }),
  nat(2, 'spherical mirrors', r`A concave mirror has focal length 10 cm. An object is placed 15 cm from it. Find the image distance (in cm, taking the sign by the Cartesian rule).`, () => mirV(-15, -10), 0, 0,
    r`$\dfrac1v=\dfrac1f-\dfrac1u=-\dfrac1{10}+\dfrac1{15}=-\dfrac1{30}$, so $v=-30$ cm: a real image 30 cm in front of the mirror.`, { unit: 'cm' }),
  nat(2, 'spherical mirrors', r`A convex mirror has radius of curvature 40 cm. An object is 60 cm in front of it. Find the image distance from the pole (in cm, with sign).`, () => mirV(-60, 20), 0, 0,
    r`$f=+R/2=+20$ cm, $u=-60$ cm. $\dfrac1v=\dfrac1{20}+\dfrac1{60}=\dfrac4{60}$, so $v=+15$ cm: a virtual image behind the mirror.`, { unit: 'cm' }),
  nat(2, 'spherical mirrors', r`A convex mirror of focal length 20 cm gives an image half the size of the object. Find the object distance (in cm).`, () => 20, 0, 0,
    r`For a mirror $m=\dfrac{f}{f-u}$. With $f=+20$ and $m=+\tfrac12$: $f-u=40$, so $u=-20$ cm. The object is 20 cm in front, at a distance equal to $f$.`, { unit: 'cm' }),
  nat(2, 'apparent depth', r`A coin lies at the bottom of a pond 12 cm deep ($n=4/3$). Seen from directly above, how deep does it appear (in cm)?`, () => 12 / (4 / 3), 0, 0,
    r`Apparent depth $=\dfrac{\text{real depth}}{n}=\dfrac{12}{4/3}=9$ cm.`, { unit: 'cm' }),
  nat(2, 'refraction through a slab', r`A glass slab ($n=1.5$) of thickness 6 cm is placed on a printed line. Looking from directly above, by how much (in cm) does the line appear to rise?`, () => 6 * (1 - 1 / 1.5), 0, 0,
    r`Normal shift $=t\left(1-\dfrac1n\right)=6\left(1-\dfrac23\right)=2$ cm.`, { unit: 'cm' }),
  nat(2, 'refraction', r`Light in air strikes a plane surface of a liquid at $45°$ and refracts at $30°$. Find the refractive index of the liquid (2 decimals).`, () => sind(45) / sind(30), 0.01, 2,
    r`$n=\dfrac{\sin i}{\sin r}=\dfrac{0.7071}{0.5}=1.41$.`),
  nat(2, 'total internal reflection', r`Find the critical angle for water-to-air ($n=4/3$) in degrees (1 decimal).`, () => asind(0.75), 0.1, 1,
    r`$\sin C=1/n=3/4=0.75$, so $C=48.6°$.`, { unit: '°' }),
  nat(2, 'lenses', r`A convex lens has focal length 20 cm. An object is 30 cm from it. Find the image distance (in cm).`, () => lensV(-30, 20), 0, 0,
    r`$\dfrac1v=\dfrac1f+\dfrac1u=\dfrac1{20}-\dfrac1{30}=\dfrac1{60}$, so $v=60$ cm (real, on the other side).`, { unit: 'cm' }),
  nat(2, 'lenses', r`A concave lens has focal length 15 cm. An object is placed 30 cm from it. Find the image distance (in cm, with sign).`, () => lensV(-30, -15), 0, 0,
    r`$\dfrac1v=\dfrac1f+\dfrac1u=-\dfrac1{15}-\dfrac1{30}=-\dfrac1{10}$, so $v=-10$ cm: virtual, on the object's side.`, { unit: 'cm' }),
  nat(2, 'lenses', r`A lens has $n=1.5$ and radii of curvature 20 cm (first face, convex towards the object) and 20 cm (second face, convex). Find its focal length (in cm).`, () => 1 / ((1.5 - 1) * (1 / 20 + 1 / 20)), 0, 0,
    r`With signs, $R_1=+20$, $R_2=-20$. $\dfrac1f=(n-1)\left(\dfrac1{R_1}-\dfrac1{R_2}\right)=0.5\left(\dfrac1{20}+\dfrac1{20}\right)=\dfrac1{20}$, so $f=20$ cm.`, { unit: 'cm' }),
  nat(2, 'prism', r`A thin prism of angle $4°$ is made of glass of $n=1.5$. Find the deviation of a ray (in degrees).`, () => (1.5 - 1) * 4, 0, 0,
    r`For a thin prism $\delta=(n-1)A=0.5\times4°=2°$.`, { unit: '°' }),
  nat(2, 'prism', r`A prism of angle $60°$ and $n=\sqrt2$ is used at minimum deviation. Find the angle of minimum deviation (in degrees).`, () => 2 * asind(Math.SQRT2 * sind(30)) - 60, 0, 0,
    r`$n=\dfrac{\sin\frac{A+\delta_m}{2}}{\sin\frac A2}$, so $\sin\frac{A+\delta_m}{2}=\sqrt2\sin30°=\tfrac{\sqrt2}{2}$. Thus $\frac{A+\delta_m}2=45°$ and $\delta_m=90°-60°=30°$.`, { unit: '°' }),
  nat(2, 'lens combinations', r`Two thin lenses of focal lengths 20 cm and 30 cm are in contact. Find the focal length of the combination (in cm).`, () => 1 / (1 / 20 + 1 / 30), 0, 0,
    r`$\dfrac1f=\dfrac1{20}+\dfrac1{30}=\dfrac5{60}$, so $f=12$ cm.`, { unit: 'cm' }),
  nat(2, 'telescope', r`An astronomical telescope in normal adjustment has an objective of focal length 100 cm and an eyepiece of focal length 5 cm. Find its magnifying power.`, () => 100 / 5, 0, 0,
    r`$m=\dfrac{f_o}{f_e}=\dfrac{100}{5}=20$. (Length of the tube $=f_o+f_e=105$ cm.)`),
  nat(2, 'eye defects', r`A person's near point is 50 cm. Find the power (in dioptre) of the reading lens that lets her read at 25 cm.`, () => 1 / 0.25 - 1 / 0.5, 0, 0,
    r`The lens must form a virtual image at 50 cm of a book at 25 cm. $\dfrac1v-\dfrac1u=\dfrac1f$ with $v=-50$ cm, $u=-25$ cm: $\dfrac1f=-\dfrac1{50}+\dfrac1{25}=\dfrac1{50}$ per cm, so $f=50$ cm, $P=+2$ D (a convex lens).`, { unit: 'D' }),
  nat(2, 'refraction', r`Light of wavelength 600 nm in air enters glass of $n=1.5$. Find its wavelength in the glass (in nm).`, () => 600 / 1.5, 0, 0,
    r`$\lambda'=\lambda/n=600/1.5=400$ nm. The frequency stays the same.`, { unit: 'nm' }),
  nat(2, 'dispersion', r`For a glass, $n_v=1.53$, $n_r=1.51$ and $n_y=1.52$. Find the dispersive power $\omega=\dfrac{n_v-n_r}{n_y-1}$ (3 decimals).`, () => 0.02 / 0.52, 0.001, 3,
    r`$\omega=\dfrac{1.53-1.51}{1.52-1}=\dfrac{0.02}{0.52}=0.038$.`),
  nat(2, 'lenses', r`An object 3 cm high is placed 30 cm from a convex lens of focal length 20 cm. Find the size of the image (in cm).`, () => Math.abs(3 * lensV(-30, 20) / -30), 0, 0,
    r`$v=60$ cm. $m=v/u=60/(-30)=-2$. Image height $=2\times3=6$ cm (real and inverted).`, { unit: 'cm' }),
  nat(2, 'optical fibre', r`An optical fibre has core of $n=1.5$ and cladding of $n=1.4$. Find the critical angle at the core-cladding boundary (in degrees, 1 decimal).`, () => asind(1.4 / 1.5), 0.1, 1,
    r`$\sin C=n_2/n_1=1.4/1.5=0.9333$, so $C=69.0°$. Rays hitting the boundary at more than this angle are totally reflected.`, { unit: '°' }),
  nat(2, 'apparent depth', r`A fish is 20 cm below the surface of water ($n=1.33$). How deep does it look from above (in cm, 1 decimal)?`, () => 20 / 1.33, 0.1, 1,
    r`Apparent depth $=20/1.33=15.0$ cm.`, { unit: 'cm' }),
  mcq(2, 'plane mirror', r`Two parallel plane mirrors face each other with an object between them. The number of images formed is`, 'infinite (in theory)', ['two', 'four', 'one'],
    r`Each image acts as an object for the other mirror, forever. In practice the images fade because each reflection loses some light.`),
  mcq(2, 'lenses', r`A convex lens made of glass ($n=1.5$) is immersed in a liquid whose refractive index is also 1.5. The lens then acts as`, 'a plane glass plate (no bending of light)', ['a convex lens of larger focal length', 'a concave lens', 'a convex lens of smaller focal length'],
    r`$\dfrac1f=\left(\dfrac{n_g}{n_m}-1\right)\left(\dfrac1{R_1}-\dfrac1{R_2}\right)=0$ when $n_g=n_m$. The lens does not bend light at all, so $f\to\infty$.`),
  mcq(2, 'lenses', r`A convex lens is cut along a plane containing its principal axis into two halves. Each half now forms an image of an object on the axis. Compared with the full lens, the image is`, 'at the same position and of the same size, but dimmer', ['at twice the distance', 'half as large', 'at half the distance'],
    r`Each half still has the same curved faces, so $f$ is unchanged and the image is in the same place with the same size. Only half the light gets through, so the image is dimmer.`, { trap: 'Cutting along the axis keeps the focal length; cutting across the axis (thinner lens, same curvature) is another matter.' }),
  mcq(2, 'mirrors in water', r`A concave mirror is moved from air into water. Its focal length`, 'does not change', ['increases', 'decreases', 'becomes negative'],
    r`For a mirror $f=R/2$ depends only on the geometry, not on the medium. (For a lens, $f$ does change with the surrounding medium.)`),
  mcq(2, 'aberrations', r`Chromatic aberration in a lens is caused by`, 'the variation of refractive index with wavelength', ['the large aperture of the lens', 'reflection from the lens surfaces', 'the thickness at the centre'],
    r`Different colours have different $n$, hence different focal lengths, so the image has coloured fringes. A large aperture causes spherical aberration instead.`),
  mcq(2, 'optical instruments', r`In an astronomical telescope the objective has a large aperture mainly to`, 'gather more light and improve resolution', ['reduce the length of the tube', 'increase the field of view', 'reduce chromatic aberration only'],
    r`Faint stars need a lot of light gathered, and the resolving limit $1.22\lambda/D$ gets smaller with a larger aperture $D$.`),
  mcq(2, 'refraction', r`A ray passes from medium 1 to medium 2 and bends away from the normal. Then`, r`$n_2<n_1$ and the speed in medium 2 is higher`, [r`$n_2>n_1$ and the speed in medium 2 is higher`, r`$n_2<n_1$ and the speed in medium 2 is lower`, r`$n_2>n_1$ and the speed in medium 2 is lower`],
    r`Bending away from the normal means $r>i$, so $\sin r>\sin i$ and $n_1\sin i=n_2\sin r$ gives $n_2<n_1$. Lower $n$ means higher speed $v=c/n$.`),
  nat(2, 'microscope', r`A compound microscope has an objective that gives a lateral magnification of 10 and an eyepiece of focal length 5 cm. The final image is at 25 cm (least distance of distinct vision). Find the total magnification.`, () => 10 * (1 + 25 / 5), 0, 0,
    r`Eyepiece magnification $m_e=1+\dfrac Df_e=1+\dfrac{25}{5}=6$. Total $m=m_om_e=10\times6=60$.`),
  nat(2, 'lenses', r`A convex lens forms a real image three times the size of the object. The object is 20 cm from the lens. Find the focal length (in cm).`, () => 15, 0, 0,
    r`Real image: $m=-3$, $m=v/u$ gives $v=-3u=+60$ cm ($u=-20$). $\dfrac1f=\dfrac1v-\dfrac1u=\dfrac1{60}+\dfrac1{20}=\dfrac4{60}$, so $f=15$ cm.`, { unit: 'cm' }),
);
// ---------- Level 3 ----------
items.push(
  nat(3, 'moving objects', r`An object moves directly towards a plane mirror at $4\ \mathrm{m\,s^{-1}}$. Find the speed of the image relative to the object (in $\mathrm{m\,s^{-1}}$).`, () => 4 + 4, 0, 0,
    r`The image is the mirror reflection, so it moves towards the mirror at $4\ \mathrm{m\,s^{-1}}$ too, in the opposite direction to the object. Relative speed $=4+4=8\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', trap: 'Relative to the mirror it is 4; relative to the object it is 8.' }),
  nat(3, 'moving mirror', r`An object is at rest in front of a plane mirror. The mirror moves directly away from the object at $3\ \mathrm{m\,s^{-1}}$. Find the speed of the image in the ground frame (in $\mathrm{m\,s^{-1}}$).`, () => 2 * 3, 0, 0,
    r`Image position $x_i=2x_m-x_o$. With the object fixed, $v_i=2v_m=6\ \mathrm{m\,s^{-1}}$, in the direction of the mirror's motion. (If the image distance behind the mirror equals the object distance in front, the mirror's motion of $v$ shifts the image by $2v$.)`, { unit: 'm/s' }),
  nat(3, 'apparent depth', r`A beaker holds 12 cm of water ($n=4/3$) with 6 cm of oil ($n=1.5$) floating on it. Looking vertically down, how far below the oil surface does the bottom seem (in cm)?`, () => 6 / 1.5 + 12 / (4 / 3), 0, 0,
    r`Apparent depth $=\sum\dfrac{t_i}{n_i}=\dfrac6{1.5}+\dfrac{12}{4/3}=4+9=13$ cm.`, { unit: 'cm' }),
  nat(3, 'apparent depth', r`A bird is 3 m above the surface of a lake ($n=4/3$). A fish directly below looks up at it. How high above the surface does the bird appear to the fish (in m)?`, () => 3 * 4 / 3, 0, 0,
    r`Looking from the denser to the rarer medium, apparent height $=n\times$ real height $=\tfrac43\times3=4$ m. The bird looks higher than it is.`, { unit: 'm', trap: 'From below the object seems farther; from above it seems nearer.' }),
  nat(3, 'lens combinations', r`A convex lens of focal length 10 cm and a concave lens of focal length 25 cm are placed in contact. Find the focal length of the combination (in cm, 1 decimal).`, () => 1 / (1 / 10 - 1 / 25), 0.1, 1,
    r`$\dfrac1F=\dfrac1{10}+\dfrac1{-25}=\dfrac{5-2}{50}=\dfrac3{50}$, so $F=16.7$ cm (convex, because the net power is positive).`, { unit: 'cm' }),
  nat(3, 'displacement method', r`An object and a screen are 100 cm apart. A convex lens gives a sharp image at two positions 40 cm apart. Find the focal length of the lens (in cm).`, () => (100 ** 2 - 40 ** 2) / (4 * 100), 0, 0,
    r`Displacement method: $f=\dfrac{D^2-d^2}{4D}=\dfrac{10000-1600}{400}=21$ cm.`, { unit: 'cm' }),
  nat(3, 'prism', r`A prism of refractive index $\sqrt2$ has its apex angle increased slowly. Beyond a certain apex angle no ray entering the first face can emerge from the second. Find that apex angle (in degrees).`, () => 2 * asind(1 / Math.SQRT2), 0, 0,
    r`Inside the prism $r_1+r_2=A$ and $r_1\le C$ at most (since $r_1<C$ for any entering ray), so $A\le 2C$ for emergence. $\sin C=1/\sqrt2$ gives $C=45°$. So $A=2C=90°$.`, { unit: '°' }),
  nat(3, 'eye defects', r`A short-sighted person cannot see clearly beyond 80 cm. Find the power of the lens (in dioptre, sign included) she needs for distant objects.`, () => -1 / 0.8, 0.01, 2,
    r`The lens must form a virtual image of a far object at her far point: $f=-80$ cm. $P=1/f=-1/0.8=-1.25$ D (concave).`, { unit: 'D' }),
  nat(3, 'microscope', r`In a compound microscope the distance between the second focal point of the objective ($f_o=1$ cm) and the first focal point of the eyepiece ($f_e=5$ cm) is 15 cm. The final image is at infinity. Find the magnifying power ($D=25$ cm).`, () => (15 / 1) * (25 / 5), 0, 0,
    r`$m=\dfrac{L}{f_o}\cdot\dfrac D{f_e}=\dfrac{15}1\times\dfrac{25}{5}=75$.`),
  nat(3, 'total internal reflection', r`Light travels in glass ($n=1.5$) and meets a glass-water ($n=4/3$) boundary. Find the critical angle (in degrees, 1 decimal).`, () => asind((4 / 3) / 1.5), 0.1, 1,
    r`$\sin C=\dfrac{n_2}{n_1}=\dfrac{4/3}{1.5}=0.889$, so $C=62.7°$.`, { unit: '°' }),
  nat(3, 'lenses', r`The Sun subtends about $0.0093$ rad at a lens of focal length 100 cm. Find the diameter of the Sun's image (in cm, 2 decimals).`, () => 100 * 0.0093, 0.01, 2,
    r`The image of a distant object lies at the focus and has size $f\theta=100\times0.0093=0.93$ cm.`, { unit: 'cm' }),
  mcq(3, 'refraction through a slab', r`A ray of light crosses a parallel-sided glass slab in air. The emergent ray is`, 'parallel to the incident ray but shifted sideways', ['parallel to the incident ray with no shift', 'deviated by $(n-1)A$', 'bent towards the normal'],
    r`The bend at the entry face is cancelled by an equal and opposite bend at the exit face (parallel faces, same two media). The ray keeps its direction but is displaced by $t\sin(i-r)/\cos r$.`),
  mcq(3, 'spherical mirrors', r`A concave mirror has focal length $f$. A real object is at a distance between $f$ and $2f$. The image is`, 'real, inverted, magnified and beyond $2f$', ['real, inverted, diminished and between $f$ and $2f$', 'virtual, erect and magnified', 'real, erect and magnified'],
    r`With $f<|u|<2f$ the image distance is larger than $2f$ and the magnification has magnitude greater than 1. It is inverted and real (in front of the mirror).`),
  mcq(3, 'prism', r`A ray falls normally on one of the faces of a right-angled isosceles prism of glass ($n=1.5$), meeting the hypotenuse next. The ray`, 'is totally reflected at the hypotenuse and turns through $90°$', ['passes straight out through the hypotenuse', 'is totally reflected and turns through $180°$', 'emerges from the hypotenuse bent towards its normal'],
    r`The angle at the hypotenuse is $45°$. $C=\sin^{-1}(1/1.5)=41.8°$, and $45°>41.8°$, so the ray is totally reflected, leaving normally from the other short face: it has turned through $90°$.`, { trap: 'A prism that turns the ray by $180°$ needs the ray to enter through the hypotenuse.' }),
  nat(3, 'lens combinations', r`Two convex lenses of focal length 20 cm each are 10 cm apart. Find the equivalent focal length of the system (in cm, 2 decimals).`, () => 1 / (1 / 20 + 1 / 20 - 10 / 400), 0.01, 2,
    r`$\dfrac1F=\dfrac1{f_1}+\dfrac1{f_2}-\dfrac d{f_1f_2}=\dfrac1{20}+\dfrac1{20}-\dfrac{10}{400}=0.075$, so $F=13.33$ cm.`, { unit: 'cm' }),
  nat(3, 'refraction through a slab', r`A ray hits a glass slab ($n=1.5$, thickness 9 cm) at $45°$. Find the lateral shift of the emergent ray (in cm, 2 decimals).`, () => { const rr = asind(sind(45) / 1.5); return 9 * sind(45 - rr) / Math.cos(rr * D2R); }, 0.02, 2,
    r`$\sin r=\dfrac{\sin45°}{1.5}=0.4714$, $r=28.13°$. Shift $=\dfrac{t\sin(i-r)}{\cos r}=\dfrac{9\times\sin16.87°}{\cos28.13°}=\dfrac{9\times0.2902}{0.8819}=2.96$ cm.`, { unit: 'cm' }),
  nat(3, 'dispersion', r`A thin prism of angle $6°$ has $n_v=1.66$ and $n_r=1.62$. Find the angular dispersion between violet and red (in degrees, 2 decimals).`, () => (1.66 - 1.62) * 6, 0.01, 2,
    r`Angular dispersion $=(n_v-n_r)A=0.04\times6°=0.24°$.`, { unit: '°' }),
  nat(3, 'spherical mirrors', r`A concave mirror forms a real image four times as tall as the object when the object is 20 cm away. Find its focal length (in cm).`, () => 16, 0, 0,
    r`Real image, so $m=-4=-v/u$ with $u=-20$: $v=-80$ cm. $\dfrac1f=\dfrac1v+\dfrac1u=-\dfrac1{80}-\dfrac1{20}=-\dfrac5{80}$, so $f=-16$ cm: magnitude 16 cm.`, { unit: 'cm', trap: 'There is a second answer with a virtual image; the question says real.' }),
  nat(3, 'mixed', r`A small object is released from rest 5 m above a horizontal plane mirror and falls freely ($g=9.8\ \mathrm{m\,s^{-2}}$). Find the speed of the object relative to its image just as it reaches 2 m above the mirror (in $\mathrm{m\,s^{-1}}$, 1 decimal).`, () => 2 * Math.sqrt(2 * 9.8 * 3), 0.1, 1,
    r`It has fallen $5-2=3$ m: $v=\sqrt{2gh}=\sqrt{2\times9.8\times3}=7.67\ \mathrm{m\,s^{-1}}$ downward. The image moves up at the same speed, so the relative speed is $2v=15.3\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  nat(3, 'mixed', r`Light takes how long to cross a glass slab ($n=1.5$) 3 cm thick at normal incidence? Give the answer in picoseconds ($c=3\times10^8\ \mathrm{m\,s^{-1}}$).`, () => 1.5 * 0.03 / 3e8 * 1e12, 0, 0,
    r`Speed in glass $v=c/n=2\times10^8\ \mathrm{m\,s^{-1}}$. $t=\dfrac{0.03}{2\times10^8}=1.5\times10^{-10}$ s $=150$ ps.`, { unit: 'ps' }),
);
// ---------- Level 4 and 5 ----------
items.push(
  nat(4, 'moving objects', r`A concave mirror has focal length 20 cm. An object 30 cm from it moves along the axis towards the mirror at $1.5\ \mathrm{cm\,s^{-1}}$. Find the speed of the image at that instant (in $\mathrm{cm\,s^{-1}}$).`, () => (mirV(-30, -20) / -30) ** 2 * 1.5, 0, 0,
    r`$v=-60$ cm (from $\dfrac1v=-\dfrac1{20}+\dfrac1{30}$). Differentiate $\dfrac1v+\dfrac1u=\dfrac1f$: $\dfrac{dv}{dt}=-\dfrac{v^2}{u^2}\dfrac{du}{dt}$. Magnitude: $\left(\dfrac{60}{30}\right)^2\times1.5=4\times1.5=6\ \mathrm{cm\,s^{-1}}$. (The image moves away from the mirror as the object nears it.)`, { unit: 'cm/s', trap: 'Longitudinal image speed is $m^2$ times the object speed, not $m$ times.' }),
  nat(4, 'apparent depth', r`A fish is 1.2 m below the surface of water ($n=4/3$). A man stands with his eyes 1.5 m above the surface, directly above it. How far from his eyes does the fish appear (in m, 2 decimals)?`, () => 1.5 + 1.2 / (4 / 3), 0.01, 2,
    r`Air above is already the viewer's medium, so only the water layer is shortened: apparent distance $=1.5+\dfrac{1.2}{4/3}=1.5+0.9=2.40$ m.`, { unit: 'm' }),
  nat(4, 'silvered lens', r`A thin plano-convex lens ($n=1.5$, radius of the curved face 30 cm) is silvered on its plane face. Find the focal length of the equivalent mirror (in cm).`, () => 1 / (2 / (30 / 0.5)), 0, 0,
    r`$f_{lens}=\dfrac R{n-1}=60$ cm. A silvered lens: light passes through it twice and reflects once. $\dfrac1F=\dfrac2{f_{lens}}+\dfrac1{f_m}$, and a plane mirror has $\dfrac1{f_m}=0$. So $\dfrac1F=\dfrac2{60}$ and $F=30$ cm. It acts like a concave mirror of focal length 30 cm.`, { unit: 'cm' }),
  nat(4, 'refraction at spherical surface', r`A point object is in air 60 cm from the pole of a convex spherical surface of radius 20 cm, separating air from glass of $n=1.5$. Find the image distance from the pole (in cm).`, () => 1.5 / (0.5 / 20 + 1 / -60), 0, 0,
    r`$\dfrac{n_2}{v}-\dfrac{n_1}{u}=\dfrac{n_2-n_1}{R}$. With $n_1=1$, $n_2=1.5$, $u=-60$, $R=+20$: $\dfrac{1.5}{v}=\dfrac{0.5}{20}+\dfrac1{-60}=0.025-0.01667=\dfrac1{120}$. So $v=1.5\times120=180$ cm, on the glass side.`, { unit: 'cm' }),
  nat(4, 'prism', r`A prism of apex angle $60°$ and $n=1.5$. Find the smallest angle of incidence (in degrees, 1 decimal) for which a ray can emerge from the second face.`, () => asind(1.5 * sind(60 - asind(1 / 1.5))), 0.1, 1,
    r`The ray must meet the second face at an angle $r_2\le C$, where $\sin C=1/1.5$, $C=41.81°$. Since $r_1+r_2=A=60°$, $r_1\ge60°-41.81°=18.19°$. Smallest $i$: $\sin i=1.5\sin18.19°=0.4683$, so $i=27.9°$.`, { unit: '°', trap: 'At smaller angles of incidence the ray hits the second face beyond the critical angle and is trapped.' }),
  nat(4, 'light pipe', r`A long glass rod ($n=1.4$) in air has flat ends. A ray enters one end at angle of incidence $\alpha$ to the axis. Find the largest $\alpha$ (in degrees, 1 decimal) for which the ray is totally internally reflected at the side wall.`, () => asind(Math.sqrt(1.4 ** 2 - 1)), 0.1, 1,
    r`Let $r$ be the refraction angle at the end. At the side wall the angle of incidence is $90°-r$, which must be at least $C$ with $\sin C=1/n$: $\cos r\ge1/n$, so $\sin r\le\sqrt{1-1/n^2}$. Then $\sin\alpha=n\sin r\le\sqrt{n^2-1}=\sqrt{0.96}=0.9798$, so $\alpha_{max}=78.5°$.`, { unit: '°' }),
  nat(4, 'achromatism', r`A crown prism ($A_1=10°$, $n_v-n_r=0.014$, $n_y=1.5$) is combined with a flint prism ($n_v-n_r=0.028$, $n_y=1.6$), set opposite, so that there is no net dispersion. Find the net deviation of the yellow light (in degrees).`, () => (1.5 - 1) * 10 - (1.6 - 1) * (10 * 0.014 / 0.028), 0.01, 2,
    r`No net dispersion: $(n_v-n_r)_1A_1=(n_v-n_r)_2A_2$, so $A_2=10\times\dfrac{0.014}{0.028}=5°$. Net deviation of yellow $=(n_1-1)A_1-(n_2-1)A_2=0.5\times10-0.6\times5=5-3=2°$.`, { unit: '°' }),
  nat(4, 'telescope', r`An astronomical telescope has $f_o=60$ cm and $f_e=5$ cm. It is adjusted so that the final image is at the near point of 25 cm. Find the magnifying power (2 decimals).`, () => (60 / 5) * (1 + 5 / 25), 0.01, 2,
    r`$m=\dfrac{f_o}{f_e}\left(1+\dfrac{f_e}{D}\right)=12\times1.2=14.4$. The length of the telescope in this setting is $f_o+u_e$ with $u_e=4.17$ cm, i.e. 64.2 cm, not $65$ cm.`, { unit: '' }),
  nat(4, 'lens combinations', r`A convex lens (focal length 20 cm) is placed 10 cm in front of a plane mirror. An object 40 cm from the lens on the other side from the mirror sends light through the lens to the mirror, back through the lens again. Find the distance of the final image from the lens (in cm).`, () => 10, 0, 0,
    r`First pass: $\dfrac1v=\dfrac1{20}-\dfrac1{40}$, so $v=40$ cm beyond the lens. The mirror is 10 cm from the lens, so this image would lie 30 cm behind the mirror (a virtual object for it). A plane mirror puts the image as far in front of it as the object is behind: 30 cm in front, which is $10-30=-20$, that is 20 cm past the lens in the new direction of travel. Rays are still converging when they reach the lens a second time, so it is a virtual object with $u=+20$ cm: $\dfrac1v=\dfrac1{20}+\dfrac1{20}$, so $v=10$ cm. The final image is 10 cm from the lens, on the object's side.`, { unit: 'cm' }),
  nat(4, 'lens in liquid', r`A thin glass lens ($n=1.5$) has focal length 20 cm in air. It is immersed in a liquid of refractive index 1.6. Find its focal length in the liquid (in cm, with sign).`, () => { const fl = 1 / ((1.5 / 1.6 - 1) / (0.5 * 20)); return fl; }, 0.5, 1,
    r`$\dfrac1{f_a}=(n_g-1)K$ and $\dfrac1{f_l}=\left(\dfrac{n_g}{n_l}-1\right)K$. Dividing: $\dfrac{f_a}{f_l}=\dfrac{1.5/1.6-1}{0.5}=-0.125$. So $f_l=\dfrac{20}{-0.125}=-160$ cm: the lens now diverges.`, { unit: 'cm', trap: 'A glass lens in a denser liquid reverses its action.' }),
  nat(4, 'moving objects', r`A coin is dropped from rest 4 m above a horizontal plane mirror ($g=9.8\ \mathrm{m\,s^{-2}}$). After 0.5 s find the speed of its image relative to the coin (in $\mathrm{m\,s^{-1}}$, 1 decimal).`, () => 2 * 9.8 * 0.5, 0.1, 1,
    r`Speed after 0.5 s: $v=gt=4.9\ \mathrm{m\,s^{-1}}$. The image moves up at $4.9\ \mathrm{m\,s^{-1}}$, the coin down at $4.9$, so the relative speed is $9.8\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', sub: 'mixed' }),
  nat(4, 'eye defects', r`A far-sighted person has a near point at 100 cm. Find the focal length (in cm) of the spectacle lens that lets her read at 25 cm.`, () => 100 / 3, 0.1, 1,
    r`Object at $u=-25$, image at $v=-100$. $\dfrac1f=\dfrac1v-\dfrac1u=-\dfrac1{100}+\dfrac1{25}=\dfrac3{100}$, so $f=33.3$ cm (convex).`, { unit: 'cm' }),
  mcq(4, 'spherical mirrors', r`A concave mirror and a convex lens each have focal length 20 cm. An object is placed 40 cm in front of each. Which statement about the images is correct?`, 'Both are real, inverted and of the same size as the object', ['The mirror image is real and the lens image is virtual', 'Both images are virtual', 'The mirror image is twice the object size and the lens image is equal in size'],
    r`At $2f$ both give $|v|=2f=40$ cm and $m=-1$. The mirror's image is in front of it, the lens's image is behind it, but both are real, inverted and equal in size.`, { trap: 'The two images are on different sides, so some students think one is virtual.' }),
  mcq(4, 'refraction', r`A ray passes from air into a transparent plate, with $n$ increasing smoothly with depth (a graded layer). The path of the ray is`, 'curved, bending progressively towards the normal', ['straight, bending only at the first surface', 'curved, bending away from the normal', 'a zig-zag between the faces'],
    r`Treat the layer as many thin slabs. At each boundary $n\sin\theta$ stays constant, so $\theta$ gets smaller as $n$ rises: the path bends towards the normal, smoothly.`),
  nat(5, 'silvered lens', r`A plano-convex lens ($n=1.5$, radius of curved face 20 cm) is silvered on its curved face. A small object is on the axis 20 cm from the plane face in air. Find the distance of the final image from the plane face (in cm).`, () => Math.abs(mirV(-20, -(20 / (2 * 1.5)))), 0.05, 1,
    r`Light enters the plane face unbent, reflects at the curved mirror (focal length $R/2=10$ cm inside the glass), and leaves through the plane face. The equivalent mirror has $F=\dfrac R{2n}=\dfrac{20}{3}=6.67$ cm (concave), with the plane face as its pole. Then $\dfrac1v=\dfrac1F-\dfrac1u=-\dfrac3{20}+\dfrac1{20}=-\dfrac1{10}$, so $v=-10$ cm: a real image 10 cm in front of the plane face.`, { unit: 'cm' }),
  nat(5, 'ball lens', r`A solid glass sphere of radius 6 cm and $n=1.5$ receives a narrow parallel beam. At what distance beyond the far surface do the rays focus (in cm)?`, () => 1.5 * 6 / (2 * 0.5) - 6, 0, 0,
    r`First surface ($R=+6$ cm): $\dfrac{1.5}{v_1}=\dfrac{0.5}{6}$, so $v_1=18$ cm from the front pole. The back pole is 12 cm from the front pole, so the rays are still converging 6 cm beyond it: a virtual object, $u=+6$ cm. Second surface ($R=-6$ cm, glass to air): $\dfrac1v-\dfrac{1.5}{6}=\dfrac{1-1.5}{-6}$, so $\dfrac1v=0.25+0.0833=0.3333$ and $v=3$ cm. The rays focus 3 cm beyond the sphere.`, { unit: 'cm' }),
  nat(5, 'rainbow', r`In a spherical raindrop ($n=4/3$) a primary rainbow ray has angle of incidence $i$ with $\cos^2 i=\dfrac{n^2-1}{3}$ (minimum deviation). The total deviation is $D=180°+2i-4r$. Find the angle between the ray from the sun and the ray to the eye, $180°-D$, in degrees (1 decimal).`, () => { const i = Math.acos(Math.sqrt((16 / 9 - 1) / 3)) / D2R; const rr = asind(sind(i) / (4 / 3)); return 180 - (180 + 2 * i - 4 * rr); }, 0.1, 1,
    r`$\cos^2i=\dfrac{16/9-1}{3}=\dfrac7{27}=0.2593$, so $\cos i=0.5092$ and $i=59.4°$. $\sin r=\dfrac{\sin59.4°}{4/3}=0.6460$, $r=40.2°$. $D=180+118.8-160.8=138.0°$, so $180°-D=42.0°$: the red edge of the primary bow is about $42°$ from the anti-solar point.`, { unit: '°' }),
  nat(5, 'moving objects', r`A convex lens of focal length 15 cm forms a real image of a small object on its axis. The object is 30 cm away and moves towards the lens at $2\ \mathrm{cm\,s^{-1}}$. What is the speed of the image (in $\mathrm{cm\,s^{-1}}$)?`, () => (lensV(-30, 15) / -30) ** 2 * 2, 0, 0,
    r`$v=30$ cm. For a lens $\dfrac1v-\dfrac1u=\dfrac1f$ gives $\dfrac{dv}{dt}=\dfrac{v^2}{u^2}\dfrac{du}{dt}$. $(v/u)^2=1$ so the image moves at $2\ \mathrm{cm\,s^{-1}}$ (away from the lens, as the object approaches).`, { unit: 'cm/s' }),
);
items.push(
  nat(5, 'total internal reflection', r`A ray enters the top face of a rectangular glass block of refractive index $n$ (in air) and meets a side face. Find the smallest $n$ (2 decimals) for which every ray entering the top face, at any angle of incidence, is totally reflected at the side face.`, () => Math.SQRT2, 0.01, 2,
    r`Let the ray enter at angle $i$ and refract at $r$. At the side face the angle of incidence is $90°-r$. TIR needs $\sin(90°-r)=\cos r\ge\dfrac1n$ for every $i$. The worst case is the largest $r$, at $i=90°$: $\sin r=1/n$, so $\cos r=\sqrt{1-1/n^2}\ge1/n$, which gives $n^2\ge2$ and $n\ge\sqrt2=1.41$.`, { trap: 'Test the grazing entry ($i=90°$), which gives the largest $r$ and the weakest TIR.' }),
  nat(5, 'slab measurement', r`In a travelling-microscope experiment a mark is first focused (scale reading 10.00 cm). A glass slab is placed over it, and the microscope is raised to focus on the top surface of the slab (15.00 cm) and then on the image of the mark seen through the slab (scale reading 11.67 cm). Find the refractive index of the slab using $n=\dfrac{\text{real thickness}}{\text{apparent thickness}}$ (2 decimals).`, () => (15 - 10) / (15 - 11.67), 0.02, 2,
    r`Real thickness $=15.00-10.00=5.00$ cm (top surface minus the mark's position). Apparent thickness $=15.00-11.67=3.33$ cm (top surface minus the raised image). $n=\dfrac{5.00}{3.33}=1.50$.`, { unit: '' }),
  nat(5, 'mixed', r`A plane mirror turns at a steady $2\ \mathrm{rad\,s^{-1}}$ about a vertical axis in its surface. The reflected beam falls on a flat wall 3 m away. At the instant the reflected ray strikes the wall normally, find the speed of the light spot on the wall (in $\mathrm{m\,s^{-1}}$).`, () => 2 * 2 * 3, 0, 0,
    r`The reflected ray turns at $2\omega=4\ \mathrm{rad\,s^{-1}}$. The spot is at $x=D\tan\phi$ with $\phi$ the angle from the normal to the wall, so $v=D\sec^2\phi\,\dfrac{d\phi}{dt}$. At $\phi=0$: $v=3\times1\times4=12\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', trap: 'The ray turns twice as fast as the mirror.' }),
  nat(5, 'mixed', r`A plane mirror turns at $1.5\ \mathrm{rad\,s^{-1}}$. The reflected beam makes a light spot on a flat wall 2 m away. At the moment the reflected ray makes $60°$ with the normal to the wall, find the speed of the spot (in $\mathrm{m\,s^{-1}}$).`, () => 2 * 1.5 * 2 / Math.cos(60 * D2R) ** 2, 0, 0,
    r`$\dfrac{d\phi}{dt}=2\omega=3\ \mathrm{rad\,s^{-1}}$. $x=D\tan\phi$, so $v=D\sec^2\phi\cdot\dfrac{d\phi}{dt}=2\times\dfrac1{\cos^260°}\times3=2\times4\times3=24\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  nat(5, 'aberrations', r`A thin glass lens has $n_r=1.50$ for red light and $n_v=1.52$ for violet. Its focal length for red light is 100 cm. Find the longitudinal chromatic aberration (the difference between the red and violet focal lengths, in cm, 2 decimals).`, () => 100 - 100 * 0.5 / 0.52, 0.02, 2,
    r`$f\propto\dfrac1{n-1}$. $f_v=100\times\dfrac{0.50}{0.52}=96.15$ cm. Difference $=100-96.15=3.85$ cm (violet focuses closer to the lens).`, { unit: 'cm' }),
  nat(5, 'lenses', r`A convex lens has a focal length of 15 cm. Find the smallest possible distance between a real object and its real image (in cm).`, () => 4 * 15, 0, 0,
    r`Distance $D=|u|+v$. With $\dfrac1v+\dfrac1{|u|}=\dfrac1f$ the sum is least when $|u|=v=2f$: $D_{min}=4f=60$ cm. For any smaller separation no real image can form.`, { unit: 'cm', trap: 'The minimum occurs for the symmetric case $u=v=2f$.' }),
  nat(5, 'moving objects', r`A short rod of length 2 mm lies along the axis of a convex lens of focal length 20 cm, its centre 30 cm from the lens. Find the length of its real image (in mm).`, () => 2 * (lensV(-30, 20) / -30) ** 2, 0, 0,
    r`$v=\dfrac{uf}{u+f}=60$ cm. Longitudinal magnification $\approx\left(\dfrac vu\right)^2=\left(\dfrac{60}{30}\right)^2=4$ for a short rod. Length of the image $=4\times2=8$ mm.`, { unit: 'mm' }),
  mcq(4, 'refraction', r`A narrow beam of light passes from air into a glass block at $i=0°$ (normal incidence). Which statement is correct?`, 'The ray does not bend, but its speed and wavelength both decrease', ['The ray bends towards the normal by a small amount', 'The ray does not bend and its wavelength stays the same', 'The ray does not bend and its speed stays the same'],
    r`At $i=0°$, $\sin r=0$ so $r=0$: no bending. But the speed is $c/n$ and the wavelength $\lambda/n$ inside the glass; only the frequency stays unchanged.`, { trap: 'No bending does not mean no change of speed.' }),
  nat(5, 'lens-mirror system', r`A convex lens of focal length 30 cm is 10 cm in front of a concave mirror of focal length 20 cm, on a common axis. A narrow parallel beam travels along the axis, first through the lens and then to the mirror. Find the distance from the mirror of the first image formed by the mirror (in cm, taken as positive if in front of the mirror).`, () => -mirV(20, -20), 0, 0,
    r`After the lens the rays converge towards a point 30 cm beyond it. The mirror is 10 cm beyond the lens, so that point is 20 cm behind the mirror: a virtual object, $u=+20$ cm. The mirror has $f=-20$ cm. $\dfrac1v=\dfrac1f-\dfrac1u=-\dfrac1{20}-\dfrac1{20}=-\dfrac1{10}$, so $v=-10$ cm: a real image 10 cm in front of the mirror.`, { unit: 'cm', trap: 'Measure the object distance from the mirror, not from the lens, and treat converging light as a virtual object.' }),
);
// ---------- Assertion and Reason ----------
items.push(
  asrt(2, 'lenses', r`A concave lens always forms a virtual, erect, diminished image of a real object.`, r`The rays leaving a concave lens always diverge, so they never meet at a real point.`, 0,
    r`For $f<0$ and $u<0$: $\dfrac1v=\dfrac1f+\dfrac1u<0$, so $v<0$ and $|v|<|u|$ (virtual, same side, closer) with $0<m<1$. R explains A: a diverging lens makes the emergent rays spread out, and we only see them appearing to come from a point on the object's side.`),
  asrt(3, 'total internal reflection', r`A diamond sparkles much more than a piece of glass of the same cut.`, r`A diamond is much harder than glass.`, 1,
    r`A is true: the critical angle of diamond ($n=2.42$, $C=24.4°$) is small, so most light entering it is totally reflected many times before leaving. R is true, but hardness is not the reason. It is the high refractive index that matters.`),
  asrt(3, 'dispersion', r`The focal length of a convex glass lens is larger for red light than for violet light.`, r`The refractive index of glass is smaller for red light than for violet light.`, 0,
    r`$\dfrac1f=(n-1)\left(\dfrac1{R_1}-\dfrac1{R_2}\right)$. Red has smaller $n$, so a smaller $\dfrac1f$ and larger $f$. R is the reason for A (this is the origin of chromatic aberration).`),
  asrt(2, 'spherical mirrors', r`A convex mirror always forms a virtual, erect and diminished image of a real object.`, r`A convex mirror has a real principal focus.`, 2,
    r`A is true: $u<0$, $f>0$ give $v>0$ with $v<f$ and $0<m<1$. R is false: the rays diverge after reflection, and they only seem to come from a point behind the mirror, so the focus is virtual.`),
  asrt(3, 'total internal reflection', r`A diver looking up sees the whole sky and horizon squeezed into a circular patch of the surface.`, r`Rays arriving at the surface from the horizon (nearly $90°$ incidence) refract into water at the critical angle.`, 0,
    r`In water the greatest refraction angle is $C=\sin^{-1}(1/n)=48.6°$, from a grazing ray in air. So all the light from the sky reaches the diver inside a cone of half-angle $C$. Outside the patch, the diver sees reflected light from the bottom (total internal reflection). R gives the reason.`),
  asrt(3, 'total internal reflection', r`Total internal reflection can occur when light goes from air into glass at a large angle of incidence.`, r`When a ray enters glass from air it bends towards the normal.`, 3,
    r`A is false: TIR needs the ray to travel from a denser to a rarer medium. Going from air to glass, $\sin r=\sin i/n<\sin i$ always has a solution, so the ray always enters. R is true but does not make A true.`),
  asrt(4, 'lenses', r`If half of a convex lens (the lower half, cut across the aperture) is covered with black paper, its focal length is halved.`, r`The focal length of a lens depends only on the refractive indices and the radii of curvature of its faces.`, 3,
    r`A is false: the focal length stays the same and the image is only dimmer (intensity halves). R is a true statement, and it shows why $f$ is unchanged.`, { trap: 'Covering a part reduces brightness, not the focal length.' }),
  asrt(4, 'prism', r`At the angle of minimum deviation a ray passes through the prism parallel to its base.`, r`At minimum deviation $i=e$ and $r_1=r_2$.`, 0,
    r`The path is symmetrical about the bisector of the apex angle, so $r_1=r_2=A/2$ and the ray inside is parallel to the base for an isosceles prism. R states the symmetry that causes it.`),
  asrt(3, 'refraction', r`A mirage is seen on a hot road in summer.`, r`The layer of air close to the road is denser than the air above it.`, 2,
    r`A is true: rays from the sky pass into hotter, less dense air near the road (lower $n$), bend away from the normal, and are totally reflected. The observer sees a "pool of the sky". R is false: hot air is less dense.`),
  asrt(2, 'plane mirror', r`A plane mirror can form a real image.`, r`A plane mirror always forms an image of the same size as the object.`, 1,
    r`A is true when the incident rays are converging (a virtual object): the mirror reflects them to a real point in front. R is also true, but equal size has nothing to do with whether the image is real.`),
);

// ---------- Statement I / Statement II ----------
items.push(
  stm(2, 'mirrors and lenses', r`The focal length of a spherical mirror is the same in air and in water.`, r`The focal length of a thin lens is the same in air and in water.`, 2,
    r`I is true: $f=R/2$ depends on geometry only. II is false: $\dfrac1f=\left(\dfrac{n_l}{n_m}-1\right)(\dots)$ depends on the surrounding medium.`),
  stm(3, 'dispersion', r`The speed of light in glass is different for different colours.`, r`The refractive index of glass depends on the wavelength of light.`, 0,
    r`Both are true and connected: $v=c/n(\lambda)$. In glass red light is fastest and violet is slowest (normal dispersion).`),
  stm(3, 'lenses', r`A concave lens can form a real image of a real object.`, r`A convex lens cannot form a virtual image.`, 1,
    r`I is false: a concave lens gives only virtual images of real objects. II is false: a convex lens does form a virtual, magnified image when the object is inside the focal length.`),
  stm(3, 'plane mirror', r`The image in a plane mirror is laterally inverted.`, r`A plane mirror turns the image of the object upside down.`, 2,
    r`I is true: left and right appear swapped. II is false: the image of an upright object is upright. The mirror reverses front-to-back, not up-to-down.`),
  stm(4, 'apparent depth', r`When a pool is viewed obliquely, its bottom appears shallower than when viewed vertically.`, r`The relation (apparent depth) $=$ (real depth)$/n$ holds only for rays close to the normal.`, 0,
    r`For a ray leaving water at angle $r$ and emerging at $i$, apparent depth $=d\dfrac{\tan r}{\tan i}$. With $n=\tfrac43$ and $i=60°$ this is $0.49d$ compared with $0.75d$ for vertical viewing. Both statements are true.`),
  stm(3, 'lens combinations', r`The power of two thin lenses in contact is the sum of their powers.`, r`A convex and a concave lens of equal power placed in contact have zero net power.`, 0,
    r`$P=P_1+P_2$. With $P_1=+P$ and $P_2=-P$ we get $P=0$: the pair behaves like a plane glass plate (for thin lenses).`),
  stm(4, 'dispersion', r`A prism bends blue light more than red.`, r`Blue light has a higher speed than red light in glass.`, 2,
    r`I is true: $n_{blue}>n_{red}$. II is false: $v=c/n$, so the higher index gives a lower speed. Blue light is slower in glass.`),
  stm(3, 'aberration', r`A spherical concave mirror of small aperture focuses a wide parallel beam to a single point.`, r`Spherical aberration is the failure of rays far from the axis to meet at the paraxial focus.`, 3,
    r`I is false: it is only for rays near the axis (paraxial rays). Rays far from the axis cross the axis closer to the mirror. II is the correct definition.`),
);

// ---------- One or more correct ----------
items.push(
  msq(3, 'lenses', r`Which statements are correct? (Glass of $n=1.5$; water $n=1.33$; carbon disulphide $n=1.63$.)`,
    [r`A glass convex lens has a longer focal length in water than in air`, r`A glass convex lens placed in carbon disulphide behaves as a diverging lens`, r`An air bubble shaped like a biconvex lens, inside water, acts as a diverging lens`, r`The focal length of a concave mirror increases in water`], [0, 1, 2],
    r`$\dfrac1f\propto\left(\dfrac{n_l}{n_m}-1\right)$. (A) In water $\dfrac{1.5}{1.33}-1=0.13<0.5$, so $f$ grows. (B) In CS$_2$, $1.5/1.63<1$ gives a negative power. (C) For air in water the ratio is $<1$: diverging. (D) A mirror's $f=R/2$ does not depend on the medium.`),
  msq(3, 'total internal reflection', r`Which statements about total internal reflection are correct?`,
    [r`It is used to carry light along optical fibres`, r`It helps a diamond to sparkle`, r`It can occur when light goes from air to water`, r`It needs the angle of incidence to exceed the critical angle`], [0, 1, 3],
    r`TIR needs a denser-to-rarer path and an angle above $C$. Fibres and diamonds use it; air to water never gives it (C false).`),
  msq(4, 'spherical mirrors', r`A concave mirror has focal length $f$. For which positions of a real object is the image magnified?`,
    [r`Between the pole and the focus`, r`Between the focus and the centre of curvature`, r`At the centre of curvature`, r`Beyond the centre of curvature`], [0, 1],
    r`Magnification $m=\dfrac{f}{f-u}$. Between pole and focus: $m>1$, virtual. Between $f$ and $2f$: $|m|>1$, real. At $2f$: $|m|=1$. Beyond $2f$: $|m|<1$.`),
  msq(3, 'prism', r`A ray passes through a prism in air. Which statements are correct?`,
    [r`At minimum deviation the angle of incidence equals the angle of emergence`, r`The angle of minimum deviation increases if $n$ increases`, r`For a thin prism the deviation is nearly $(n-1)A$ for any small angle of incidence`, r`Red light is deviated more than violet light`], [0, 1, 2],
    r`(A) Symmetric path. (B) $\sin\frac{A+\delta_m}2=n\sin\frac A2$, so a larger $n$ gives larger $\delta_m$. (C) Thin-prism formula. (D) Violet has the larger $n$, so it deviates more.`),
  msq(4, 'lenses', r`A convex lens of focal length 10 cm has a small object 5 cm from it. Which statements are correct?`,
    [r`The image is virtual`, r`The image is erect`, r`The image is 10 cm from the lens`, r`The image is half the size of the object`], [0, 1, 2],
    r`$\dfrac1v=\dfrac1{10}-\dfrac15=-\dfrac1{10}$, so $v=-10$ cm: virtual and on the object's side. $m=v/u=(-10)/(-5)=+2$: erect and twice as big (D false).`),
  msq(3, 'eye defects', r`Which statements about defects of vision are correct?`,
    [r`Myopia is corrected with a concave lens`, r`In hypermetropia the near point is beyond 25 cm`, r`Presbyopia may need bifocal lenses`, r`Astigmatism is corrected with a spherical lens`], [0, 1, 2],
    r`Astigmatism comes from unequal curvature in different directions of the cornea, so it needs a cylindrical lens (D false).`),
  msq(5, 'optical instruments', r`Which statements about optical instruments are correct?`,
    [r`The objective of a compound microscope has a short focal length`, r`The objective of an astronomical telescope has a long focal length and a large aperture`, r`In normal adjustment an astronomical telescope has length $f_o-f_e$`, r`A Galilean telescope has length $f_o-f_e$ in normal adjustment`], [0, 1, 3],
    r`Normal adjustment of an astronomical telescope needs the two focal points to coincide: length $f_o+f_e$ (C false). The Galilean design uses a concave eyepiece, so the length is $f_o-f_e$.`),
  msq(4, 'apparent depth', r`A fish is in a pond and a bird is flying above it. Which statements are correct for near-normal viewing?`,
    [r`A person above the water sees the fish nearer than it really is`, r`The fish sees the bird higher than it really is`, r`The apparent depth of the fish does not depend on how high the person's eye is above the water`, r`The apparent depth of the fish does not depend on the refractive index of the water`], [0, 1, 2],
    r`Apparent depth $=d/n$ comes from one refraction at the surface, so it is measured below the surface for any eye height (C true), and it does depend on $n$ (D false). Looking up from water, apparent height $=nh$ (B true).`),
  msq(5, 'refraction at spherical surface', r`For refraction from air ($n_1=1$) into glass ($n_2=1.5$) at a single spherical surface, which statements are correct?`,
    [r`$\dfrac{n_2}{v}-\dfrac{n_1}{u}=\dfrac{n_2-n_1}{R}$`, r`A concave surface (towards the object) always forms a virtual image of a real object`, r`A convex surface can form a real image of a real object`, r`An object at infinity gives an image at $v=R$ for a convex surface`], [0, 1, 2],
    r`(B) $R<0$ and $u<0$ make both terms on the right negative, so $v<0$. (C) If $|u|$ is large enough, $\dfrac{n_2}v>0$. (D) $v=\dfrac{n_2R}{n_2-n_1}=3R$ here, not $R$.`),
);
// ---------- Match the following and passages ----------
const mat2 = (level, sub, group, q, correct, wrongs, sol, o = {}) => {
  const pos = (c++ * 3 + 2) % 4; const options = [...wrongs]; options.splice(pos, 0, correct);
  return base(level, sub, { type: 'mcq', format: 'match', group, q, options, answer: pos, sol, ...o });
};
const groups = {
  m1: { title: 'Images of mirrors and lenses',
    list1: ['A. Convex mirror, real object at any distance', 'B. Concave mirror, object between pole and focus', 'C. Convex lens, object beyond $2f$', 'D. Concave lens, object at infinity'],
    list2: ['p. virtual, erect and magnified', 'q. real, inverted and diminished', 'r. virtual, erect and diminished', 's. virtual image at the focal point'] },
  m2: { title: 'Two thin lenses of focal length f',
    list1: ['A. Two convex lenses $f$, in contact', 'B. Convex $f$ with a concave lens of focal length $2f$, in contact', 'C. Two convex lenses $f$, separated by $f$', 'D. Two convex lenses $f$, separated by $2f$'],
    list2: [r`p. equivalent focal length $f/2$`, r`q. no net power (parallel beam stays parallel)`, r`r. equivalent focal length $f$`, r`s. equivalent focal length $2f$`] },
  m3: { title: 'Defects of vision',
    list1: ['A. Myopia', 'B. Hypermetropia', 'C. Presbyopia', 'D. Astigmatism'],
    list2: ['p. concave lens', 'q. convex lens', 'r. bifocal lens', 's. cylindrical lens'] },
  m4: { title: 'Magnifying power',
    list1: ['A. Astronomical telescope, normal adjustment', 'B. Compound microscope, final image at infinity (tube length $L$)', 'C. Simple microscope, image at the near point $D$', 'D. Simple microscope, image at infinity'],
    list2: [r`p. $f_o/f_e$`, r`q. $\dfrac{L}{f_o}\cdot\dfrac{D}{f_e}$`, r`r. $1+\dfrac Df$`, r`s. $\dfrac Df$`] },
  p1: { title: 'A convex lens on an optical bench',
    passage: r`<p>A convex lens of focal length 20 cm is fixed on an optical bench. A small object 2 cm tall is placed on the axis 30 cm from the lens.</p>` },
  p2: { title: 'A ray through a glass prism',
    passage: r`<p>A glass prism has apex angle $60°$ and refractive index 1.5. A ray in air meets one face at an angle of incidence of $40°$ (use $\sin40°=0.6428$).</p>` },
  p3: { title: 'A lamp at the bottom of a pond',
    passage: r`<p>A small lamp rests at the bottom of a pond of depth 2.0 m, with water of refractive index $4/3$. Light from the lamp leaves the surface only inside a circle, because of total internal reflection outside it.</p>` },
};
items.push(
  mat2(2, 'images', 'm1', r`Match each optical arrangement with the image it forms.`, 'A-r, B-p, C-q, D-s', ['A-p, B-r, C-q, D-s', 'A-r, B-p, C-s, D-q', 'A-q, B-p, C-r, D-s'],
    r`Convex mirror: always virtual, erect, diminished (r). Concave mirror inside $f$: virtual, erect, magnified (p). Convex lens beyond $2f$: real, inverted, diminished (q). Concave lens with parallel rays: the rays appear to diverge from the focus, a virtual point image (s).`),
  mat2(3, 'lens combinations', 'm2', r`Match each arrangement with its effective focal length (thin lenses, formula $\dfrac1F=\dfrac1{f_1}+\dfrac1{f_2}-\dfrac d{f_1f_2}$).`, 'A-p, B-s, C-r, D-q', ['A-p, B-q, C-r, D-s', 'A-s, B-p, C-r, D-q', 'A-p, B-s, C-q, D-r'],
    r`A: $\tfrac1f+\tfrac1f=\tfrac2f$, so $F=f/2$ (p). B: $\tfrac1f-\tfrac1{2f}=\tfrac1{2f}$, so $F=2f$ (s). C: $\tfrac2f-\tfrac f{f^2}=\tfrac1f$, so $F=f$ (r). D: $\tfrac2f-\tfrac{2f}{f^2}=0$ (q).`),
  mat2(3, 'eye defects', 'm3', r`Match each defect of vision with the usual correction.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-r, B-q, C-p, D-s'],
    r`Myopia: concave (diverging) lens (p). Hypermetropia: convex lens (q). Presbyopia: bifocal (r). Astigmatism: cylindrical lens (s).`),
  mat2(4, 'optical instruments', 'm4', r`Match each instrument with its magnifying power.`, 'A-p, B-q, C-r, D-s', ['A-q, B-p, C-r, D-s', 'A-p, B-q, C-s, D-r', 'A-p, B-r, C-q, D-s'],
    r`Telescope in normal adjustment: $f_o/f_e$ (p). Compound microscope, final image at infinity: $\dfrac L{f_o}\dfrac D{f_e}$ (q). Simple microscope, near point: $1+D/f$ (r). Simple microscope, infinity: $D/f$ (s).`),
);
items.push(
  pas(2, 'lenses', 'p1', r`Find the image distance (in cm).`, () => lensV(-30, 20), 0, 0,
    r`$\dfrac1v=\dfrac1{20}-\dfrac1{30}=\dfrac1{60}$, so $v=60$ cm.`, { unit: 'cm' }),
  pas(2, 'lenses', 'p1', r`Find the height of the image (in cm, magnitude).`, () => 2 * 60 / 30, 0, 0,
    r`$|m|=\dfrac{60}{30}=2$. Image height $=2\times2=4$ cm (real, inverted).`, { unit: 'cm' }),
  pas(3, 'lenses', 'p1', r`At what distance from the lens (in cm) should the object be placed to get an erect image twice its size?`, () => 10, 0, 0,
    r`Virtual, erect: $m=+2=\dfrac{f}{f+u}$ with $f=20$: $f+u=10$, so $u=-10$ cm. Check: $\dfrac1v=\dfrac1{20}-\dfrac1{10}=-\dfrac1{20}$, $v=-20$, $m=v/u=2$.`, { unit: 'cm' }),
  pas(2, 'prism', 'p2', r`Find the angle of refraction $r_1$ at the first face (in degrees, 1 decimal).`, () => asind(0.6428 / 1.5), 0.1, 1,
    r`$\sin r_1=\dfrac{0.6428}{1.5}=0.4285$, so $r_1=25.4°$.`, { unit: '°' }),
  pas(3, 'prism', 'p2', r`Find the angle of emergence $e$ at the second face (in degrees, 1 decimal).`, () => asind(1.5 * sind(60 - asind(0.6428 / 1.5))), 0.2, 1,
    r`$r_2=A-r_1=60-25.4=34.6°$. $\sin e=1.5\sin34.6°=1.5\times0.5686=0.8529$, so $e=58.5°$. (No total reflection, since $34.6°<C=41.8°$.)`, { unit: '°' }),
  pas(4, 'prism', 'p2', r`Find the angle of deviation of the ray (in degrees, 1 decimal).`, () => 40 + asind(1.5 * sind(60 - asind(0.6428 / 1.5))) - 60, 0.3, 1,
    r`$\delta=i+e-A=40+58.5-60=38.5°$.`, { unit: '°' }),
  pas(2, 'apparent depth', 'p3', r`How deep does the lamp appear when seen vertically from above (in m)?`, () => 2 / (4 / 3), 0.05, 1,
    r`Apparent depth $=2.0/(4/3)=1.5$ m.`, { unit: 'm', sub: 'apparent depth' }),
  pas(3, 'total internal reflection', 'p3', r`Find the radius of the circle of light on the surface (in m, 2 decimals).`, () => 2 * Math.tan(asind(0.75) * D2R), 0.01, 2,
    r`The edge ray meets the surface at the critical angle: $\sin C=3/4$, $\tan C=3/\sqrt7=1.134$. $r=h\tan C=2.0\times1.134=2.27$ m.`, { unit: 'm' }),
  pas(4, 'total internal reflection', 'p3', r`Find the area of this circle (in $\mathrm{m^2}$, 1 decimal).`, () => PI * (2 * Math.tan(asind(0.75) * D2R)) ** 2, 0.2, 1,
    r`$A=\pi r^2=\pi\times(2.268)^2=\pi\times5.143=16.2\ \mathrm{m^2}$. (Exactly: $\pi h^2\tan^2C=\pi\times4\times9/7$.)`, { unit: 'm²' }),
);
// ---------- Number templates ----------
const out = (x, dp, exact = false) => ({ answer: R(x, dp), tol: exact ? 0 : +(10 ** -dp).toFixed(dp + 1) });
const sg = (x) => (x < 0 ? '−' : '') + fmt(Math.abs(x), 4); // signed number text
const T = (id, level, sub, type, make, verify) => ({ id, type, level, exams: exs(level, type), sub, make, verify });
const gens = [
  T('ro-g01', 2, 'spherical mirrors', 'nat', (rng) => {
    const v = int(rng, 0, 3); const F = pick(rng, 10, 30, 5); const kk = choose(rng, [1.5, 2, 3, 4]); const h = pick(rng, 1, 6);
    if (v === 1) { const U = pick(rng, 20, 90, 10); const u = -U; const vv = u * F / (u - F);
      return { v, F, u, q: r`A convex mirror has focal length ${F} cm. A real object is ${U} cm in front of it. Find the image distance (in cm, with sign by the Cartesian rule, 1 decimal).`, ...out(vv, 1), unit: 'cm', sol: r`$f=+${F}$, $u=-${U}$. $\dfrac1v=\dfrac1f-\dfrac1u=\dfrac1{${F}}+\dfrac1{${U}}$, so $v=${R(vv, 2)}$ cm (positive: a virtual image behind the mirror).` }; }
    const U = F * kk; const u = -U; const f = -F; const vv = u * f / (u - f); const m = -vv / u;
    if (v === 0) return { v, F, u, q: r`A concave mirror has focal length ${F} cm. An object is placed ${U} cm in front of it. Find the image distance from the pole (in cm, with sign, 1 decimal).`, ...out(vv, 1), unit: 'cm', sol: r`$f=-${F}$, $u=-${U}$. $\dfrac1v=\dfrac1f-\dfrac1u=-\dfrac1{${F}}+\dfrac1{${U}}$, so $v=${R(vv, 2)}$ cm (negative: real, in front of the mirror).`, trap: 'Use the sign convention: both $f$ and $u$ are negative for a concave mirror and a real object.' };
    if (v === 2) return { v, F, u, q: r`A concave mirror has focal length ${F} cm. An object is ${U} cm from it. Find the magnification $m=-v/u$ (2 decimals).`, ...out(m, 2), sol: r`$v=\dfrac{uf}{u-f}=${R(vv, 2)}$ cm. $m=-\dfrac vu=-\dfrac{${R(vv, 2)}}{${-U}}=${R(m, 2)}$. A negative value means an inverted image.` };
    return { v, F, u, h, q: r`A concave mirror has focal length ${F} cm. An object ${h} cm tall is ${U} cm from it. Find the height of the image (in cm, magnitude, 2 decimals).`, ...out(Math.abs(m * h), 2), unit: 'cm', sol: r`$v=\dfrac{uf}{u-f}=${R(vv, 2)}$ cm. $|m|=\left|\dfrac vu\right|=${R(Math.abs(m), 3)}$. Image height $=${R(Math.abs(m), 3)}\times${h}=${R(Math.abs(m * h), 2)}$ cm.` };
  }, (p) => { const f = p.v === 1 ? p.F : -p.F; const v = 1 / (1 / f - 1 / p.u); return p.v === 2 ? -v / p.u : p.v === 3 ? Math.abs(v / p.u * p.h) : v; }),

  T('ro-g02', 2, 'plane mirror', 'nat', (rng) => {
    const v = int(rng, 0, 3);
    if (v === 0) { const th = pick(rng, 5, 40, 5); return { v, th, q: r`A plane mirror is turned through $${th}°$ about an axis in its plane while the incident ray stays fixed. Through what angle (in degrees) does the reflected ray turn?`, ...out(2 * th, 0, true), unit: '°', sol: r`The reflected ray turns twice as much as the mirror: $2\times${th}°=${2 * th}°$.` }; }
    if (v === 1) { const th = choose(rng, [30, 36, 45, 60, 90]); return { v, th, q: r`Two plane mirrors are inclined at $${th}°$. An object is placed between them on the bisector. How many images are formed?`, ...out(360 / th - 1, 0, true), sol: r`$n=\dfrac{360°}{\theta}-1=\dfrac{360}{${th}}-1=${360 / th - 1}$.` }; }
    if (v === 2) { const H = pick(rng, 1.5, 1.9, 0.1); return { v, H, q: r`A person ${H} m tall wants to see her whole image in a vertical plane mirror. Find the shortest mirror she needs (in m, 2 decimals).`, ...out(H / 2, 2), unit: 'm', sol: r`The mirror must be half her height: $${H}/2=${R(H / 2, 3)}$ m, whatever the distance.`, trap: 'The distance from the mirror does not matter.' }; }
    const d = pick(rng, 3, 8, 1); const s = pick(rng, 1, 2, 0.5); const t = pick(rng, 1, 2, 1);
    return { v, d, s, t, q: r`A boy stands ${d} m in front of a plane mirror and walks towards it at ${s} $\mathrm{m\,s^{-1}}$ for ${t} s. Find the distance between him and his image after this time (in m).`, ...out(2 * (d - s * t), 1), unit: 'm', sol: r`He is now at $${d}-${s}\times${t}=${R(d - s * t, 2)}$ m from the mirror. His image is the same distance behind it. Distance $=2\times${R(d - s * t, 2)}=${R(2 * (d - s * t), 2)}$ m.` };
  }, (p) => (p.v === 0 ? p.th + p.th : p.v === 1 ? 360 / p.th - 1 : p.v === 2 ? p.H / 2 : (p.d - p.s * p.t) + (p.d - p.s * p.t))),

  T('ro-g03', 3, 'moving objects', 'nat', (rng) => {
    const v = int(rng, 0, 3); const vo = pick(rng, 1, 6, 1); const vm = pick(rng, 1, 4, 1);
    if (v === 0) return { v, vo, q: r`An object approaches a plane mirror at $${vo}\ \mathrm{m\,s^{-1}}$. Find the speed of its image relative to the object (in $\mathrm{m\,s^{-1}}$).`, ...out(2 * vo, 0, true), unit: 'm/s', sol: r`The image approaches the mirror at the same speed from the other side. Relative speed $=${vo}+${vo}=${2 * vo}\ \mathrm{m\,s^{-1}}$.` };
    if (v === 1) return { v, vm, q: r`An object is at rest in front of a plane mirror. The mirror moves away from the object at $${vm}\ \mathrm{m\,s^{-1}}$. Find the speed of the image in the ground frame (in $\mathrm{m\,s^{-1}}$).`, ...out(2 * vm, 0, true), unit: 'm/s', sol: r`$x_i=2x_m-x_o$, so $v_i=2v_m=${2 * vm}\ \mathrm{m\,s^{-1}}$.` };
    if (v === 2) return { v, vo, vm, q: r`An object moves towards a plane mirror at $${vo}\ \mathrm{m\,s^{-1}}$ while the mirror moves towards the object at $${vm}\ \mathrm{m\,s^{-1}}$. Find the speed of the image relative to the object (in $\mathrm{m\,s^{-1}}$).`, ...out(2 * (vo + vm), 0, true), unit: 'm/s', sol: r`Take $x_i=2x_m-x_o$, so $v_i-v_o=2(v_m-v_o)$. The mirror and object approach each other at $${vo}+${vm}=${vo + vm}\ \mathrm{m\,s^{-1}}$, so the image and object approach at twice that: $${2 * (vo + vm)}\ \mathrm{m\,s^{-1}}$.` };
    const F = pick(rng, 10, 20, 5); const kk = choose(rng, [1.5, 3, 4]); const U = F * kk; const vv = U * F / (U - F);
    return { v, F, U, vo, q: r`A concave mirror has focal length ${F} cm. An object ${U} cm from it moves along the axis at $${vo}\ \mathrm{cm\,s^{-1}}$. Find the speed of the image (in $\mathrm{cm\,s^{-1}}$, 2 decimals).`, ...out((vv / U) ** 2 * vo, 2), unit: 'cm/s', sol: r`$|v|=\dfrac{uf}{u-f}=${R(vv, 2)}$ cm. Differentiating the mirror formula: $\dfrac{dv}{dt}=-\dfrac{v^2}{u^2}\dfrac{du}{dt}$. Speed $=\left(\dfrac{${R(vv, 2)}}{${U}}\right)^2\times${vo}=${R((vv / U) ** 2 * vo, 3)}\ \mathrm{cm\,s^{-1}}$.`, trap: 'It is $m^2$ times the object speed.' };
  }, (p) => (p.v === 0 ? 2 * p.vo : p.v === 1 ? 2 * p.vm : p.v === 2 ? 2 * (p.vo + p.vm) : p.vo * (1 / (1 / p.F - 1 / p.U) / p.U) ** 2)),

  T('ro-g04', 2, 'refraction', 'nat', (rng) => {
    const v = int(rng, 0, 3); const n = choose(rng, [1.33, 1.5, 1.6, 1.25, 2]);
    if (v === 0) { const i = choose(rng, [30, 45, 60]); const rr = asind(sind(i) / n); return { v, n, i, q: r`A ray in air strikes a surface of refractive index ${n} at an angle of incidence of $${i}°$. Find the angle of refraction (in degrees, 1 decimal).`, ...out(rr, 1), unit: '°', sol: r`$\sin r=\dfrac{\sin${i}°}{${n}}=${R(sind(i) / n, 4)}$, so $r=${R(rr, 2)}°$.` }; }
    if (v === 1) return { v, n, q: r`The refractive index of a medium is ${n}. Find the speed of light in it (in units of $10^8\ \mathrm{m\,s^{-1}}$, 3 decimals; $c=3\times10^8$).`, ...out(3 / n, 3), unit: '×10⁸ m/s', sol: r`$v=c/n=3/${n}=${R(3 / n, 3)}\times10^8\ \mathrm{m\,s^{-1}}$.` };
    if (v === 2) { const lam = pick(rng, 400, 700, 50); return { v, n, lam, q: r`Light of wavelength ${lam} nm in air enters a medium of refractive index ${n}. Find its wavelength in the medium (in nm, 1 decimal).`, ...out(lam / n, 1), unit: 'nm', sol: r`$\lambda'=\lambda/n=${lam}/${n}=${R(lam / n, 2)}$ nm. The frequency is unchanged.` }; }
    const vv = choose(rng, [1.5, 2, 2.4, 2.25]); return { v, vv, q: r`The speed of light in a transparent medium is $${vv}\times10^8\ \mathrm{m\,s^{-1}}$. Find its refractive index (3 decimals).`, ...out(3 / vv, 3), sol: r`$n=c/v=3/${vv}=${R(3 / vv, 4)}$.` };
  }, (p) => (p.v === 0 ? asind(sind(p.i) / p.n) : p.v === 1 ? 3e8 / p.n / 1e8 : p.v === 2 ? p.lam / p.n : 3e8 / (p.vv * 1e8))),

  T('ro-g05', 3, 'apparent depth', 'nat', (rng) => {
    const v = int(rng, 0, 3); const n = choose(rng, [4 / 3, 1.5, 1.6]); const nt = n === 4 / 3 ? '4/3' : String(n);
    if (v === 0) { const d = pick(rng, 6, 30, 3); return { v, n, d, q: r`A coin is ${d} cm below the surface of a liquid of refractive index ${nt}. Viewed from directly above, how deep does it appear (in cm, 2 decimals)?`, ...out(d / n, 2), unit: 'cm', sol: r`Apparent depth $=d/n=${d}/${R(n, 3)}=${R(d / n, 2)}$ cm.` }; }
    if (v === 1) { const t1 = pick(rng, 3, 12, 3); const t2 = pick(rng, 6, 18, 3); const n2 = choose(rng, [1.2, 1.5, 1.6]); const ans = t1 / n + t2 / n2;
      return { v, n, n2, t1, t2, q: r`A tank has a layer of liquid ${t1} cm thick ($n=${nt}$) over a layer ${t2} cm thick ($n=${n2}$). Looking vertically down, how far below the top surface does the bottom appear (in cm, 2 decimals)?`, ...out(ans, 2), unit: 'cm', sol: r`Apparent depth $=\dfrac{t_1}{n_1}+\dfrac{t_2}{n_2}=\dfrac{${t1}}{${R(n, 3)}}+\dfrac{${t2}}{${n2}}=${R(ans, 3)}$ cm.` }; }
    if (v === 2) { const h = pick(rng, 2, 9, 1); return { v, n, h, q: r`A bird is ${h} m above the surface of a lake ($n=${nt}$). How high does it appear to a fish directly below it (in m, 2 decimals)?`, ...out(n * h, 2), unit: 'm', sol: r`Seen from the denser medium, apparent height $=nh=${R(n, 3)}\times${h}=${R(n * h, 2)}$ m.`, trap: 'The fish sees the bird farther than it is.' }; }
    const H = pick(rng, 1, 2, 0.5); const d = pick(rng, 1, 3, 0.5); return { v, n, H, d, q: r`A fish is ${d} m below the surface of water ($n=${nt}$). A person's eye is ${H} m above the surface, directly over the fish. How far from the eye does the fish appear (in m, 2 decimals)?`, ...out(H + d / n, 2), unit: 'm', sol: r`Apparent distance $=H+\dfrac dn=${H}+\dfrac{${d}}{${R(n, 3)}}=${R(H + d / n, 2)}$ m.` };
  }, (p) => (p.v === 0 ? p.d * (1 / p.n) : p.v === 1 ? (p.t1 * p.n2 + p.t2 * p.n) / (p.n * p.n2) : p.v === 2 ? p.h / (1 / p.n) : p.H + p.d * (1 / p.n))),

  T('ro-g06', 3, 'refraction through a slab', 'nat', (rng) => {
    const v = int(rng, 0, 3); const n = choose(rng, [1.5, 1.6, 1.33, 1.8]); const t = pick(rng, 3, 12, 1);
    if (v === 0) return { v, n, t, q: r`A glass slab ($n=${n}$) of thickness ${t} cm lies over a printed word. By how much (in cm, 2 decimals) does the word appear raised when viewed from directly above?`, ...out(t * (1 - 1 / n), 2), unit: 'cm', sol: r`Normal shift $=t\left(1-\dfrac1n\right)=${t}\left(1-\dfrac1{${n}}\right)=${R(t * (1 - 1 / n), 3)}$ cm.` };
    if (v === 1) { const i = choose(rng, [30, 45, 60]); const rr = asind(sind(i) / n); const ls = t * sind(i - rr) / Math.cos(rr * D2R); return { v, n, t, i, q: r`A ray strikes a glass slab ($n=${n}$, thickness ${t} cm) at $${i}°$. Find the lateral shift of the emergent ray (in cm, 2 decimals).`, ...out(ls, 2), unit: 'cm', sol: r`$r=\sin^{-1}\dfrac{\sin${i}°}{${n}}=${R(rr, 2)}°$. Shift $=\dfrac{t\sin(i-r)}{\cos r}=\dfrac{${t}\times\sin${R(i - rr, 2)}°}{\cos${R(rr, 2)}°}=${R(ls, 3)}$ cm.` }; }
    if (v === 2) return { v, n, t, q: r`How long does light take to cross a glass slab ($n=${n}$) ${t} cm thick at normal incidence (in picoseconds, 1 decimal)? ($c=3\times10^8\ \mathrm{m\,s^{-1}}$)`, ...out(n * t / 100 / 3e8 * 1e12, 1), unit: 'ps', sol: r`$t=\dfrac{d}{v}=\dfrac{nd}{c}=\dfrac{${n}\times${t / 100}}{3\times10^8}=${R(n * t / 100 / 3e8 * 1e12, 2)}\times10^{-12}$ s.` };
    const s = R(t * (1 - 1 / n), 3); return { v, n, t, s, q: r`A glass block ($n=${n}$) makes a mark seen from directly above appear raised by ${s} cm. Find its thickness (in cm, nearest whole number).`, ...out(s / (1 - 1 / n), 0), unit: 'cm', sol: r`Shift $s=t(1-1/n)$, so $t=\dfrac{s}{1-1/n}=\dfrac{${s}}{${R(1 - 1 / n, 4)}}=${R(s / (1 - 1 / n), 2)}$ cm.` };
  }, (p) => (p.v === 0 ? p.t * (p.n - 1) / p.n : p.v === 1 ? p.t * (Math.sin((p.i - asind(Math.sin(p.i * D2R) / p.n)) * D2R)) / Math.cos(Math.asin(Math.sin(p.i * D2R) / p.n)) : p.v === 2 ? p.n * (p.t / 100) / 3e8 * 1e12 : p.s * p.n / (p.n - 1))),

  T('ro-g07', 3, 'total internal reflection', 'nat', (rng) => {
    const v = int(rng, 0, 3);
    if (v === 0) { const n = choose(rng, [1.33, 1.5, 1.6, 1.8, 2.42]); return { v, n, q: r`Find the critical angle for light going from a medium of refractive index ${n} into air (in degrees, 1 decimal).`, ...out(asind(1 / n), 1), unit: '°', sol: r`$\sin C=\dfrac1n=\dfrac1{${n}}=${R(1 / n, 4)}$, so $C=${R(asind(1 / n), 2)}°$.` }; }
    if (v === 1) { const C = choose(rng, [30, 40, 45, 50, 60]); return { v, C, q: r`The critical angle of a transparent material in air is $${C}°$. Find its refractive index (3 decimals).`, ...out(1 / sind(C), 3), sol: r`$n=\dfrac1{\sin C}=\dfrac1{\sin${C}°}=${R(1 / sind(C), 4)}$.` }; }
    if (v === 2) { const h = pick(rng, 1, 5, 0.5); const n = choose(rng, [4 / 3, 1.5, 1.6]); const nt = n === 4 / 3 ? '4/3' : String(n); return { v, h, n, q: r`A lamp is at the bottom of a tank of liquid ($n=${nt}$) of depth ${h} m. Light leaves the surface only inside a circle. Find the circle's radius (in m, 2 decimals).`, ...out(h / Math.sqrt(n * n - 1), 2), unit: 'm', sol: r`At the edge the ray meets the surface at $C$ with $\sin C=1/n$, so $\tan C=\dfrac1{\sqrt{n^2-1}}$. $r=h\tan C=\dfrac{${h}}{\sqrt{${R(n * n, 4)}-1}}=${R(h / Math.sqrt(n * n - 1), 3)}$ m.` }; }
    const n1 = choose(rng, [1.5, 1.6, 1.7]); const n2 = choose(rng, [1.33, 1.4, 1.2]); return { v, n1, n2, q: r`Light inside a medium of $n=${n1}$ meets its boundary with another medium of $n=${n2}$. Find the critical angle (in degrees, 1 decimal).`, ...out(asind(n2 / n1), 1), unit: '°', sol: r`$\sin C=\dfrac{n_2}{n_1}=\dfrac{${n2}}{${n1}}=${R(n2 / n1, 4)}$, so $C=${R(asind(n2 / n1), 2)}°$.` };
  }, (p) => (p.v === 0 ? Math.asin(1 / p.n) / D2R : p.v === 1 ? 1 / Math.sin(p.C * D2R) : p.v === 2 ? p.h * Math.tan(Math.asin(1 / p.n)) : Math.asin(p.n2 / p.n1) / D2R)),

  T('ro-g08', 2, 'lenses', 'nat', (rng) => {
    const v = int(rng, 0, 3); const F = pick(rng, 10, 30, 5);
    if (v === 0) { const U = F * choose(rng, [1.5, 2, 3, 4]); const vv = lensV(-U, F); return { v, F, U, q: r`A convex lens has focal length ${F} cm. An object is ${U} cm from it. Find the image distance (in cm, 1 decimal).`, ...out(vv, 1), unit: 'cm', sol: r`$\dfrac1v=\dfrac1f+\dfrac1u=\dfrac1{${F}}-\dfrac1{${U}}$, so $v=${R(vv, 2)}$ cm (real, on the other side).` }; }
    if (v === 1) { const U = F / 2; const vv = lensV(-U, F); return { v, F, U, q: r`A convex lens has focal length ${F} cm. An object is ${U} cm from it. Find the image distance (in cm, with sign, 1 decimal).`, ...out(vv, 1), unit: 'cm', sol: r`$\dfrac1v=\dfrac1{${F}}-\dfrac1{${U}}=-\dfrac1{${F}}$, so $v=-${F}$ cm: a virtual image on the object's side.`, trap: 'Object inside the focal length gives a virtual image.' }; }
    if (v === 2) { const U = pick(rng, 20, 60, 10); const vv = lensV(-U, -F); return { v, F, U, q: r`A concave lens has focal length ${F} cm. An object is ${U} cm from it. Find the image distance (in cm, with sign, 1 decimal).`, ...out(vv, 1), unit: 'cm', sol: r`$f=-${F}$, $u=-${U}$. $\dfrac1v=\dfrac1f+\dfrac1u=-\dfrac1{${F}}-\dfrac1{${U}}$, so $v=${R(vv, 2)}$ cm (virtual).` }; }
    const U = F * choose(rng, [1.5, 2, 3]); const h = pick(rng, 1, 5, 1); const vv = lensV(-U, F); return { v, F, U, h, q: r`A convex lens of focal length ${F} cm forms an image of an object ${h} cm tall placed ${U} cm from it. Find the image height (in cm, 2 decimals).`, ...out(Math.abs(h * vv / U), 2), unit: 'cm', sol: r`$v=${R(vv, 2)}$ cm. $|m|=v/|u|=${R(vv / U, 3)}$. Height $=${R(Math.abs(h * vv / U), 2)}$ cm (inverted).` };
  }, (p) => { const f = p.v === 2 ? -p.F : p.F; const vv = 1 / (1 / f + 1 / -p.U); return p.v === 3 ? Math.abs(p.h * vv / p.U) : vv; }),

  T('ro-g09', 3, 'lens maker', 'nat', (rng) => {
    const v = int(rng, 0, 3);
    if (v === 0) { const n = choose(rng, [1.5, 1.6, 1.4, 1.7]); const Rr = pick(rng, 10, 40, 5); const f = Rr / (2 * (n - 1)); return { v, n, Rr, q: r`A biconvex lens of glass ($n=${n}$) has both faces of radius ${Rr} cm. Find its focal length in air (in cm, 1 decimal).`, ...out(f, 1), unit: 'cm', sol: r`$\dfrac1f=(n-1)\left(\dfrac1{R_1}-\dfrac1{R_2}\right)=${R(n - 1, 2)}\left(\dfrac1{${Rr}}+\dfrac1{${Rr}}\right)$, so $f=${R(f, 2)}$ cm.` }; }
    if (v === 1) { const n = choose(rng, [1.5, 1.6, 1.4, 1.7]); const Rr = pick(rng, 10, 40, 5); const f = Rr / (n - 1); return { v, n, Rr, q: r`A plano-convex lens ($n=${n}$) has a curved face of radius ${Rr} cm. Find its focal length (in cm, 1 decimal).`, ...out(f, 1), unit: 'cm', sol: r`$R_1=${Rr}$, $R_2=\infty$. $\dfrac1f=(n-1)\dfrac1{R}=\dfrac{${R(n - 1, 2)}}{${Rr}}$, so $f=${R(f, 2)}$ cm.` }; }
    if (v === 2) { const n = choose(rng, [1.5, 1.6, 1.4]); const f = pick(rng, 10, 30, 5); const Rr = 2 * f * (n - 1); return { v, n, f, q: r`A thin equiconvex lens of glass ($n=${n}$) has focal length ${f} cm in air. Find the radius of curvature of each face (in cm, 1 decimal).`, ...out(Rr, 1), unit: 'cm', sol: r`$\dfrac1f=(n-1)\dfrac2R$, so $R=2(n-1)f=2\times${R(n - 1, 2)}\times${f}=${R(Rr, 2)}$ cm.` }; }
    const pr = choose(rng, [[30, 30], [24, 20], [16, 20], [36, 30], [30, 25]]); const n = 1 + pr[0] / (2 * pr[1]); return { v, Rr: pr[0], f: pr[1], q: r`An equiconvex lens with faces of radius ${pr[0]} cm has focal length ${pr[1]} cm in air. Find the refractive index of its glass (2 decimals).`, ...out(n, 2), sol: r`$\dfrac1f=(n-1)\dfrac2R$, so $n=1+\dfrac R{2f}=1+\dfrac{${pr[0]}}{${2 * pr[1]}}=${R(n, 3)}$.` };
  }, (p) => (p.v === 0 ? 1 / ((p.n - 1) * (2 / p.Rr)) : p.v === 1 ? 1 / ((p.n - 1) / p.Rr) : p.v === 2 ? p.f * 2 * (p.n - 1) : 1 + p.Rr / (2 * p.f))),

  T('ro-g10', 3, 'lens combinations', 'nat', (rng) => {
    const v = int(rng, 0, 3);
    if (v === 0) { const f1 = pick(rng, 10, 40, 10); const f2 = pick(rng, 10, 40, 10); return { v, f1, f2, q: r`Two thin convex lenses of focal lengths ${f1} cm and ${f2} cm are in contact. Find the focal length of the combination (in cm, 2 decimals).`, ...out(f1 * f2 / (f1 + f2), 2), unit: 'cm', sol: r`$\dfrac1F=\dfrac1{${f1}}+\dfrac1{${f2}}$, so $F=\dfrac{${f1}\times${f2}}{${f1 + f2}}=${R(f1 * f2 / (f1 + f2), 3)}$ cm.` }; }
    if (v === 1) { const f1 = pick(rng, 10, 20, 5); const f2 = f1 + pick(rng, 5, 20, 5); return { v, f1, f2, q: r`A convex lens of focal length ${f1} cm is in contact with a concave lens of focal length ${f2} cm. Find the focal length of the combination (in cm, 2 decimals).`, ...out(f1 * f2 / (f2 - f1), 2), unit: 'cm', sol: r`$\dfrac1F=\dfrac1{${f1}}-\dfrac1{${f2}}=\dfrac{${f2}-${f1}}{${f1 * f2}}$, so $F=${R(f1 * f2 / (f2 - f1), 3)}$ cm (convex).` }; }
    if (v === 2) { const f1 = pick(rng, 10, 30, 10); const f2 = pick(rng, 10, 30, 10); const d = pick(rng, 5, 15, 5); const F = 1 / (1 / f1 + 1 / f2 - d / (f1 * f2)); return { v, f1, f2, d, q: r`Two thin convex lenses of focal lengths ${f1} cm and ${f2} cm are ${d} cm apart. Find the equivalent focal length (in cm, 2 decimals).`, ...out(F, 2), unit: 'cm', sol: r`$\dfrac1F=\dfrac1{f_1}+\dfrac1{f_2}-\dfrac d{f_1f_2}=\dfrac1{${f1}}+\dfrac1{${f2}}-\dfrac{${d}}{${f1 * f2}}$, so $F=${R(F, 3)}$ cm.` }; }
    const P1 = pick(rng, 2, 6, 1); const P2 = -pick(rng, 1, 1.5, 0.5); return { v, P1, P2, q: r`Two thin lenses in contact have powers $+${P1}$ D and $${P2}$ D. Find the focal length of the combination (in cm, 1 decimal).`, ...out(100 / (P1 + P2), 1), unit: 'cm', sol: r`$P=${P1}+(${P2})=${R(P1 + P2, 2)}$ D. $f=\dfrac{100}{${R(P1 + P2, 2)}}=${R(100 / (P1 + P2), 2)}$ cm.` };
  }, (p) => (p.v === 0 ? 1 / (1 / p.f1 + 1 / p.f2) : p.v === 1 ? 1 / (1 / p.f1 - 1 / p.f2) : p.v === 2 ? p.f1 * p.f2 / (p.f1 + p.f2 - p.d) : 100 / (p.P1 + p.P2))),

  T('ro-g11', 4, 'displacement method', 'nat', (rng) => {
    const v = int(rng, 0, 2); const tr = choose(rng, [[90, 20, 30], [100, 24, 20], [100, 21, 40], [64, 15, 16], [80, 15, 40], [150, 36, 30]]);
    const [D, f, d] = tr;
    if (v === 0) return { v, D, d, q: r`An object and a screen are ${D} cm apart. A convex lens forms a sharp image for two positions ${d} cm apart. Find its focal length (in cm, 2 decimals).`, ...out((D * D - d * d) / (4 * D), 2), unit: 'cm', sol: r`$f=\dfrac{D^2-d^2}{4D}=\dfrac{${D * D}-${d * d}}{${4 * D}}=${R((D * D - d * d) / (4 * D), 3)}$ cm.` };
    if (v === 1) return { v, D, f, q: r`An object and a screen are ${D} cm apart. A convex lens of focal length ${f} cm can give a sharp image at two positions. Find the distance between these positions (in cm).`, ...out(Math.sqrt(D * D - 4 * D * f), 0, true), unit: 'cm', sol: r`$d=\sqrt{D^2-4Df}=\sqrt{${D * D}-${4 * D * f}}=\sqrt{${D * D - 4 * D * f}}=${Math.sqrt(D * D - 4 * D * f)}$ cm.` };
    const o = pick(rng, 2, 6, 1); const kk = choose(rng, [2, 3]); return { v, o, kk, q: r`In the displacement method the two real images have heights ${o * kk} cm and ${o / kk} cm. Find the height of the object (in cm, 2 decimals).`, ...out(o, 2), unit: 'cm', sol: r`$h_1h_2=O^2$, so $O=\sqrt{${o * kk}\times${R(o / kk, 3)}}=\sqrt{${R(o * o, 3)}}=${o}$ cm.` };
  }, (p) => (p.v === 0 ? (p.D ** 2 - p.d ** 2) / (4 * p.D) : p.v === 1 ? Math.sqrt(p.D * (p.D - 4 * p.f)) : Math.sqrt(p.o * p.kk * (p.o / p.kk)))),

  T('ro-g12', 3, 'prism', 'nat', (rng) => {
    const v = int(rng, 0, 3);
    if (v === 0) { const pr = choose(rng, [[60, Math.SQRT2, '\\sqrt2'], [60, 1.5, '1.5'], [60, Math.sqrt(3), '\\sqrt3'], [50, 1.5, '1.5'], [40, 1.6, '1.6']]); const [A, n, nt] = pr; const dm = 2 * asind(n * sind(A / 2)) - A; return { v, A, n, q: r`Find the angle of minimum deviation of a prism of apex angle $${A}°$ and refractive index $${nt}$ (in degrees, 1 decimal).`, ...out(dm, 1), unit: '°', sol: r`$\sin\dfrac{A+\delta_m}2=n\sin\dfrac A2=${R(n, 4)}\times\sin${A / 2}°=${R(n * sind(A / 2), 4)}$. So $\dfrac{A+\delta_m}2=${R(asind(n * sind(A / 2)), 2)}°$ and $\delta_m=${R(dm, 2)}°$.` }; }
    if (v === 1) { const pr = choose(rng, [[60, 30], [60, 60], [30, 30], [90, 30]]); const [A, dm] = pr; const n = sind((A + dm) / 2) / sind(A / 2); return { v, A, dm, q: r`A prism of apex angle $${A}°$ has a minimum deviation of $${dm}°$. Find its refractive index (3 decimals).`, ...out(n, 3), sol: r`$n=\dfrac{\sin\frac{A+\delta_m}2}{\sin\frac A2}=\dfrac{\sin${(A + dm) / 2}°}{\sin${A / 2}°}=${R(n, 4)}$.` }; }
    if (v === 2) { const n = choose(rng, [1.5, 1.6, 1.4, 1.7]); const dl = pick(rng, 2, 6, 1); const A = dl / (n - 1); return { v, n, dl, q: r`A thin prism of refractive index ${n} deviates a ray by $${dl}°$. Find its apex angle (in degrees, 1 decimal).`, ...out(A, 1), unit: '°', sol: r`$\delta=(n-1)A$, so $A=\dfrac{${dl}}{${R(n - 1, 2)}}=${R(A, 2)}°$.` }; }
    const n = choose(rng, [1.5, 1.6, 1.4]); const A = choose(rng, [40, 50, 60]); const i = asind(n * sind(A / 2)); return { v, n, A, q: r`In a prism of apex angle $${A}°$ and $n=${n}$, the ray inside is parallel to the base. Find the angle of incidence (in degrees, 1 decimal).`, ...out(i, 1), unit: '°', sol: r`A ray parallel to the base means symmetric passage: $r_1=A/2=${A / 2}°$. $\sin i=n\sin r_1=${n}\times\sin${A / 2}°=${R(n * sind(A / 2), 4)}$, so $i=${R(i, 2)}°$.` };
  }, (p) => (p.v === 0 ? 2 * Math.asin(p.n * Math.sin(p.A / 2 * D2R)) / D2R - p.A : p.v === 1 ? Math.sin((p.A + p.dm) / 2 * D2R) / Math.sin(p.A / 2 * D2R) : p.v === 2 ? p.dl / (p.n - 1) : Math.asin(p.n * Math.sin(p.A / 2 * D2R)) / D2R)),

  T('ro-g13', 4, 'prism', 'nat', (rng) => {
    const v = int(rng, 0, 3); const n = choose(rng, [1.5, 1.6, 1.7, 1.4]); const C = asind(1 / n);
    if (v === 0) return { v, n, q: r`A prism of refractive index ${n} has its apex angle raised slowly. Beyond what apex angle (in degrees, 1 decimal) can no ray emerge from the second face?`, ...out(2 * C, 1), unit: '°', sol: r`Emergence needs $r_2\le C$ and $r_1<C$ for any entering ray, so $A=r_1+r_2<2C$. $C=\sin^{-1}(1/${n})=${R(C, 2)}°$, so the limit is $2C=${R(2 * C, 2)}°$.` };
    if (v === 1) { const A = choose(rng, [50, 55, 60, 65]); const i = asind(n * sind(A - C)); return { v, n, A, q: r`A prism of apex angle $${A}°$ and $n=${n}$. Find the smallest angle of incidence (in degrees, 1 decimal) at which a ray can emerge from the second face.`, ...out(i, 1), unit: '°', sol: r`$C=${R(C, 2)}°$. At the limit $r_2=C$ so $r_1=A-C=${R(A - C, 2)}°$. $\sin i=n\sin r_1=${R(n * sind(A - C), 4)}$, so $i=${R(i, 2)}°$.` }; }
    const A = choose(rng, [20, 25, 30]); const e = asind(n * sind(A));
    if (v === 2) return { v, n, A, q: r`A ray falls normally on the first face of a prism of apex angle $${A}°$ and $n=${n}$. Find the angle at which it emerges from the second face (in degrees, 1 decimal).`, ...out(e, 1), unit: '°', sol: r`With $i=0$: $r_1=0$ and $r_2=A=${A}°$ (less than $C$, so it emerges). $\sin e=n\sin${A}°=${R(n * sind(A), 4)}$, so $e=${R(e, 2)}°$.` };
    return { v, n, A, q: r`A ray falls normally on the first face of a prism of apex angle $${A}°$ and $n=${n}$. Find the deviation of the ray (in degrees, 1 decimal).`, ...out(e - A, 1), unit: '°', sol: r`$e=\sin^{-1}(n\sin${A}°)=${R(e, 2)}°$. $\delta=i+e-A=0+${R(e, 2)}-${A}=${R(e - A, 2)}°$.` };
  }, (p) => { const C = Math.asin(1 / p.n) / D2R; return p.v === 0 ? 2 * C : p.v === 1 ? Math.asin(p.n * Math.sin((p.A - C) * D2R)) / D2R : p.v === 2 ? Math.asin(p.n * Math.sin(p.A * D2R)) / D2R : Math.asin(p.n * Math.sin(p.A * D2R)) / D2R - p.A; }),

  T('ro-g14', 2, 'dispersion', 'nat', (rng) => {
    const v = int(rng, 0, 3);
    if (v === 0) { const ny = pick(rng, 1.50, 1.62, 0.02); const nv = R(ny + pick(rng, 0.005, 0.015, 0.005), 3); const nr = R(ny - pick(rng, 0.005, 0.015, 0.005), 3); return { v, nv, nr, ny, q: r`A glass has $n_v=${nv}$, $n_r=${nr}$ and $n_y=${R(ny, 3)}$. Find its dispersive power $\omega=\dfrac{n_v-n_r}{n_y-1}$ (3 decimals).`, ...out((nv - nr) / (ny - 1), 3), sol: r`$\omega=\dfrac{${nv}-${nr}}{${R(ny, 3)}-1}=\dfrac{${R(nv - nr, 4)}}{${R(ny - 1, 3)}}=${R((nv - nr) / (ny - 1), 4)}$.` }; }
    if (v === 1) { const A = pick(rng, 4, 10, 2); const dn = pick(rng, 0.01, 0.04, 0.01); return { v, A, dn, q: r`A thin prism of angle $${A}°$ is made of glass with $n_v-n_r=${dn}$. Find the angle between the violet and red rays leaving it (in degrees, 3 decimals).`, ...out(dn * A, 3), unit: '°', sol: r`Angular dispersion $=(n_v-n_r)A=${dn}\times${A}°=${R(dn * A, 3)}°$.` }; }
    const A1 = pick(rng, 6, 12, 2); const w1 = choose(rng, [0.014, 0.016, 0.02]); const w2 = choose(rng, [0.028, 0.032, 0.04]); const A2 = A1 * w1 / w2;
    if (v === 2) return { v, A1, w1, w2, q: r`A crown prism of angle $${A1}°$ ($n_v-n_r=${w1}$) is combined with a flint prism ($n_v-n_r=${w2}$), placed opposite, to give no net dispersion. Find the angle of the flint prism (in degrees, 2 decimals).`, ...out(A2, 2), unit: '°', sol: r`No dispersion: $(n_v-n_r)_1A_1=(n_v-n_r)_2A_2$. $A_2=${A1}\times\dfrac{${w1}}{${w2}}=${R(A2, 3)}°$.` };
    const n1 = 1.5; const n2 = 1.6; return { v, A1, w1, w2, n1, n2, q: r`A crown prism of angle $${A1}°$ ($n_y=1.5$, $n_v-n_r=${w1}$) is combined with a flint prism ($n_y=1.6$, $n_v-n_r=${w2}$) placed opposite, with no net dispersion. Find the net deviation of yellow light (in degrees, 2 decimals).`, ...out(0.5 * A1 - 0.6 * A2, 2), unit: '°', sol: r`$A_2=${A1}\times\dfrac{${w1}}{${w2}}=${R(A2, 3)}°$. Net deviation $=(1.5-1)\times${A1}-(1.6-1)\times${R(A2, 3)}=${R(0.5 * A1 - 0.6 * A2, 3)}°$.` };
  }, (p) => (p.v === 0 ? (p.nv - p.nr) / (p.ny - 1) : p.v === 1 ? p.A * p.dn : p.v === 2 ? p.A1 / p.w2 * p.w1 : (p.A1 * (p.n1 - 1)) - (p.n2 - 1) * (p.A1 * p.w1 / p.w2))),

  T('ro-g15', 3, 'telescope', 'nat', (rng) => {
    const v = int(rng, 0, 3); const fe = choose(rng, [2, 2.5, 4, 5]); const m = choose(rng, [20, 24, 30, 40]); const fo = m * fe;
    if (v === 0) return { v, fo, fe, q: r`An astronomical telescope has an objective of focal length ${fo} cm and an eyepiece of focal length ${fe} cm. Find the magnifying power in normal adjustment.`, ...out(fo / fe, 0, true), sol: r`$m=\dfrac{f_o}{f_e}=\dfrac{${fo}}{${fe}}=${m}$.` };
    if (v === 1) return { v, fo, fe, q: r`An astronomical telescope has an objective of focal length ${fo} cm and an eyepiece of focal length ${fe} cm. Find the length of the tube in normal adjustment (in cm).`, ...out(fo + fe, 1), unit: 'cm', sol: r`$L=f_o+f_e=${fo}+${fe}=${fo + fe}$ cm.` };
    if (v === 2) return { v, fo, fe, q: r`An astronomical telescope has $f_o=${fo}$ cm and $f_e=${fe}$ cm. It is adjusted so that the final image forms at the near point $D=25$ cm. Find the magnifying power (2 decimals).`, ...out((fo / fe) * (1 + fe / 25), 2), sol: r`$m=\dfrac{f_o}{f_e}\left(1+\dfrac{f_e}D\right)=${m}\times\left(1+\dfrac{${fe}}{25}\right)=${R((fo / fe) * (1 + fe / 25), 3)}$.` };
    return { v, fo, fe, m, q: r`A telescope in normal adjustment has magnifying power ${m} and a tube ${fo + fe} cm long. Find the focal length of its objective (in cm).`, ...out(fo, 1), unit: 'cm', sol: r`$f_o=mf_e$ and $f_o+f_e=${fo + fe}$, so $f_e(m+1)=${fo + fe}$, giving $f_e=${fe}$ cm and $f_o=${m}\times${fe}=${fo}$ cm.` };
  }, (p) => (p.v === 0 ? p.fo / p.fe : p.v === 1 ? p.fe + p.fo : p.v === 2 ? p.fo / p.fe + p.fo / 25 : p.m * (p.fo + p.fe) / (p.m + 1))),

  T('ro-g16', 3, 'microscope', 'nat', (rng) => {
    const v = int(rng, 0, 3);
    if (v === 0) { const L = pick(rng, 12, 20, 2); const fo = choose(rng, [1, 1.5, 2]); const fe = choose(rng, [4, 5, 2.5]); return { v, L, fo, fe, q: r`A compound microscope has $f_o=${fo}$ cm, $f_e=${fe}$ cm and the distance between the second focal point of the objective and the first focal point of the eyepiece is ${L} cm. The final image is at infinity. Find the magnifying power ($D=25$ cm, 1 decimal).`, ...out((L / fo) * (25 / fe), 1), sol: r`$m=\dfrac L{f_o}\cdot\dfrac D{f_e}=\dfrac{${L}}{${fo}}\times\dfrac{25}{${fe}}=${R((L / fo) * (25 / fe), 2)}$.` }; }
    if (v === 1) { const pr = choose(rng, [[1, 1.25], [1, 1.2], [2, 2.4], [1.5, 1.8], [2, 2.5]]); const [fo, U] = pr; const vv = U * fo / (U - fo); return { v, fo, U, q: r`The objective of a microscope has focal length ${fo} cm. A specimen is ${U} cm from it. Find the lateral magnification produced by the objective (magnitude, 1 decimal).`, ...out(vv / U, 1), sol: r`$\dfrac1v=\dfrac1f+\dfrac1u=\dfrac1{${fo}}-\dfrac1{${U}}$, so $v=${R(vv, 2)}$ cm. $|m_o|=\dfrac v{|u|}=${R(vv / U, 2)}$.` }; }
    if (v === 2) { const f = choose(rng, [2.5, 5, 12.5]); return { v, f, q: r`A simple microscope uses a lens of focal length ${f} cm. Find its magnifying power for an image at the near point $D=25$ cm.`, ...out(1 + 25 / f, 0, true), sol: r`$m=1+\dfrac Df=1+\dfrac{25}{${f}}=${1 + 25 / f}$.` }; }
    const fe = choose(rng, [2.5, 5]); const mo = pick(rng, 5, 20, 5); return { v, fe, mo, q: r`A compound microscope's objective gives a lateral magnification of ${mo}. The eyepiece has focal length ${fe} cm and the final image is at 25 cm. Find the total magnification.`, ...out(mo * (1 + 25 / fe), 0, true), sol: r`$m_e=1+\dfrac{25}{${fe}}=${1 + 25 / fe}$. $m=${mo}\times${1 + 25 / fe}=${mo * (1 + 25 / fe)}$.` };
  }, (p) => (p.v === 0 ? p.L * 25 / (p.fo * p.fe) : p.v === 1 ? Math.abs(1 / (1 / p.fo - 1 / p.U) / p.U) : p.v === 2 ? (p.f + 25) / p.f : p.mo * (p.fe + 25) / p.fe)),

  T('ro-g17', 3, 'eye defects', 'nat', (rng) => {
    const v = int(rng, 0, 3);
    if (v === 0) { const x = pick(rng, 50, 200, 25); return { v, x, q: r`A short-sighted person's far point is ${x} cm. Find the power of the lens (in dioptre, with sign) that lets her see distant objects clearly (2 decimals).`, ...out(-100 / x, 2), unit: 'D', sol: r`The lens must give a virtual image of a far object at her far point: $f=-${x}$ cm. $P=\dfrac1f=-\dfrac{100}{${x}}=${R(-100 / x, 3)}$ D.` }; }
    if (v === 1) { const N = pick(rng, 40, 100, 20); return { v, N, q: r`A person's near point is ${N} cm. Find the power of the reading glasses (in dioptre, 2 decimals) that let her read a book at 25 cm.`, ...out(100 / 25 - 100 / N, 2), unit: 'D', sol: r`$P=\dfrac1{u'}-\dfrac1{v'}$ with $u'=25$ cm (book) and $v'=N=${N}$ cm: $P=\dfrac{100}{25}-\dfrac{100}{${N}}=${R(4 - 100 / N, 3)}$ D.` }; }
    if (v === 2) { const N = pick(rng, 40, 100, 20); const f = 25 * N / (N - 25); return { v, N, q: r`A far-sighted person has a near point of ${N} cm. What focal length (in cm, 1 decimal) must her reading lens have to read at 25 cm?`, ...out(f, 1), unit: 'cm', sol: r`$\dfrac1f=\dfrac1{25}-\dfrac1{${N}}=\dfrac{${N}-25}{${25 * N}}$, so $f=${R(f, 2)}$ cm (convex).` }; }
    const P = pick(rng, 1, 4, 0.5); return { v, P, q: r`A short-sighted person wears glasses of power $-${P}$ D. What is her far point without glasses (in cm)?`, ...out(100 / P, 1), unit: 'cm', sol: r`The lens makes distant objects appear at her far point: $|f|=\dfrac1P=\dfrac{100}{${P}}=${R(100 / P, 2)}$ cm.` };
  }, (p) => (p.v === 0 ? -1 / (p.x / 100) : p.v === 1 ? 1 / 0.25 - 1 / (p.N / 100) : p.v === 2 ? 1 / (1 / 25 - 1 / p.N) : 1 / (p.P) * 100)),
  T('ro-g18', 4, 'silvered lens', 'nat', (rng) => {
    const v = int(rng, 0, 3); const n = choose(rng, [1.5, 1.6, 1.4]); const Rr = pick(rng, 10, 40, 5);
    if (v === 0) return { v, n, Rr, q: r`A plano-convex lens ($n=${n}$, curved face of radius ${Rr} cm) is silvered on its plane face. Find the focal length of the equivalent concave mirror (in cm, 2 decimals).`, ...out(Rr / (2 * (n - 1)), 2), unit: 'cm', sol: r`$f_{lens}=\dfrac R{n-1}=${R(Rr / (n - 1), 3)}$ cm. Light crosses the lens twice and reflects once from a plane mirror: $\dfrac1F=\dfrac2{f_{lens}}$, so $F=${R(Rr / (2 * (n - 1)), 3)}$ cm.` };
    if (v === 1) return { v, n, Rr, q: r`A plano-convex lens ($n=${n}$, curved face of radius ${Rr} cm) is silvered on its curved face. Find the focal length of the equivalent concave mirror, measured from the plane face (in cm, 2 decimals).`, ...out(Rr / (2 * n), 2), unit: 'cm', sol: r`Parallel rays enter the plane face unbent and focus at $R/2=${Rr / 2}$ cm inside the glass (mirror focus). Seen from outside through the plane face this depth looks $\dfrac{R/2}n$: $F=\dfrac R{2n}=${R(Rr / (2 * n), 3)}$ cm. Check: $\dfrac1F=\dfrac2{f_{lens}}+\dfrac1{f_m}=\dfrac{2(n-1)}R+\dfrac2R=\dfrac{2n}R$.` };
    const F = Rr / (2 * n); const U = F * choose(rng, [2, 3, 4]); const vv = mirV(-U, -F);
    if (v === 2) return { v, n, Rr, U, q: r`A plano-convex lens ($n=${n}$, curved face radius ${Rr} cm) is silvered on its curved face. A point object is ${R(U, 3)} cm in front of the plane face. Find the distance of the final image from the plane face (in cm, 2 decimals).`, ...out(Math.abs(vv), 2), unit: 'cm', sol: r`Equivalent concave mirror: $F=\dfrac R{2n}=${R(F, 3)}$ cm. $\dfrac1v=\dfrac1f-\dfrac1u=-\dfrac1{${R(F, 3)}}+\dfrac1{${R(U, 3)}}$, so $v=${R(vv, 3)}$ cm: a real image in front of the plane face.` };
    return { v, n, Rr, q: r`A plano-convex lens ($n=${n}$, curved face radius ${Rr} cm) is silvered on its plane face. Find the power of the equivalent mirror (in dioptre, 2 decimals).`, ...out(100 * 2 * (n - 1) / Rr, 2), unit: 'D', sol: r`$\dfrac1F=\dfrac{2(n-1)}R=\dfrac{${R(2 * (n - 1), 3)}}{${Rr}}$ per cm $=${R(100 * 2 * (n - 1) / Rr, 3)}$ D.` };
  }, (p) => (p.v === 0 ? 1 / (2 / (p.Rr / (p.n - 1))) : p.v === 1 ? p.Rr / 2 / p.n : p.v === 2 ? Math.abs(1 / (-1 / (p.Rr / (2 * p.n)) + 1 / p.U)) : 100 * 2 / (p.Rr / (p.n - 1)))),

  T('ro-g19', 4, 'refraction at spherical surface', 'nat', (rng) => {
    const v = int(rng, 0, 3); const n2 = choose(rng, [1.5, 1.6, 1.33, 2]); const Rr = pick(rng, 10, 30, 5);
    if (v === 0) { let U = pick(rng, 40, 100, 10); if (Math.abs(1 / U - (n2 - 1) / Rr) < 1e-9) U += 5; const vv = n2 / (1 / -U + (n2 - 1) / Rr); return { v, n2, Rr, U, q: r`A point object in air is ${U} cm from a convex spherical surface of radius ${Rr} cm, beyond which is glass of $n=${n2}$. Find the image distance from the pole (in cm, 1 decimal).`, ...out(vv, 1), unit: 'cm', sol: r`$\dfrac{n_2}v-\dfrac{n_1}u=\dfrac{n_2-n_1}R$: $\dfrac{${n2}}v=\dfrac{${R(n2 - 1, 2)}}{${Rr}}+\dfrac1{-${U}}$, giving $v=${R(vv, 2)}$ cm.` }; }
    if (v === 1) { const f = n2 * Rr / (n2 - 1); return { v, n2, Rr, q: r`A convex spherical surface of radius ${Rr} cm separates air from glass of $n=${n2}$. Where does a narrow parallel beam from the air side focus (in cm from the pole, 1 decimal)?`, ...out(f, 1), unit: 'cm', sol: r`With $u\to-\infty$: $\dfrac{n_2}v=\dfrac{n_2-n_1}R$, so $v=\dfrac{n_2R}{n_2-n_1}=\dfrac{${n2}\times${Rr}}{${R(n2 - 1, 2)}}=${R(f, 2)}$ cm.` }; }
    if (v === 2) { const U = pick(rng, 20, 60, 10); const vv = n2 / (1 / -U + (n2 - 1) / -Rr); return { v, n2, Rr, U, q: r`A point object in air is ${U} cm from a concave spherical surface of radius ${Rr} cm (its centre of curvature is on the air side, so $R=-${Rr}$ cm), with glass of $n=${n2}$ beyond it. Find the image distance (in cm, with sign, 1 decimal).`, ...out(vv, 1), unit: 'cm', sol: r`$\dfrac{n_2}v=\dfrac{n_1}u+\dfrac{n_2-n_1}R=\dfrac1{-${U}}+\dfrac{${R(n2 - 1, 2)}}{-${Rr}}$, so $v=${R(vv, 2)}$ cm (negative: virtual, on the object's side).` }; }
    const d = pick(rng, 4, 8, 2); const R2 = pick(rng, 10, 20, 5); const vv = 1 / (1.5 / -d + 0.5 / R2); return { v, d, R2, q: r`A small bubble in a glass sphere ($n=1.5$) of radius ${R2} cm lies ${d} cm below the surface nearest an observer, on the diameter through the observer. Find the distance from that surface at which the bubble appears (in cm, magnitude, 2 decimals).`, ...out(Math.abs(vv), 2), unit: 'cm', sol: r`Light goes from glass ($n_1=1.5$) to air ($n_2=1$) at a surface whose centre lies on the incoming side, so $R=-${R2}$ cm and $u=-${d}$ cm. $\dfrac1v=\dfrac{n_1}u+\dfrac{n_2-n_1}R=\dfrac{1.5}{-${d}}+\dfrac{-0.5}{-${R2}}=${R(1.5 / -d + 0.5 / R2, 4)}$, so $v=${R(vv, 3)}$ cm (virtual, inside the sphere).` };
  }, (p) => (p.v === 0 ? 1 / (1 / p.n2 * (-1 / p.U + (p.n2 - 1) / p.Rr)) : p.v === 1 ? 1 / ((p.n2 - 1) / (p.n2 * p.Rr)) : p.v === 2 ? 1 / ((1 / p.n2) * (-1 / p.U - (p.n2 - 1) / p.Rr)) : Math.abs(1 / (-1.5 / p.d + 0.5 / p.R2)))),

  T('ro-g20', 5, 'lens-mirror system', 'nat', (rng) => {
    const v = int(rng, 0, 1); const f = choose(rng, [10, 15, 20]); let a; let U; let u2; let v1;
    for (let t = 0; t < 50; t++) { a = choose(rng, [5, 10, 15]); U = f * choose(rng, [1.5, 2, 3]); v1 = lensV(-U, f); u2 = -(2 * a - v1); if (Math.abs(u2 + f) > 1e-6 && Math.abs(v1 - a) > 1e-6) break; }
    if (v === 0) { const v2 = 1 / (1 / f + 1 / u2); return { v, f, a, U, q: r`A convex lens of focal length ${f} cm has a plane mirror ${a} cm behind it, facing it. A point object is ${U} cm in front of the lens on the axis. Light passes through the lens, reflects from the mirror and passes through the lens again. Find the position of the final image: distance from the lens, positive if on the object's side, negative if beyond the lens (in cm, 1 decimal).`, ...out(v2, 1), unit: 'cm', sol: r`First pass: $v_1=\dfrac{uf}{u+f}$ gives $v_1=${R(v1, 2)}$ cm beyond the lens. The mirror (at ${a} cm) turns this into an image at $2a-v_1=${R(2 * a - v1, 2)}$ cm from the lens, measured the original way. Seen by the returning light this is an object at $u_2=${R(u2, 2)}$ cm (positive means beyond the lens: a virtual object). $\dfrac1{v_2}=\dfrac1f+\dfrac1{u_2}$, so $v_2=${R(v2, 2)}$ cm, positive meaning on the object's side.` }; }
    const aa = choose(rng, [20, 30, 40]); const ff = choose(rng, [10, 15]); const uu = aa * ff / (aa - ff); return { v, aa, ff, q: r`A convex lens of focal length ${ff} cm has a plane mirror ${aa} cm behind it. At what distance in front of the lens (in cm, 1 decimal) must a point object be placed so that its final image coincides with the object itself?`, ...out(uu, 1), unit: 'cm', sol: r`The final image coincides with the object when light falls on the mirror normally, i.e. when the first image is formed on the mirror itself: $v_1=${aa}$ cm. $\dfrac1u=\dfrac1f-\dfrac1{v_1}$ in magnitude: $\dfrac1u=\dfrac1{${ff}}-\dfrac1{${aa}}$, so $u=${R(uu, 2)}$ cm.` };
  }, (p) => { if (p.v === 0) { const v1 = p.U * p.f / (p.U - p.f); const x2 = 2 * p.a - v1; return (-x2) * p.f / (-x2 + p.f); } return 1 / (1 / p.ff - 1 / p.aa); }),
  T('ro-g21', 2, 'nature of image', 'mcq', (rng) => {
    const v = int(rng, 0, 3); const F = pick(rng, 10, 30, 5); const kk = choose(rng, [0.5, 1.5, 3]); const U = F * kk;
    const OPT = ['real, inverted and magnified', 'real, inverted and diminished', 'virtual, erect and magnified', 'virtual, erect and diminished'];
    const dev = v === 0 ? 'concave mirror' : v === 1 ? 'convex lens' : v === 2 ? 'convex mirror' : 'concave lens';
    let ans;
    if (v <= 1) ans = kk === 0.5 ? 2 : kk === 1.5 ? 0 : 1; else ans = 3;
    const correct = OPT[ans]; const wrongs = OPT.filter((_, i) => i !== ans);
    const o = shuffleOpts(rng, correct, wrongs);
    const why = v <= 1 ? (kk === 0.5 ? r`The object is inside the focal length ($u<f$): virtual, erect and magnified.` : kk === 1.5 ? r`The object is between $f$ and $2f$: real, inverted and magnified.` : r`The object is beyond $2f$: real, inverted and diminished.`) : r`A ${dev} always gives a virtual, erect, diminished image of a real object.`;
    return { v, F, kk, ans, q: r`A real object is placed ${R(U, 1)} cm in front of a ${dev} of focal length ${F} cm. The image is`, options: o.options, answer: o.answer, sol: r`Compare $u=${R(U, 1)}$ cm with $f=${F}$ cm. ${why}`, trap: 'Compare the object distance with f and 2f before deciding.' };
  }, (p) => p.options.indexOf(['real, inverted and magnified', 'real, inverted and diminished', 'virtual, erect and magnified', 'virtual, erect and diminished'][p.v >= 2 ? 3 : p.kk === 0.5 ? 2 : p.kk === 1.5 ? 0 : 1])),

  T('ro-g22', 3, 'spherical mirrors', 'mcq', (rng) => {
    const F = pick(rng, 10, 30, 5); const kk = choose(rng, [1.5, 2, 3, 4]); const U = F * kk; const vv = -(U * F / (U - F));
    const v = int(rng, 0, 1);
    if (v === 0) {
      const o = numOpts(rng, vv, [-(U * F / (F + U)), -vv, vv * 1.5], 'cm', 3);
      return { v, F, U, vv, q: r`A concave mirror has focal length ${F} cm. A real object is ${U} cm in front of it. Where is the image (distance from the pole, with sign by the Cartesian convention)?`, options: o.options, answer: o.answer, sol: r`$f=-${F}$, $u=-${U}$: $\dfrac1v=\dfrac1f-\dfrac1u=-\dfrac1{${F}}+\dfrac1{${U}}$, so $v=${R(vv, 2)}$ cm. Using the lens formula $\dfrac1v=\dfrac1f+\dfrac1u$ by mistake gives $${R(-(U * F / (F + U)), 2)}$ cm, and dropping the sign gives $+${R(-vv, 2)}$ cm.`, trap: 'The mirror formula has $1/v + 1/u$, not $1/v - 1/u$.' };
    }
    const trueM = -(vv / -U);
    const o = numOpts(rng, trueM, [-trueM, 1 / trueM, Math.abs(trueM) + 1], '', 3);
    return { v, F, U, vv, q: r`A concave mirror has focal length ${F} cm. A real object is ${U} cm in front of it. The magnification $m=-v/u$ of the image is`, options: o.options, answer: o.answer, sol: r`$v=\dfrac{uf}{u-f}=${R(vv, 2)}$ cm. $m=-\dfrac vu=-\dfrac{${R(vv, 2)}}{${-U}}=${R(trueM, 3)}$. The sign is negative for an inverted real image.` };
  }, (p) => {
    const trueV = 1 / (1 / -p.F - 1 / -p.U); const trueM = -(trueV / -p.U);
    const text = p.v === 0 ? fmt(trueV, 3) + ' cm' : fmt(trueM, 3);
    return p.options.indexOf(text);
  }),

  T('ro-g23', 4, 'lens in liquid', 'nat', (rng) => {
    const v = int(rng, 0, 1); const fa = choose(rng, [15, 20, 25, 30]); const nl = choose(rng, [[4 / 3, '4/3', 4], [1.6, '1.6', -8], [1.2, '1.2', 2], [1.75, '1.75', -3.5]]);
    const ng = 1.5; const fl = fa * (ng - 1) / (ng / nl[0] - 1);
    if (v === 0) return { v, fa, nl: nl[0], q: r`A thin glass lens ($n=1.5$) has focal length ${fa} cm in air. Find its focal length in a liquid of refractive index $${nl[1]}$ (in cm, with sign, 1 decimal).`, ...out(fl, 1), unit: 'cm', sol: r`$\dfrac{f_{liq}}{f_{air}}=\dfrac{n_g-1}{n_g/n_l-1}=\dfrac{0.5}{${R(ng / nl[0] - 1, 4)}}=${R(nl[2], 3)}$. $f_{liq}=${fa}\times${R(nl[2], 3)}=${R(fl, 2)}$ cm${fl < 0 ? ', negative: the lens now diverges' : ''}.`, trap: 'A glass lens in a liquid of higher index behaves like a diverging lens.' };
    return { v, fa, nl: nl[0], q: r`A thin glass lens ($n=1.5$) has focal length ${fa} cm in air. Find its power in a liquid of refractive index $${nl[1]}$ (in dioptre, with sign, 2 decimals).`, ...out(100 / fl, 2), unit: 'D', sol: r`$f_{liq}=f_{air}\dfrac{n_g-1}{n_g/n_l-1}=${R(fl, 2)}$ cm. $P=\dfrac{100}{${R(fl, 2)}}=${R(100 / fl, 3)}$ D.` };
  }, (p) => (p.v === 0 ? 1 / ((1.5 / p.nl - 1) / (0.5 * p.fa)) : 100 * ((1.5 / p.nl - 1) / (0.5 * p.fa)))),

  T('ro-g24', 3, 'mixed', 'nat', (rng) => {
    const v = int(rng, 0, 2); const n = choose(rng, [1.5, 1.6, 1.33]); const t = pick(rng, 2, 10, 2); const lam = choose(rng, [500, 600, 400]);
    if (v === 0) return { v, n, t, q: r`Light crosses a glass plate ($n=${n}$) ${t} mm thick at normal incidence. By how much is the optical path longer than the path in air over the same thickness? Give $(n-1)t$ in mm (2 decimals).`, ...out((n - 1) * t, 2), unit: 'mm', sol: r`Optical path in glass $=nt=${R(n * t, 3)}$ mm; in air it is $t=${t}$ mm. Extra $=(n-1)t=${R((n - 1) * t, 3)}$ mm.` };
    if (v === 1) { const tt = pick(rng, 2, 8, 2); return { v, n, tt, lam, q: r`How many wavelengths of light of vacuum wavelength ${lam} nm fit across a glass plate ($n=${n}$) ${tt} $\mu$m thick (nearest whole number)?`, ...out(n * tt * 1000 / lam, 0), sol: r`Wavelength in glass $=\lambda/n$. Number $=\dfrac{t}{\lambda/n}=\dfrac{nt}{\lambda}=\dfrac{${n}\times${tt * 1000}\ \mathrm{nm}}{${lam}\ \mathrm{nm}}=${R(n * tt * 1000 / lam, 2)}$.` }; }
    const d = pick(rng, 1, 5, 1); return { v, n, d, q: r`The speed of light in a liquid is $c/${n}$. How long does light take to travel ${d} m in the liquid (in nanoseconds, 2 decimals; $c=3\times10^8\ \mathrm{m\,s^{-1}}$)?`, ...out(d * n / 3e8 * 1e9, 2), unit: 'ns', sol: r`$t=\dfrac{d}{v}=\dfrac{nd}{c}=\dfrac{${n}\times${d}}{3\times10^8}=${R(d * n / 3e8 * 1e9, 3)}$ ns.` };
  }, (p) => (p.v === 0 ? (p.n * p.t - p.t) : p.v === 1 ? p.n * p.tt * 1000 / p.lam : p.n * p.d / 3e8 * 1e9)),

  T('ro-g25', 4, 'optical fibre', 'nat', (rng) => {
    const v = int(rng, 0, 2); const pr = choose(rng, [[1.5, 1.4], [1.48, 1.46], [1.6, 1.5], [1.45, 1.4]]); const [n1, n2] = pr;
    const NA = Math.sqrt(n1 * n1 - n2 * n2);
    if (v === 0) return { v, n1, n2, q: r`An optical fibre has a core of $n=${n1}$ and cladding of $n=${n2}$. Find its numerical aperture $\sqrt{n_1^2-n_2^2}$ (3 decimals).`, ...out(NA, 3), sol: r`$\mathrm{NA}=\sqrt{${R(n1 * n1, 4)}-${R(n2 * n2, 4)}}=\sqrt{${R(n1 * n1 - n2 * n2, 4)}}=${R(NA, 4)}$.` };
    if (v === 1) return { v, n1, n2, q: r`An optical fibre has a core of $n=${n1}$ and cladding of $n=${n2}$, with the fibre in air. Find the acceptance angle (the largest angle of incidence at the end face for guided light), in degrees, 1 decimal.`, ...out(asind(NA), 1), unit: '°', sol: r`$\sin\alpha_{max}=\sqrt{n_1^2-n_2^2}=${R(NA, 4)}$, so $\alpha_{max}=${R(asind(NA), 2)}°$.` };
    return { v, n1, n2, q: r`A fibre has a core of $n=${n1}$ and cladding of $n=${n2}$. Find the critical angle at the core-cladding boundary (in degrees, 1 decimal).`, ...out(asind(n2 / n1), 1), unit: '°', sol: r`$\sin C=\dfrac{n_2}{n_1}=\dfrac{${n2}}{${n1}}=${R(n2 / n1, 4)}$, so $C=${R(asind(n2 / n1), 2)}°$.` };
  }, (p) => (p.v === 0 ? Math.sqrt(p.n1 ** 2 - p.n2 ** 2) : p.v === 1 ? Math.asin(Math.sqrt(p.n1 ** 2 - p.n2 ** 2)) / D2R : Math.asin(p.n2 / p.n1) / D2R)),
];

{ // ===== extension block (added 2026-11-22): harder items, new formats and templates =====
const r = String.raw;
const CUET = true; const PFX = 'ro'; const GN = 25;
const F = (x, s = 3) => String(+Number(x).toPrecision(s));
const XEB = { 1: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'], 2: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'], 3: ['jee-main', 'neet', 'keam', 'comedk'], 4: ['jee-main', 'jee-adv'], 5: ['jee-adv'] };
const xe = (l, type) => (CUET && type === 'mcq' && l <= 3 ? [...XEB[l], 'cuet'] : XEB[l]);
let xk = 0; let xc = 0;
const xb = (l, sub, o) => ({ id: `${PFX}-x${String(++xk).padStart(3, '0')}`, level: l, sub, ...o, exams: xe(l, o.type) });
const m = (l, sub, q, correct, wrongs, sol, o = {}) => { const pos = (xc++ * 3 + 1) % 4; const options = [...wrongs]; options.splice(pos, 0, correct); return xb(l, sub, { type: 'mcq', format: 'single', q, options, answer: pos, sol, ...o }); };
const n = (l, sub, q, fn, tol, dp, sol, o = {}) => { const answer = +fn().toFixed(dp); return xb(l, sub, { type: 'nat', format: tol === 0 ? 'integer' : 'numeric', q, answer, tol, calc: () => answer, sol, ...o }); };
const s = (l, sub, q, options, answer, sol, o = {}) => xb(l, sub, { type: 'msq', format: 'multi', q, options, answer, sol, ...o });
const AO = ['Both A and R are true and R is the correct explanation of A', 'Both A and R are true but R is not the correct explanation of A', 'A is true but R is false', 'A is false but R is true'];
const a = (l, sub, A, R, answer, sol, o = {}) => xb(l, sub, { type: 'mcq', format: 'assertion', q: `<b>Assertion (A):</b> ${A}<br><b>Reason (R):</b> ${R}`, options: AO, answer, sol, ...o });
const SO = ['Both Statement I and Statement II are true', 'Both Statement I and Statement II are false', 'Statement I is true but Statement II is false', 'Statement I is false but Statement II is true'];
const t = (l, sub, I, II, answer, sol, o = {}) => xb(l, sub, { type: 'mcq', format: 'statements', q: `<b>Statement I:</b> ${I}<br><b>Statement II:</b> ${II}`, options: SO, answer, sol, ...o });
// "how many of these are correct": list = 4 statements, k = how many are correct (1-4)
const cn = (l, sub, q, list, k, sol, o = {}) => xb(l, sub, { type: 'mcq', format: 'statements', q: `${q}<br>${list.map((x, i) => `(${['i', 'ii', 'iii', 'iv'][i]}) ${x}`).join('<br>')}`, options: ['Only one', 'Only two', 'Only three', 'All four'], answer: k - 1, sol, ...o });
// match item: letters = correct List II letter for A, B, C, D, e.g. ['q','r','p','s']
const mt = (l, sub, group, letters, sol, o = {}) => {
  const code = (L) => L.map((x, i) => `${'ABCD'[i]}-${x}`).join(', ');
  const right = code(letters); const wr = [];
  for (const [i, j] of [[0, 1], [1, 2], [2, 3], [0, 3], [0, 2], [1, 3]]) { const L = [...letters]; [L[i], L[j]] = [L[j], L[i]]; const c = code(L); if (c !== right && !wr.includes(c)) wr.push(c); }
  const pos = (xc++ * 3 + 2) % 4; const options = wr.slice(0, 3); options.splice(pos, 0, right);
  return xb(l, sub, { type: 'mcq', format: 'match', q: 'Match the entries of List I with List II and choose the correct code.', group, options, answer: pos, sol, ...o });
};
const pn = (l, sub, group, q, fn, tol, dp, sol, o = {}) => { const answer = +fn().toFixed(dp); return xb(l, sub, { type: 'nat', format: 'passage', group, q, answer, tol, calc: () => answer, sol, ...o }); };
const pm = (l, sub, group, q, correct, wrongs, sol, o = {}) => { const pos = (xc++ * 3 + 1) % 4; const options = [...wrongs]; options.splice(pos, 0, correct); return xb(l, sub, { type: 'mcq', format: 'passage', group, q, options, answer: pos, sol, ...o }); };
let xg = GN;
const gx = (l, type, sub, make, verify) => ({ id: `${PFX}-g${String(++xg).padStart(2, '0')}`, type, level: l, exams: xe(l, type), sub, make, verify });
const NG = {};
const Dg = Math.PI / 180; const sd = (x) => Math.sin(x * Dg); const asd = (x) => Math.asin(x) / Dg;
Object.assign(groups, {
  xo1: { title: 'A concave mirror of focal length $f$: image for various object positions',
    list1: ['A. Object at infinity', 'B. Object at $2f$ (the centre of curvature)', 'C. Object between $f$ and $2f$', 'D. Object between the pole and the focus'],
    list2: ['p. Virtual, erect and magnified', 'q. Real, inverted and the same size', 'r. Real, inverted and magnified', 's. Real, a point at the focus'] },
  xo2: { title: 'Critical angles (light going from the medium into air)',
    list1: ['A. Glass, $\\mu = 1.5$', 'B. Water, $\\mu = 4/3$', 'C. Diamond, $\\mu = 2.42$', 'D. A medium with $\\mu = \\sqrt2$'],
    list2: ['p. $24.4^\\circ$', 'q. $41.8^\\circ$', 'r. $45^\\circ$', 's. $48.6^\\circ$'] },
  xo3: { title: 'Prism formulas',
    list1: ['A. Deviation by a thin prism', 'B. Refractive index from the angle of minimum deviation', 'C. Angular dispersion between violet and red', 'D. Dispersive power'],
    list2: [r`p. $\dfrac{\mu_v-\mu_r}{\mu-1}$`, r`q. $(\mu-1)A$`, r`r. $(\mu_v-\mu_r)A$`, r`s. $\dfrac{\sin\frac{A+\delta_m}{2}}{\sin\frac A2}$`] },
  xo4: { title: 'A thin glass lens ($\\mu = 1.5$) with $f = 10$ cm in air, placed in other media',
    list1: ['A. In air', 'B. In water ($\\mu = 4/3$)', 'C. In a liquid with $\\mu = 1.5$', 'D. In a liquid with $\\mu = 1.6$'],
    list2: ['p. $+40$ cm', 'q. Infinite (no focusing)', 'r. $-80$ cm', 's. $+10$ cm'] },
  xo5: { title: 'Thin lenses $f_1 = +20$ cm and $f_2 = -20$ cm separated by a distance $d$: effective focal length of the pair',
    list1: ['A. $d = 0$', 'B. $d = 10$ cm', 'C. $d = 20$ cm', 'D. $d = 40$ cm'],
    list2: ['p. $+10$ cm', 'q. $+20$ cm', 'r. $+40$ cm', 's. Infinite'] },
  xo6: { title: 'Optical instruments',
    list1: ['A. Magnifying power of an astronomical telescope ($f_o = 100$ cm, $f_e = 5$ cm), normal adjustment', 'B. Length of that telescope', 'C. Magnifying power of a compound microscope ($f_o = 2$ cm, $f_e = 5$ cm, tube length 20 cm, image at infinity, $D = 25$ cm)', 'D. Magnifying power of a simple microscope of $f = 5$ cm with the image at infinity'],
    list2: ['p. 105 cm', 'q. 5', 'r. 20', 's. 50'] },
  xo7: { title: 'Apparent depth and shift',
    list1: ['A. A fish 12 cm under water ($\\mu = 4/3$) as seen from air: apparent depth', 'B. A bird 8 m above water as seen by the fish: apparent height', 'C. Shift of an object seen through a 6 cm glass slab ($\\mu = 1.5$)', 'D. Apparent thickness of that slab'],
    list2: ['p. 9 cm', 'q. 2 cm', 'r. 10.67 m', 's. 4 cm'] },
  xo8: { title: 'Prisms of $\\mu = 1.5$ with angles $45^\\circ$-$45^\\circ$-$90^\\circ$ (critical angle in air $41.8^\\circ$)',
    list1: ['A. A ray enters normally through a short face', 'B. A ray enters normally through the long (hypotenuse) face', 'C. The same prism in water ($\\mu = 4/3$, critical angle $48.6^\\circ$), ray as in A', 'D. Condition on $\\mu$ for total reflection in air for the ray in A'],
    list2: ['p. Turned through $90^\\circ$', 'q. Turned through $180^\\circ$ (reversed)', 'r. No total reflection, light leaves the hypotenuse', r`s. $\mu > \sqrt2$`] },
  xop1: { title: 'Two lenses in line',
    passage: r`<p>A convex lens of focal length 15 cm is placed 10 cm in front of a concave lens of focal length 30 cm, on the same axis. A small object is placed 30 cm in front of the convex lens.</p>` },
  xop2: { title: 'Light through a prism',
    passage: r`<p>A prism has refracting angle $60^\circ$ and refractive index $\sqrt2$ for a certain light. The prism is in air.</p>` },
});

items.push(
  // ---------- Level 2 ----------
  n(2, 'spherical mirrors', r`A concave mirror has a focal length of 15 cm. An object is placed 30 cm in front of it. How far (in cm) from the mirror is the image?`, () => 30, 0, 0,
    r`The object is at the centre of curvature, $2f$. Mirror formula: $\dfrac1v = \dfrac1f - \dfrac1u$ (magnitudes, real object and image): $\dfrac1v = \dfrac1{15}-\dfrac1{30} = \dfrac1{30}$, so $v = 30$ cm. The image is real, inverted, and the same size.`, { unit: 'cm' }),
  m(2, 'plane mirror', r`A plane mirror is turned through $15^\circ$ about an axis in its plane, perpendicular to the incident ray's plane, while the incident ray stays fixed. The reflected ray turns through`, r`$30^\circ$`, [r`$15^\circ$`, r`$45^\circ$`, r`$7.5^\circ$`],
    r`When a mirror turns through $\theta$ the normal turns through $\theta$, so the angle of incidence changes by $\theta$ and the reflected ray turns by $2\theta = 30^\circ$.`),
  n(2, 'refraction', r`The refractive index of a glass is 1.5. Find the speed of light in it (in units of $10^8\ \mathrm{m\,s^{-1}}$; $c = 3\times10^8$).`, () => 3 / 1.5, 0, 0,
    r`$v = c/\mu = 3\times10^8/1.5 = 2\times10^8\ \mathrm{m\,s^{-1}}$.`, { unit: '10⁸ m/s' }),
  m(2, 'total internal reflection', r`The critical angle for a medium of refractive index $\sqrt2$ against air is`, r`$45^\circ$`, [r`$30^\circ$`, r`$60^\circ$`, r`$90^\circ$`],
    r`$\sin\theta_c = 1/\mu = 1/\sqrt2$, so $\theta_c = 45^\circ$.`),
  n(2, 'lenses', r`A convex lens has a focal length of 25 cm. Find its power (in dioptres).`, () => 100 / 25, 0, 0,
    r`$P = 1/f$ with $f$ in metres: $1/0.25 = 4$ D.`, { unit: 'D' }),
  m(2, 'plane mirror', r`Two plane mirrors are inclined at $60^\circ$. The number of images of an object between them is`, '5', ['6', '4', '3'],
    r`$n = \dfrac{360^\circ}{\theta} - 1 = 6 - 1 = 5$ (360 divided by $\theta$ is a whole number).`),
  n(2, 'apparent depth', r`A coin lies at the bottom of water ($\mu = 4/3$) 12 cm deep. At what apparent depth (in cm) is it seen from directly above?`, () => 12 / (4 / 3), 0, 0,
    r`Apparent depth $= \dfrac{\text{real depth}}{\mu} = \dfrac{12}{4/3} = 9$ cm.`, { unit: 'cm' }),
  mt(2, 'spherical mirrors', 'xo1', ['s', 'q', 'r', 'p'], r`Object at infinity: image at the focus, real and point-like (s). At $2f$: real, inverted, same size at $2f$ (q). Between $f$ and $2f$: real, inverted, magnified, beyond $2f$ (r). Inside the focus: virtual, erect, magnified (p).`),
  // ---------- Level 3 ----------
  n(3, 'lenses', r`A concave lens has $f = -20$ cm and an object is 30 cm in front of it. Find the distance of the image from the lens (in cm).`, () => 12, 0, 0,
    r`$\dfrac1v = \dfrac1f + \dfrac1u = -\dfrac1{20} - \dfrac1{30} = -\dfrac{5}{60}$, so $v = -12$ cm: a virtual, erect, diminished image 12 cm from the lens on the object's side.`, { unit: 'cm' }),
  n(3, 'prism', r`A prism of angle $60^\circ$ and refractive index $\sqrt3$ is set at minimum deviation. Find the angle of minimum deviation (in degrees).`, () => 2 * asd(Math.sqrt(3) * sd(30)) - 60, 0, 0,
    r`$\mu = \dfrac{\sin\frac{A+\delta_m}2}{\sin\frac A2}$, so $\sin\frac{A+\delta_m}{2} = \sqrt3\times\tfrac12 = 0.866$. $\dfrac{A+\delta_m}2 = 60^\circ$, so $\delta_m = 60^\circ$.`, { unit: '°' }),
  n(3, 'prism', r`A thin prism of angle $4^\circ$ and refractive index 1.5 deviates a ray by how many degrees?`, () => 0.5 * 4, 0, 0,
    r`$\delta = (\mu-1)A = 0.5\times4^\circ = 2^\circ$.`, { unit: '°' }),
  n(3, 'lens maker', r`A biconvex lens of glass ($\mu = 1.5$) has both faces of radius 20 cm. Find its focal length (in cm).`, () => 1 / (0.5 * (1 / 20 + 1 / 20)), 0, 0,
    r`$\dfrac1f = (\mu-1)\left(\dfrac1{R_1}-\dfrac1{R_2}\right) = 0.5\left(\dfrac1{20}+\dfrac1{20}\right) = \dfrac1{20}$. $f = 20$ cm.`, { unit: 'cm' }),
  m(3, 'lens in liquid', r`A glass lens ($\mu = 1.5$) is placed in water ($\mu = 4/3$). Its focal length becomes`, '4 times its value in air', ['2 times its value in air', 'one-fourth of its value in air', 'unchanged'],
    r`$\dfrac{f_w}{f_a} = \dfrac{\mu_g - 1}{\mu_g/\mu_w - 1} = \dfrac{0.5}{1.125-1} = 4$.`, { trap: 'The lens still converges, but more weakly.' }),
  n(3, 'lens combinations', r`Two thin lenses of focal lengths $+10$ cm and $-40$ cm are in contact. Find the focal length of the combination (in cm, 1 decimal).`, () => 1 / (1 / 10 - 1 / 40), 0.1, 1,
    r`$\dfrac1F = \dfrac1{10} - \dfrac1{40} = \dfrac{3}{40}$. $F = 13.3$ cm (converging).`, { unit: 'cm' }),
  n(3, 'refraction through a slab', r`A glass slab of thickness 6 cm and $\mu = 1.5$ is placed over a printed page. By how much (in cm) does the print appear raised?`, () => 6 * (1 - 1 / 1.5), 0, 0,
    r`Shift $= t\left(1 - \dfrac1\mu\right) = 6\times\dfrac13 = 2$ cm.`, { unit: 'cm' }),
  n(3, 'telescope', r`An astronomical telescope has an objective of focal length 100 cm and an eyepiece of focal length 5 cm. Find its magnifying power in normal adjustment.`, () => 100 / 5, 0, 0,
    r`$M = f_o/f_e = 100/5 = 20$. (The length of the telescope is $f_o + f_e = 105$ cm.)`),
  n(3, 'microscope', r`A compound microscope has $f_o = 2$ cm, $f_e = 5$ cm and a tube length (distance between the lenses' focal points) of 20 cm. For the final image at infinity find its magnifying power ($D = 25$ cm).`, () => (20 / 2) * (25 / 5), 0, 0,
    r`$M = \dfrac{L}{f_o}\cdot\dfrac{D}{f_e} = \dfrac{20}{2}\times\dfrac{25}{5} = 10\times5 = 50$.`),
  n(3, 'eye defects', r`A short-sighted person cannot see clearly beyond 80 cm. What lens power (in D, 2 decimals) lets them see distant objects clearly? Give the answer with its sign.`, () => -1 / 0.8, 0.01, 2,
    r`The lens must form an image of a distant object at the far point (80 cm), a virtual image: $f = -0.8$ m. $P = 1/f = -1.25$ D (a concave lens).`, { unit: 'D' }),
  n(3, 'total internal reflection', r`A point source lies at the bottom of a liquid of refractive index 1.25 and depth 60 cm. Find the radius (in cm) of the circle of light on the surface.`, () => 60 * Math.tan(Math.asin(1 / 1.25)), 0, 0,
    r`$\sin\theta_c = 1/1.25 = 0.8$, $\tan\theta_c = \dfrac43$. $r = h\tan\theta_c = 60\times\dfrac43 = 80$ cm.`, { unit: 'cm' }),
  n(3, 'plane mirror', r`A person walks towards a large plane mirror at $1.5\ \mathrm{m\,s^{-1}}$. At what speed (in m/s) does she approach her image?`, () => 3, 0, 0,
    r`The image moves towards her mirror-symmetrically at $1.5\ \mathrm{m\,s^{-1}}$ too, so the relative speed is $3\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s', trap: 'The image speed is relative to the mirror, not to her.' }),
  n(3, 'lenses', r`Find the least possible distance (in cm) between a real object and its real image formed by a convex lens of focal length 15 cm.`, () => 4 * 15, 0, 0,
    r`With $u$ and $v$ the distances, $D = u + v$ and $\dfrac1u+\dfrac1v = \dfrac1f$ gives $u^2 - Du + Df = 0$. Real solutions need $D^2\ge4Df$, so $D\ge4f = 60$ cm (object and image both at $2f$).`, { unit: 'cm' }),
  n(3, 'apparent depth', r`A layer of water ($\mu = 4/3$) 12 cm thick lies on a layer of oil ($\mu = 1.5$) 15 cm thick. An observer in air looks straight down at the bottom of the oil. At what apparent depth (in cm) is the bottom seen?`, () => 12 / (4 / 3) + 15 / 1.5, 0, 0,
    r`Each layer contributes (thickness)/(its index): $\dfrac{12}{4/3}+\dfrac{15}{1.5} = 9+10 = 19$ cm.`, { unit: 'cm' }),
  m(3, 'total internal reflection', r`A ray enters normally through one short face of a $45^\circ$-$45^\circ$-$90^\circ$ prism and meets the long face. The least refractive index for total reflection there is`, r`$\sqrt2$`, [r`$1.5$`, r`$2$`, r`$\sqrt3$`],
    r`The angle of incidence at the long face is $45^\circ$. TIR needs $45^\circ\ge\theta_c$, i.e. $\sin45^\circ\ge1/\mu$, so $\mu\ge\sqrt2 = 1.414$.`),
  m(3, 'dispersion', r`White light passes through a glass prism. Which colour is deviated the most?`, 'violet', ['red', 'green', 'yellow'],
    r`The refractive index is greatest for violet (shortest wavelength), so $\delta = (\mu - 1)A$ is greatest for it.`),
  mt(3, 'total internal reflection', 'xo2', ['q', 's', 'p', 'r'], r`$\theta_c = \sin^{-1}(1/\mu)$. Glass: $\sin^{-1}0.667 = 41.8^\circ$ (q). Water: $\sin^{-1}0.75 = 48.6^\circ$ (s). Diamond: $\sin^{-1}0.413 = 24.4^\circ$ (p). $\mu = \sqrt2$: $45^\circ$ (r).`),
  mt(3, 'prism', 'xo3', ['q', 's', 'r', 'p'], r`Thin prism: $\delta = (\mu-1)A$ (q). Minimum deviation: $\mu = \dfrac{\sin\frac{A+\delta_m}2}{\sin\frac A2}$ (s). Angular dispersion: $\delta_v-\delta_r = (\mu_v-\mu_r)A$ (r). Dispersive power: $\omega = \dfrac{\mu_v-\mu_r}{\mu-1}$ (p).`),
  mt(3, 'optical instruments', 'xo6', ['r', 'p', 's', 'q'], r`Telescope: $M = 100/5 = 20$ (r), length $= 105$ cm (p). Microscope: $\dfrac{20}{2}\times\dfrac{25}{5} = 50$ (s). Simple microscope with the image at infinity: $M = D/f = 25/5 = 5$ (q).`),
  mt(3, 'apparent depth', 'xo7', ['p', 'r', 'q', 's'], r`A: $12/(4/3) = 9$ cm (p). B: the fish sees objects above water raised: $8\times\tfrac43 = 10.67$ m (r). C: shift $= 6(1-\tfrac1{1.5}) = 2$ cm (q). D: $6/1.5 = 4$ cm (s).`),
  a(3, 'spherical mirrors', 'A concave mirror can form a virtual image.', 'When an object is between the pole and the focus, the reflected rays diverge and appear to come from a point behind the mirror.', 0,
    r`Both true and R explains A: for $u<f$, $v$ comes out negative (behind the mirror), and the image is virtual, erect and magnified.`),
  a(3, 'total internal reflection', 'A diamond sparkles brilliantly.', 'The critical angle for diamond is small, so light inside it suffers many total internal reflections.', 0,
    r`$\mu = 2.42$ gives $\theta_c = 24.4^\circ$, very small, so most rays inside are totally reflected several times before leaving through the cut faces. Both true, R explains A.`),
  t(3, 'refraction', 'The speed of light in glass is less than in air for every colour.', r`The refractive index $\mu = c/v$ of glass is greater than 1 for every colour.`, 0,
    r`Both true. $\mu>1$ means $v<c$.`),
  cn(3, 'concepts', 'How many of the following are correct?', ['Total internal reflection can occur when light goes from a rarer to a denser medium.', 'A real image can be caught on a screen.', 'A concave lens always forms a virtual image of a real object.', 'The focal length of a lens does not depend on the medium it is in.'], 2,
    r`(i) False: it needs a denser-to-rarer path. (ii) True. (iii) True. (iv) False: $\dfrac1f = \left(\dfrac{\mu_g}{\mu_m}-1\right)\left(\dfrac1{R_1}-\dfrac1{R_2}\right)$ depends on the medium. Two are correct.`),
  // ---------- Level 4 ----------
  n(4, 'lens displacement method', r`An object and a screen are 100 cm apart. A convex lens gives a sharp image at two positions 40 cm apart. Find its focal length (in cm).`, () => (100 ** 2 - 40 ** 2) / (4 * 100), 0, 0,
    r`Bessel's method: $f = \dfrac{D^2 - d^2}{4D} = \dfrac{10000-1600}{400} = 21$ cm.`, { unit: 'cm' }),
  n(4, 'silvered lens', r`A plano-convex lens ($\mu = 1.5$, radius of the curved face 30 cm) has its plane face silvered. It acts as a concave mirror. Find the focal length of the mirror (in cm).`, () => 30 / (2 * 0.5) / 1 * 1, 0, 0,
    r`Light crosses the curved face (power $\dfrac{\mu-1}{R}$), reflects at the plane face and crosses the curved face again: $P = 2\times\dfrac{0.5}{0.3} = 3.33$ D, so $F = 0.3$ m $= 30$ cm.`, { unit: 'cm' }),
  n(4, 'refraction at spherical surface', r`A point object in air is 30 cm from the vertex of a convex spherical glass surface of radius 10 cm ($\mu = 1.5$). Find the image distance (in cm) from the vertex.`, () => 1.5 / (0.5 / 10 - 1 / 30), 0, 0,
    r`$\dfrac{\mu_2}{v} - \dfrac{\mu_1}{u} = \dfrac{\mu_2 - \mu_1}{R}$ with $u = -30$, $R = +10$: $\dfrac{1.5}{v} = 0.05 - \dfrac1{30} = \dfrac1{60}$. $v = 90$ cm, a real image inside the glass.`, { unit: 'cm' }),
  n(4, 'ball lens', r`A solid glass sphere of radius 4 cm and $\mu = 1.5$ is placed in a parallel beam. At what distance (in cm) behind the back surface is the beam focused?`, () => 4 * (2 - 1.5) / (2 * 0.5), 0, 0,
    r`Refraction at the first surface: $\dfrac{1.5}{v} = \dfrac{0.5}{4}$, $v = 12$ cm from the front. The back surface is 8 cm from the front, so the image is a virtual object at 4 cm beyond it for the second surface: $\dfrac1{v'} - \dfrac{1.5}{4} = \dfrac{1-1.5}{-4}$, giving $v' = 2$ cm. The image is 2 cm behind the sphere.`, { unit: 'cm' }),
  n(4, 'telescope', r`An astronomical telescope has $f_o = 100$ cm and $f_e = 5$ cm. Find its magnifying power when the final image is formed at the near point of 25 cm.`, () => (100 / 5) * (1 + 5 / 25), 0, 0,
    r`$M = \dfrac{f_o}{f_e}\left(1 + \dfrac{f_e}{D}\right) = 20\times1.2 = 24$. (It is 20 in normal adjustment.)`),
  n(4, 'lenses', r`A convex lens of focal length 20 cm forms an image twice as large as the object. Find the sum (in cm) of the two possible object distances.`, () => 30 + 10, 0, 0,
    r`Real image: $m = -2$, $v = 2|u|$: $\dfrac1{2u}+\dfrac1u = \dfrac1{20}$, so $u = 30$ cm. Virtual image: $m = +2$: $\dfrac{1}{u}-\dfrac1{2u} = \dfrac1{20}$, $u = 10$ cm. Sum $= 40$ cm.`, { unit: 'cm' }),
  n(4, 'spherical mirrors', r`A concave mirror of focal length 15 cm forms an image three times the size of the object. Find the difference (in cm) between the two possible object distances.`, () => 20 - 10, 0, 0,
    r`Real image ($m=-3$): $u = \tfrac43f = 20$ cm. Virtual image ($m=+3$): $u = \tfrac23f = 10$ cm. The difference is 10 cm.`, { unit: 'cm' }),
  n(4, 'lens combinations', r`Thin lenses of focal lengths $+20$ cm and $-20$ cm are 10 cm apart. Find the effective focal length of the pair (in cm).`, () => 1 / (1 / 20 - 1 / 20 + 10 / 400), 0, 0,
    r`$\dfrac1F = \dfrac1{f_1}+\dfrac1{f_2}-\dfrac d{f_1f_2} = 0 - \dfrac{10}{(20)(-20)} = \dfrac1{40}$. $F = 40$ cm. Separating a convex and a concave lens of equal strength makes a converging system.`, { unit: 'cm' }),
  n(4, 'prism', r`The refractive index of a glass is 1.51 for red and 1.53 for violet light, with a mean of 1.52. Find its dispersive power (3 decimals).`, () => 0.02 / 0.52, 0.001, 3,
    r`$\omega = \dfrac{\mu_v - \mu_r}{\mu - 1} = \dfrac{0.02}{0.52} = 0.038$.`),
  n(4, 'refraction through a slab', r`A ray strikes a slab of glass ($\mu = \sqrt2$, thickness 3 cm) at $45^\circ$. Find its lateral displacement on emerging (in cm, 3 decimals).`, () => 3 * Math.sin(15 * Dg) / Math.cos(30 * Dg), 0.005, 3,
    r`$\sin r = \dfrac{\sin45^\circ}{\sqrt2} = \dfrac12$, $r = 30^\circ$. $d = \dfrac{t\sin(i-r)}{\cos r} = \dfrac{3\sin15^\circ}{\cos30^\circ} = \dfrac{3\times0.2588}{0.866} = 0.897$ cm.`, { unit: 'cm' }),
  n(4, 'optical fibre', r`An optical fibre has a core of refractive index 1.5 and a cladding of 1.4. Find its numerical aperture (2 decimals).`, () => Math.sqrt(1.5 ** 2 - 1.4 ** 2), 0.01, 2,
    r`$\mathrm{NA} = \sqrt{\mu_1^2 - \mu_2^2} = \sqrt{2.25-1.96} = \sqrt{0.29} = 0.54$. Light entering within the acceptance angle $\sin^{-1}0.54$ (from air) is guided.`),
  n(4, 'moving objects', r`An object moves towards a concave mirror ($f = 10$ cm) at $1\ \mathrm{cm\,s^{-1}}$ when it is 15 cm from it. Find the speed of its image (in cm/s).`, () => 4, 0, 0,
    r`$u = -15$, $f = -10$: $\dfrac1v = \dfrac1f - \dfrac1u = -\dfrac1{10}+\dfrac1{15} = -\dfrac1{30}$, $v = -30$ cm, $m = -v/u = -2$. For a small motion along the axis $v_I = -m^2v_O$ in magnitude $m^2v_O = 4\times1 = 4\ \mathrm{cm\,s^{-1}}$ (the image moves away from the mirror).`, { unit: 'cm/s' }),
);

items.push(
  s(4, 'spherical mirrors', r`Which statements about a concave mirror are correct?`,
    ['An object beyond the centre of curvature has a real, inverted, diminished image.', 'The image can be larger than the object.', 'Every virtual image it forms is erect.', 'In the Cartesian sign convention the focal length of a concave mirror is positive.'], [0, 1, 2],
    r`(A) True: image between $f$ and $2f$. (B) True: object between $f$ and $2f$ gives a larger real image. (C) True: virtual images of a mirror are erect. (D) False: with the pole as origin and the incident light's direction as positive, a concave mirror has $f<0$.`),
  s(5, 'prism', r`A ray passes a prism at minimum deviation. Which statements are correct?`,
    ['The angles of refraction $r_1$ and $r_2$ are equal.', 'The deviation is the largest possible for that prism.', 'The angle of incidence equals the angle of emergence.', r`$\mu = \sin\frac{A+\delta_m}2\Big/\sin\frac A2$.`], [0, 2, 3],
    r`At minimum deviation the ray passes symmetrically: $i = e$ and $r_1 = r_2 = A/2$ (A, C), and the formula holds (D). The deviation is the smallest possible, not the largest (B false).`),
  s(4, 'total internal reflection', r`Which statements about total internal reflection are correct?`,
    ['Light must go from a denser to a rarer medium.', 'The angle of incidence must exceed the critical angle.', 'It can occur when light goes from air into glass.', 'The critical angle depends on the colour of the light.'], [0, 1, 3],
    r`TIR needs a denser-to-rarer path and an incidence angle beyond $\theta_c$ (A, B). Going from air to glass cannot give it (C false). $\theta_c = \sin^{-1}(1/\mu)$ and $\mu$ depends on the colour (D true).`),
  s(5, 'lenses', r`A convex lens is cut in two ways. Which statements are correct?`,
    ['Cut into two halves along a plane containing the axis, each half has the same focal length as the whole lens.', 'In that case each half gives an image of the same size but less bright.', 'In that case each half forms only half the image.', 'Cut by a plane perpendicular to the axis into two thin plano-convex pieces, the focal length of each is twice the original.'], [0, 1, 3],
    r`The half lens still has the same curvatures, so $f$ is unchanged (A). It receives half the light, so the image is dimmer but complete (B true, C false). A thin biconvex lens cut across is two plano-convex lenses each with one curved face: $P = P_0/2$, so $f' = 2f$ (D true).`),
  s(4, 'eye defects', r`Which statements about myopia (short sight) are correct?`,
    ['It is corrected with a convex lens.', 'It is corrected with a concave lens.', 'The image of a distant object forms in front of the retina.', 'The far point of the eye is nearer than infinity.'], [1, 2, 3],
    r`A myopic eye is too strong, so parallel rays focus in front of the retina (C) and the far point is finite (D). A concave (diverging) lens corrects it (B true, A false).`),
  s(5, 'telescope', r`Which statements about an astronomical telescope are correct?`,
    ['A larger objective aperture gathers more light.', 'A longer objective focal length gives a larger magnifying power.', 'The eyepiece has a short focal length.', 'A longer eyepiece focal length gives a larger magnifying power.'], [0, 1, 2],
    r`$M = f_o/f_e$: larger for large $f_o$ and small $f_e$ (B, C true; D false). The aperture sets the light-gathering power and resolution (A).`),
  s(4, 'dispersion', r`Which statements about dispersion are correct?`,
    ['Violet light is deviated more than red light by a glass prism.', 'Red light travels faster than violet light in glass.', 'The refractive index of a vacuum depends on the colour of the light.', 'A rainbow is formed by dispersion together with total internal reflection inside the drops.'], [0, 1, 3],
    r`In glass $\mu_v>\mu_r$, so violet is slower and bends more (A, B). In vacuum all colours have the same speed $c$, so $\mu = 1$ (C false). In a drop, light is refracted, reflected once (internally) and refracted again, spreading the colours (D).`),
  s(5, 'lens combinations', r`Two thin lenses of focal lengths $f_1$ and $f_2$ are in contact. Which statements are correct?`,
    ['The power is $P_1 + P_2$.', r`The focal length satisfies $\dfrac1F = \dfrac1{f_1}+\dfrac1{f_2}$.`, r`The focal length is $f_1 + f_2$.`, 'A convex and a concave lens of equal numerical focal length have an infinite combined focal length.'], [0, 1, 3],
    r`Powers add for thin lenses in contact, so $\dfrac1F = \dfrac1{f_1}+\dfrac1{f_2}$ (A, B). $F\ne f_1+f_2$ (C false). With $f_2 = -f_1$ the power is zero and the pair does not converge or diverge (D).`),
  s(4, 'plane mirror', r`Which statements about a plane mirror are correct?`,
    ['The image is as far behind the mirror as the object is in front.', 'The image of a real object is virtual.', 'The image is laterally inverted.', 'If the mirror turns through $\\theta$, the reflected ray turns through $\\theta$.'], [0, 1, 2],
    r`The first three are properties of plane mirror images. A mirror turning by $\theta$ turns the reflected ray by $2\theta$ (D false).`),
  s(5, 'apparent depth', r`An observer in air looks nearly vertically down at an object in water ($\mu = 4/3$). Which statements are correct?`,
    ['The apparent depth is less than the real depth.', 'The apparent depth is $\\tfrac34$ of the real depth.', 'The apparent depth is $\\tfrac43$ of the real depth.', 'A fish looking up sees a bird higher than it really is.'], [0, 1, 3],
    r`Real depth/apparent depth $= \mu$, so the apparent depth is $\tfrac34$ of the real (A, B true, C false). From the water the air object appears at $\mu\times$ its real height: higher (D true).`),
  mt(4, 'lens in a liquid', 'xo4', ['s', 'p', 'q', 'r'], r`$\dfrac{f_m}{f_a} = \dfrac{\mu_g-1}{\mu_g/\mu_m - 1}$. Air: 10 cm (s). Water: $\dfrac{0.5}{0.125}\times10 = 40$ cm (p). $\mu_m = 1.5$: the denominator is 0, $f\to\infty$ (q). $\mu_m = 1.6$: $\dfrac{0.5}{-0.0625}\times10 = -80$ cm, a diverging lens (r).`),
  mt(4, 'lens combinations', 'xo5', ['s', 'r', 'q', 'p'], r`$\dfrac1F = -\dfrac d{f_1f_2} = \dfrac d{400}$ (the powers cancel). $d=0$: infinite (s). $d=10$: 40 cm (r). $d=20$: 20 cm (q). $d=40$: 10 cm (p).`),
  mt(4, 'prism', 'xo8', ['p', 'q', 'r', 's'], r`A: the ray meets the hypotenuse at $45^\circ$, above $41.8^\circ$: TIR, turned through $90^\circ$ (p). B: it meets each short face at $45^\circ$ and is totally reflected twice, leaving reversed (q). C: in water $\theta_c = 48.6^\circ>45^\circ$, so no TIR (r). D: TIR at $45^\circ$ needs $1/\mu\le\sin45^\circ$, i.e. $\mu\ge\sqrt2$ (s).`),
  a(4, 'lens in a liquid', 'A glass lens placed in a liquid of the same refractive index does not bend light at all.', 'The relative refractive index of the lens material with respect to the liquid is then 1.', 0,
    r`With $\mu_g/\mu_l = 1$, the factor $\left(\dfrac{\mu_g}{\mu_l}-1\right)$ in the lens maker's formula is 0, so $f\to\infty$. Both true, R explains A.`),
  a(4, 'dispersion', 'The focal length of a glass lens is greater for red light than for violet light.', 'The refractive index of glass is smaller for red light than for violet light.', 0,
    r`$\dfrac1f\propto(\mu-1)$, and $\mu_r<\mu_v$, so $f_r>f_v$. This is chromatic aberration. R explains A.`),
  a(4, 'spherical mirrors', 'A convex mirror always forms a virtual, erect, diminished image of a real object.', 'The reflected rays from a convex mirror always diverge.', 0,
    r`Parallel or diverging rays from a real object reflect as diverging rays, which seem to come from a point behind the mirror. Both true, and R explains A.`),
  t(4, 'lens combinations', 'Two thin lenses of powers $+2$ D and $-2$ D in contact have zero power together.', 'The power of thin lenses in contact is the sum of their powers.', 0,
    r`Both true. $P = 2 + (-2) = 0$: a plane parallel plate in effect.`),
  t(4, 'telescope', 'The magnifying power of an astronomical telescope in normal adjustment is $f_o/f_e$.', 'The magnifying power increases if the diameter of the objective is increased.', 2,
    r`I is true. II is false: the diameter affects brightness and resolution, not the angular magnification.`),
  cn(4, 'spherical mirrors', 'How many of the following are correct?', ['A plane mirror always has a magnification of $+1$.', 'A convex mirror has a real focus.', 'A diverging lens has a positive power.', 'Optical fibres work by total internal reflection.'], 2,
    r`(i) True. (ii) False: the focus of a convex mirror is virtual. (iii) False: a diverging lens has negative power. (iv) True. Two are correct.`),
  // ---------- Level 5 ----------
  n(5, 'lens-mirror system', r`A convex lens of focal length 20 cm has a plane mirror 25 cm behind it. An object is 40 cm in front of the lens. After the light has passed the lens, been reflected by the mirror and passed back through the lens, how far (in cm) from the lens is the final image?`, () => 20, 0, 0,
    r`First pass: $\dfrac1v = \dfrac1{20}-\dfrac1{40} = \dfrac1{40}$, so the image would form 40 cm beyond the lens. The mirror is 25 cm behind the lens, so the light is reflected before reaching that point; the mirror makes an image 15 cm in front of it, that is 10 cm from the lens (between the lens and the mirror). For the return pass, this is a real object 10 cm from the lens: $\dfrac1{v'} = \dfrac1{20}-\dfrac1{10} = -\dfrac1{20}$, so $v' = -20$ cm. The final image is virtual, 20 cm from the lens, on the mirror side.`, { unit: 'cm', trap: 'Use the mirror image of the first image as the new object.' }),
  n(5, 'prism', r`Find the least angle of incidence (in degrees, 1 decimal) on one face of a prism ($A = 60^\circ$, $\mu = 1.5$) for which the ray can emerge from the second face.`, () => asd(1.5 * Math.sin((60 - asd(1 / 1.5)) * Dg)), 0.1, 1,
    r`Emergence needs $r_2<\theta_c = \sin^{-1}(1/1.5) = 41.8^\circ$. Then $r_1 = A - r_2>18.2^\circ$. $\sin i = 1.5\sin18.2^\circ = 0.468$, so $i = 27.9^\circ$. For smaller $i$ the ray is totally reflected at the second face.`, { unit: '°', trap: 'At the limit the ray grazes the second face.' }),
  n(5, 'achromatism', r`A crown prism ($A = 10^\circ$, $\mu_r = 1.51$, $\mu_v = 1.53$, $\mu = 1.52$) is combined with a flint prism ($\mu_r = 1.62$, $\mu_v = 1.66$, $\mu = 1.64$) of angle $A'$ placed inverted, so that there is no net dispersion. Find the net deviation of the mean ray (in degrees, 1 decimal).`, () => 0.52 * 10 - 0.64 * (0.02 * 10 / 0.04), 0.05, 1,
    r`No dispersion: $(\mu_v-\mu_r)A = (\mu_v'-\mu_r')A'$, so $A' = \dfrac{0.02\times10}{0.04} = 5^\circ$. Net deviation $= (\mu-1)A - (\mu'-1)A' = 0.52\times10 - 0.64\times5 = 5.2 - 3.2 = 2.0^\circ$.`, { unit: '°' }),
  n(5, 'refraction through a slab', r`Light enters a prism of angle $60^\circ$ and $\mu = \sqrt2$ at grazing incidence ($i = 90^\circ$). Find the angle of deviation (in degrees, 1 decimal).`, () => 90 + asd(Math.SQRT2 * Math.sin(15 * Dg)) - 60, 0.1, 1,
    r`$\sin r_1 = \dfrac{1}{\sqrt2}$, $r_1 = 45^\circ$. $r_2 = 60 - 45 = 15^\circ$. $\sin e = \sqrt2\sin15^\circ = 0.366$, $e = 21.5^\circ$. $\delta = i + e - A = 90+21.5-60 = 51.5^\circ$.`, { unit: '°' }),
  n(5, 'mixed: lens and slab', r`A convex lens of focal length 10 cm forms a real image of a distant object on a screen. A glass slab 3 cm thick ($\mu = 1.5$) is placed between the lens and the screen. By how far (in cm) must the screen be moved away from the lens to refocus?`, () => 3 * (1 - 1 / 1.5), 0, 0,
    r`A slab shifts the image away from the lens by $t\left(1-\dfrac1\mu\right) = 3\times\dfrac13 = 1$ cm, so the screen must move 1 cm further from the lens.`, { unit: 'cm' }),
  s(5, 'refraction', r`A person looks down at an object under water ($\mu = 4/3$) through a flat surface. Which are correct for near-normal viewing?`,
    ['The object appears nearer the surface than it is.', 'The image is virtual.', 'The apparent depth is $\\tfrac43$ of the real depth.', 'The image is laterally inverted.'], [0, 1],
    r`Apparent depth $=$ real depth$/\mu = \tfrac34\times$ real (A true, C false). The rays reaching the eye diverge from a point, so the image is virtual (B). A plane refracting surface does not invert the image sideways (D false).`),
  s(5, 'lens', r`A convex lens forms a real image of an object on a screen. The lower half of the lens is covered. Which are correct?`,
    ['The whole image still forms.', 'The image is dimmer.', 'The focal length halves.', 'The image moves up.'], [0, 1],
    r`Every part of a lens forms a complete image. Fewer rays reach the screen, so the image is dimmer (B). The focal length and the image position do not change (C, D false).`),
  s(5, 'total internal reflection', r`A right-angled isosceles prism of $\mu = 1.5$ is used to turn a ray normal to one short face. Which are correct?`,
    ['The ray is turned through $90^\circ$.', 'The prism must be in a medium of index less than $1.5/\\sqrt2 \\approx 1.06$ for TIR to occur.', 'Total internal reflection occurs if the prism is immersed in water.', 'The ray strikes the hypotenuse at $45^\circ$.'], [0, 1, 3],
    r`The ray hits the long face at $45^\circ$ and is totally reflected if $\sin45^\circ>\mu_m/\mu_p$, i.e. $\mu_m<1.5/\sqrt2 = 1.06$ (B). It turns through $90^\circ$ (A). In water ($\mu_m = 1.33$) the condition fails (C false).`),
);

items.push(
  pn(3, 'lens combinations', 'xop1', r`How far (in cm) from the convex lens is the image it forms alone?`, () => 1 / (1 / 15 - 1 / 30), 0, 0,
    r`$\dfrac1v = \dfrac1{15} - \dfrac1{30} = \dfrac1{30}$. $v = 30$ cm (real, beyond the lens), with $m_1 = v/u = -1$.`, { unit: 'cm' }),
  pn(4, 'lens combinations', 'xop1', r`How far (in cm) from the concave lens is the final image?`, () => 1 / (-1 / 30 + 1 / 20), 0, 0,
    r`The first image is 30 cm from the convex lens, which is 20 cm beyond the concave lens (10 cm away): a virtual object for the concave lens, $u = +20$. $\dfrac1v = \dfrac1f + \dfrac1u = -\dfrac1{30}+\dfrac1{20} = \dfrac1{60}$. $v = 60$ cm, a real image beyond the concave lens.`, { unit: 'cm', trap: 'The image of the first lens is a virtual object for the second.' }),
  pn(4, 'lens combinations', 'xop1', r`Find the overall linear magnification (with sign).`, () => (30 / -30) * (60 / 20), 0, 0,
    r`$m_1 = v_1/u_1 = 30/(-30) = -1$. $m_2 = v_2/u_2 = 60/20 = +3$. Total $m = -3$: the final image is real, inverted and three times the size.`),
  pn(3, 'prism', 'xop2', r`A ray is incident at $45^\circ$. Find the angle of deviation (in degrees).`, () => 2 * 45 - 60, 0, 0,
    r`$\sin r_1 = \sin45^\circ/\sqrt2 = \tfrac12$, so $r_1 = 30^\circ$ and $r_2 = 60-30 = 30^\circ$. The ray leaves at $45^\circ$. $\delta = i + e - A = 45+45-60 = 30^\circ$. This is the minimum deviation (symmetrical passage).`, { unit: '°' }),
  pn(5, 'prism', 'xop2', r`Find the least angle of incidence (in degrees, 1 decimal) for which a ray can emerge from the second face.`, () => asd(Math.SQRT2 * Math.sin(15 * Dg)), 0.1, 1,
    r`The critical angle is $45^\circ$, so emergence needs $r_2<45^\circ$, i.e. $r_1>15^\circ$. $\sin i = \sqrt2\sin15^\circ = 0.366$, $i = 21.5^\circ$.`, { unit: '°' }),
  pn(5, 'prism', 'xop2', r`Find the deviation (in degrees, 1 decimal) if the ray is incident at $90^\circ$ (grazing).`, () => 90 + asd(Math.SQRT2 * Math.sin(15 * Dg)) - 60, 0.1, 1,
    r`$r_1 = 45^\circ$ ($\sin r_1 = 1/\sqrt2$), $r_2 = 15^\circ$, $\sin e = \sqrt2\sin15^\circ = 0.366$, $e = 21.5^\circ$. $\delta = 90+21.5-60 = 51.5^\circ$ (larger than the minimum deviation $30^\circ$).`, { unit: '°' }),
);

gens.push(
  gx(3, 'nat', 'lenses', (rng) => {
    const f = pick(rng, 10, 30, 5); const u = pick(rng, f + 5, 80, 5);
    const v = u * f / (u - f);
    return { f, u, q: `A convex lens of focal length ${f} cm forms an image of an object ${u} cm in front of it. Find the image distance (in cm, 2 decimals).`, answer: +v.toFixed(2), tol: 0.02, unit: 'cm',
      sol: `$\\dfrac1v = \\dfrac1f + \\dfrac1u$ with $u = -${u}$: $\\dfrac1v = \\dfrac1{${f}} - \\dfrac1{${u}}$. $v = ${v.toFixed(2)}$ cm (real, on the far side).` };
  }, (p) => { const x1 = p.u - p.f; return p.f * p.f / x1 + p.f; }),
  gx(3, 'nat', 'spherical mirrors', (rng) => {
    const f = pick(rng, 8, 25, 1); const u = pick(rng, f + 3, 70, 1);
    const v = u * f / (u - f); const m = -v / u;
    return { f, u, q: `A concave mirror of focal length ${f} cm forms a real image of an object ${u} cm from it. Find the magnification (3 decimals, with sign).`, answer: +m.toFixed(3), tol: 0.003,
      sol: `$v = \\dfrac{uf}{u-f} = ${v.toFixed(2)}$ cm. $m = -\\dfrac vu = ${m.toFixed(3)}$. The minus sign means the image is inverted.` };
  }, (p) => -p.f / (p.u - p.f)),
  gx(3, 'nat', 'lens maker', (rng) => {
    const mu = pick(rng, 1.4, 1.7, 0.1); const R1 = pick(rng, 10, 40, 5); const R2 = pick(rng, 10, 40, 5);
    const f = 1 / ((mu - 1) * (1 / R1 + 1 / R2));
    return { mu, R1, R2, q: `A biconvex lens of glass ($\\mu = ${mu}$) has radii of curvature ${R1} cm and ${R2} cm. Find its focal length (in cm, 2 decimals).`, answer: +f.toFixed(2), tol: 0.02, unit: 'cm',
      sol: `$\\dfrac1f = (\\mu-1)\\left(\\dfrac1{R_1}+\\dfrac1{R_2}\\right) = ${mu - 1 > 0 ? +(mu - 1).toFixed(2) : 0}\\left(\\dfrac1{${R1}}+\\dfrac1{${R2}}\\right)$. $f = ${f.toFixed(2)}$ cm.` };
  }, (p) => { const P1 = (p.mu - 1) / p.R1; const P2 = (p.mu - 1) / p.R2; return 1 / (P1 + P2); }),
  gx(4, 'nat', 'lens in liquid', (rng) => {
    const mg = pick(rng, 1.4, 1.7, 0.1); const ml = choose(rng, [1.2, 1.33, 1.36]); const fa = pick(rng, 10, 40, 5);
    const fl = fa * (mg - 1) / (mg / ml - 1);
    return { mg, ml, fa, q: `A thin glass lens ($\\mu = ${mg}$) has a focal length of ${fa} cm in air. Find its focal length (in cm, 1 decimal) in a liquid of index ${ml}. Give a negative sign if it becomes diverging.`, answer: +fl.toFixed(1), tol: 0.2, unit: 'cm',
      sol: `$\\dfrac{f_l}{f_a} = \\dfrac{\\mu_g-1}{\\mu_g/\\mu_l - 1} = \\dfrac{${+(mg - 1).toFixed(2)}}{${+(mg / ml - 1).toFixed(4)}}$. $f_l = ${fl.toFixed(1)}$ cm.`, trap: 'If $\\mu_l>\\mu_g$ the lens reverses its nature.' };
  }, (p) => { const K = 1 / ((p.mg - 1) * p.fa); const Pl = (p.mg / p.ml - 1) * K; return 1 / Pl; }),
  gx(4, 'nat', 'prism', (rng) => {
    const A = choose(rng, [40, 50, 60, 70]); const mu = pick(rng, 1.4, 1.7, 0.05);
    const dm = 2 * asd(mu * sd(A / 2)) - A;
    return { A, mu, q: `A prism of refracting angle ${A}° and refractive index ${mu} is used at minimum deviation. Find the angle of minimum deviation (in degrees, 1 decimal).`, answer: +dm.toFixed(1), tol: 0.1, unit: '°',
      sol: `$\\sin\\dfrac{A+\\delta_m}2 = \\mu\\sin\\dfrac A2 = ${mu}\\times${+sd(A / 2).toFixed(4)} = ${+(mu * sd(A / 2)).toFixed(4)}$. $\\dfrac{A+\\delta_m}{2} = ${asd(mu * sd(A / 2)).toFixed(2)}^\\circ$, so $\\delta_m = ${dm.toFixed(1)}^\\circ$.` };
  }, (p) => { let lo = 0; let hi = 90; for (let i = 0; i < 100; i++) { const d = (lo + hi) / 2; const mm = sd((p.A + d) / 2) / sd(p.A / 2); if (mm < p.mu) lo = d; else hi = d; } return (lo + hi) / 2; }),
  gx(3, 'nat', 'total internal reflection', (rng) => {
    const mu = pick(rng, 1.2, 1.6, 0.05); const h = pick(rng, 20, 100, 10);
    const r2 = h / Math.sqrt(mu * mu - 1);
    return { mu, h, q: `A point source lies at a depth of ${h} cm in a liquid of refractive index ${mu}. Find the radius (in cm, 1 decimal) of the circle on the surface through which light escapes.`, answer: +r2.toFixed(1), tol: 0.2, unit: 'cm',
      sol: `$\\sin\\theta_c = 1/${mu}$, $\\tan\\theta_c = \\dfrac1{\\sqrt{${mu}^2-1}}$. $r = h\\tan\\theta_c = ${r2.toFixed(1)}$ cm.` };
  }, (p) => p.h * Math.tan(Math.asin(1 / p.mu))),
  gx(4, 'nat', 'lens displacement method', (rng) => {
    const f = pick(rng, 10, 30, 2); const D = 4 * f + pick(rng, 10, 60, 10);
    const d = Math.sqrt(D * D - 4 * D * f);
    return { f, D, d, q: `A lens gives two sharp images of an object on a screen ${D} cm from it, with the lens positions ${d.toFixed(2)} cm apart. Find the focal length (in cm, 1 decimal).`, answer: +f.toFixed(1), tol: 0.1, unit: 'cm',
      sol: `$f = \\dfrac{D^2-d^2}{4D} = \\dfrac{${D}^2-${d.toFixed(2)}^2}{4\\times${D}} = ${f}$ cm.` };
  }, (p) => { const u1 = (p.D - p.d) / 2; const v1 = p.D - u1; return u1 * v1 / (u1 + v1); }),
  gx(3, 'mcq', 'total internal reflection', (rng) => {
    const M = [['glass of index 1.5', 1.5], ['water', 4 / 3], ['diamond', 2.42], ['a liquid of index 1.25', 1.25]];
    const b = choose(rng, M); const th = asd(1 / b[1]);
    const o = numOpts(rng, th, [asd(1 / b[1]) + 10, 90 - asd(1 / b[1]), asd(1 / b[1]) / 2], '°', 3);
    return { th, q: `What is the critical angle for light going from ${b[0]} into air?`, options: o.options, answer: o.answer,
      sol: `$\\sin\\theta_c = 1/\\mu = ${+(1 / b[1]).toFixed(4)}$, so $\\theta_c = ${th.toFixed(1)}^\\circ$. The other options use $90^\\circ-\\theta_c$, half of it, or shift it.`, trap: 'Use $\\sin\\theta_c = 1/\\mu$, not $\\cos$ or $\\tan$.', _mu: b[1] };
  }, (p) => p.options.findIndex((x) => Math.abs(parseFloat(x) - p.th) < 0.06)),
  gx(4, 'mcq', 'lens combinations', (rng) => {
    let f1; let f2; let d; let P; let wr;
    do { f1 = choose(rng, [10, 15, 20, 25]); f2 = choose(rng, [-10, -15, -20, -30]); d = choose(rng, [5, 10, 15]); P = 1 / f1 + 1 / f2 - d / (f1 * f2); wr = [1 / (1 / f1 + 1 / f2), f1 + f2 - d, (f1 * f2) / (f1 + f2 + d), f1 + f2]; } while (Math.abs(P) < 0.004 || wr.some((x) => !isFinite(x)) || wr.some((x) => Math.abs(x - 1 / P) < 0.01 * Math.abs(1 / P)));
    const F = 1 / P;
    const o = numOpts(rng, F, wr, 'cm', 3);
    return { f1, f2, d, F, q: `A thin convex lens of focal length ${f1} cm and a thin concave lens of focal length ${-f2} cm are ${d} cm apart on the same axis. Find the effective focal length of the pair.`, options: o.options, answer: o.answer,
      sol: `$\\dfrac1F = \\dfrac1{f_1}+\\dfrac1{f_2}-\\dfrac d{f_1f_2} = \\dfrac1{${f1}}+\\dfrac1{${f2}}-\\dfrac{${d}}{(${f1})(${f2})}$. $F = ${F.toFixed(2)}$ cm. The other options ignore the separation or use a wrong rule.`, trap: 'Do not drop the separation term.' };
  }, (p) => p.options.findIndex((x) => Math.abs(parseFloat(x) - p.F) < 0.006 * Math.abs(p.F) + 1e-9)),
  gx(5, 'nat', 'refraction at spherical surface', (rng) => {
    let mu; let R; let u;
    do { mu = pick(rng, 1.4, 1.8, 0.1); R = pick(rng, 5, 20, 5); u = pick(rng, 2, 6, 1) * R / 2 + R; } while (Math.abs((mu - 1) / R - 1 / u) < 0.006);
    const v = mu / ((mu - 1) / R - 1 / u);
    return { mu, R, u, q: `A point object in air is ${u} cm from the vertex of a convex spherical surface of radius ${R} cm bounding glass of index ${mu}. Find the image distance (in cm, 2 decimals) from the vertex.`, answer: +v.toFixed(2), tol: 0.02, unit: 'cm',
      sol: `$\\dfrac{\\mu_2}v - \\dfrac{\\mu_1}u = \\dfrac{\\mu_2-\\mu_1}R$ with $u = -${u}$: $\\dfrac{${mu}}v = \\dfrac{${+(mu - 1).toFixed(2)}}{${R}} - \\dfrac1{${u}}$. $v = ${v.toFixed(2)}$ cm.` };
  }, (p) => { const n1 = 1; const n2 = p.mu; const left = (n2 - n1) / p.R + n1 / (-p.u); return n2 / left; }),
  gx(3, 'nat', 'apparent depth', (rng) => {
    const t1 = pick(rng, 6, 20, 2); const t2 = pick(rng, 6, 20, 2); const m1 = choose(rng, [1.33, 1.5]); const m2 = choose(rng, [1.6, 1.7, 1.8]);
    const a = t1 / m1 + t2 / m2;
    return { t1, t2, m1, m2, q: `A layer of liquid of index ${m1} and thickness ${t1} cm lies on a layer of liquid of index ${m2} and thickness ${t2} cm. Looking straight down from air, at what apparent depth (in cm, 2 decimals) is the bottom seen?`, answer: +a.toFixed(2), tol: 0.02, unit: 'cm',
      sol: `Apparent depth $= \\sum\\dfrac{t_i}{\\mu_i} = \\dfrac{${t1}}{${m1}}+\\dfrac{${t2}}{${m2}} = ${a.toFixed(2)}$ cm.` };
  }, (p) => { const first = p.t1 / p.m1; const second = p.t2 / p.m2; return first + second; }),
);

}

// Sign display tidied ("+ -3" reads "- 3", "1x" reads "x"): signs() in ../_util.js.
export default tidyGens({ topic: 'ray-optics', groups, items, gens }, ['ro-g02', 'ro-g23']);
