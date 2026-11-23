// Class 11 Maths, Statistics (step player): mean and SD of a grouped frequency table by the step-deviation method.
import { textSteps } from '../c12m-view3d.js';
export default (host) => textSteps(host, 'Grouped data by step deviation', [
  ['Marks 10–20, 20–30, 30–40, 40–50, 50–60 with frequencies 4, 6, 10, 8, 2 (n = 30). Class marks x = 15, 25, 35, 45, 55.'],
  ['Pick an assumed mean A = 35 (a middle class mark) and class width h = 10. Let y = (x − A)/h.', 'y = −2, −1, 0, 1, 2'],
  ['Multiply by the frequencies.', 'Σfy = −8 − 6 + 0 + 8 + 4 = −2'],
  ['The mean.', 'mean = A + h·Σfy/n = 35 + 10(−2/30) = 34.33'],
  ['Also find Σfy² (square y first, then multiply by f).', 'Σfy² = 16 + 6 + 0 + 8 + 8 = 38'],
  ['The variance: σ² = h²[Σfy²/n − (Σfy/n)²].', '100 × (38/30 − 0.0044) = 100 × 1.2622 = 126.22'],
  ['The standard deviation.', 'σ = √126.22 ≈ 11.23 marks'],
], 'Finding the mean and standard deviation of grouped data using assumed mean and step deviation', 1.0);
