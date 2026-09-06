import type { LayoutServerLoad } from './$types';
import { getPortfolio, getWatchlists, getAlerts } from '$lib/server/db';

export const load: LayoutServerLoad = async ({ locals }) => {
  if (!locals.user) {
    return { user: null, portfolio: null, watchlists: null, alerts: null };
  }

  const portfolio = getPortfolio(locals.userId!);
  const watchlists = getWatchlists(locals.userId!);
  const alerts = getAlerts(locals.userId!);

  return {
    user: {
      id: locals.user.id,
      username: locals.user.username,
      displayName: locals.user.displayName,
      email: locals.user.email,
      avatarColor: locals.user.avatarColor,
      createdAt: locals.user.createdAt
    },
    portfolio,
    watchlists,
    alerts
  };
};
