import { redirect, fail } from '@sveltejs/kit';
import { verifyLogin, createSession } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) throw redirect(302, '/');
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = data.get('email')?.toString().trim();
    const password = data.get('password')?.toString();

    if (!email || !password) {
      return fail(400, { error: 'Email and password are required' });
    }

    const user = await verifyLogin(email, password);
    if (!user) {
      return fail(400, { error: 'Invalid email or password' });
    }

    const token = createSession(user.id);
    cookies.set('session_token', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    throw redirect(302, '/');
  }
};
