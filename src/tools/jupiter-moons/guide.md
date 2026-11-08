---
name: Jupiter's moons
num: 62
shelf: science
section: planetary-science
title: "Jupiter's moons tonight: where Io, Europa, Ganymede and Callisto are, with transits and eclipses"
summary: "See where Jupiter's four large moons are at any moment, in the same orientation as your eyepiece, and list the coming transits, shadow transits, occultations and eclipses you can see from your place."
status: live
ads: true
order: 30
icon: orbit
works: offline
updated: 2026-11-08
related: [sky-tonight, object-altitude, telescope-calculator, observing-session, observing-log, sky-events-calendar]
sources:
  - "Sun, Moon and planet positions: astronomy-engine by Don Cross (MIT licence), accurate to about an arcminute."
  - "City coordinates and time zones: public geographic facts, typed by fibub."
flow:
  - { icon: compass, label: "Your place" }
  - { icon: clock, label: "Date, time" }
  - { icon: orbit, label: "Moons" }
---

## What it does

Even small binoculars show Jupiter's four large moons, discovered by Galileo in 1610: Io, Europa, Ganymede and Callisto. They swing from side to side as they orbit, so the line of dots changes every night, and Io moves visibly within an hour. This tool draws Jupiter and its moons for any moment, turned to match what you see through your instrument, and names each dot. It lists the coming events: a moon crossing in front of Jupiter (a **transit**), its black shadow crossing the cloud tops (a **shadow transit**), a moon slipping behind the planet (an **occultation**) and a moon fading into Jupiter's shadow (an **eclipse**). For each event it says whether you can see it from your place, with Jupiter's height at the time. A wave chart shows the moons over the coming days, the same kind of chart astronomy magazines print each month.

## How to use it

1. Set your **place** at the top. Times show on the clock chosen in "Times in".
2. Pick the **date and time**, or press **Now**. The −1 hour and +1 hour buttons step through the night so you can watch the moons move.
3. Choose the **view**. With the naked eye or binoculars, north is up and east is to the left. Most telescopes without a diagonal (reflectors, finders) turn the view upside down. A refractor or Schmidt–Cassegrain with a star diagonal shows a mirror image. Match it once and the dots line up with the eyepiece.
4. Choose how many days of **events** to list, and tick **Only events I can see** to hide those in daylight or with Jupiter down. Tap an event to draw the moons at its middle.
5. Download the event list as a CSV in UTC, or the whole page as a PNG, PDF or Word file.

## What each result means

- **Distance from Jupiter** is in Jupiter radii (one radius is 71,492 km) and in arcminutes on the sky. Callisto strays up to about 26 radii from the planet, roughly 10 arcminutes at opposition.
- **Now** says whether each moon is in plain view, in front of the disc, behind it or in the shadow.
- **From here** is "You can see it" when, at the start, middle or end of the event, Jupiter is at least 10° above your horizon and the Sun at least 6° below it.
- Shadow transits are the easiest events to see: a sharp black dot on the clouds, visible in a 75 mm telescope. Transits of the moons themselves are harder, as a bright moon is lost against the bright clouds.

## How it is worked out

Moon positions come from the L1.2 theory of Lainey and others, as built into the open-source astronomy-engine library, with Jupiter's position from VSOP87. The moons are placed as they were when their light left them, about 35 to 50 minutes before you see it. Events are found by stepping through time every four minutes and then narrowing each start and end to about 10 seconds. Shadows are cast by sunlight along a straight line onto a round Jupiter; the real planet is 6.5 % flattened and its shadow has a soft edge, so times can differ from almanac predictions by a minute or two.

## Worked example

On the evening of 11 February 2027, near opposition, set the place to Toronto and the time zone to Toronto's own. At 18:58 EST, Europa slides behind Jupiter, which is 16° up in the east as twilight ends. The planet is 45″ across and 4.36 AU away. Europa comes out from behind the disc at 21:49 but stays invisible, because it is still in Jupiter's shadow, until it suddenly appears beside the planet at 21:53, with Jupiter now 46° high. The event table lists both, the occultation and the eclipse, as visible. Earlier that day an Io transit runs from 14:55 to 17:12 EST, in daylight, so it is marked "No".

## Frequently asked questions

**Why are the moons not in a perfectly straight line?** They orbit close to Jupiter's equator, which we see almost edge-on, but the line is tilted on the sky by up to about 25° from east–west, depending on where Jupiter is along the ecliptic.

**Why do occultations and eclipses happen together near opposition?** At opposition the Sun is right behind us, so Jupiter's shadow points straight away from us and hides behind the planet. Months either side, the shadow sticks out to one side and the two events come apart.

**Which moons can I see in binoculars?** All four, when they are far enough from Jupiter's glare. Ganymede is the brightest at about magnitude 4.6.

**Does it work offline?** Yes: once the page has loaded, everything is worked out in your browser.
