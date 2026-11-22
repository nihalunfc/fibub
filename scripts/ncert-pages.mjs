// Makes the two page files of every published NCERT study course (src/courses/ncert.ts, NCERT_LIVE):
// src/pages/learn/courses/<id>/index.astro and [lesson].astro. Run after adding a course to NCERT_LIVE:
// node scripts/ncert-pages.mjs
import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
const src = readFileSync(new URL('../src/courses/ncert.ts', import.meta.url), 'utf8');
const ids = JSON.parse(src.match(/NCERT_LIVE = (\[[^\]]*\])/)[1].replace(/'/g, '"'));
for (const id of ids) {
  const dir = new URL(`../src/pages/learn/courses/${id}/`, import.meta.url);
  mkdirSync(dir, { recursive: true });
  const index = `---
// Made by scripts/ncert-pages.mjs: one NCERT study course's home page.
import CourseHome from '../../../../components/course/CourseHome.astro';
import NcertIntro from '../../../../components/course/NcertIntro.astro';
import { ncertCourse } from '../../../../courses/ncert';
import '../../../../styles/lesson-kit.css';
const course = ncertCourse('${id}');
---
<CourseHome course={course} compact><NcertIntro course={course} /></CourseHome>
`;
  const lesson = `---
// Made by scripts/ncert-pages.mjs: one lesson of an NCERT study course.
import LessonPage from '../../../../components/course/LessonPage.astro';
import { ncertCourse } from '../../../../courses/ncert';
import { FIGURES } from '../../../../courses/ncert-figures';
import { courseLessons, type LessonEntry } from '../../../../lib/course';
import '../../../../styles/math.css';
import '../../../../styles/lesson-kit.css';
export async function getStaticPaths() {
  const written = await courseLessons(ncertCourse('${id}'));
  const live = new Set(written.keys());
  return [...written].map(([slug, entry]) => ({ params: { lesson: slug }, props: { slug, entry, live } }));
}
const { slug, entry, live } = Astro.props as { slug: string; entry: LessonEntry; live: Set<string> };
---
<LessonPage course={ncertCourse('${id}')} entry={entry} slug={slug} live={live} figures={FIGURES} />
`;
  writeFileSync(new URL('index.astro', dir), index);
  writeFileSync(new URL('[lesson].astro', dir), lesson);
  mkdirSync(new URL(`../src/courses/${id}/`, import.meta.url), { recursive: true });
}
console.log(`ncert pages: ${ids.length} courses`);
