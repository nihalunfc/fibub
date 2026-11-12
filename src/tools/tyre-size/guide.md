---
name: Tyre size
num: 2114
shelf: vehicles
code: T940
section: tyre-basics
title: "Tyre size calculator: read the numbers on your tyre"
summary: "Type the size printed on your tyre, like 205/55 R16 91V, and see in plain words how wide and tall it is, what wheel it fits, how much weight it carries and how fast it is rated, with a picture of each part."
seoDescription: "Read the size on your tyre in plain words: width, sidewall, wheel size, load and speed rating, with pictures. Compare two sizes and your speedometer error."
status: live
ads: false
order: 2114
icon: ruler
works: offline
updated: 2026-11-12
related: [tyre-age, tread-depth, tyre-type, tyre-pressure, stopping-distance, used-car-checklist, real-mileage]
sources:
  - "Size maths: sidewall = width × aspect ratio ÷ 100; overall diameter = rim (inches × 25.4 mm) + 2 × sidewall. Load index (kg per tyre) and speed symbols (km/h) follow the ISO 4000 and ETRTO tables, as checked November 2026; check the official source. Speedometer error assumes the speedometer was right on the original size."
  - "Country marks: BIS (India: ISI mark), NHTSA and Transport Canada (DOT code), GOV.UK (E-mark and tyre label), as checked November 2026; check the official source. Drawings are fibub's own."
flow:
  - { icon: pointer, label: "Vehicle" }
  - { icon: pencil, label: "Type size" }
  - { icon: eye, label: "Read it" }
---

## What it does

Every tyre has its size moulded on the side, as a string like **205/55 R16 91V**. Each part means something: how wide the tyre is, how tall its sidewall is, how it is built, which wheel it fits, how much weight it can carry and how fast it is rated to go. This tool reads the code for you and says it in plain words, one line each.

A picture of the tyre shows the code on its sidewall, with every part in its own colour. The same colours are used in the result lines and in a second drawing that cuts through the wheel to show the width, the sidewall and the wheel size. Tap any line or any part of the code to pick it out. Before you set the pressure for the new tyres, use [[tyre-pressure]]; to see how tyres change your braking, try [[stopping-distance]]; buying a car? Check its tyres with [[used-car-checklist]].

## How to use it

1. Pick your vehicle: car or SUV, pickup or light truck, motorcycle or scooter, or truck or bus. It loads an example code and shows where to find yours.
2. Type the code as printed on your tyre. Spaces and small letters are fine, and you can leave out the load and speed part.
3. Read the lines. Tap one to see that part light up in both pictures.
4. Open **Compare with another size** if you are thinking of a different size.

## What each setting does

- **Vehicle**: changes the example, the notes for that kind of vehicle and the places to look for the size.
- **The size on your tyre**: the code itself. Car sizes (205/55 R16 91V), US P and LT sizes (P215/65R15 95H, LT245/75R16 120/116S), off-road inch sizes (33x12.50R15), bike sizes (120/70 ZR17 58W, 90/90-12 54J, 3.00-18 47P) and truck sizes (295/80R22.5 152/148M, 10.00-20 16PR) all work.
- **Country**: speeds in mph for the USA and UK, weights in pounds too for the USA, and a short note on the marks to look for there.
- **Compare with another size**: shows how much taller or shorter the other size is and what your speedometer would really mean.

## How to read a tyre code

- **205**: the width in millimetres, from one side to the other.
- **55**: the sidewall height as a percentage of the width (55% of 205 mm is 113 mm).
- **R**: radial, the usual build today. D or a dash means bias-ply, and B means belted bias. ZR is an older way to mark a tyre built for over 240 km/h.
- **16**: the wheel (rim) size in inches.
- **91**: the load index. 91 means up to 615 kg per tyre. Two numbers, like 120/116, give the load for a single tyre and for each tyre of a twin pair.
- **V**: the speed rating. V means up to 240 km/h (149 mph). This is what the tyre is built for, not a speed to drive at.
- **P, LT, ST, T or C**: passenger car, light truck, trailer only, temporary spare, or commercial van tyre.
- **16PR**: the ply rating on older bias tyres, a strength grade.

## Worked example

Type **205/55 R16 91V**. The tool says: 205 mm wide; sidewall 113 mm tall (55% of the width), exactly 112.75 mm; radial; fits a 16-inch wheel; carries up to 615 kg per tyre; safe up to 240 km/h. The whole tyre is 406.4 + 2 × 112.75 = 631.9 mm tall.

Now compare it with **225/45 R17**. That tyre is 634.3 mm tall, which is 0.4% taller. When your speedometer says 100 km/h you are really doing about 100.4 km/h: within 3%, so usually fine.

A scooter tyre **90/90-12 54J** reads as a bias-ply tyre that carries up to 212 kg and is rated to 100 km/h.

## FAQs

**Which size should I buy?** The one on the sticker in the door frame or in the manual: it is the size the vehicle maker fitted. The tyre on the car may have been changed by an earlier owner.

**Can I fit a different size?** Often, if the overall height is within about 3% and the load index and speed rating are at least as high. Check with a tyre shop: the tyre must also clear the body and suspension.

**What if my code has no ratio, like 11R22.5?** The tool assumes a usual height and says so. The real size is in the tyre maker's data.

**What is the date code?** A separate 4-digit number on the sidewall, the week and year the tyre was made. 2325 means week 23 of 2025.

**Does anything get sent?** No. Everything is worked out on this page and nothing is saved.
