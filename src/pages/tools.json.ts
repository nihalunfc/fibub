import type { APIRoute } from 'astro';
import { toolIndex } from '../lib/toolIndex';

export const GET: APIRoute = () => toolIndex('en');
