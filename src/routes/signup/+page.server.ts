import { redirect, fail } from '@sveltejs/kit';
import { createUser, createSession } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) throw redirect(302, '/');
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const username = data.get('username')?.toString().trim();
    const email = data.get('email')?.toString().trim();
    const password = data.get('password')?.toString();
    const displayName = data.get('displayName')?.toString().trim();

    if (!username || !email || !password) {
      return fail(400, { error: 'All fields are required' });
    }

    if (username.length < 3) {
      return fail(400, { error: 'Username must be at least 3 characters' });
    }

    if (password.length < 6) {
      return fail(400, { error: 'Password must be at least 6 characters' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return fail(400, { error: 'Invalid email address' });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return fail(400, { error: 'Username can only contain letters, numbers, and underscores' });
    }

    try {
      const user = await createUser(username, email, password, displayName || username);
      const token = createSession(user.id);
      cookies.set('session_token', token, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7
      });
    } catch (e: any) {
      return fail(400, { error: e.message || 'Failed to create account' });
    }

    throw redirect(302, '/');
  }
};
