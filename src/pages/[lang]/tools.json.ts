import type { APIRoute } from 'astro';
import { toolIndex } from '../../lib/toolIndex';
import { OTHER_LANGS } from '../../i18n';

export const getStaticPaths = () => OTHER_LANGS.map((l) => ({ params: { lang: l.code } }));
export const GET: APIRoute = ({ params }) => toolIndex(params.lang!);
