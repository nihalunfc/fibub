---
name: Moon phase simulator
num: 1227
shelf: learn
code: L112
section: school-earth
title: "Moon phase simulator: drag the Moon round the Earth and see its phase, tithi, age and rise time"
summary: "Drag the Moon round its orbit with sunlight from one side and watch its face change from new moon to full and back. Shows the phase name, how much is lit, its age in days, the tithi and paksha, roughly when it rises, and the mean phase on any date."
status: live
ads: false
order: 1227
icon: moon
works: offline
updated: 2026-11-09
related: [sky-tonight, kepler-orbits, dark-sky-calendar, historic-calendar-converter]
sources:
  - "Phases from the Sun-Earth-Moon angle, lit fraction (1 − cos θ)/2, tithis of 12° of elongation with Shukla and Krishna paksha, and moonrise about 49 minutes later each day are standard astronomy. Wording, pictures and examples are fibub's own."
  - "Mean synodic month 29.530588853 days, mean sidereal month 27.321661 days and the mean new moon of 2000 January 6 (JDE 2451550.09766): J. Meeus, Astronomical Algorithms, 2nd edition, chapter 49."
  - "Checked in tests against observed new and full moons (8 April 2024, 14 March 2025, 7 September 2025, 12 August 2026, 9 November 2026), all within the half-day that the mean motion allows."
flow:
  - { icon: pointer, label: "Drag Moon" }
  - { icon: moon, label: "See phase" }
  - { icon: calendar, label: "Tithi, age" }
  - { icon: check, label: "Check" }
---

## What it does

The Moon makes no light of its own. The Sun always lights the half of it that faces the Sun, and as the Moon travels round the Earth once a month we see different amounts of that lit half. That is all the **phases** are: not the Earth's shadow, just our changing view.

This page shows the same moment two ways. The top picture looks down on the Earth and Moon from far above the North Pole, with sunlight coming from the left. **Drag the Moon** round its orbit and the second picture shows how its face looks from the Earth that night: a thin crescent, a half Moon at first quarter, a round full Moon, then shrinking back. Under it you get the phase name, how much of the face is lit, the Moon's **age** in days, the **tithi** and **paksha** of the Indian lunar calendar, and roughly when it rises and sets.

It follows Class 8 Science, keeping time with the skies (phases of the Moon, the lunar month, tithis and the Indian calendar), and helps with Class 6 and 7 work on the Moon and with eclipses later on. To find the Moon in tonight's real sky, open [[sky-tonight]]; for why the Moon and planets move as they do, try [[kepler-orbits]]; and to see dark, Moon-free nights through the year, the [[dark-sky-calendar]].

## How to use it

1. Choose a **Level**. **Class 8** shows the phase, age, tithi and rise time. **Class 9 to 12** adds the lit fraction formula and why the month of phases (29.53 days) is longer than one trip round against the stars (27.32 days).
2. **Drag the Moon** in the top picture, move the **day** slider, or tap **New**, **First quarter**, **Full** or **Last quarter**. **+1 day** steps the Moon on by one day.
3. **Seen from** flips the face for the southern hemisphere, where the waxing Moon is lit on the left.
4. Under **Phase on a date**, pick a date and press **Show this date**, or press **Today**. The page uses the Moon's average motion, so the real phase can be up to about half a day off.

## Worked example

The page opens with the Moon 4 days old. It has gone 4 ÷ 29.53 × 360 = 48.8° round from the Sun, so it is a **waxing crescent**, lit on the right as seen from India. The lit part is (1 − cos 48.8°) ÷ 2 = 0.170, about 17% of the face. 48.8 ÷ 12 = 4.06, so it is tithi 5: **Shukla paksha Panchami**. It rose at about 09:15 and sets about 21:15 local solar time, so you see it in the west after sunset.

Pick 9 November 2026 and press **Show this date**: the mean age is 29.0 days, a **new moon**. The real new moon that day was at 07:02 UTC.

## Check yourself

Five fresh questions: the Moon's age from its angle, how much is lit, the tithi from the angle, how much later it rises after a few days, and days to the next new moon. Nothing is saved.

## Tips

- A waxing Moon (growing) is seen in the evening; a waning Moon (shrinking) is up late at night and in the morning sky.
- The full Moon rises as the Sun sets, and the new Moon is up with the Sun, hidden in its glare.
- A tithi is not a day: it is the time the Moon takes to gain 12° on the Sun, so it can start at any hour and be 19 to 26 hours long.

## FAQ

**Are the phases caused by the Earth's shadow?** No. The Earth's shadow only falls on the Moon during a lunar eclipse, which can happen only at full moon.

**Why doesn't every full moon give an eclipse?** The Moon's orbit is tilted by about 5° to the Earth's, so most months it passes above or below the shadow. This page draws a flat orbit.

**Are the rise times exact?** No. They are for an ideal Moon on the celestial equator. Real times shift with the season, your place and the Moon's tilted path.

**Is this from the NCERT book?** It covers the same topic with fibub's own pictures and examples. fibub is not part of NCERT.
