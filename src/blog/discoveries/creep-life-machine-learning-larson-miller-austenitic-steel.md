---
title: "Creep life of austenitic heat-resistant steel: machine learning with the Larson-Miller parameter"
summary: "A 2025 Metals study trained machine learning models on 216 creep tests of austenitic steels and found that predicting the Larson-Miller parameter beats predicting hours."
tools: [larson-miller-calculator, curve-fitter, unit-converter]
updated: 2026-11-10
sources:
  - "Xie X, Liu M, Yang P, Yang Z, Pan C, Wang C, Wei X (2025), Data and Knowledge Dual-Driven Creep Life Prediction for Austenitic Heat-Resistance Steel, Metals 15(2): 120, published 25 January 2025. Open access, CC BY. Details checked on the publisher's page, 2026-11-10."
  - "Larson F R and Miller J (1952), Trans. ASME 74: 765-775 (the original time-temperature parameter). LMP = T (C + log10 t) with T in kelvin and t in hours: standard creep mechanics."
  - "The nine creep-rupture tests in the worked example are made up by fibub for this page; they are not the paper's data or data for any real alloy."
paper:
  title: "Data and Knowledge Dual-Driven Creep Life Prediction for Austenitic Heat-Resistance Steel"
  authors: "Xie X, Liu M, Yang P, Yang Z, Pan C, Wang C, Wei X"
  journal: "Metals"
  year: 2025
  doi: "10.3390/met15020120"
  url: "https://www.mdpi.com/2075-4701/15/2/120"
  licence: "CC BY"
  reviewed: true
---

Steels for boiler tubes, furnace parts and power-plant pipework spend years glowing hot under load, slowly stretching until they break. That slow stretching is called creep, and testing it takes months. A team in China trained machine learning models on 216 published creep tests of austenitic heat-resistant steels, and reported in *Metals* in January 2025 that the models did better when asked for the Larson-Miller parameter instead of the raw rupture time in hours. This page explains the result and shows how the [[larson-miller-calculator]] turns your own rupture tests into the same parameter, with the [[curve-fitter]] for any other trend you want to test and the [[unit-converter]] for awkward temperature or stress units.

## What they found

Seven kinds of model were compared, from plain linear regression to random forests, gradient boosting, support vector regression, a small neural network (a multilayer perceptron) and a convolutional network. The neural network came out best and linear regression worst. The authors quote an accuracy of 72 % for the best model, though the page does not spell out which measure that number is.

Two ideas helped. First, creep life in the data ran from under 6 hours to over 11,000 hours, a very lopsided spread. Rewriting each test as a Larson-Miller parameter made the targets far more evenly spread, closer to a bell curve, and the models predicted them better on average. Second, adding "metallurgy knowledge" from thermodynamic software, such as how strongly strengthening particles want to form, improved the predictions. The kinetic quantities (the driving force for those particles) helped more than the equilibrium ones. A genetic algorithm then searched for new compositions for 750 °C and 100 MPa, and the predicted lives beat the best alloys in the data, though the authors say these designs are not ready to use.

## Why it matters

New heat-resistant alloys are slow to prove because each long creep test ties up a furnace for a year or more. A model that can rank candidate compositions from existing data lets a lab test the most promising few first. The lesson about the Larson-Miller parameter is useful well beyond this paper: when a quantity spans several powers of ten, a physically sensible transformation can do more for a model than a fancier algorithm.

## How they did it

Each of the 216 records held the amounts of 16 alloying elements, the solution-treatment temperature (about 1,090 to 1,250 °C), the test temperature (600 to 850 °C), the stress (30 to 300 MPa) and the rupture life. Inputs were standardised, features were screened with correlation tests and a random forest, and the data were split 80:20 for training and testing, with five-fold cross-validation to tune each model. For the Larson-Miller form they took the usual constant C = 20 from earlier work, giving LMP = T (20 + log10 t) with T in kelvin and t in hours.

## Check it yourself with fibub

The calculator does the Larson-Miller step for your own tests, and lets you see whether C = 20 really suits them. The numbers below are **made up by fibub** for a generic austenitic steel; they are not the paper's.

1. **Paste the tests.** In the creep-rupture box, one test per line: temperature, stress, hours. Our nine tests are 650 °C at 250, 200 and 160 MPa (420, 2,600 and 11,000 h); 700 °C at 200, 150 and 110 MPa (240, 1,900 and 9,800 h); and 750 °C at 150, 110 and 80 MPa (170, 1,300 and 6,500 h). Leave the unit on °C.
2. **Read the parameter.** At 650 °C (923.15 K) and 420 h, LMP = 923.15 × (20 + log10 420) ≈ 20,900. The slowest test, 750 °C for 6,500 h, gives about 24,400. Nine lives spread over almost two powers of ten become numbers that differ by under 20 %, which is the evening-out the paper relies on.
3. **Fit the master curve.** Keep C = 20 and the quadratic fit in log stress. The scatter comes out at about 0.12 in log10 t, roughly a factor of 1.3 in life.
4. **Look at the best-fit C.** For our made-up data the page finds C ≈ 15.9, and the scatter falls to about 0.04. So C = 20 is a convention, not a law: a model trained on parameters built with the wrong C learns some of that error too.
5. **Predict.** In the second card, enter 750 °C and 100 MPa, the paper's design condition. Our curve gives a rupture life of about 1,700 h. For a 100,000 h design life at 650 °C, the allowable stress comes out near 130 MPa, but that is far beyond our longest test, so treat it as an extrapolation. The Sherby-Dorn and Manson-Haferd rows beside it show how much the methods disagree out there.

If you also have minimum creep rates, the Norton card fits the stress exponent n and the activation energy Q, which tells you which creep mechanism you are looking at.

## The fine print

The data set is small for machine learning, and the authors say every model overfitted to some degree. All records came from two earlier sources, so any differences in how those labs tested carry through. The 72 % accuracy figure is not clearly defined, and the table that compares hours with Larson-Miller targets could not be read as text on the publisher's page. The new alloy designs are predictions only; none was made and tested in this paper. And C = 20 was assumed for every steel, which, as the example shows, may not be the best choice for a given alloy family.
