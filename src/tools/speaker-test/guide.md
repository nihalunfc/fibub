---
name: Speaker Test
num: 3071
shelf: everyday
code: T1052
section: sound-camera
title: "Speaker test: check left and right, frequency sweep and phase online"
seoTitle: "Speaker test online: left, right and sweep"
summary: "Test your speakers or headphones in the browser: left and right channels, a 20 Hz to 20 kHz sweep to find where you stop hearing, a phase check and a 5.1 check. Nothing is sent anywhere."
status: live
ads: false
order: 3071
icon: wave
works: offline
updated: 2026-11-19
related: [mic-test, tone-generator, audiogram, device-info]
sources:
  - "Sounds are made in your browser with the Web Audio API: StereoPannerNode for left and right, an oscillator ramped on a log scale for the sweep, and pink noise (Paul Kellet's filter, -3 dB per octave)."
  - "Channel count is AudioContext.destination.maxChannelCount; choosing an output device uses AudioContext.setSinkId, which is in Chromium browsers only."
  - "The 20 Hz to 20 kHz span is the usual nominal range of human hearing; how high you hear falls with age. The -18 dB start volume is fibub's own rule of thumb to keep first sounds gentle."
flow:
  - { icon: sliders, label: "Set volume" }
  - { icon: play, label: "Play" }
  - { icon: check, label: "Note result" }
---

## What it does

The Speaker Test checks that your speakers or headphones work, that left and right are the right way round, and how low and high they can play. Press **Left**, **Right** or **Both** to hear a short burst of noise from that side; a **20 Hz to 20 kHz sweep** glides from the deepest rumble to the highest squeal while a live readout shows the pitch, and you press **I stopped hearing it** to note your own limits. A **phase test** plays the same noise in step and then flipped, which exposes a speaker wired backwards.

Everything is made in your browser, so it works offline once the page has loaded and nothing is sent anywhere. It starts quiet (-18 dB) so nothing blasts you. To test the other direction use the [[mic-test]]; to play a single pitch for as long as you like, the [[tone-generator]]; and for a proper hearing chart, the [[audiogram]].

## How to test your speakers

1. Turn the volume slider to a comfortable level, then press **Left**. The sound should come from the left speaker only. Do the same for **Right** and **Both**.
2. Press **Start sweep** and listen. Press **I stopped hearing it** the moment the sound disappears, at the low end or the high end.
3. Press **In phase** then **Out of phase**. With speakers in front of you, out of phase sounds thinner and wider, as if it came from nowhere.
4. If your browser lists outputs, pick another speaker or headset from **Play through**.

## What each part shows

- **Left / Right / Both**: a 1.5-second noise burst panned fully left, right or centre. The sentence says which side you should hear.
- **Sweep**: a tone rising from 20 Hz to 20 kHz over 20 seconds, with the pitch in hertz shown live. Your marks are listed below it.
- **Phase test**: in phase means both speakers push together; out of phase means one pulls while the other pushes, which cancels the bass in the middle.
- **Volume**: from -40 dB (very quiet) to 0 dB (loudest the page can send). Your own volume control still applies on top.
- **Play through**: the output device, where the browser allows choosing (Chrome, Edge and other Chromium browsers; not Safari or Firefox by default).
- **Channels**: how many output channels the browser says your device has. Six or more adds a 5.1 check.

## Worked example

A laptop sweep fades out at about 150 Hz at the low end because small speakers cannot make deep bass, and at 16,000 Hz at the top end. That is normal: most laptop speakers start near 150 Hz, and hearing at the top end drops with age, often below 16 kHz by middle age and below 12 kHz later. Headphones usually go much lower.

## If something sounds wrong

- **No sound at all**: check the system volume and mute, that the right output is chosen, and that the tab is not muted.
- **Left and right swapped**: check the headphone side markings, the balance setting in your system sound options, and the cable.
- **Sound only from one side**: try another cable or app; a mono setting in accessibility options can also cause oddities.
- **Crackling at high volume**: lower the volume; the speaker is being pushed too hard.

## FAQs

**Why can I not hear the lowest frequencies?** Small speakers cannot move enough air. Below about 150 Hz many laptop and phone speakers fall silent. It does not mean they are broken.

**Why do I stop hearing the sweep at 15 kHz?** Hearing at the top end falls with age, and many speakers roll off there too. Test with headphones and compare.

**Does this damage my speakers?** The sounds are modest and start quiet. Keep the volume sensible, especially with headphones, and avoid listening loudly for long.

**Why is there no output picker?** Choosing an output from a web page works in Chromium browsers. In Safari and Firefox use your system sound settings.
