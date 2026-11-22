---
title: "Planning a night: Sun, Moon and twilight"
summary: "A good night needs the Sun well below the horizon, the Moon out of the way, clear steady air and targets high in the sky. Learn the three kinds of twilight and a simple checklist for planning a session."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "When does astronomical twilight end?"
    choices: ["When the Sun sets", "When the Sun is 6° below the horizon", "When the Sun is 18° below the horizon"]
    ans: 2
    why: "Below −18° the Sun adds no measurable light to the sky: full night."
  - q: "You want to photograph a faint galaxy. Which Moon phase is best?"
    choices: ["Full Moon", "First quarter, after moonset", "New Moon"]
    ans: 2
    why: "Around new Moon the sky is darkest all night. After a first-quarter moonset is also good, but only for part of the night."
  - q: "At 55° N in late June, how much full darkness is there?"
    choices: ["None", "About 4 hours", "About 8 hours"]
    ans: 0
    why: "The Sun never gets 18° below the horizon, so astronomical twilight lasts all night."
sources:
  - "Twilight definitions (civil −6°, nautical −12°, astronomical −18°): US Naval Observatory, aa.usno.navy.mil"
---

**Module 3 · about 25 minutes · read first: [1.3 Seasons and the Sun's path](/learn/courses/sky-watching/seasons/), [1.4 Moon phases and eclipses](/learn/courses/sky-watching/moon-phases/), [3.3 Seeing and transparency](/learn/courses/sky-watching/seeing-transparency/) · maths: uses Lessons 1.3 and 1.4.** You'll be able to name the three twilights, find how long true darkness lasts on any date and latitude, and plan an observing session that puts each target at its best.

<div class="bigidea">A good night needs the Sun well below the horizon, the Moon out of the way, clear steady air and targets high in the sky; plan with twilight times, the Moon's phase and a short checklist.</div>

## 1. Why this matters

Clear nights are precious. Good planning means you don't spend the darkest hours on the Moon, or chase a galaxy that is sinking into the town's glow. This lesson ties together everything in Part A into a habit observers use before every session.

## 2. Three twilights

After sunset the sky darkens gradually because sunlight still reaches the upper atmosphere. Twilight is split by how far the Sun's centre is below the horizon:

| Sun's altitude | Name | What you notice |
|---|---|---|
| 0° to −6° | **Civil twilight** | Bright enough to read outside; Venus and the brightest stars appear |
| −6° to −12° | **Nautical twilight** | The horizon fades out; most constellations visible |
| −12° to −18° | **Astronomical twilight** | Looks dark, but faint galaxies and nebulae are still washed out |
| below −18° | **Night** | The Sun adds nothing; the sky is as dark as it gets |

<!--fig:twilight-bands-->

Things to notice:

- At 43° N, full darkness lasts about 8.7 hours at the equinox but only about 4 hours at the June solstice.
- North of about 48.6° N, there is a stretch around the June solstice with no full darkness at all.
- Near the equator, twilight is short: the Sun drops almost straight down.

Plan a galaxy night at 45° N in late March:

<div class="steps">
<div class="step"><b>Sunset 19:30.</b> Civil twilight (Sun to −6°) ends about 20:00: bright planets show.</div>
<div class="step"><b>Nautical twilight (−12°).</b> Ends about 20:35: most stars visible, sky still blue.</div>
<div class="step"><b>Astronomical twilight (−18°).</b> Ends about 21:10: full darkness for faint galaxies.</div>
<div class="step"><b>Check the Moon.</b> A first-quarter Moon sets around 02:00, so the best hours start then; or pick a night near new Moon.</div>
<div class="step"><b>Targets.</b> Leo and Virgo galaxies are highest near midnight. Check the cloud and seeing forecast, pack warm clothes and a red torch.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** use Lesson 1.2's hour-angle formula with a target altitude `$h_0$` below the horizon instead of 0°.

**Equation:** the Sun reaches altitude `$h_0$` at hour angle `$H$` where

```math
\cos H = \frac{\sin h_0 - \sin\varphi\,\sin\delta_\odot}{\cos\varphi\,\cos\delta_\odot}
```

Full darkness lasts `$24 - 2H/15$` hours, with `$h_0 = -18^\circ$`. If `$\cos H < -1$` the Sun never climbs to `$h_0$` (polar night); if `$\cos H > 1$` it never sinks to `$h_0$` (no full darkness).

**No full darkness when** the Sun's lowest altitude `$-(90^\circ - \varphi - \delta_\odot)$` is above −18°, that is `$\varphi > 72^\circ - \delta_\odot$`: at the June solstice, latitudes above about 48.6°.
</details>

## 3. A planning checklist

1. **Weather:** clear sky forecast, cloud maps, and wind (wind shakes telescopes and worsens seeing).
2. **Sun:** when does astronomical twilight end and begin?
3. **Moon:** phase, rise and set times. Plan faint targets for when the Moon is down.
4. **Targets:** list them with the time each crosses the meridian (highest, lowest airmass). Observe each within a couple of hours of that, starting with the ones setting first in the west.
5. **Gear and comfort:** cool the telescope for 30 to 60 minutes, dress warmly, bring a red torch and a log (Lesson 5.7).


<div class="meaning">

<dl>
<dt>Civil / nautical / astronomical twilight</dt><dd>Sun 6°, 12° and 18° below the horizon.</dd>
<dt>cos H = (sin h₀ − sin φ sin δ☉)/(cos φ cos δ☉)</dt><dd>Hour angle when the Sun reaches altitude h₀.</dd>
<dt>24 − 2H/15</dt><dd>Hours of full darkness with h₀ = −18°.</dd>
<dt>Physical meaning</dt><dd>After sunset, sunlight still lights the air high above you, and that glow fades slowly as the Sun sinks further. Only when the Sun is 18° down is the upper air in shadow and the sky truly dark. Near midsummer at high latitudes it never gets that far, so the sky never fully darkens.</dd>
</dl>

</div>

<div class="myth">

**"It is dark as soon as the Sun sets."** Full darkness comes about 1.5 hours after sunset at mid-latitudes, longer in summer and further north. Above about 49° N there is no full darkness at all around the June solstice.

</div>

## 4. Worked example

*Toronto (43.7° N), equinox (`$\delta_\odot = 0$`).*

```math
\cos H = \frac{\sin(-18^\circ) - 0}{\cos 43.7^\circ} = \frac{-0.309}{0.723} = -0.427, \qquad H = 115.3^\circ = 7.69 \text{ h}
```

Astronomical dawn is at solar time `$12 - 7.69 = 4.31$` h (about 04:19) and dusk at `$12 + 7.69 = 19.69$` h (about 19:41). Full darkness lasts `$24 - 2 \times 7.69 = 8.6$` hours. With a full Moon that night, you would rather wait a week: the last-quarter Moon rises around midnight, giving dark evening hours.

Clock times differ from solar times because of time zones (Toronto is about 17 minutes behind its zone's central longitude) and the equation of time (up to ±16 minutes); planning tools handle both.

## 5. Practice

<div class="problem" data-problem="dark-hours"></div>

**More practice** (answers below):

1. At what solar time does nautical twilight end at the equator on the equinox?
2. Why is a new Moon week in winter ideal for deep-sky observing in Canada?
3. Your target crosses the meridian at 02:00. When should you observe it?

<details>
<summary>Answers</summary>

1. At the equator on the equinox the Sun sets straight down at 15° per hour, so −12° comes 48 minutes after sunset: about 18:48 solar time.
2. Long nights (more hours of full darkness) and no Moon.
3. Around 02:00, within a couple of hours either side, when it is highest and the airmass lowest.
</details>

<div class="keypoints">

- Three twilights: civil (−6°), nautical (−12°), astronomical (−18°).
- Faint objects need astronomical darkness and no Moon.
- Observe targets near their highest point (when they cross the meridian).
- Check the weather, seeing and transparency forecasts before going out.

</div>

**Try it on the real sky:** get twilight, Moon and darkness times for your town with the [[dark-sky-calendar]], build a timed target list with the [[observing-session]] planner, and see what is up right now with [[sky-tonight]].

**New words:** *civil, nautical and astronomical twilight*, *transit time*, *equation of time*.
