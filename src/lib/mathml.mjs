// Maths in course lessons, turned into MathML at build time by temml (no script or font is sent to the
// browser; MathML is drawn by the browser with the system's maths font). Only for the courses listed in
// COURSES, so a `$` in other pages (prices, regex) is never touched.
//
// In a lesson's Markdown:
//   inline:  `$\hat y = wx + b$`          (LaTeX inside backticks, starting and ending with $)
//   display: ```math                       (a fenced block whose language is math)
//            J(w) = \frac{1}{n}\sum_i (y_i - \hat y_i)^2
//            ```
// A formula temml cannot read fails the build, with the lesson and the formula in the message.
import temml from 'temml';

const COURSES = ['/src/courses/ml-foundations/', '/src/courses/statistics/', '/src/courses/power-bi/', '/src/courses/data-storytelling/', '/src/courses/astronomy/', '/src/courses/sky-watching/'];

const render = (tex, display, where) => {
  try {
    return temml.renderToString(tex, { displayMode: display, throwOnError: true, annotate: false });
  } catch (e) {
    throw new Error(`${where}: bad maths "${tex}": ${e.message}`);
  }
};

function walk(node, file) {
  if (!node.children) return;
  node.children.forEach((c, i) => {
    if (c.type === 'inlineCode' && /^\$[^$][\s\S]*\$$/.test(c.value) && c.value.length > 2) {
      node.children[i] = { type: 'html', value: render(c.value.slice(1, -1), false, file) };
    } else if (c.type === 'code' && c.lang === 'math') {
      node.children[i] = { type: 'html', value: `<div class="cs-math">${render(c.value, true, file)}</div>` };
    } else walk(c, file);
  });
}

export default function remarkMathml() {
  return (tree, file) => {
    const path = String(file?.path ?? file?.history?.[0] ?? '').replace(/\\/g, '/');
    if (!COURSES.some((c) => path.includes(c))) return;
    walk(tree, path);
  };
}
