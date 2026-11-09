---
name: Eclipse finder
num: 65
shelf: science
section: observing
title: "Eclipse finder: solar and lunar eclipses visible from your location, with local times"
summary: "List every solar and lunar eclipse you can see from your place for up to 50 years, with local start, peak and end times, how much is covered, the Sun or Moon's height, and a picture you can scrub through."
status: live
ads: true
order: 25
icon: moon
works: offline
updated: 2026-11-08
related: [sky-events-calendar, sun-position-calculator, sky-tonight, object-altitude, dark-sky-calendar, observing-session]
sources:
  - "Sun, Moon and planet positions: astronomy-engine by Don Cross (MIT licence), accurate to about an arcminute."
  - "City coordinates and time zones: public geographic facts, typed by fibub."
flow:
  - { icon: compass, label: "Your place" }
  - { icon: calendar, label: "Eclipses" }
  - { icon: moon, label: "Watch it" }
---

## What it does

Eclipses are rare where you live, and the lists in news stories are usually for somewhere else. This tool finds every solar and lunar eclipse you can see from your own place, up to 50 years ahead. For each one it gives the local start, peak and end times, how much of the Sun or Moon is covered, how high it stands in your sky, and whether you can see it at all.

Tap any eclipse for its full timeline and a picture. For a solar eclipse you see the Moon's disc crossing the Sun as it looks from your place. For a lunar eclipse you see the Moon's path through Earth's grey penumbra and dark umbra. A slider moves through the eclipse from first contact to last.

For the Sun's position at any moment of an eclipse, use the [[sun-position-calculator]]; for every other sky event in the month, the [[sky-events-calendar]].

## How to use it

1. Set your **place** at the top: pick a city, type coordinates, or use your device's location. "Times in" picks the clock for every time.
2. Choose how far to **look ahead** and whether to show solar eclipses, lunar eclipses or both.
3. By default the list holds only the eclipses you can see from your place. Tick **Also list eclipses I can't see from here** to show the rest, for example a lunar eclipse while your Moon is below the horizon.
4. Tap an eclipse for its contact times and picture, and drag the slider to watch it unfold.
5. Download the list as a CSV, or the page as a PNG, PDF or Word file.

## What each result means

- **Solar, partial here (total elsewhere)**: the Moon's shadow misses you, but it makes a total or annular eclipse somewhere else on Earth.
- **Covered at most**: for a solar eclipse, the share of the Sun's area hidden at greatest eclipse (the obscuration). The **magnitude**, also shown, is the share of the Sun's diameter covered, which is always the larger number. For a lunar eclipse, it is the share of the Moon inside the dark umbra.
- **Penumbral** lunar eclipses only dim the Moon slightly, and many people do not notice them. **Partial** ones bite a dark notch out of the Moon. In **total** ones the whole Moon turns coppery red, lit only by sunlight bent through Earth's atmosphere.
- **From here** says "Partly" when the Sun or Moon rises or sets during the eclipse, so you only see part of it. You will need a clear, flat horizon.

## How it is worked out

Eclipse searches and contact times come from the open-source astronomy-engine library, which models the Sun with VSOP87 and the Moon with the lunar theory in Montenbruck and Pfleger's *Astronomy on the Personal Computer*, and allows for the flattened shape of the Earth for the observer's own position. The lunar shadow is enlarged by about 1/85 for Earth's atmosphere, as almanacs do. Contact times typically agree with NASA's eclipse predictions within a minute.

## Worked example

From Toronto on 8 April 2024, the tool gives a partial eclipse from 14:04 to 16:31 EDT. The Moon covers 99.9 % of the Sun's area at 15:19, magnitude 0.998, with the Sun 45° high. In Niagara Falls, a little further south, it lists a total eclipse with totality from 15:18:14 to 15:21:49 EDT, about 3 minutes 35 seconds.

Looking ahead from Toronto, the total lunar eclipse of 25–26 June 2029 is a good one. The Moon is fully in Earth's shadow from 22:30 to 00:13 EDT, 103 minutes of totality, with the Moon low in the south-east and about 17° high at greatest eclipse. For the total lunar eclipse of 14 March 2025, the tool's contact times (partial from 01:09, total from 02:25 to 03:31 EDT) agree with NASA's within a minute.

## Frequently asked questions

**Is it safe to look at a solar eclipse?** Only through certified eclipse glasses (ISO 12312-2) or a proper solar filter, including when the Sun is mostly covered. Only during the brief totality of a total eclipse may you look without protection.

**Why do I see more lunar eclipses than solar ones?** A lunar eclipse can be seen from the whole night side of Earth, but a solar eclipse only from the narrow region the Moon's shadow crosses.

**How accurate are the times?** Usually within a minute, which is plenty for planning. For a solar eclipse near the edge of the path of totality, check a detailed map, as a few hundred metres can matter.

**Does it work offline?** Yes. Once the page has loaded, every search runs in your browser.
