/**
 * custom idea routes
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/ideas/:id/timeline',
      handler: 'api::idea.idea.timeline',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/ideas/:id/snapshot',
      handler: 'api::idea.idea.createSnapshot',
      config: {
        auth: false,
      },
    },
  ],
};
