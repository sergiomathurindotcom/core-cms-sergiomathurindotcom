/**
 * idea controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::idea.idea', ({ strapi }) => ({
  /**
   * Get timeline/snapshots for an idea
   * GET /api/ideas/:id/timeline
   */
  async timeline(ctx) {
    const { id } = ctx.params;

    try {
      // Fetch the idea to check visibility
      const idea = await strapi.entityService.findOne('api::idea.idea', id, {
        fields: ['showTimelinePublicly'],
      });

      if (!idea) {
        return ctx.notFound('Idea not found');
      }

      // Check if timeline should be public
      if (!idea.showTimelinePublicly) {
        return ctx.forbidden('Timeline is not public for this idea');
      }

      // Fetch all snapshots for this idea
      const snapshots = await strapi.entityService.findMany('api::idea-snapshot.idea-snapshot', {
        filters: {
          idea: {
            id: id,
          },
        },
        sort: { snapshotDate: 'asc' },
        populate: '*',
      });

      return snapshots;
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  /**
   * Create a manual snapshot of an idea
   * POST /api/ideas/:id/snapshot
   */
  async createSnapshot(ctx) {
    const { id } = ctx.params;
    const { changeNotes } = ctx.request.body;

    try {
      // Fetch the full idea data
      const idea = await strapi.entityService.findOne('api::idea.idea', id, {
        populate: '*',
      });

      if (!idea) {
        return ctx.notFound('Idea not found');
      }

      // Create the snapshot
      const snapshot = await strapi.entityService.create('api::idea-snapshot.idea-snapshot', {
        data: {
          idea: id,
          snapshotDate: new Date(),
          title: idea.title,
          description: idea.description,
          status: idea.status,
          priority: idea.priority,
          tags: idea.tags,
          triggerType: 'manual',
          triggerSource: 'Manual snapshot creation',
          changeNotes: changeNotes || '',
          snapshotData: JSON.stringify(idea),
          publishedAt: new Date(),
        },
      });

      return snapshot;
    } catch (error) {
      ctx.throw(500, error);
    }
  },
}));
