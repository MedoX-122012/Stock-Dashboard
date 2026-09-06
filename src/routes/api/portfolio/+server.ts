import { json } from '@sveltejs/kit';
import { getPortfolio, savePortfolio } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.userId) return json({ error: 'Unauthorized' }, { status: 401 });
  return json(getPortfolio(locals.userId));
};

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.userId) return json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  savePortfolio(locals.userId, body);
  return json({ ok: true });
};
