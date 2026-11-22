// Cosmology figures are JS modules run by the lesson kit (public/learn-kit/cosmology/figs/<name>.js), placed in
// the text as <figure class="fig" data-fig="name">. This map stays empty unless an Astro figure is ever needed
// as <!--fig:name-->. tests/cosmo.mjs checks that every data-fig and data-problem in the lessons exists.
export const FIGURES: Record<string, any> = {};
