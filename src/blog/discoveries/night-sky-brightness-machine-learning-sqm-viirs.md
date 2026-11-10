---
title: "Mapping night sky brightness with machine learning, SQM and VIIRS"
summary: "A 2025 open-access study trains machine learning on hand-held sky meter readings and satellite night lights to map sky brightness. Here is how to read its numbers with fibub."
tools: [light-pollution-calculator, regression-workbench, dark-sky-calendar, sub-exposure-calculator]
updated: 2026-11-10
sources:
  - "Zheng, S.; Chen, Y.; Eziz, A.; Kurban, A.; Van de Voorde, T.; De Maeyer, P. (2025), Machine-Learning-Based Monitoring of Night Sky Brightness Using Sky Quality Meters and Multi-Source Remote Sensing, Remote Sensing 17(8), 1332, published 8 April 2025. Open access under CC BY 3.0, as shown on the publisher's page, checked 2026-11-10."
  - "Natural sky luminance of about 0.174 mcd/m² (about 22.0 mag/arcsec²), after Falchi et al. (2016), Science Advances 2: e1600377."
paper:
  title: "Machine-Learning-Based Monitoring of Night Sky Brightness Using Sky Quality Meters and Multi-Source Remote Sensing"
  authors: "Zheng S, Chen Y, Eziz A, Kurban A, Van de Voorde T, De Maeyer P"
  journal: "Remote Sensing"
  year: 2025
  doi: "10.3390/rs17081332"
  url: "https://www.mdpi.com/2072-4292/17/8/1332"
  licence: "CC BY 3.0"
  reviewed: true
---

How dark is the sky where you live? A cheap hand-held sky quality meter answers that for one spot on one night. A 2025 paper in *Remote Sensing* asks whether a computer can learn to answer it everywhere, by joining a few hundred of those readings to what satellites see from orbit. The team trained several machine learning models on meter readings from China and Belgium and on satellite maps of night lights, haze, cloud, moonlight and height above sea level. Their best models predicted sky brightness to within about half a magnitude per square arcsecond. If you take your own meter readings, the [[light-pollution-calculator]] turns them into a Bortle class, a luminance and a naked-eye star limit, so you can see what an error of that size means on the ground.

## What they found

The authors collected 632 readings on 112 dates between August 2024 and January 2025, mainly around Chaozhou and Urumqi in China and Ghent in Belgium. The readings ran from about 14 to 24 mag/arcsec², with an average near 18, which is a bright, city-like sky.

Combining five tree-based models into one weighted vote gave the best result. On the test readings it explained about 88% of the variation, with a typical error (root mean square) of about 0.47 mag/arcsec². A random forest on its own came almost as close. They then used the model to draw monthly maps, and found that winter readings in Urumqi swung more than summer ones, which they link to snow reflecting city light back up into the sky.

## Why it matters

Light at night harms wildlife, wastes energy and hides the stars. Satellites see the light going up, but not how bright the sky looks from the ground, and that is what matters to people, animals and telescopes. Ground meters measure the sky itself, but they are few and far apart. A model that links the two could fill the gaps, track change month by month, and help planners and observatories without a meter on every street.

## How they did it

Every reading came from a portable meter pointed at the zenith. The meter was checked against a fixed one at a mountain observatory in Xinjiang. For each reading, the team pulled matching satellite values: the VIIRS day-night band (a satellite camera that records light at night), a cloud mask, an aerosol index for haze, ground reflectance, how full the Moon was, and the elevation. They split the readings into 70% for training and 30% for testing, tried linear, polynomial, support vector and tree-based models, and checked them with ten-fold cross-validation.

## Check it yourself with fibub

A sky meter reports in **magnitudes per square arcsecond**. The scale runs backwards: higher numbers mean a darker sky, and every 2.5 magnitudes is a factor of 10 in brightness. That makes the numbers hard to feel, so translate them. Open the [[light-pollution-calculator]], leave **I know** on the meter reading, and type a value. These are our own example readings, not the paper's data:

| Our reading (mag/arcsec²) | Bortle class | Luminance (mcd/m²) | Faintest star overhead | Times brighter than natural |
|---|---|---|---|---|
| 18.0 | 8 to 9, city | 6.81 | 4.0 | 39 |
| 19.5 | 5, suburban | 1.71 | 5.1 | 9.8 |
| 21.3 | 4, rural to suburban | 0.326 | 6.3 | 1.9 |

You can also type several readings separated by spaces, such as **18.2 18.6 18.4**; the tool averages them to 18.4 and shows the spread.

Now use the **Compare with** box to put the model error in context. Type 18.0 as the reading and 20.5 as the comparison: the city sky is 10 times brighter, and the darker sky shows stars 1.9 magnitudes fainter. By the same rule, the paper's typical error of 0.47 mag/arcsec² is a factor of about 1.5 in brightness (10 to the power 0.47 ÷ 2.5). That is often enough to move a site across one Bortle class boundary, but not to mistake a city for the countryside. The meter's own stated accuracy of ±10% in light is only about 0.1 mag/arcsec², so most of the model error comes from the prediction, not the instrument.

To build a model like this on your own readings, paste a table of meter values beside satellite values into the [[regression-workbench]] and fit a plain linear model first; it gives a fair baseline before trying anything fancier. Because moonlight brightens the sky by several magnitudes, plan your own readings for moonless hours with the [[dark-sky-calendar]]. For astrophotographers, the [[sub-exposure-calculator]] shows how a brighter sky shortens the useful length of each frame.

## The fine print

- **A short window.** The readings cover about six months, so the study shows seasons in part, not trends over years.
- **Few places.** Most readings come from three cities, so the model may not carry over to deserts, mountains or the tropics without new data.
- **Hand-held, not fixed.** A portable meter gives a snapshot. Cloud, haze and where exactly the meter points all change the number.
- **Cloudy readings.** Values near 24 mag/arcsec² are darker than any clear natural sky, which usually means thick cloud over a dark site. Our calculator only accepts readings up to 23, since it is meant for clear skies.
- **Error in magnitudes.** A 0.47 error sounds small, but it is a 54% difference in light. Keep that in mind when reading any map built from the model.
- Our table uses our own readings. For the paper's maps, model weights and full results, read the paper.
