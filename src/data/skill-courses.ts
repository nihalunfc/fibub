// Home skills courses (nihal, 2026-11-16): short practical courses at /learn/courses/<id>/. Each lesson is a
// Learn tool (#L code, src/tools/<id>/, section home-skills or school-physics) built on src/lib/learn/skill.ts:
// illustrated step cards with Done ticks, tap-to-label pictures, put-in-order activities, printable checklists and
// a short safety quiz. Every lesson has a "Stay safe" box and a "Call a professional when" box. No electrical
// wiring or gas work, ever. To add a lesson: build the tool, then list its id here in the order to take it.
export type SkillCourse = {
  id: string;
  name: string;
  text: string;          // one or two sentences for the card and the page lead
  lessons: string[];     // Learn tool ids, in order
  tools: string[];       // calculators and other fibub tools that go with the course
  safety: string;        // one line shown at the top of the course page
};

export const SKILL_COURSES: SkillCourse[] = [
  { id: 'tyres-and-punctures', name: 'Tyres and punctures',
    text: 'Change a flat car tyre onto the spare, plug a puncture in a tubeless tyre, and patch a bicycle inner tube, step by step with pictures.',
    lessons: ['change-flat-tyre', 'plug-tyre-puncture', 'fix-bike-puncture'],
    tools: ['wheel-nut-torque', 'tyre-pressure', 'tyre-age', 'tyre-size', 'winter-tyres'],
    safety: 'Never get under a car held up only by a jack. On a busy road, get everyone out on the safe side and call for roadside help instead.' },
  { id: 'hand-tools-and-safety', name: 'Hand tools and safety',
    text: 'Name the tools in a basic tool kit, learn what each is for, wear the right protection, and measure and mark accurately.',
    lessons: ['know-hand-tools', 'workshop-safety', 'measure-and-mark'],
    tools: ['wheel-nut-torque', 'cut-list'],
    safety: 'Eye protection for anything that cuts, drills or hammers. Keep blades sharp, cut away from your body, and keep children and pets clear.' },
  { id: 'light-carpentry', name: 'Light carpentry',
    text: 'Saw a straight cut, drill and screw wood without splitting it, then put it together by building a simple shelf.',
    lessons: ['saw-straight', 'drill-and-screw', 'build-simple-shelf'],
    tools: ['cut-list', 'shelf-load'],
    safety: 'Clamp the work, not your hand. Unplug power tools before changing a bit or blade.' },
  { id: 'wall-fixings', name: 'Wall fixings',
    text: 'Find out what your wall is made of and what is hidden in it, choose the right plug or anchor, and hang a picture, mirror or shelf that stays up.',
    lessons: ['whats-in-your-wall', 'pick-wall-plug', 'hang-picture-mirror'],
    tools: ['shelf-load', 'cut-list'],
    safety: 'Check for hidden cables and pipes before you drill. If you hit a cable or pipe, stop and call an electrician or plumber.' },
  { id: 'how-machines-work', name: 'How machines work',
    text: 'The physics a millwright uses every day: levers, pulleys and belts, gears, friction and bearings, with things to move and measure.',
    lessons: ['simple-machines', 'levers-in-tools', 'belts-and-pulleys', 'bearings-and-friction'],
    tools: ['gear-train-calculator', 'friction-ramp', 'shaft-bearing-life', 'bolt-torque-calculator'],
    safety: 'This course explains how machines work. It does not train you to repair industrial machinery: that is a skilled trade with its own training and lock-out rules.' },
];

export const skillCourseById = (id: string) => SKILL_COURSES.find((c) => c.id === id);
/** The course a lesson belongs to, with its place in it (first course that lists it). */
export function courseOf(lesson: string) {
  for (const c of SKILL_COURSES) { const i = c.lessons.indexOf(lesson); if (i >= 0) return { course: c, i }; }
  return undefined;
}
