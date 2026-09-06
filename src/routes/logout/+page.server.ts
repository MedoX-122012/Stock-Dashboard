import { redirect } from '@sveltejs/kit';
import { deleteSession } from '$lib/server/auth';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ cookies }) => {
    const token = cookies.get('session_token');
    if (token) {
      deleteSession(token);
      cookies.delete('session_token', { path: '/' });
    }
    throw redirect(302, '/login');
  }
};
