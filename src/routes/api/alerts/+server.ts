import { json } from '@sveltejs/kit';
import { getAlerts, saveAlerts } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.userId) return json({ error: 'Unauthorized' }, { status: 401 });
  return json(getAlerts(locals.userId));
};

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.userId) return json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  saveAlerts(locals.userId, body);
  return json({ ok: true });
};
