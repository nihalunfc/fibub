// Inspection lists. rf = red flag: if marked Problem it is shown as a red flag.
export type Item = { t: string; rf?: string };
export type Group = { g: string; items: Item[] };
const papers = (v: string): Group => ({ g: 'Papers', items: [
  { t: 'Registration document name and details match the seller', rf: 'Papers mismatch' },
  { t: 'Chassis (VIN) and engine numbers match the papers and the stamp on the vehicle', rf: 'Papers mismatch' },
  { t: 'Seller is the registered owner, or has written authority', rf: 'Papers mismatch' },
  { t: 'Insurance and roadworthiness or emissions papers are current' },
  { t: 'Service history or bills are available' },
  { t: 'No unpaid loan or fines on the vehicle (ask the official records)', rf: 'Papers mismatch' },
] });
const odo: Item = { t: 'Odometer reading fits the age, wear on pedals/seat/grips and the service history', rf: 'Odometer doubts' };
export const SETS: Record<string, Group[]> = {
  car: [
    papers('car'),
    { g: 'Body', items: [
      { t: 'Panel gaps even and paint colour matches on every panel' },
      { t: 'No rust on sills, wheel arches, boot floor or door bottoms' },
      { t: 'No signs of frame or chassis damage: bent rails, uneven welds, crumpled floor', rf: 'Frame damage' },
      { t: 'Glass, lights and mirrors undamaged' },
    ] },
    { g: 'Under the bonnet', items: [
      { t: 'Engine oil level and colour normal, no milky film under the cap' },
      { t: 'Coolant, brake fluid and power-steering fluid at level and clean' },
      { t: 'No leaks under the engine or on the ground' },
      { t: 'Belts and hoses not cracked; battery terminals clean' },
      { t: 'Engine starts at once from cold, idles smoothly, no warning lights' },
    ] },
    { g: 'Tyres and wheels', items: [
      { t: 'Tread depth good and even on all four tyres (and the spare)' },
      { t: 'No bulges, cracks or very old tyres (check the date code)' },
      { t: 'Wheels not bent or cracked' },
    ] },
    { g: 'Interior', items: [
      { t: 'No damp smell, mud, silt or water lines under carpets, seats or in the boot', rf: 'Flood signs' },
      { t: 'No rust on seat rails or under the dashboard; no fogging in lamps', rf: 'Flood signs' },
      odo,
      { t: 'Air conditioning, heater, windows, locks and electrics work' },
      { t: 'Seat belts and airbags: no warning light, belts retract' },
    ] },
    { g: 'Test drive', items: [
      { t: 'Pulls straight, no vibration at speed' },
      { t: 'Brakes stop firmly in a straight line, no grinding or pulsing' },
      { t: 'Gears or automatic shifts smooth, clutch bites normally' },
      { t: 'No knocks or clunks over bumps; steering not loose' },
      { t: 'No smoke from the exhaust' },
    ] },
    { g: 'After the drive', items: [
      { t: 'Recheck under the vehicle for new leaks' },
      { t: 'Engine temperature normal and no new warning lights' },
      { t: 'Agree the price in writing and get a mechanic\'s inspection if unsure' },
    ] },
  ],
  bike: [
    papers('bike'),
    { g: 'Body and frame', items: [
      { t: 'Frame, swingarm and forks straight: no cracks, kinks or fresh welds', rf: 'Frame damage' },
      { t: 'Handlebar and footrests not bent; levers undamaged' },
      { t: 'No rust on the tank, exhaust or chain guard' },
      { t: 'Fuel tank inside clean, no rust flakes' },
    ] },
    { g: 'Engine and fluids', items: [
      { t: 'Starts easily from cold and idles steadily' },
      { t: 'No oil leaks around the engine, forks or shock' },
      { t: 'Oil level and colour normal; coolant (if liquid-cooled) at level' },
      { t: 'Chain and sprockets not hooked or stiff; correct slack' },
      { t: 'Battery holds charge; lights, horn and indicators work' },
    ] },
    { g: 'Tyres and brakes', items: [
      { t: 'Tread good and even; no cracks (check the date code)' },
      { t: 'Brake pads or shoes have life left; discs not scored' },
      { t: 'Wheels true, spokes tight, no dents in the rims' },
    ] },
    { g: 'Condition clues', items: [
      odo,
      { t: 'No mud, silt or water lines in the airbox, wiring or under the seat', rf: 'Flood signs' },
      { t: 'No scratches on the end of levers, footrest or engine cases showing a past fall' },
    ] },
    { g: 'Test ride', items: [
      { t: 'Runs straight with hands off lightly; no wobble' },
      { t: 'Clutch, gears and throttle smooth; no slipping' },
      { t: 'Brakes firm; no judder or pulling to one side' },
      { t: 'Suspension not bottoming out or leaking' },
    ] },
    { g: 'After the ride', items: [
      { t: 'Recheck for leaks and hot smells' },
      { t: 'Agree the price in writing; get a mechanic to look if unsure' },
    ] },
  ],
  truck: [
    papers('truck'),
    { g: 'Permits and plates', items: [
      { t: 'Fitness, permit, tax and insurance valid for the use' },
      { t: 'Axle and gross weight plate match the papers and the body', rf: 'Papers mismatch' },
    ] },
    { g: 'Body and chassis', items: [
      { t: 'Chassis rails straight: no cracks, repair plates or fresh welds', rf: 'Frame damage' },
      { t: 'Cab, body and floor sound; no heavy rust' },
      { t: 'Fifth wheel, hitch or tow points worn evenly and secure' },
      { t: 'Lights, reflectors and mirrors complete and working' },
    ] },
    { g: 'Engine and fluids', items: [
      { t: 'Cold start good; no heavy smoke at start or under load' },
      { t: 'Oil, coolant and gearbox/diff oil at level; no leaks' },
      { t: 'Turbo, belts and hoses sound; air filter not clogged' },
      { t: 'Air system builds pressure and holds it (no leaks hissing)' },
    ] },
    { g: 'Tyres, axles and brakes', items: [
      { t: 'All tyres matched, with good tread and no cuts or bulges' },
      { t: 'Brake drums/discs and linings have life left' },
      { t: 'Springs and axle mounts not cracked or sagging' },
    ] },
    { g: 'Cab and clues', items: [
      odo,
      { t: 'No silt, damp or water lines in the cab or wiring', rf: 'Flood signs' },
      { t: 'Dashboard gauges, warning lights, heater and electrics work' },
    ] },
    { g: 'Test drive', items: [
      { t: 'Pulls straight, no vibration; steering not loose' },
      { t: 'Gears and clutch smooth; no slipping when loaded or on a hill' },
      { t: 'Brakes stop straight and firmly' },
    ] },
    { g: 'After the drive', items: [
      { t: 'Recheck for leaks, temperature and warning lights' },
      { t: 'Agree the price in writing; get a mechanic or surveyor if unsure' },
    ] },
  ],
};
export type Mark = 'ok' | 'problem' | '';
export function score(marks: Mark[]) {
  const ok = marks.filter((m) => m === 'ok').length, problems = marks.filter((m) => m === 'problem').length;
  const checked = ok + problems;
  return { ok, problems, checked, skipped: marks.length - checked, pct: checked ? Math.round((ok / checked) * 100) : 0 };
}
