import type { Handle } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get('session_token') || '';
  const user = validateSession(token);
  event.locals.user = user;
  event.locals.userId = user?.id ?? null;

  return resolve(event);
};
