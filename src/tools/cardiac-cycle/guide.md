---
name: Cardiac cycle
num: 1127
shelf: learn
code: L61
section: school-biology
title: "Cardiac cycle"
summary: "Watch a four-chamber heart beat in slow motion: atria and ventricles contract, valves open and shut, and an ECG-like trace and the ventricle volume move with them. Change the heart rate and the filling to see stroke volume and cardiac output. Teaching model, not medical."
status: live
ads: false
order: 1127
icon: chart
works: offline
updated: 2026-11-09
related: [photosynthesis-lab, fick-cardiac-output, heart-rate-zones]
sources:
  - "Timing at 75 beats a minute (cycle 0.8 s: atrial systole 0.1 s, ventricular systole 0.3 s, joint diastole 0.4 s), cardiac output = stroke volume × heart rate, and the order of valve events are standard physiology; written by fibub."
  - "Systole is scaled with the square root of the cycle length (as the QT interval roughly is) so that diastole shortens most at fast rates; this is a simplification for teaching."
  - "The ECG-like trace and the volume curve are smooth made-up shapes drawn by fibub, not recordings, and must not be used to read a real ECG. Volumes are typical round resting values. Nothing you enter is stored or sent anywhere."
flow:
  - { icon: sliders, label: "Rate" }
  - { icon: eye, label: "Watch" }
  - { icon: calculator, label: "Output" }
  - { icon: check, label: "Check" }
---

## What it does

Your heart is two pumps side by side. The **right side** collects blood low in oxygen from the body and pumps it to the lungs; the **left side** collects oxygen-rich blood from the lungs and pumps it to the body. Each beat follows the same pattern, the **cardiac cycle**: the atria contract, then the ventricles, then the whole heart relaxes and fills. Valves stop blood flowing backwards.

This page animates a simple four-chamber heart (blue for blood low in oxygen, red for oxygen-rich blood) together with an **ECG-like trace** and the **volume of the left ventricle**:

- **AV valves** (tricuspid on the right, bicuspid or mitral on the left) open while the heart fills and shut as the ventricles contract: the "lub" sound.
- **Semilunar valves** (pulmonary and aortic) open only while the ventricles push blood out, and shut as they relax: the "dub".
- The **P wave** comes as the atria are told to contract, **QRS** as the ventricles are, and **T** as the ventricles recover.

It fits **Class 10 Science: life processes** (the human heart, double circulation) and **Class 11 Biology: body fluids and circulation** (cardiac cycle, ECG, cardiac output). It is a teaching model, not a medical tool. Photosynthesis, from the same Class 10 chapter, is in the [[photosynthesis-lab]]; work out cardiac output from oxygen use with [[fick-cardiac-output]]; and see training heart rates in [[heart-rate-zones]].

## How to use it

1. **Pick the level.** *Class 10* shows the chambers, valves, heart rate and output, and explains double circulation. *Class 11* adds the end-systolic volume, ejection fraction and a table of each phase with its time, valves and ECG wave.
2. **Slide the heart rate** (40 to 180 beats a minute) and the **filling** of the ventricle.
3. **Slow motion** shows the beat at a quarter of real speed; **Pause** stops it so you can study one moment. The line under the picture says what is happening and which valves are open.
4. Read the **cardiac output** with the sum filled in.
5. Download the picture and numbers, or (Class 11) one beat's phases as a CSV file. **Check yourself** gives fresh questions every time.

## Worked example

At the start: 75 beats a minute, 120 mL in the ventricle when full and 50 mL left after each beat. One beat takes 60 ÷ 75 = **0.80 s**: 0.1 s atrial systole, 0.3 s ventricular systole, 0.4 s joint diastole. Stroke volume = 120 − 50 = **70 mL**, so cardiac output = 70 mL × 75 = 5250 mL/min = **5.25 L/min**. At 150 beats a minute a beat takes only 0.40 s: systole shrinks to 0.21 s but diastole to just 0.12 s, so there is less time to fill.

## Tips

- Pause just after the tall R spike: both sets of valves are shut and the ventricle volume is flat. That is isovolumetric contraction.
- The left ventricle wall is thickest because it pushes blood all round the body.
- Real ECGs come from electrodes on the skin; doctors read them carefully. Do not use this trace to judge a real one.

## FAQ

**Why does the volume not fall to zero?** The ventricle never empties completely; about 50 mL stays behind at rest.

**Why do the atria only add a little blood?** Most filling happens on its own while the heart relaxes; the atria top up the last part.

**Does the right ventricle pump the same amount?** Yes, on average both sides pump the same volume each beat, or blood would pile up on one side.
